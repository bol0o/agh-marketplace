export interface User {
	id: string;
	email: string;
	name: string;
	avatar: string | null;
	role: 'user' | 'admin' | 'moderator';
	studentInfo?: {
		faculty: string | null;
		year: number | null;
	};
	rating: number;
	ratingCount: number;
	joinedAt: string;
	settings: {
		notifications: {
			email: boolean;
			push: boolean;
			marketing: boolean;
		};
	};
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
	completionTime?: number; // in hours
}
