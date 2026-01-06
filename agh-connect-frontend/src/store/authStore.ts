import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';
import { AuthResponse } from '@/types/auth';

interface AuthState {
	user: User | null;
	token: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;

	login: (data: AuthResponse) => void;
	logout: () => void;
	clear: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			refreshToken: null,
			isAuthenticated: false,

			login: (data: AuthResponse) => {
				const { user, token, refreshToken } = data;

				if (typeof window !== 'undefined') {
					document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
					document.cookie = `userRole=${user.role}; path=/; max-age=${7 * 24 * 60 * 60}`;
					document.cookie = `userId=${user.id}; path=/; max-age=${7 * 24 * 60 * 60}`;

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
					document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
					document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
					document.cookie = 'userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

					localStorage.removeItem('token');
					localStorage.removeItem('refreshToken');
				}

				set({
					user: null,
					token: null,
					refreshToken: null,
					isAuthenticated: false,
				});
			},

			clear: () => {
				set({
					user: null,
					token: null,
					refreshToken: null,
					isAuthenticated: false,
				});
			},
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				refreshToken: state.refreshToken,
			}),
		}
	)
);
