import Link from 'next/link';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { MOCK_PRODUCTS } from '@/data/mockData';
import { SearchX } from 'lucide-react';
import styles from '@/styles/marketplace.module.scss';

const ITEMS_PER_PAGE = 12;

interface MarketplacePageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function MarketplacePage(props: MarketplacePageProps) {
	const searchParams = await props.searchParams;

	const category = searchParams.cat as string | undefined;
	const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : null;
	const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : null;
	const type = searchParams.type as string | undefined;
	const conditionParam = searchParams.condition as string | undefined;
	const conditions = conditionParam ? conditionParam.split(',') : [];
	const searchQuery = searchParams.search as string | undefined;

	const currentPage = Number(searchParams.page) || 1;

	const filteredProducts = MOCK_PRODUCTS.filter((product) => {
		if (category && product.category !== category) return false;
		if (type && type !== 'all' && product.type !== type) return false;
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
	const endIndex = startIndex + ITEMS_PER_PAGE;

	const currentProducts = filteredProducts.slice(startIndex, endIndex);

	const pageTitle = category ? category : 'Wszystkie Oferty';
	const currentItemsLower = ITEMS_PER_PAGE * (currentPage - 1) + 1;
	const currentItemsUpper = Math.min(ITEMS_PER_PAGE * currentPage, totalItems);

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
						{currentProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>

					<Pagination totalPages={totalPages} />
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
