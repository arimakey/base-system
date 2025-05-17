import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { User, UserState } from '../types/user.interface';
import { NavigateFunction } from 'react-router-dom';

const initialState: Pick<UserState, 'user' | 'token' | 'loading'> = {
	user: null,
	token: null,
	loading: false,
};

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			...initialState,

			setUser: (user: User | null) => {
				set({ user });
				toast.success(
					user ? 'Usuario cargado correctamente' : 'Sesión cerrada'
				);
			},

			setToken: (token: string | null) => set({ token }),

			clearUser: () => {
				set({ ...initialState });
				toast.info('Sesión cerrada');
			},

			setLoading: (loading: boolean) => set({ loading }),

			fetchUserData: async (navigate: NavigateFunction) => {
				set({ loading: true });
				const { token } = get();

				if (!token) {
					set({ loading: false });
					toast.error(
						'No hay token de autenticación. Redirigiendo...'
					);
					navigate('/');
					return;
				}

				try {
					const response = await fetch('/api/auth/me', {
						headers: { Authorization: `Bearer ${token}` },
					});

					if (!response.ok) {
						throw new Error(
							'Error al obtener los datos del usuario'
						);
					}

					const userData: User = await response.json();
					set({ user: userData, loading: false });
					toast.success('Bienvenido de nuevo');
					navigate('/dashboard');
				} catch (error) {
					console.error('Authentication error:', error);
					set({ user: null, loading: false });
					toast.error('Error de autenticación. Redirigiendo...');
					navigate('/');
				}
			},
		}),
		{
			name: 'user-auth-storage', // clave en localStorage
			partialize: (state) => ({
				token: state.token,
				user: state.user,
			}),
		}
	)
);

// helper exports
export const setUser = (user: User | null) =>
	useUserStore.getState().setUser(user);
export const setToken = (token: string | null) =>
	useUserStore.getState().setToken(token);
export const clearUser = () => useUserStore.getState().clearUser();
export const setLoading = (loading: boolean) =>
	useUserStore.getState().setLoading(loading);
export const fetchUserData = (navigate: NavigateFunction) =>
	useUserStore.getState().fetchUserData(navigate);
