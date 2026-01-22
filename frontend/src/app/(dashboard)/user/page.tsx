'use client';

import { UserProfileHeader } from '@/components/user/UserProfileHeader';
import { UserStats } from '@/components/user/UserStats';
import { ReviewList } from '@/components/user/ReviewList';
import { AlertCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/store/useAuth';
import styles from './user.module.scss';
import { PageLoading } from '@/components/shared/PageLoading';

export default function CurrentUserPage() {
	const { user } = useAuth();
	const { user: profileUser, reviews, loading, error } = useUser();

	if (loading) {
		return <PageLoading text={'Ładowanie użytkownika...'} />;
	}

	if (error || !profileUser) {
		return (
			<div className={styles.errorContainer}>
				<AlertCircle className={styles.errorIcon} size={48} />
				<h2>Wystąpił błąd</h2>
				<p>{error || 'Nie udało się załadować profilu'}</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<UserProfileHeader user={profileUser} isCurrentUser />
			<UserStats user={profileUser} />

			<ReviewList reviews={reviews} showAddReview={false} currentUserId={user?.id} />
		</div>
	);
}
