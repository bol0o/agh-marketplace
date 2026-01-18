'use client';

import { Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { Pagination } from '@/components/shared/Pagination';
import styles from './NotificationList.module.scss';

interface Notification {
	id: string;
	type: string;
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	link: string | null;
}

interface NotificationTypeConfig {
	label: string;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
}

interface NotificationListProps {
	notifications: Notification[];
	totalPages: number;
	showOnlyUnread: boolean;
	selectedType: string;
	notificationTypes: Record<string, NotificationTypeConfig>;
	getNotificationType: (type: string) => NotificationTypeConfig;
	formatDate: (dateString: string) => string;
	onMarkAsRead: (id: string) => void;
}

export function NotificationList({
	notifications,
	totalPages,
	showOnlyUnread,
	selectedType,
	notificationTypes,
	getNotificationType,
	formatDate,
	onMarkAsRead,
}: NotificationListProps) {
	if (!Array.isArray(notifications) || notifications.length === 0) {
		return (
			<div className={styles.emptyState}>
				<Bell size={48} className={styles.emptyIcon} />
				<h3 className={styles.emptyTitle}>Brak powiadomień</h3>
				<p className={styles.emptyMessage}>
					{showOnlyUnread
						? 'Nie masz nieprzeczytanych powiadomień'
						: selectedType !== 'ALL'
							? 'Brak powiadomień tego typu'
							: 'Wszystkie sprawdzone! Wróć później po nowe powiadomienia.'}
				</p>
			</div>
		);
	}

	return (
		<div className={styles.listContainer}>
			<div className={styles.notifications}>
				{notifications.map((notification) => {
					const typeConfig = getNotificationType(notification.type);

					return (
						<NotificationItem
							key={notification.id}
							{...notification}
							typeConfig={typeConfig}
							formatDate={formatDate}
							onMarkAsRead={onMarkAsRead}
						/>
					);
				})}
			</div>

			{totalPages > 1 && (
				<div className={styles.pagination}>
					<Pagination totalPages={totalPages} />
				</div>
			)}
		</div>
	);
}
