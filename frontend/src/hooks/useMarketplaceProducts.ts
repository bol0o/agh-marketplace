import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { isAxiosError } from 'axios';
import { Product, ProductsResponse } from '@/types/marketplace';
import api from '@/lib/axios';

interface UseMarketplaceProductsReturn {
	products: Product[];
	isLoading: boolean;
	error: string | null;
	pagination: ProductsResponse['pagination'] | null;
	refresh: () => Promise<void>;
}

export const useMarketplaceProducts = (): UseMarketplaceProductsReturn => {
	const searchParams = useSearchParams();

	const [products, setProducts] = useState<Product[]>([]);
	const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const buildApiParams = useCallback(() => {
		const params = new URLSearchParams();

		const page = searchParams.get('page') || '1';
		params.set('page', page);

		const search = searchParams.get('search');
		if (search) params.set('search', search);

		const cat = searchParams.get('cat');
		if (cat) params.set('cat', cat.toUpperCase());

		const minPrice = searchParams.get('minPrice');
		if (minPrice) params.set('minPrice', minPrice);

		const maxPrice = searchParams.get('maxPrice');
		if (maxPrice) params.set('maxPrice', maxPrice);

		const type = searchParams.get('type');
		if (type && type !== 'all') params.set('status', type);

		const onlyFollowed = searchParams.get('onlyFollowed');
		if (onlyFollowed) params.set('onlyFollowed', 'true');

		const sort = searchParams.get('sort');
		if (sort) {
			const sortMap: Record<string, string> = {
				price_asc: 'price_asc',
				price_desc: 'price_desc',
				name_asc: 'name_asc',
				name_desc: 'name_desc',
				date_asc: 'createdAt_asc',
				newest: 'newest',
			};
			params.set('sort', sortMap[sort] || sort);
		}

		const location = searchParams.get('location');
		if (location) params.set('location', location);

		const condition = searchParams.get('condition');
		if (condition) params.set('condition', condition);

		return params.toString();
	}, [searchParams]);

	const fetchProducts = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const queryString = buildApiParams();

			const response = await api.get<ProductsResponse>(`/products?${queryString}`);

			const data = response.data;

			setProducts(data.products || []);
			setPagination(data.pagination);
		} catch (err: unknown) {
			console.error('Błąd pobierania produktów:', err);

			let errorMessage = 'Nie udało się pobrać produktów';

			if (isAxiosError(err)) {
				errorMessage = err.response?.data?.error || err.message || errorMessage;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	}, [buildApiParams]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const refresh = useCallback(async () => {
		await fetchProducts();
	}, [fetchProducts]);

	return {
		products,
		isLoading,
		error,
		pagination,
		refresh,
	};
};
