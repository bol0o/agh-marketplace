'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Pagination } from '@/components/shared/Pagination';
import { SearchX, Loader2, AlertCircle, Filter } from 'lucide-react';
import styles from './marketplace.module.scss';
import { useMarketplaceProducts } from '@/hooks/useMarketplaceProducts';
import { PageLoading } from '@/components/shared/PageLoading';

const CATEGORY_NAMES: Record<string, string> = {
	BOOKS: 'Książki',
	ELECTRONICS: 'Elektronika',
	ACCESSORIES: 'Akcesoria',
	CLOTHING: 'Odzież',
	OTHER: 'Inne',
};

const TYPE_NAMES: Record<string, string> = {
	buy_now: 'Kup Teraz',
	auction: 'Aukcja',
};

export default function MarketplacePage() {
	const searchParams = useSearchParams();
	const { products, isLoading, error, pagination, refresh } = useMarketplaceProducts();

	const category = searchParams.get('cat');
	const type = searchParams.get('type');
	const searchQuery = searchParams.get('search');
	const location = searchParams.get('location');

	const getPageTitle = () => {
		if (category) {
			return CATEGORY_NAMES[category.toUpperCase()] || category;
		}

		if (type && TYPE_NAMES[type]) {
			return TYPE_NAMES[type];
		}

		if (searchQuery) return `Wyniki dla: "${searchQuery}"`;
		if (location) return `Oferty w: ${location}`;

		return 'Wszystkie Oferty';
	};

	const hasActiveFilters = () => {
		const params = ['cat', 'minPrice', 'maxPrice', 'type', 'condition', 'search', 'location'];

		return params.some((param) => searchParams.has(param));
	};

	const currentPage = pagination?.currentPage || 1;
	const totalPages = pagination?.totalPages || 1;
	const totalProducts = pagination?.totalItems || 0;
	const itemsPerPage = pagination?.itemsPerPage || 24;

	const startItem = totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endItem = Math.min(currentPage * itemsPerPage, totalProducts);

	if (isLoading) {
		return <PageLoading text={'Ładowanie ofert...'} />;
	}

	if (error) {
		return (
			<div className={styles.errorWrapper}>
				<AlertCircle className={styles.errorIcon} size={48} />
				<h3 className={styles.errorTitle}>Błąd pobierania ofert</h3>
				<p className={styles.errorText}>{error}</p>
				<button onClick={refresh} className={styles.retryBtn}>
					Spróbuj ponownie
				</button>
			</div>
		);
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<div className={styles.titleSection}>
					<h1 className={styles.title}>{getPageTitle()}</h1>

					{hasActiveFilters() && (
						<div className={styles.activeFiltersBadge}>
							<Filter size={14} />
							<span>Aktywne filtry</span>
						</div>
					)}
				</div>

				<div className={styles.resultsInfo}>
					<div className={styles.resultsCount}>
						{totalProducts === 0
							? 'Brak wyników'
							: `Wyświetlanie ${startItem}-${endItem} z ${totalProducts} ofert`}
					</div>

					{totalPages > 1 && (
						<div className={styles.pageInfo}>
							Strona {currentPage} z {totalPages}
						</div>
					)}
				</div>
			</div>

			{products.length > 0 ? (
				<>
					<div className={styles.grid}>
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					{totalPages > 1 && (
						<div className={styles.paginationWrapper}>
							<Pagination totalPages={totalPages} />
						</div>
					)}
				</>
			) : (
				<div className={styles.emptyState}>
					<SearchX className={styles.emptyIcon} size={64} />
					<h3 className={styles.emptyTitle}>Nie znaleziono ofert</h3>
					<p className={styles.emptyText}>
						{searchQuery
							? `Brak wyników dla "${searchQuery}"`
							: 'Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtry'}
					</p>

					<div className={styles.emptyActions}>
						{hasActiveFilters() && (
							<Link href="/marketplace" className={styles.resetBtn}>
								Wyczyść wszystkie filtry
							</Link>
						)}

						<Link
							href={searchQuery ? '/marketplace' : '/marketplace?type=buy_now'}
							className={styles.browseBtn}
						>
							{searchQuery ? 'Przeglądaj wszystkie oferty' : 'Przeglądaj oferty'}
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
