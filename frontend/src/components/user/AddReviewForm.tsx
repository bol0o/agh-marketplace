'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import styles from './AddReviewForm.module.scss';

interface AddReviewFormProps {
	onSubmit: (rating: number, comment: string) => Promise<void>;
	onCancel: () => void;
	isSubmitting?: boolean;
}

export function AddReviewForm({ onSubmit, onCancel, isSubmitting = false }: AddReviewFormProps) {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');
	const [hoverRating, setHoverRating] = useState<number | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (comment.trim() && !isSubmitting) {
			await onSubmit(rating, comment.trim());
			setComment('');
		}
	};

	const renderStars = () => {
		return Array.from({ length: 5 }, (_, i) => {
			const starValue = i + 1;
			return (
				<button
					key={i}
					type="button"
					className={`${styles.starButton} ${
						starValue <= (hoverRating || rating) ? styles.starFilled : ''
					}`}
					onClick={() => setRating(starValue)}
					onMouseEnter={() => setHoverRating(starValue)}
					onMouseLeave={() => setHoverRating(null)}
					aria-label={`Oceń ${starValue} ${starValue === 1 ? 'gwiazdkę' : 'gwiazdki'}`}
					disabled={isSubmitting}
				>
					<Star size={32} />
				</button>
			);
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h3 className={styles.title}>Dodaj opinię</h3>
				<button
					className={styles.closeButton}
					onClick={onCancel}
					aria-label="Zamknij"
					disabled={isSubmitting}
				>
					<X size={20} />
				</button>
			</div>

			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.ratingSection}>
					<div className={styles.ratingLabel}>Twoja ocena</div>
					<div className={styles.starsContainer}>
						{renderStars()}
						<div className={styles.ratingValue}>{rating}.0</div>
					</div>
				</div>

				<div className={styles.commentSection}>
					<label htmlFor="comment" className={styles.commentLabel}>
						Komentarz (opcjonalnie)
					</label>
					<textarea
						id="comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className={styles.commentInput}
						placeholder="Opisz swoje doświadczenia z tym użytkownikiem..."
						rows={4}
						maxLength={500}
						disabled={isSubmitting}
					/>
					<div className={styles.commentCounter}>{comment.length}/500 znaków</div>
				</div>

				<div className={styles.actions}>
					<button
						type="button"
						className={styles.cancelButton}
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Anuluj
					</button>
					<button
						type="submit"
						className={styles.submitButton}
						disabled={!rating || isSubmitting}
					>
						{isSubmitting ? 'Wysyłanie...' : 'Dodaj opinię'}
					</button>
				</div>
			</form>
		</div>
	);
}
