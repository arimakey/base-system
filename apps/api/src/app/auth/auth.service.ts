import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleUser } from './google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(user: GoogleUser) {
    const payload = {
      sub: user.googleId,
      email: user.email,
      name: user.name,
      iss: 'your-app-name',
      aud: 'your-app-client',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.googleId,
        email: user.email,
        name: user.name
      }
    };
  }
}
