// mocks.ts
import { AuthService } from '../../../src/app/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

export const authServiceMock: Partial<AuthService> = {
	findOrCreateUserFromGoogle: jest.fn(),
	generateAccessToken: jest.fn(),
	generateRefreshToken: jest.fn(),
	handleRefresh: jest.fn(),
};

export const configServiceMock: Partial<ConfigService> = {
	get: jest.fn(),
};

export const responseMock = (): Partial<Response> => ({
	clearCookie: jest.fn(),
	cookie: jest.fn(),
	redirect: jest.fn(),
});
