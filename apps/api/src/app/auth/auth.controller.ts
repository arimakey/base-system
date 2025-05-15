import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './google.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

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
		return req.user;
	}

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    return res.json({ message: 'Logged out successfully' });
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
		@Req() req: { user: GoogleUser },
		@Res() res: Response
	) {
		try {
			const user = await this.authService.findOrCreateUserFromGoogle(req.user);
			const backendToken = await this.authService.generateBackendJWT(user);
			const frontendUrl = this.config.get('FRONTEND_URL');
			res.redirect(`${frontendUrl}/login/callback?token=${backendToken.access_token}`);
		} catch (error) {
			const frontendUrl = this.config.get('FRONTEND_URL');
			console.error('Google auth failed', error);
			res.redirect(`${frontendUrl}/login/callback?error=auth_failed`);
		}
	}
}
