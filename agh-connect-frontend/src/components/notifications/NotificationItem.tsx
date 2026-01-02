import Link from 'next/link';
import { NotificationItem as INotificationItem } from '@/data/notifications';
import { Trash2, CreditCard, Gavel, Info, Mail } from 'lucide-react';
import styles from './NotificationItem.module.scss';

interface NotificationItemProps {
	item: INotificationItem;
	onDelete: (id: string) => void;
}

export function NotificationItem({ item, onDelete }: NotificationItemProps) {
	const getIcon = (type: string) => {
		switch (type) {
			case 'offer':
				return <Gavel size={24} />;
			case 'payment':
				return <CreditCard size={24} />;
			case 'message':
				return <Mail size={24} />;
			default:
				return <Info size={24} />;
		}
	};

	return (
		<div className={`${styles.item} ${!item.isRead ? styles.unread : ''}`}>
			<div className={`${styles.iconWrapper} ${styles[item.type]}`}>{getIcon(item.type)}</div>

			<div className={styles.content}>
				<div className={styles.headerRow}>
					<h3>{item.title}</h3>
					<span>{item.timestamp}</span>
				</div>
				<p>{item.message}</p>

				{item.link && (
					<Link href={item.link} className={styles.link}>
						Zobacz szczegóły &rarr;
					</Link>
				)}
			</div>

			<button
				className={styles.deleteBtn}
				onClick={() => onDelete(item.id)}
				title="Usuń powiadomienie"
			>
				<Trash2 size={18} />
			</button>
		</div>
	);
}
