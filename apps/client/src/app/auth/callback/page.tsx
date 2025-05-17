import { setToken } from '../../../stores/user.store';
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
		}
        navigate('/dashboard');
	}, [token, error, navigate]);

	return (
		<div>
			<h1>Google Callback Page</h1>
			<p>Processing Google authentication...</p>
			{error && <p style={{ color: 'red' }}>Error: {error}</p>}
		</div>
	);
}
