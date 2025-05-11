import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './google.strategy';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private config: ConfigService
	) {}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	googleLogin() {
		// Inicia el flujo de autenticación Google
	}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleLoginCallback(
		@Req() req: { user: GoogleUser },
		@Res() res: Response
	) {
		try {
			const token = await this.authService.login(req.user);
			const frontendUrl =
				this.config.get('FRONTEND_URL') ||
				this.config.get('API_URL').replace('/api', '');
			res.redirect(`${frontendUrl}/login?token=${token.access_token}`);
		} catch (error) {
			const frontendUrl =
				this.config.get('FRONTEND_URL') || 'http://localhost:4200'; // ajusta esto
			res.redirect(`${frontendUrl}/login?error=auth_failed`);
		}
	}
}
