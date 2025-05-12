import { type LoaderFunctionArgs, redirect, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { useUser } from '../../store/user.store';
import { getSessionFromRequest } from '../../session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromRequest(request);
  const user = session.get('user');
  const token = session.get('token');

  if (!user || !token) {
    return redirect('/login');
  }

  return json({ user });
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  const { user: clientUser, isAuthenticated } = useUser() as {
    user: any;
    isAuthenticated: boolean;
  };

	if (isAuthenticated || !user) {
		return (
			<div>
				<p>No estás autenticado</p>
				<a href="/login">Ir al login</a>
			</div>
		);
	}

	return (
		<div style={{ padding: '20px' }}>
			<h1>Dashboard</h1>
			<div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
				<h2 style={{ marginBottom: '16px' }}>Datos del usuario</h2>
				{user ? (
					<div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '8px 16px' }}>
						<strong>ID:</strong>
						<span>{user.id}</span>
						<strong>Nombre:</strong>
						<span>{user.name}</span>
						<strong>Email:</strong>
						<span>{user.email}</span>
						{user.picture && (
							<>
								<strong>Foto:</strong>
								<img
									src={user.picture}
									alt="Profile"
									style={{ width: '64px', height: '64px', borderRadius: '50%' }}
								/>
							</>
						)}
					</div>
				) : (
					<p>No se encontraron datos del usuario.</p>
				)}
			</div>

			<Form
				method="post"
				action="/auth/logout"
				onSubmit={async (e) => {
					e.preventDefault();
					try {
						const response = await fetch(
							'http://localhost:3000/api/auth/logout',
							{
								method: 'POST',
								credentials: 'include', // Send cookies automatically
							}
						);

						if (response.ok) {
							window.location.href = '/';
						}
					} catch (error) {
						console.error('Logout failed:', error);
					}
				}}
			>
				<button
					type="submit"
					style={{
						padding: '8px 16px',
						backgroundColor: '#f44336',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					Cerrar sesión
				</button>
			</Form>
		</div>
	);
}
