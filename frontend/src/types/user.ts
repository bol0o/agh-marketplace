import { OrderAddress } from './order';

export interface User {
	id: string;
	email: string;
	name: string;
	avatar: string | null;
	role: 'user' | 'admin';
	studentInfo?: {
		faculty: string | null;
		year: number | null;
	};
	rating: number;
	ratingCount: number;
	joinedAt: string;
	settings: UserSettings;
	address?: UserAddress;
	listedProductsCount: number;
	soldItemsCount: number;
}

export interface Review {
	id: string;
	rating: number;
	comment: string;
	reviewerId: string;
	revieweeId: string;
	createdAt: string;
	reviewer?: {
		firstName: string;
		lastName: string;
		avatarUrl?: string;
	};
}

export interface CreateReviewData {
	revieweeId: string;
	rating: number;
	comment: string;
}

export interface UserStats {
	totalListings: number;
	totalSales: number;
	averageRating: number;
	totalReviews: number;
	responseRate?: number;
	completionTime?: number;
}

export interface UserAddress {
	street: string;
	buildingNumber: string;
	apartmentNumber: string;
	city: string;
	zipCode: string;
	phone: string;
}

export interface UserSettings {
	notifications: {
		email: boolean;
		push: boolean;
		marketing: boolean;
	};
}

export interface UpdateProfileData {
	firstName?: string;
	lastName?: string;
	avatarUrl?: string;
	faculty?: string;
	year?: number;
}

export interface UpdateAddressData {
	street?: string;
	buildingNumber?: string;
	apartmentNumber?: string | null;
	city?: string;
	zipCode?: string;
	phone?: string;
}

export interface UpdateSettingsData {
	email?: boolean;
	push?: boolean;
	marketing?: boolean;
}
