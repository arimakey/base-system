import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate(payload: any) {
		// Ensure roles are passed as an array, even if not present in older tokens (for graceful migration)
		const roles = Array.isArray(payload.roles) ? payload.roles : [];
		return { id: payload.sub, email: payload.email, name: payload.name, roles: roles };
	}
}
