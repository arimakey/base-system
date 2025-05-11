import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './google.strategy';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async login(user: GoogleUser) {
		// Solo claims personalizados, sin iat/exp
		const payload = {
			sub: user.googleId,
			email: user.email,
			name: user.name,
			iss: 'your-app-name',
			aud: 'your-app-client',
		};

		const access_token = this.jwtService.sign(payload, {
			expiresIn: '1h',
		});

		return {
			access_token,
			user: {
				id: user.googleId,
				email: user.email,
				name: user.name,
			},
		};
	}
}
