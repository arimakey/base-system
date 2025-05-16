import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh'
) {
	constructor(
		private configService: ConfigService,
		private authService: AuthService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					// También podríamos usar la cookie directamente aquí
					return request?.body?.refreshToken;
				},
			]),
			secretOrKey: configService.get('JWT_REFRESH_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: any) {
		const refreshToken =
			req.cookies?.refresh_token || req.body?.refreshToken;

		if (!refreshToken) {
			throw new UnauthorizedException('Refresh token not found');
		}

		// Validar el token de actualización en la base de datos
		const user = await this.authService.validateRefreshToken(refreshToken);
		if (!user) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		return user;
	}
}
