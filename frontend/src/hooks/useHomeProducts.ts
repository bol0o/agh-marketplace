import { useState, useEffect, useCallback } from 'react';
import { Product, ProductsResponse } from '@/types/marketplace';
import api from '@/lib/axios';

interface UseHomeProductsProps {
	limit?: number;
	sort?: string;
	onlyFollowed?: boolean;
}

export const useHomeProducts = ({
	limit = 12,
	sort,
	onlyFollowed = false,
}: UseHomeProductsProps = {}) => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const params = new URLSearchParams({
				limit: limit.toString(),
			});

			if (sort) {
				params.append('sort', sort);
			}

			if (onlyFollowed) {
				params.append('onlyFollowed', 'true');
			}

			const response = await api.get<ProductsResponse>(`/products?${params}`);
			setProducts(response.data.products || []);
		} catch (err: unknown) {
			// 2. Zmiana any na unknown
			console.error('Error fetching home products:', err);
			setError('Nie udało się pobrać produktów');
			setProducts([]);
		} finally {
			setLoading(false);
		}
	}, [limit, sort, onlyFollowed]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return {
		products,
		loading,
		error,
		refresh: fetchProducts,
	};
};
