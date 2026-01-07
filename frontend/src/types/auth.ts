// src/types/auth.ts

export interface User {
	id: string;
	email: string;
	name: string;
	avatar: string | null;
	role: 'student' | 'admin' | string; // Backend zwraca małe litery, token duże - ujednolicimy to
	studentInfo: {
		faculty: string | null;
		year: number;
	};
	rating: number;
	ratingCount: number;
	joinedAt: string;
}

export interface AuthResponse {
	token: string; // Access Token
	refreshToken: string; // Refresh Token
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
