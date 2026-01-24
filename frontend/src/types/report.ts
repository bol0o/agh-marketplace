export type ReportStatus = 'open' | 'in_progress' | 'closed';

export interface Reporter {
	id: string;
	name: string;
	email: string;
}

export interface Report {
	id: string;
	reason: string;
	details?: string;
	status: ReportStatus;
	createdAt: string;
	updatedAt: string;
	reporter: Reporter;
	targetId: string;
	targetType: string;
}
