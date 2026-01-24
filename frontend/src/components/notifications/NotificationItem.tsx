'use client';

import { Check } from 'lucide-react';
import styles from './NotificationItem.module.scss';

interface NotificationItemProps {
	id: string;
	type: string;
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	link: string | null;
	typeConfig: {
		label: string;
		icon: React.ReactNode;
		color: string;
		bgColor: string;
	};
	formatDate: (dateString: string) => string;
	onMarkAsRead: (id: string) => void;
}

export function NotificationItem({
	id,
	title,
	message,
	timestamp,
	isRead,
	link,
	typeConfig,
	formatDate,
	onMarkAsRead,
}: NotificationItemProps) {
	return (
		<article className={`${styles.notificationItem} ${!isRead ? styles.unread : ''}`}>
			<div className={styles.iconContainer} style={{ backgroundColor: typeConfig.bgColor }}>
				<div className={styles.icon} style={{ color: typeConfig.color }}>
					{typeConfig.icon}
				</div>
			</div>

			<div className={styles.content}>
				<header className={styles.header}>
					<span className={styles.type} style={{ color: typeConfig.color }}>
						<span className={styles.typeIcon}>{typeConfig.icon}</span>
						{typeConfig.label}
					</span>
					<time className={styles.time} dateTime={timestamp}>
						{formatDate(timestamp)}
					</time>
				</header>

				<h3 className={styles.title}>{title}</h3>
				<p className={styles.message}>{message}</p>

				<footer className={styles.footer}>
					{link && (
						<a href={link} className={styles.link} style={{ color: typeConfig.color }}>
							Zobacz szczegóły →
						</a>
					)}

					{!isRead && (
						<button
							onClick={() => onMarkAsRead(id)}
							className={styles.markReadButton}
							aria-label="Oznacz jako przeczytane"
						>
							<Check size={16} />
							<span>Przeczytane</span>
						</button>
					)}
				</footer>
			</div>

			{!isRead && <div className={styles.unreadBadge}></div>}
		</article>
	);
}
