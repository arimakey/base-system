import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, Form } from '@remix-run/react';
import { getSessionFromRequest } from '../../session.server';

type UserData = {
  id: string;
  email: string;
  name: string;
  picture?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionFromRequest(request);
  const token = session.get('token');

  if (!token) {
    return json({ user: null });
  }

  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  const response = await fetch(`${apiUrl}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    return json({ user: null });
  }

  return json({ user: await response.json() });
}

export default function Dashboard() {
  const { user } = useLoaderData<{ user: UserData | null }>();
  console.log('User data:', user);
  if (!user) {
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
      <div style={{ marginBottom: '20px' }}>
        <h2>Datos del usuario</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <Form
        method="post"
        action="/auth/logout"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await fetch('http://localhost:3000/api/auth/logout', {
              method: 'POST',
              credentials: 'include' // Send cookies automatically
            });

            if (response.ok) {
              window.location.href = '/';
            }
          } catch (error) {
            console.error('Logout failed:', error);
          }
        }}
      >
        <button type="submit" style={{
          padding: '8px 16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Cerrar sesión
        </button>
      </Form>
    </div>
  );
}
