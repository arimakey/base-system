import { create } from 'zustand';

interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

interface UserState {
	user: User | null;
	token: string | null;
	setUser: (user: User | null) => void;
	setToken: (token: string | null) => void;
	clearUser: () => void;
}

const initialState: Pick<UserState, 'user' | 'token'> = {
	user: null,
	token: null,
};

export const useUserStore = create<UserState>((set) => ({
	...initialState,
	setUser: (user: User | null) => set(() => ({ user })),
	setToken: (token: string | null) => set(() => ({ token })),
	clearUser: () => set(() => ({ ...initialState })),
}));

export function useUser(): { user: User | null; isAuthenticated: boolean } {
	const { user } = useUserStore((state: UserState) => ({ user: state.user }));
	return {
		user,
		isAuthenticated: !!user,
	};
}

// Convenience selectors/actions if needed, though direct use of useUserStore is common
export const setUser = (user: User | null) => useUserStore.getState().setUser(user);
export const setToken = (token: string | null) => useUserStore.getState().setToken(token);
export const clearUser = () => useUserStore.getState().clearUser();
