'use client';

import { Review } from '@/types/user';
import { Star, UserCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import styles from './ReviewList.module.scss';

interface ReviewListProps {
	reviews: Review[];
	showAddReview?: boolean;
	onAddReview?: () => void;
	currentUserId?: string;
}

export function ReviewList({
	reviews,
	showAddReview = false,
	onAddReview,
	currentUserId,
}: ReviewListProps) {
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

	if (reviews.length === 0) {
		return (
			<div className={styles.emptyReviews}>
				<div className={styles.emptyContent}>
					<Star className={styles.emptyIcon} />
					<h3 className={styles.emptyTitle}>Brak opinii</h3>
					<p className={styles.emptyText}>
						Ten użytkownik nie ma jeszcze żadnych opinii.
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
				<h2 className={styles.title}>Opinie ({reviews.length})</h2>
				{showAddReview && onAddReview && (
					<button className={styles.addReviewButton} onClick={onAddReview}>
						Dodaj opinię
					</button>
				)}
			</div>

			<div className={styles.reviewsList}>
				{reviews.map((review) => {
					const isCurrentUserReview = review.reviewerId === currentUserId;

					return (
						<div key={review.id} className={styles.reviewCard}>
							<div className={styles.reviewHeader}>
								<Link
									href={`/user/${review.reviewerId}`}
									className={styles.reviewerLink}
									aria-label={`Profil użytkownika ${review.reviewer?.firstName || 'Anonim'}`}
								>
									<div className={styles.reviewerInfo}>
										<UserCircle className={styles.reviewerIcon} />
										<div>
											<div className={styles.reviewerName}>
												{review.reviewer
													? `${review.reviewer.firstName} ${review.reviewer.lastName}`
													: 'Anonimowy użytkownik'}
												{isCurrentUserReview && (
													<span className={styles.youBadge}>(Ty)</span>
												)}
											</div>
											<div className={styles.reviewDate}>
												<Calendar className={styles.dateIcon} size={14} />
												{formatDate(review.createdAt)}
											</div>
										</div>
									</div>
								</Link>
								<div className={styles.reviewRating}>
									{renderStars(review.rating)}
								</div>
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
