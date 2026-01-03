export type ReportTargetType = 'product' | 'user' | 'chat';
export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface Report {
	id: string;
	reporterId: string;
	targetType: ReportTargetType;
	targetId: string;
	reason: 'spam' | 'scam' | 'offensive' | 'other';
	description?: string;
	status: ReportStatus;
	createdAt: string;
}

export interface AdminStats {
	totalUsers: number;
	activeListings: number;
	totalRevenue: number;
	pendingReports: number;
}
