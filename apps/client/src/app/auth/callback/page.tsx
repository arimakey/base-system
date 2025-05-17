import { setToken, setUser } from '../../../stores/user.store';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CallbackPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(location.search);
	const token = searchParams.get('token');
	const error = searchParams.get('error');

	useEffect(() => {
		if (error) {
			navigate('/');
		} else if (token) {
			setToken(token);
			fetch('/api/auth/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((response) => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Failed to fetch user data');
					}
				})
				.then((userData) => {
					console.log('User data:', userData);
					setUser(userData);
					navigate('/dashboard');
				})
				.catch((err) => {
					console.error('Error fetching user data:', err);
					navigate('/');
				});
		}
	}, [token, error, navigate]);

	return (
		<div>
			<h1>Google Callback Page</h1>
			<p>Processing Google authentication...</p>
			{error && <p style={{ color: 'red' }}>Error: {error}</p>}
		</div>
	);
}
