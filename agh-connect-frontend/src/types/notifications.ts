export type NotificationType = 'system' | 'offer' | 'payment' | 'message';

export interface NotificationItem {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	link?: string;
}
