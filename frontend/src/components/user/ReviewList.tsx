'use client';

import { Review } from '@/types/user';
import { Star, UserCircle, Calendar, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ReviewList.module.scss';
import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';

interface ReviewListProps {
	reviews: Review[];
	showAddReview?: boolean;
	onAddReview?: () => void;
	onDeleteReview?: (reviewId: string) => Promise<boolean>;
	currentUserId?: string;
	currentUserRole?: string;
    paginationInfo?: {
		totalItems: number;
		currentPage: number;
		totalPages: number;
	};
}

export function ReviewList({
	reviews,
	showAddReview = false,
	onAddReview,
	onDeleteReview,
	currentUserId,
	currentUserRole = 'user',
    paginationInfo,
}: ReviewListProps) {
	const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
	const { addToast } = useUIStore();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`${styles.star} ${i < rating ? styles.starFilled : ''}`}
				size={16}
			/>
		));
	};

	const renderAvatar = (review: Review) => {
		if (review.reviewer?.avatarUrl) {
			return (
				<div className={styles.avatarContainer}>
					<Image
						src={review.reviewer.avatarUrl}
						alt={`Avatar użytkownika ${review.reviewer.name}`}
						width={40}
						height={40}
						className={styles.avatar}
					/>
				</div>
			);
		}

		return <UserCircle className={styles.reviewerIcon} />;
	};

	const handleDeleteReview = async (reviewId: string) => {
		if (!onDeleteReview) return;

		try {
			setDeletingReviewId(reviewId);
			await onDeleteReview(reviewId);
		} catch (error) {
			addToast('Błąd podczas usuwania opinii', 'error');
			console.error('Błąd podczas usuwania opinii:', error);
		} finally {
			setDeletingReviewId(null);
			addToast('Pomyślnie usunięto opinie', 'success');
		}
	};

	const canDeleteReview = (review: Review) => {
		if (!onDeleteReview) return false;
		if (currentUserRole === 'admin') return true;
		return review.reviewerId === currentUserId;
	};

	if (reviews.length === 0) {
		return (
			<div className={styles.emptyReviews}>
				<div className={styles.emptyContent}>
					<Star className={styles.emptyIcon} />
					<h3 className={styles.emptyTitle}>Brak opinii</h3>
					<p className={styles.emptyText}>
						{paginationInfo?.currentPage && paginationInfo.currentPage > 1 
							? 'Brak opinii na tej stronie.' 
							: 'Ten użytkownik nie ma jeszcze żadnych opinii.'}
					</p>
					{showAddReview && onAddReview && (
						<button className={styles.addReviewButton} onClick={onAddReview}>
							Dodaj pierwszą opinię
						</button>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>
					Opinie ({paginationInfo?.totalItems || reviews.length})
					{paginationInfo && paginationInfo.totalPages > 1 && (
						<span className={styles.pageInfo}>
							{' '}· Strona {paginationInfo.currentPage} z {paginationInfo.totalPages}
						</span>
					)}
				</h2>
				{showAddReview && onAddReview && (
					<button className={styles.addReviewButton} onClick={onAddReview}>
						Dodaj opinię
					</button>
				)}
			</div>

			<div className={styles.reviewsList}>
				{reviews.map((review) => {
					const isCurrentUserReview = review.reviewerId === currentUserId;
					const showDeleteButton = canDeleteReview(review);
					const isDeleting = deletingReviewId === review.id;

					return (
						<div key={review.id} className={styles.reviewCard}>
							<div className={styles.reviewHeader}>
								<div className={styles.reviewerSection}>
									<Link
										href={`/user/${review.reviewer?.id}`}
										className={styles.reviewerLink}
										aria-label={`Profil użytkownika ${review.reviewer?.name || 'Anonim'}`}
									>
										<div className={styles.reviewerInfo}>
											{renderAvatar(review)}
											<div className={styles.reviewerDetails}>
												<div className={styles.reviewerName}>
													{review.reviewer
														? `${review.reviewer.name}`
														: 'Anonimowy użytkownik'}
													{isCurrentUserReview && (
														<span className={styles.youBadge}>
															(Ty)
														</span>
													)}
												</div>
												<div className={styles.reviewDate}>
													<Calendar
														className={styles.dateIcon}
														size={14}
													/>
													{formatDate(review.createdAt)}
												</div>
											</div>
										</div>
									</Link>
									<div className={styles.reviewRating}>
										{renderStars(review.rating)}
									</div>
								</div>

								{showDeleteButton && (
									<button
										className={styles.deleteButton}
										onClick={() => handleDeleteReview(review.id)}
										disabled={isDeleting}
										aria-label="Usuń opinię"
										title={
											currentUserRole === 'admin'
												? 'Usuń opinię (admin)'
												: 'Usuń swoją opinię'
										}
									>
										{isDeleting ? (
											<span className={styles.deleteSpinner}></span>
										) : (
											<Trash2 size={18} />
										)}
									</button>
								)}
							</div>

							{review.comment && (
								<div className={styles.reviewComment}>{review.comment}</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
