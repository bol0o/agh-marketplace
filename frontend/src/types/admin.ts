export interface DashboardStats {
	totalUsers: number;
	activeListings: number;
	totalRevenue: number;
	pendingReports: number;
}

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: 'STUDENT' | 'ADMIN' | 'TEACHER';
	isActive: boolean;
	_count: {
		products: number;
		orders: number;
	};
}
