import { Outlet } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getSessionFromRequest } from '../../session.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSessionFromRequest(request);
	const token = session.get('token');
	const user = session.get('user');

	if (!token) {
		throw redirect('/');
	}

	if (user) {
		return null;
	}

	const apiUrl = process.env.API_URL || 'http://localhost:3000';

	const response = await fetch(`${apiUrl}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw redirect('/404');
	}

	return null;
}

function route() {
	return <Outlet />;
}

export default route;
