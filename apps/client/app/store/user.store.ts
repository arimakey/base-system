import { Store } from '@tanstack/store';
import { useStore } from '@tanstack/react-store';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  token: null
};

export const userStore = new Store(initialState);

export function setUser(user: User | null) {
  userStore.setState((state) => ({
    ...state,
    user,
    isAuthenticated: !!user
  }));
}

export function setToken(token: string | null) {
  userStore.setState((state) => ({
    ...state,
    token,
  }));
}

export function clearUser() {
  userStore.setState(() => initialState);
}

export function useUser(): { user: User | null; isAuthenticated: boolean } {
  return useStore(userStore);
}
