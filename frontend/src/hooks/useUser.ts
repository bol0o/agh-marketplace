import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from 'axios';
import api from '@/lib/axios';
import { User, Review } from '@/types/user';
import { CreateReviewData } from '@/types/user';
import { useSearchParams } from 'next/navigation';

interface UseUserProps {
	userId?: string;
}

interface PaginatedResponse {
	pagination: {
		totalItems: number;
		totalPages: number;
		currentPage: number;
		itemsPerPage: number;
	};
	reviews: Review[];
}

export const useUser = ({ userId }: UseUserProps = {}) => {
	const [user, setUser] = useState<User | null>(null);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
	const [pagination, setPagination] = useState({
		totalItems: 0,
		totalPages: 0,
		currentPage: 1,
		itemsPerPage: 10
	});

	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';
	const limit = searchParams.get('limit') || '4';

	const fetchUserData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			let userData;

			if (userId) {
				const response = await api.get(`/users/${userId}`);
				userData = response.data;
			} else {
				const response = await api.get('/users/me');
				userData = response.data;
			}

			setUser(userData);

			const reviewsResponse = await api.get<PaginatedResponse>(`/reviews/${userData.id}`, {
				params: { 
					page: parseInt(page), 
					limit: parseInt(limit) 
				}
			});
			
			setReviews(reviewsResponse.data.reviews || []);
			setPagination(reviewsResponse.data.pagination);
		} catch (err: unknown) {
			console.error('Error fetching user data:', err);
			setError('Nie udało się pobrać danych użytkownika');
			setUser(null);
			setReviews([]);
			setPagination({
				totalItems: 0,
				totalPages: 0,
				currentPage: 1,
				itemsPerPage: 10
			});
		} finally {
			setLoading(false);
		}
	}, [userId, page, limit]);

	useEffect(() => {
		fetchUserData();
	}, [fetchUserData]);

	const createReview = async (reviewData: Omit<CreateReviewData, 'revieweeId'>) => {
		if (!user) throw new Error('No user selected');

		try {
			const response = await api.post('/reviews', {
				...reviewData,
				revieweeId: user.id,
			});

			await fetchUserData();

			if (user) {
				const newTotalRating = user.rating * user.ratingCount + reviewData.rating;
				const newRatingCount = user.ratingCount + 1;
				const newAverageRating = newTotalRating / newRatingCount;

				setUser((prev) =>
					prev
						? {
								...prev,
								rating: newAverageRating,
								ratingCount: newRatingCount,
							}
						: null
				);
			}

			return response.data;
		} catch (err: unknown) {
			console.error('Error creating review:', err);
			throw err;
		}
	};

	const deleteReview = async (reviewId: string) => {
		try {
			setDeletingReviewId(reviewId);

			const reviewToDelete = reviews.find((review) => review.id === reviewId);
			if (!reviewToDelete) {
				throw new Error('Opinie nie znaleziono');
			}

			await api.delete(`/reviews/${reviewId}`);

			await fetchUserData();

			if (user && user.ratingCount > 1) {
				const newTotalRating = user.rating * user.ratingCount - reviewToDelete.rating;
				const newRatingCount = user.ratingCount - 1;
				const newAverageRating = newTotalRating / newRatingCount;

				setUser((prev) =>
					prev
						? {
								...prev,
								rating: newAverageRating,
								ratingCount: newRatingCount,
							}
						: null
				);
			} else if (user && user.ratingCount === 1) {
				setUser((prev) =>
					prev
						? {
								...prev,
								rating: 0,
								ratingCount: 0,
							}
						: null
				);
			}

			return true;
		} catch (err: unknown) {
			console.error('Error deleting review:', err);

			let errorMessage = 'Nie udało się usunąć opinii';

			if (isAxiosError(err)) {
				errorMessage = err.response?.data?.message || errorMessage;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			throw new Error(errorMessage);
		} finally {
			setDeletingReviewId(null);
		}
	};

	return {
		user,
		reviews,
		pagination,
		loading,
		error,
		deletingReviewId,
		refresh: fetchUserData,
		createReview,
		deleteReview,
	};
};