import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extraer token de la URL si existe
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <a href="/auth/google">
        <button style={{
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Login with Google
        </button>
      </a>
    </div>
  );
}
