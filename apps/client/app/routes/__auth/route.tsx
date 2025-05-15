import { Outlet } from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { getSessionFromRequest } from '../../session.server';

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSessionFromRequest(request);
	const token = session.get('token');

	if (token) {
		throw redirect('/dashboard');
	}

	return null;
}

function route() {
	return <Outlet />;
}

export default route;
