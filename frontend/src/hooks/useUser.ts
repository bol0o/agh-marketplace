import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { User, Review } from '@/types/user';
import { CreateReviewData } from '@/types/user';

interface UseUserProps {
	userId?: string;
}

export const useUser = ({ userId }: UseUserProps = {}) => {
	const [user, setUser] = useState<User | null>(null);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUserData();
	}, [userId]);

	const fetchUserData = async () => {
		try {
			setLoading(true);
			setError(null);

			let userData;

			if (userId) {
				// Pobierz konkretnego użytkownika
				const response = await api.get(`/users/${userId}`);
				userData = response.data;
			} else {
				// Pobierz obecnie zalogowanego użytkownika
				const response = await api.get('/users/me');
				userData = response.data;
			}

			setUser(userData);

			// Pobierz recenzje
			const reviewsResponse = await api.get(`/reviews/${userData.id}`);
			setReviews(reviewsResponse.data || []);
		} catch (err: any) {
			console.error('Error fetching user data:', err);
			setError('Nie udało się pobrać danych użytkownika');
			setUser(null);
			setReviews([]);
		} finally {
			setLoading(false);
		}
	};

	const createReview = async (reviewData: Omit<CreateReviewData, 'revieweeId'>) => {
		if (!user) throw new Error('No user selected');

		try {
			const response = await api.post('/reviews', {
				...reviewData,
				revieweeId: user.id,
			});

			// Dodaj nową recenzję do listy
			setReviews((prev) => [response.data, ...prev]);

			// Aktualizuj rating użytkownika
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
		} catch (err: any) {
			console.error('Error creating review:', err);
			throw err;
		}
	};

	return {
		user,
		reviews,
		loading,
		error,
		refresh: fetchUserData,
		createReview,
	};
};
