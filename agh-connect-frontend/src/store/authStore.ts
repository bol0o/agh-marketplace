// src/store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types/user'; // Importuj nowe typy
import { authService } from '@/services/authService';
import { AuthResponse } from '@/types/auth';

interface AuthState {
	user: User | null;
	token: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	// Zmieniamy to: przyjmujemy cały obiekt odpowiedzi z API
	login: (data: AuthResponse) => void;

	logout: () => void;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
	refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null,
	isAuthenticated: false,
	isLoading: true,

	// --- ZAKTUALIZOWANA FUNKCJA LOGIN ---
	login: (data: AuthResponse) => {
		const { user, token, refreshToken } = data;

		if (typeof window !== 'undefined') {
			localStorage.setItem('token', token);
			if (refreshToken) {
				localStorage.setItem('refreshToken', refreshToken);
			}
		}

		set({
			user,
			token,
			refreshToken,
			isAuthenticated: true,
		});
	},

	logout: () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			localStorage.removeItem('refreshToken');
		}
		set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
		if (typeof window !== 'undefined') {
			window.location.href = '/login';
		}
	},

	checkAuth: async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			set({ isLoading: false, isAuthenticated: false });
			return;
		}

		try {
			// Tutaj nadal pobieramy usera, jeśli odświeżamy stronę (F5)
			const user = await authService.getMe();
			set({
				user,
				isAuthenticated: true,
				token: localStorage.getItem('token'),
				refreshToken: localStorage.getItem('refreshToken'),
			});
		} catch (error) {
			console.error('Błąd sesji:', error);
			if (typeof window !== 'undefined') {
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
			}
			set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
		} finally {
			set({ isLoading: false });
		}
	},
}));
