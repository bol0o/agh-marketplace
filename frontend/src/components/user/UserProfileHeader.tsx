'use client';

import { User } from '@/types/user';
import { Mail, Calendar, Star, GraduationCap } from 'lucide-react';
import styles from './UserProfileHeader.module.scss';

interface UserProfileHeaderProps {
	user: User;
	isCurrentUser?: boolean;
}

export function UserProfileHeader({ user, isCurrentUser = false }: UserProfileHeaderProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'long',
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.avatarSection}>
				<div className={styles.avatar}>
					{user.avatar ? (
						<img src={user.avatar} alt={user.name} />
					) : (
						<span className={styles.avatarFallback}>{user.name.charAt(0)}</span>
					)}
				</div>
				{isCurrentUser && <span className={styles.currentUserBadge}>Twój profil</span>}
			</div>

			<div className={styles.userInfo}>
				<h1 className={styles.userName}>{user.name}</h1>

				<div className={styles.ratingSection}>
					<div className={styles.rating}>
						<Star className={styles.starIcon} />
						<span className={styles.ratingValue}>{user.rating.toFixed(1)}</span>
						<span className={styles.ratingCount}>
							({user.ratingCount} {user.ratingCount === 1 ? 'opinia' : 'opinii'})
						</span>
					</div>
				</div>

				<div className={styles.details}>
					{user.studentInfo?.faculty && (
						<div className={styles.detailItem}>
							<GraduationCap className={styles.detailIcon} />
							<span>{user.studentInfo.faculty}</span>
						</div>
					)}

					<div className={styles.detailItem}>
						<Calendar className={styles.detailIcon} />
						<span>Dołączył {formatDate(user.joinedAt)}</span>
					</div>

					{isCurrentUser && (
						<div className={styles.detailItem}>
							<Mail className={styles.detailIcon} />
							<span>{user.email}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
