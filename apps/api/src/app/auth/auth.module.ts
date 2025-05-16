import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtRefreshGuard } from './refresh.guard';
import { RefreshToken } from './refresh-token.entity'; // Asegurarnos que la ruta sea correcta
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([RefreshToken]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		ConfigModule.forRoot({
			envFilePath: '.env',
			isGlobal: true,
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				secret: config.get('JWT_SECRET'),
				signOptions: { expiresIn: '15m' },
			}),
			inject: [ConfigService],
		}),
	],
	providers: [
		AuthService,
		GoogleStrategy,
		JwtStrategy,
		JwtRefreshStrategy,
		JwtAuthGuard,
		JwtRefreshGuard,
	],
	controllers: [AuthController],
	exports: [JwtModule, AuthService],
})
export class AuthModule {}
