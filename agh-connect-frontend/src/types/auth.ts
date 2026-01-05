import { User } from './user';

export type UserRole = 'STUDENT' | 'ADMIN' | 'TEACHER';

export interface AuthResponse {
	user: User;
	token: string;
	refreshToken?: string;
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
	studentId?: string; // Opcjonalne
}
