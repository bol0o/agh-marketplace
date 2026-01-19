'use client';

import { Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
// import { useMessages } from '@/hooks/useMessages';
import styles from './WelcomeBanner.module.scss';

interface WelcomeBannerProps {
	className?: string;
}

export function WelcomeBanner({ className = '' }: WelcomeBannerProps) {
	const { user } = useAuth();
	const { unreadCount: notificationCount } = useNotifications();
	// const { unreadMessages: messageCount } = useMessages();
	const messageCount = 1;

	if (!user) return null;

	const userFirstName = user.name.split(' ')[0];

	const faculty = user.studentInfo?.faculty;
	const welcomeText = faculty
		? `Witaj ${userFirstName}, co tam na ${faculty}?`
		: `Witaj ${userFirstName}, co tam u Ciebie?`;

	const hasMessages = messageCount > 0;
	const hasNotifications = notificationCount > 0;

	return (
		<div className={`${styles.welcomeBanner} ${className}`}>
			<div className={styles.content}>
				<div className={styles.userInfo}>
					<div className={styles.avatarSection}>
						<div className={styles.avatar}>
							{user.avatar ? (
								<img src={user.avatar} alt={user.name} />
							) : (
								<span>{user.name.charAt(0)}</span>
							)}
						</div>
						<div className={styles.welcomeIcon}>
							<span>👋</span>
						</div>
					</div>
					<div>
						<h1 className={styles.welcomeTitle}>{welcomeText}</h1>

						<div className={styles.stats}>
							{hasNotifications && (
								<span className={styles.statBadge}>
									<Bell size={16} />
									<span>{notificationCount} powiadomienia</span>
								</span>
							)}

							{hasMessages && (
								<span className={styles.statBadge}>
									<MessageSquare size={16} />
									<span>
										{messageCount}{' '}
										{messageCount > 1 ? 'wiadomości' : 'wiadomość'}
									</span>
								</span>
							)}

							{!hasNotifications && !hasMessages && (
								<span className={styles.noNotifications}>
									Brak nowych powiadomień
								</span>
							)}
						</div>
					</div>
				</div>

				{user.studentInfo?.faculty && (
					<div className={styles.facultyBadge}>
						<span>{user.studentInfo.faculty}</span>
					</div>
				)}
			</div>
		</div>
	);
}
