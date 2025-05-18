import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/app/auth/auth.controller';
import { AuthService } from '../../../src/app/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleUser } from '../../../src/app/auth/google.strategy';
import { rolePermissions } from '../../../src/app/auth/role-permissions.config';
import { authServiceMock, configServiceMock, responseMock } from './mock.spec';
import { Permission } from '../../../src/app/auth/enums/permission.enum';
import { Role } from '../../../src/app/auth/enums/role.enum';

describe('AuthController', () => {
	let controller: AuthController;
	let authService: Partial<AuthService>;
	let configService: Partial<ConfigService>;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				{ provide: ConfigService, useValue: configServiceMock },
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
		authService = module.get(AuthService);
		configService = module.get(ConfigService);

		jest.spyOn(console, 'error').mockImplementation(() => {
			// Silence expected errors
		});
	});

	it('should initiate Google authentication when accessing the /auth/google endpoint', () => {
		const result = controller.googleLogin();
		expect(result).toEqual({ message: 'Google authentication initiated' });
	});

	it('should clear refresh token cookie and return success message on logout', async () => {
		const mockRes = responseMock();
		(configService.get as jest.Mock).mockReturnValue('test.domain');

		const result = await controller.logout(mockRes as any);

		expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token', {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			domain: 'test.domain',
		});
		expect(result).toEqual({ message: 'Logged out successfully' });
	});

	it('should throw UnauthorizedException when refresh token is missing or invalid', async () => {
		const mockRes = responseMock();

		// Missing token
		const req1 = { cookies: {} } as any;
		await expect(
			controller.refreshToken(req1, mockRes as any)
		).rejects.toThrow(UnauthorizedException);
		expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token');

		// Invalid token
		const req2 = { cookies: { refresh_token: 'invalid_token' } } as any;
		(authServiceMock.handleRefresh as jest.Mock).mockRejectedValue(
			new Error('Invalid token')
		);

		await expect(
			controller.refreshToken(req2, mockRes as any)
		).rejects.toThrow(UnauthorizedException);
		expect(authServiceMock.handleRefresh).toHaveBeenCalledWith(
			'invalid_token'
		);
		expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token');
	});

	it('should return user data with calculated permissions when accessing /auth/me', async () => {
		const mockUser = {
			id: '123',
			email: 'test@example.com',
			name: 'Test User',
			roles: [Role.ADMIN, Role.USER],
		};
		const req = { user: mockUser } as any;

		(rolePermissions[Role.ADMIN] as Permission[]) = [
			Permission.TASK_CREATE,
			Permission.TASK_READ_ANY_LIST,
			Permission.TASK_UPDATE_ANY,
			Permission.TASK_DELETE_ANY,
		];
		(rolePermissions[Role.USER] as Permission[]) = [
			Permission.TASK_READ_OWN_LIST,
		];

		const result = await controller.getCurrentUser(req);

		expect(result).toEqual({
			...mockUser,
			permissions: [
				'TASK_CREATE',
				'TASK_READ_ANY_LIST',
				'TASK_UPDATE_ANY',
				'TASK_DELETE_ANY',
				'TASK_READ_OWN_LIST',
			],
		});
	});

	it('should redirect to frontend with access token after successful Google authentication', async () => {
		const mockUser: GoogleUser = {
			googleId: '123',
			email: 'test@example.com',
			name: 'Test User',
		};
		const mockAccessToken = 'mock_access_token';
		const mockRefreshToken = 'mock_refresh_token';
		const mockFrontendUrl = 'http://frontend.com';

		const req = { user: mockUser } as any;
		const mockRes = responseMock();

		(
			authServiceMock.findOrCreateUserFromGoogle as jest.Mock
		).mockResolvedValue(mockUser);
		(authServiceMock.generateAccessToken as jest.Mock).mockResolvedValue(
			mockAccessToken
		);
		(authServiceMock.generateRefreshToken as jest.Mock).mockResolvedValue(
			mockRefreshToken
		);

		(configService.get as jest.Mock).mockImplementation((key: string) => {
			if (key === 'FRONTEND_URL') return mockFrontendUrl;
			if (key === 'COOKIE_DOMAIN') return 'example.com';
		});

		await controller.googleLoginCallback(req, mockRes as any);

		expect(authServiceMock.findOrCreateUserFromGoogle).toHaveBeenCalledWith(
			mockUser
		);
		expect(mockRes.cookie).toHaveBeenCalledWith(
			'refresh_token',
			mockRefreshToken,
			expect.objectContaining({
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				domain: 'example.com',
			})
		);
		expect(mockRes.redirect).toHaveBeenCalledWith(
			`${mockFrontendUrl}/auth/login/callback?token=${mockAccessToken}`
		);
	});

	it('should redirect to frontend with error message on Google authentication failure', async () => {
		const mockReq = { user: {} as GoogleUser };
		const mockRes = responseMock();

		(
			authServiceMock.findOrCreateUserFromGoogle as jest.Mock
		).mockRejectedValue(new Error('Google auth failed'));
		(configService.get as jest.Mock).mockReturnValue('http://frontend.url');

		await controller.googleLoginCallback(mockReq as any, mockRes as any);

		expect(mockRes.redirect).toHaveBeenCalledWith(
			'http://frontend.url/auth/login/callback?error=auth_failed'
		);
		expect(console.error).toHaveBeenCalledWith(
			'Google auth failed',
			expect.any(Error)
		);
	});

	it('should refresh access token and set new refresh token cookie when valid refresh token is provided', async () => {
		const mockRefreshToken = 'valid_refresh_token';
		const mockNewAccessToken = 'new_access_token';
		const mockNewRefreshToken = 'new_refresh_token';

		const req = { cookies: { refresh_token: mockRefreshToken } } as any;
		const mockRes = responseMock();

		(authServiceMock.handleRefresh as jest.Mock).mockResolvedValue({
			accessToken: mockNewAccessToken,
			refreshToken: mockNewRefreshToken,
		});

		const result = await controller.refreshToken(req, mockRes as any);

		expect(authServiceMock.handleRefresh).toHaveBeenCalledWith(
			mockRefreshToken
		);
		expect(mockRes.cookie).toHaveBeenCalledWith(
			'refresh_token',
			mockNewRefreshToken,
			expect.objectContaining({
				httpOnly: true,
				secure: expect.any(Boolean),
				sameSite: 'lax',
				maxAge: 7 * 24 * 60 * 60 * 1000,
			})
		);
		expect(result).toEqual({ accessToken: mockNewAccessToken });
	});
});
