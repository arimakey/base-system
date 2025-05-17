export interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

export interface UserState {
	user: User | null;
	token: string | null;
	setUser: (user: User | null) => void;
	setToken: (token: string | null) => void;
	clearUser: () => void;
}
