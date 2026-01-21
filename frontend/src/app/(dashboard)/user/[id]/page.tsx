'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { UserProfileHeader } from '@/components/user/UserProfileHeader';
import { UserStats } from '@/components/user/UserStats';
import { ReviewList } from '@/components/user/ReviewList';
import { AddReviewForm } from '@/components/user/AddReviewForm';
import { Loader, AlertCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/store/useAuth';
import styles from '../user.module.scss';

export default function UserProfilePage() {
	const params = useParams();
	const userId = params.id as string;
	const { user: currentUser } = useAuth();

	const { user, reviews, loading, error, createReview } = useUser({ userId });
	const [showAddReview, setShowAddReview] = useState(false);
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);

	const isOwnProfile = currentUser?.id === userId;

	const handleAddReview = async (rating: number, comment: string) => {
		try {
			setIsSubmittingReview(true);
			await createReview({ rating, comment });
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

	if (error || !user) {
		return (
			<div className={styles.errorContainer}>
				<AlertCircle className={styles.errorIcon} size={48} />
				<h2>Wystąpił błąd</h2>
				<p>{error || 'Nie udało się załadować profilu użytkownika'}</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<UserProfileHeader user={user} isCurrentUser={isOwnProfile} />
			<UserStats user={user} />

			{!isOwnProfile && showAddReview && (
				<AddReviewForm
					onSubmit={handleAddReview}
					onCancel={() => setShowAddReview(false)}
					isSubmitting={isSubmittingReview}
				/>
			)}

			<ReviewList
				reviews={reviews}
				showAddReview={!isOwnProfile}
				onAddReview={() => setShowAddReview(true)}
				currentUserId={currentUser?.id}
			/>
		</div>
	);
}
