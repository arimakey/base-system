import { Outlet, useLoaderData } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getSessionFromRequest } from '../../session.server';
import { LoaderData } from '../../types/loader.interface';
import { setToken, setUser } from '../../store/user.store';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSessionFromRequest(request);
	const token = session.get('token');
	let user = session.get('user');

	if (!token) throw redirect('/');

	if (!user) {
		try {
			const apiUrl = process.env.API_URL || 'http://localhost:3000';
			const response = await fetch(`${apiUrl}/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) throw redirect('/login');

			user = await response.json();
			session.set('user', user);
		} catch (error) {
			throw redirect('/login');
		}
	}

	return { token, user };
}

export default function Route() {
	const { user, token } = useLoaderData<LoaderData>();

	setUser(user);
	setToken(token);

	return <Outlet />;
}
