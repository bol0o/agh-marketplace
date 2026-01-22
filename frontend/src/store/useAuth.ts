import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import api from '@/lib/axios';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

interface UserState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	login: (credentials: LoginCredentials) => Promise<void>;
	register: (data: RegisterCredentials) => Promise<void>;

	logout: () => Promise<void>;
}

export const useAuth = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			isLoading: false,

			login: async (credentials: LoginCredentials) => {
				set({ isLoading: true });
				try {
					const { data } = await api.post<AuthResponse>('/auth/login', credentials);

					Cookies.set('accessToken', data.token, {
						expires: 1,
						secure: IS_PRODUCTION,
						sameSite: 'strict',
					});
					Cookies.set('refreshToken', data.refreshToken, {
						expires: 7,
						secure: IS_PRODUCTION,
						sameSite: 'strict',
					});
					Cookies.set('userRole', data.user.role, {
						expires: 1,
						secure: IS_PRODUCTION,
					});

					set({ user: data.user, isAuthenticated: true, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					throw error;
				}
			},

			register: async (registerData: RegisterCredentials) => {
				set({ isLoading: true });
				try {
					const { data } = await api.post<AuthResponse>('/auth/register', registerData);

					Cookies.set('accessToken', data.token, {
						expires: 1,
						secure: IS_PRODUCTION,
						sameSite: 'strict',
					});
					Cookies.set('refreshToken', data.refreshToken, {
						expires: 7,
						secure: IS_PRODUCTION,
						sameSite: 'strict',
					});
					Cookies.set('userRole', data.user.role, {
						expires: 1,
						secure: IS_PRODUCTION,
					});

					set({ user: data.user, isAuthenticated: true, isLoading: false });
				} catch (error) {
					set({ isLoading: false });
					throw error;
				}
			},

			logout: async () => {
				set({ isLoading: true });

				try {
					await api.post('/auth/logout');
				} catch (error) {
					console.error('Błąd podczas wylogowywania na serwerze:', error);
				} finally {
					Cookies.remove('accessToken');
					Cookies.remove('refreshToken');
					Cookies.remove('userRole');

					set({ user: null, isAuthenticated: false, isLoading: false });

					if (typeof window !== 'undefined') {
						window.location.href = '/login';
					}
				}
			},
		}),
		{
			name: 'user-storage',
			partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
		}
	)
);
