import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MOCK_CART } from '@/data/mockData';
import { ProductGallery } from '@/components/marketplace/product/ProductGallery';
import { ProductInfo } from '@/components/marketplace/product/ProductInfo';
import { ProductSidebar } from '@/components/marketplace/product/ProductSidebar';
import styles from '@/styles/productPage.module.scss';

// Next.js 15: params jest Promise
interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
	const { id } = await params;

	// 1. Pobieramy produkt (symulacja bazy danych)
	const product = MOCK_CART.find((p) => p.id === id)?.product;

	if (!product) {
		notFound(); // Wyświetli stronę 404
	}

	return (
		<div className={styles.pageWrapper}>
			{/* Nawigacja powrotna */}
			<Link href="/marketplace" className={styles.backLink}>
				<ArrowLeft size={16} />
				Wróć do ofert
			</Link>

			<div className={styles.grid}>
				{/* LEWA STRONA (Galeria + Info) */}
				<div className={styles.mainContent}>
					<ProductGallery image={product.image} title={product.title} />
					<ProductInfo product={product} />
				</div>

				{/* PRAWA STRONA (Sticky Sidebar) */}
				<aside className={styles.sidebar}>
					<ProductSidebar product={product} />
				</aside>
			</div>
		</div>
	);
}
