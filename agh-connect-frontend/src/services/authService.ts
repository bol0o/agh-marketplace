import api from '@/lib/axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { User } from '@/types/user';

export const authService = {
	login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		const response = await api.post<AuthResponse>('/auth/login', credentials);
		return response.data;
	},

	register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
		const response = await api.post<AuthResponse>('/auth/register', credentials);
		return response.data;
	},

	getMe: async (): Promise<User> => {
		const response = await api.get<User>('/users/me');
		return response.data;
	},
};
