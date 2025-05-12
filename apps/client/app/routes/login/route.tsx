import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from '@remix-run/react';
import { setUser, setToken } from '../../store/user.store';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const authError = searchParams.get('error');
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (token && !isLoading) {
      const fetchUserData = async () => {
        setIsLoading(true);
        setFetchError(null);
        setToken(token);

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
          }

          const userData = await response.json();
          setUser(userData);
          navigate('/dashboard');
        } catch (error) {
          console.error('Error fetching user data:', error);
          setFetchError(error instanceof Error ? error.message : 'An unknown error occurred.');
          setToken(null);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [token, navigate, isLoading]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Authentication failed. Please try again.
        </div>
      )}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-4">
            <p>Loading user data...</p>
          </div>
        )}
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {fetchError}
          </div>
        )}
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
