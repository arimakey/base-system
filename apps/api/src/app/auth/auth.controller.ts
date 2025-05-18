import {
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtRefreshGuard } from './refresh.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './google.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../types/user';
import { Permission } from './enums/permission.enum';
import { rolePermissions } from './role-permissions.config';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private config: ConfigService
	) {}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	googleLogin() {
		return { message: 'Google authentication initiated' };
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	async getCurrentUser(@Req() req: { user: any }) {
		console.log('Current user:', req.user);
		// Calculate user permissions based on roles
		const userPermissions = req.user.roles.reduce((acc, role) => {
			const permissionsForRole = rolePermissions[role] || [];
			return [...new Set([...acc, ...permissionsForRole])]; // Use Set to avoid duplicates
		}, [] as Permission[]);

		// Return user data with permissions
		return {
			...req.user,
			permissions: userPermissions,
		};
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('refresh_token', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			domain: this.config.get('COOKIE_DOMAIN'),
		});

		return { message: 'Logged out successfully' };
	}

	@Post('refresh')
	@UseGuards(JwtRefreshGuard)
	async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
		try {
			console.log('[Auth] Intentando refrescar el token...');

			const refreshToken = req.cookies['refresh_token'];

			if (!refreshToken) {
				console.log(
					'[Auth] No se encontró el refresh token en las cookies'
				);
				throw new UnauthorizedException(
					'Refresh token not found in cookies'
				);
			}

			console.log('[Auth] Refresh token recibido:', refreshToken);

			const { accessToken, refreshToken: newRefreshToken } =
				await this.authService.handleRefresh(refreshToken);

			console.log('[Auth] Tokens generados correctamente');

			res.cookie('refresh_token', newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			console.log('[Auth] Nuevo refresh token enviado en cookie');

			return { accessToken };
		} catch (error) {
			console.log('[Auth] Error al refrescar el token:', error);
			res.clearCookie('refresh_token');
			throw new UnauthorizedException('Invalid refresh token');
		}
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleLoginCallback(
		@Req() req: { user: GoogleUser },
		@Res() res: Response
	) {
		try {
			const user: User =
				await this.authService.findOrCreateUserFromGoogle(req.user);

			const accessToken = await this.authService.generateAccessToken(
				user
			);

			const refreshToken = await this.authService.generateRefreshToken(
				user
			);

			// Configurar la cookie para el refresh token
			res.cookie('refresh_token', refreshToken, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				domain: this.config.get('COOKIE_DOMAIN'),
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
			});

			console.log('Generated refresh token:', refreshToken);
			console.log('Generated access token:', accessToken);

			const frontendUrl = this.config.get('FRONTEND_URL');
			res.redirect(
				`${frontendUrl}/auth/login/callback?token=${accessToken}`
			);
		} catch (error) {
			const frontendUrl = this.config.get('FRONTEND_URL');
			console.error('Google auth failed', error);
			res.redirect(
				`${frontendUrl}/auth/login/callback?error=auth_failed`
			);
		}
	}
}
