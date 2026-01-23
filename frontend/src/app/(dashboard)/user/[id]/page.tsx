'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserProfileHeader } from '@/components/user/UserProfileHeader';
import { UserStats } from '@/components/user/UserStats';
import { ReviewList } from '@/components/user/ReviewList';
import { AddReviewForm } from '@/components/user/AddReviewForm';
import { AlertCircle } from 'lucide-react';
import { isAxiosError } from 'axios';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/store/useAuth';
import styles from '../user.module.scss';
import { PageLoading } from '@/components/shared/PageLoading';
import { useUIStore } from '@/store/uiStore';

export default function UserProfilePage() {
	const params = useParams();
	const userId = params.id as string;
	const { user: currentUser } = useAuth();
	const { user, reviews, loading, error, createReview, deleteReview } = useUser({ userId });
	const [showAddReview, setShowAddReview] = useState(false);
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);
	const { addToast } = useUIStore();

	const isOwnProfile = currentUser?.id === userId;

	const handleAddReview = async (rating: number, comment: string) => {
		try {
			setIsSubmittingReview(true);
			await createReview({ rating, comment });

			setShowAddReview(false);
			addToast('Opinia została dodana pomyślnie!', 'success');
		} catch (err: unknown) {
			console.error('Error adding review:', err);

			let errorMessage = 'Nie udało się dodać opinii';

			if (isAxiosError(err)) {
				errorMessage =
					err.response?.data?.error || err.response?.data?.message || errorMessage;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			addToast(`Błąd: ${errorMessage}`, 'error');
		} finally {
			setIsSubmittingReview(false);
		}
	};

	if (loading) {
		return <PageLoading text={'Ładowanie użytkownika...'} />;
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
				onDeleteReview={deleteReview}
				currentUserRole={currentUser?.role}
			/>
		</div>
	);
}
