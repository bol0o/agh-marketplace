import { create } from 'zustand';
import { User } from '@/types/user';
import { authService } from '@/services/authService';

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	// Akcje
	login: (user: User, token: string) => void;
	logout: () => void;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
	isAuthenticated: false,
	isLoading: true,

	login: (user, token) => {
		localStorage.setItem('token', token);
		set({ user, token, isAuthenticated: true });
	},

	logout: () => {
		localStorage.removeItem('token');
		set({ user: null, token: null, isAuthenticated: false });
		window.location.href = '/login';
	},

	checkAuth: async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			set({ isLoading: false, isAuthenticated: false });
			return;
		}

		try {
			const user = await authService.getMe();
			set({ user, token, isAuthenticated: true });
		} catch (error) {
			console.error('Sesja wygasła:', error);
			localStorage.removeItem('token');
			set({ user: null, token: null, isAuthenticated: false });
		} finally {
			set({ isLoading: false });
		}
	},
}));
