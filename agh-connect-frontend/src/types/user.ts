export interface Address {
	street: string;
	city: string;
	zipCode: string;
	buildingNumber: string;
	apartmentNumber?: string;
	phone: string;
}

export interface UserSettings {
	notifications: {
		email: boolean;
		push: boolean;
		marketing: boolean;
	};
}

export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	role: 'STUDENT' | 'ADMIN' | 'TEACHER';

	studentInfo?: {
		faculty: string; // np. "WI", "EAIiIB"
		year: number;
	};

	rating?: number; // Średnia ocen
	ratingCount: number; // Liczba opinii
	joinedAt: string; // Data dołączenia

	// Dane prywatne
	address?: Address;
	settings?: UserSettings;

	// Statystyki
	listedProductsCount: number;
	soldItemsCount: number;
}

export type PublicUserProfile = Pick<
	User,
	| 'id'
	| 'name'
	| 'avatar'
	| 'studentInfo'
	| 'rating'
	| 'ratingCount'
	| 'joinedAt'
	| 'listedProductsCount'
	| 'role'
>;

// Rzeczy które brakuje
// User: address, settings, ratingCount
// Orders: stan - 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
// Address: building number, apartment number
// Chat: lastSeen, status productu 'archived', messages!!
// Notifications: całe
