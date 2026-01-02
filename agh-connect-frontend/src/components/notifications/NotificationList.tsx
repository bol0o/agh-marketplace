import { NotificationItem as INotificationItem } from '@/data/notifications';
import { NotificationItem } from './NotificationItem';
import { Bell } from 'lucide-react';
import styles from './NotificationList.module.scss';

interface NotificationListProps {
	notifications: INotificationItem[];
	onDelete: (id: string) => void;
}

export function NotificationList({ notifications, onDelete }: NotificationListProps) {
	if (notifications.length === 0) {
		return (
			<div className={styles.emptyState}>
				<Bell size={48} strokeWidth={1.5} />
				<h3>Wszystko wyczyszczone!</h3>
				<p>Nie masz żadnych nowych powiadomień.</p>
			</div>
		);
	}

	return (
		<div className={styles.list}>
			{notifications.map((item) => (
				<NotificationItem key={item.id} item={item} onDelete={onDelete} />
			))}
		</div>
	);
}
