'use client';

import { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';
import { CheckCheck } from 'lucide-react';
import { NotificationList } from '@/components/notifications/NotificationList';
import styles from './notifications.module.scss';

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	const deleteNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<div className={styles.layoutWrapper}>
			<div className={styles.pageHeader}>
				<div className={styles.titleGroup}>
					<h1>Powiadomienia {unreadCount > 0 && `(${unreadCount})`}</h1>
					<p>Bądź na bieżąco z ofertami i statusem Twoich aukcji</p>
				</div>

				{unreadCount > 0 && (
					<button className={styles.markReadBtn} onClick={markAllAsRead}>
						<CheckCheck size={18} />
						Oznacz wszystkie jako przeczytane
					</button>
				)}
			</div>

			<div className={styles.container}>
				<NotificationList notifications={notifications} onDelete={deleteNotification} />
			</div>
		</div>
	);
}
