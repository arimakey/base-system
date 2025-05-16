import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService
	) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		// Primero intentamos la autenticación con Passport
		const passportResult = await super.canActivate(context);
		if (passportResult) {
			return true;
		}

		// Si falla, intentamos verificar manualmente el token
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			return false;
		}

		try {
			const payload = this.jwtService.verify(token, {
				secret: this.configService.get('JWT_SECRET'),
			});

			console.log('JWT Payload:', payload);
			request.user = { id: payload.sub };
			return true;
		} catch (err) {
			console.error('Token verification failed:', err);
			return false;
		}
	}

	private extractTokenFromHeader(request: any): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
