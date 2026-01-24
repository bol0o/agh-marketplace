'use client';

import Image from 'next/image';
import { Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
// import { useMessages } from '@/hooks/useMessages';
import styles from './WelcomeBanner.module.scss';
import { useChat } from '@/hooks/useChat';

interface WelcomeBannerProps {
	className?: string;
}

export function WelcomeBanner({ className = '' }: WelcomeBannerProps) {
	const { user } = useAuth();
	const { unreadCount: notificationCount } = useNotifications();
	const { totalUnreadMessages } = useChat();

	if (!user) return null;

	const userFirstName = user.name.split(' ')[0];

	const faculty = user.studentInfo?.faculty?.split(' ')[1];
	const welcomeText = faculty
		? `Witaj ${userFirstName}, co tam na Wydziale ${faculty}?`
		: `Witaj ${userFirstName}, co tam u Ciebie?`;

	const hasMessages = totalUnreadMessages > 0;
	const hasNotifications = notificationCount > 0;

	return (
		<div className={`${styles.welcomeBanner} ${className}`}>
			<div className={styles.content}>
				<div className={styles.userInfo}>
					<div className={styles.avatarSection}>
						<div className={styles.avatar}>
							{user.avatar ? (
								<Image
									src={user.avatar}
									alt={user.name}
									fill
									sizes="64px"
									style={{ objectFit: 'cover' }}
								/>
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
										{totalUnreadMessages}{' '}
										{totalUnreadMessages > 1 ? 'wiadomości' : 'wiadomość'}
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
			</div>
		</div>
	);
}
