import { type LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { useUser } from '../../store/user.store';

export async function loader({ request }: LoaderFunctionArgs) {
  return null; // No data needed - authentication is handled in root.tsx
}

export default function Dashboard() {
  const { user, isAuthenticated } = useUser() as { user: any; isAuthenticated: boolean };
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
