import { Outlet } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getSessionFromRequest } from '../../session.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSessionFromRequest(request);
	const token = session.get('token');

	if (!token) {
		console.log('No token found, redirecting to /404');
		throw redirect('/');
	}

	const apiUrl = process.env.API_URL || 'http://localhost:3000';
	console.log('API URL:', apiUrl);

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
