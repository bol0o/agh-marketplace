import { UserAddress } from './user';

export interface User {
	id: string;
	email: string;
	name: string;
	avatar: string | null;
	role: 'student' | 'admin' | string;
	studentInfo: {
		faculty: string | null;
		year: number;
	};
	rating: number;
	ratingCount: number;
	joinedAt: string;
	address?: UserAddress;
}

export interface AuthResponse {
	token: string;
	refreshToken: string;
	user: User;
}

export interface RefreshResponse {
	accessToken: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	acceptTerms: boolean;
}
