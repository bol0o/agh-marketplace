'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Pagination } from '@/components/shared/Pagination';
import { SearchX, Loader2, AlertCircle } from 'lucide-react';
import styles from './marketplace.module.scss';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/marketplace';

const ITEMS_PER_PAGE = 12;

export default function MarketplacePage() {
	const searchParams = useSearchParams();

	const { data: allProducts = [], isLoading, isError } = useProducts();

	const category = searchParams.get('cat');

	const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
	const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;

	const type = searchParams.get('type');
	const conditionParam = searchParams.get('condition');
	const conditions = conditionParam ? conditionParam.split(',') : [];
	const searchQuery = searchParams.get('search');

	const currentPage = Number(searchParams.get('page')) || 1;

	if (isLoading) {
		return (
			<div
				className={styles.wrapper}
				style={{
					height: '50vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Loader2 className="animate-spin text-blue-600" size={48} />
			</div>
		);
	}

	if (isError) {
		return (
			<div className={styles.wrapper} style={{ textAlign: 'center', marginTop: '50px' }}>
				<AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
				<h3 className="text-xl font-bold">Błąd pobierania ofert</h3>
				<p>Nie udało się połączyć z serwerem.</p>
			</div>
		);
	}

	const filteredProducts = allProducts.filter((product) => {
		if (category && product.category.toUpperCase() !== category.toUpperCase()) return false;
		if (type && type !== 'all' && product.type !== type) return false; // Opcjonalne
		if (minPrice !== null && product.price < minPrice) return false;
		if (maxPrice !== null && product.price > maxPrice) return false;
		if (conditions.length > 0 && !conditions.includes(product.condition)) return false;
		if (searchQuery) {
			return product.title.toLowerCase().includes(searchQuery.toLowerCase());
		}
		return true;
	});

	const totalItems = filteredProducts.length;
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

	const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	const pageTitle = category || 'Wszystkie Oferty';
	const currentItemsLower = totalItems > 0 ? startIndex + 1 : 0;
	const currentItemsUpper = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<div className={styles.titleGroup}>
					<h1>{pageTitle}</h1>
				</div>
				<div className={styles.resultsCount}>
					{`${currentItemsLower}-${currentItemsUpper} z ${totalItems} wyników`}
				</div>
			</div>

			{currentProducts.length > 0 ? (
				<>
					<div className={styles.grid}>
						{currentProducts.map((product: Product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					{totalPages > 1 && <Pagination totalPages={totalPages} />}
				</>
			) : (
				<div className={styles.emptyState}>
					<SearchX size={48} color="#9ca3af" />
					<h3>Brak wyników</h3>
					<p>Nie znaleźliśmy ofert spełniających Twoje kryteria.</p>
					<Link href="/marketplace" className={styles.resetBtn}>
						Wyczyść filtry
					</Link>
				</div>
			)}
		</div>
	);
}
