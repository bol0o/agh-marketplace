'use client';

import { useState } from 'react';
import { UserProfileHeader } from '@/components/user/UserProfileHeader';
import { UserStats } from '@/components/user/UserStats';
import { ReviewList } from '@/components/user/ReviewList';
import { Loader, AlertCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/store/useAuth'; // Dodajemy
import styles from './user.module.scss';

export default function CurrentUserPage() {
	const { user } = useAuth(); // Pobieramy currentUser z auth
	const { user: profileUser, reviews, loading, error } = useUser();
	const [showAddReview, setShowAddReview] = useState(false);
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);

	const handleAddReview = async (rating: number, comment: string) => {
		try {
			setIsSubmittingReview(true);
			// createReview z hooka useUser
			setShowAddReview(false);
		} catch (err) {
			console.error('Error adding review:', err);
		} finally {
			setIsSubmittingReview(false);
		}
	};

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Loader className={styles.spinner} size={48} />
				<p>Ładowanie profilu...</p>
			</div>
		);
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

			<ReviewList
				reviews={reviews}
				showAddReview={false}
				currentUserId={user?.id} // Przekazujemy ID obecnego użytkownika
			/>
		</div>
	);
}
