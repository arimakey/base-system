import axios from 'axios';
import { useUserStore } from '../stores/user.store';
import { userService } from '../services/user.service';
import { toast } from 'sonner';

const api = axios.create();

api.interceptors.request.use((config) => {
	const token = useUserStore.getState().token;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				// Si tienes un endpoint de refresh, hazlo aquí
				const newToken = await userService.refreshToken(); // Debes implementarlo
				useUserStore.getState().setToken(newToken);
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (refreshError) {
				useUserStore.getState().clearUser();
				toast.error('Tu sesión ha expirado. Inicia sesión de nuevo.');
				window.location.href = '/';
			}
		}
		return Promise.reject(error);
	}
);

export default api;
