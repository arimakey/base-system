import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET || 'default-secret';

export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: '__session',
			secure: process.env.NODE_ENV === 'production',
			secrets: [sessionSecret],
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			httpOnly: true,
		},
	});

export async function getSessionFromRequest(request: Request) {
	return getSession(request.headers.get('Cookie'));
}
