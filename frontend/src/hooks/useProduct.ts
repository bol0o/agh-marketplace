import { useState, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { Product } from '@/types/marketplace';
import api from '@/lib/axios';

export const useProduct = (id: string) => {
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProduct = useCallback(async () => {
		try {
			setLoading(true);
			const response = await api.get(`/products/${id}`);
			setProduct(response.data);
		} catch (err: unknown) {
			let message = 'Nie udało się pobrać produktu';

			if (isAxiosError(err)) {
				message = err.response?.data?.error || message;
			}

			setError(message);
		} finally {
			setLoading(false);
		}
	}, [id]);

	const updateProduct = useCallback(
		async (data: Partial<Product>) => {
			try {
				setLoading(true);
				const response = await api.patch(`/products/${id}`, data);
				setProduct(response.data);
				return response.data;
			} catch (err: unknown) {
				let message = 'Nie udało się zaktualizować produktu';

				if (isAxiosError(err)) {
					message = err.response?.data?.error || message;
				}

				setError(message);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[id]
	);

	const deleteProduct = useCallback(async () => {
		try {
			await api.delete(`/products/${id}`);
		} catch (err: unknown) {
			let message = 'Nie udało się usunąć produktu';

			if (isAxiosError(err)) {
				message = err.response?.data?.error || message;
			}

			setError(message);
			throw err;
		}
	}, [id]);

	return {
		product,
		loading,
		error,
		fetchProduct,
		updateProduct,
		deleteProduct,
	};
};
