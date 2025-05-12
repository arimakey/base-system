import { useEffect } from 'react';
import { useSearchParams, useNavigate } from '@remix-run/react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authError = searchParams.get('error');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Authentication failed. Please try again.
        </div>
      )}
      <div className="space-y-4">
        <a
          href="/api/auth/google"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login with Google
        </a>
      </div>
    </div>
  );
}
