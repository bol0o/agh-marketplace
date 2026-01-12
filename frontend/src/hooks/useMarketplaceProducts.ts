import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, ProductsResponse } from '@/types/marketplace';

interface UseMarketplaceProductsReturn {
	products: Product[];
	isLoading: boolean;
	error: string | null;
	pagination: ProductsResponse['pagination'] | null;
	refresh: () => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const useMarketplaceProducts = (): UseMarketplaceProductsReturn => {
	const searchParams = useSearchParams();

	const [products, setProducts] = useState<Product[]>([]);
	const [pagination, setPagination] = useState<ProductsResponse['pagination'] | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Budowanie parametrów dla API
	const buildApiParams = useCallback(() => {
		const params = new URLSearchParams();

		const page = searchParams.get('page') || '1';
		params.set('page', page);

		const search = searchParams.get('search');
		if (search) params.set('search', search);

		const cat = searchParams.get('cat');
		if (cat) {
			params.set('cat', cat.toUpperCase());
		}

		const minPrice = searchParams.get('minPrice');
		if (minPrice) params.set('minPrice', minPrice);

		const maxPrice = searchParams.get('maxPrice');
		if (maxPrice) params.set('maxPrice', maxPrice);

		const type = searchParams.get('type');
		if (type && type !== 'all') {
			params.set('status', type);
		}

		const sort = searchParams.get('sort');
		if (sort) {
			const sortMap: Record<string, string> = {
				price_asc: 'price_asc',
				price_desc: 'price_desc',
				name_asc: 'name_asc',
				name_desc: 'name_desc',
				newest: 'date_desc',
				date_desc: 'date_asc',
			};
			params.set('sort', sortMap[sort] || sort);
		}

		const location = searchParams.get('location');
		if (location) params.set('location', location);

		const condition = searchParams.get('condition');
		if (condition) {
			params.set('condition', condition);
		}

		return params.toString();
	}, [searchParams]);

	const fetchProducts = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const queryString = buildApiParams();
			const response = await fetch(`${API_URL}/products?${queryString}`);

			if (!response.ok) {
				throw new Error(`Błąd API (${response.status}): ${response.statusText}`);
			}

			const data: ProductsResponse = await response.json();

			setProducts(data.products || []);
			setPagination(data.pagination);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'Nie udało się pobrać produktów';
			setError(errorMessage);
			console.error('Błąd pobierania produktów:', err);
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
