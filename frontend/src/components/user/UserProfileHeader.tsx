'use client';

import Image from 'next/image';
import { User } from '@/types/user';
import { Mail, Calendar, Star, GraduationCap, Flag } from 'lucide-react';
import { useState } from 'react';
import styles from './UserProfileHeader.module.scss';
import { ReportModal } from '../shared/ReportModal';
import { useReport } from '@/hooks/useReport';

interface UserProfileHeaderProps {
	user: User;
	isCurrentUser?: boolean;
}

export function UserProfileHeader({ user, isCurrentUser = false }: UserProfileHeaderProps) {
	const [showReportModal, setShowReportModal] = useState(false);
	const { createReport, loading: isSubmitting } = useReport({
		targetId: user.id,
		targetType: 'user',
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'long',
		});
	};

	const handleReportSubmit = async (reason: string, description: string) => {
		try {
			await createReport({ targetId: user.id, targetType: 'user', reason, description });
			setShowReportModal(false);
		} catch (error) {
			console.error('Report submission error:', error);
		}
	};

	return (
		<>
			<div className={styles.container}>
				<div className={styles.avatarSection}>
					<div className={styles.avatar}>
						{user.avatar ? (
							<Image
								src={user.avatar}
								alt={user.name}
								fill
								sizes="(max-width: 768px) 100px, 150px"
								className={styles.avatarImg}
							/>
						) : (
							<span className={styles.avatarFallback}>{user.name.charAt(0)}</span>
						)}
					</div>
					{isCurrentUser && <span className={styles.currentUserBadge}>Twój profil</span>}
				</div>

				<div className={styles.userInfo}>
					<div className={styles.headerRow}>
						<h1 className={styles.userName}>{user.name}</h1>
						{!isCurrentUser && (
							<button
								className={styles.reportButton}
								onClick={() => setShowReportModal(true)}
								aria-label="Zgłoś użytkownika"
							>
								<Flag size={18} />
								<span className={styles.reportText}>Zgłoś</span>
							</button>
						)}
					</div>

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

			<ReportModal
				isOpen={showReportModal}
				onClose={() => setShowReportModal(false)}
				onSubmit={handleReportSubmit}
				targetName={user.name}
				targetType="user"
				isSubmitting={isSubmitting}
			/>
		</>
	);
}