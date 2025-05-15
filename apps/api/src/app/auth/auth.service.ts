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

	async findOrCreateUserFromGoogle(googleUser: GoogleUser) {
		// Implementar lógica de base de datos aquí
		// Ejemplo temporal: devolver usuario de Google directamente
		return {
			id: googleUser.googleId,
			email: googleUser.email,
			name: googleUser.name
		};
	}

	async generateBackendJWT(user: any) {
		const payload = {
			sub: user.id,
			email: user.email,
			name: user.name,
			iss: 'your-app-name',
			aud: 'your-app-client',
		};

		const access_token = this.jwtService.sign(payload, {
			expiresIn: '1h',
		});

		return { access_token };
	}
}
