import { redirect } from '@remix-run/node';
import { useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { commitSession, getSessionFromRequest } from '../../session.server';

export async function loader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const token = url.searchParams.get('token');
	const error = url.searchParams.get('error');

	if (error) {
		const session = await getSessionFromRequest(request);
		session.flash('error', 'Google authentication failed');
		return redirect('/', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}

	if (token) {
		const session = await getSessionFromRequest(request);
		session.set('token', token);

		// Fetch user data immediately with the token
		const apiUrl = process.env.API_URL || 'http://localhost:3000';
		const response = await fetch(`${apiUrl}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			const userData = await response.json();
			session.set('user', userData);
		}

		return redirect('/dashboard', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}

	return redirect('/api/auth/google');
}

export default function GoogleAuth() {
	const [searchParams] = useSearchParams();
	const error = searchParams.get('error');

	useEffect(() => {
		if (error) {
			console.error('Google auth error:', error);
		}
	}, [error]);

	return null;
}
