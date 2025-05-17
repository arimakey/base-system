import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './google.strategy';
import { User } from '../types/user';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		@InjectRepository(RefreshToken)
		private refreshTokenRepository: Repository<RefreshToken>
	) {}

	async findOrCreateUserFromGoogle(googleUser: GoogleUser): Promise<User> {
		// Aquí normalmente buscarías en la base de datos e insertarías si no existe
		// Para este ejemplo simplemente devolvemos el usuario
		return {
			id: googleUser.googleId,
			email: googleUser.email,
			name: googleUser.name,
			roles: [Role.USER], // Assign default role
		};
	}

	async generateAccessToken(user: User) {
		return this.jwtService.sign(
			{
				sub: user.id,
				email: user.email,
				name: user.name,
				roles: user.roles, // Include roles in JWT payload
			},
			{
				secret: this.configService.get('JWT_SECRET'),
				expiresIn: '15m',
			}
		);
	}

	async generateRefreshToken(user: User) {
		// Primero creamos el token JWT para el refresh
		const jwtRefreshToken = this.jwtService.sign(
			{ sub: user.id },
			{
				secret: this.configService.get('JWT_REFRESH_SECRET'),
				expiresIn: '7d',
			}
		);

		// Luego guardamos el token en la base de datos
		const token = crypto.randomBytes(40).toString('hex');
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		await this.refreshTokenRepository.save({
			token: token,
			userId: user.id,
			expiresAt,
			revoked: false,
		});

		return token;
	}

	async validateRefreshToken(token: string): Promise<User> {
		const refreshToken = await this.refreshTokenRepository.findOneBy({
			token,
		});

		if (
			!refreshToken ||
			refreshToken.revoked ||
			refreshToken.expiresAt < new Date()
		) {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}

		// En una aplicación real, aquí buscarías el usuario completo en la base de datos
		// En una aplicación real, aquí buscarías el usuario completo en la base de datos
		// incluyendo sus roles. Por ahora, asignamos un rol por defecto.
		const user: User = {
			id: refreshToken.userId,
			email: 'user@example.com', // Esto debería venir de la base de datos
			name: 'User Name', // Esto debería venir de la base de datos
			roles: [Role.USER], // Asignar rol por defecto para satisfacer el tipo
		};

		return user;
	}

	async revokeRefreshToken(token: string) {
		const result = await this.refreshTokenRepository.update(
			{ token },
			{ revoked: true }
		);

		if (result.affected === 0) {
			throw new UnauthorizedException('Token not found');
		}
	}

	async handleRefresh(token: string) {
		const user: User = await this.validateRefreshToken(token);

		// Revocamos el token actual
		await this.revokeRefreshToken(token);

		// Generamos nuevos tokens
		const accessToken = await this.generateAccessToken(user);
		const refreshToken = await this.generateRefreshToken(user);

		return {
			accessToken,
			refreshToken,
		};
	}
}
