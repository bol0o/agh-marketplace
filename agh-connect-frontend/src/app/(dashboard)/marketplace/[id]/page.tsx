'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { ProductGallery } from '@/components/marketplace/product/ProductGallery';
import { ProductInfo } from '@/components/marketplace/product/ProductInfo';
import { ProductSidebar } from '@/components/marketplace/product/ProductSidebar';
import styles from './productPage.module.scss';
import { useProduct } from '@/hooks/useProduct';

export default function ProductPage() {
	const params = useParams();
	const id = params.id as string;

	const { data: product, isLoading, isError, error } = useProduct(id);

	if (isLoading) {
		return (
			<div
				className={styles.pageWrapper}
				style={{
					height: '60vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Loader2 className="animate-spin text-blue-600" size={48} />
			</div>
		);
	}

	if (isError || !product) {
		return (
			<div className={styles.pageWrapper} style={{ textAlign: 'center', marginTop: '100px' }}>
				<AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
				<h2 className="text-xl font-bold mb-2">Produkt nie został znaleziony</h2>
				<p className="text-slate-500 mb-6">
					Oferta mogła wygasnąć lub nie masz do niej dostępu.
				</p>
				<Link
					href="/marketplace"
					className={styles.backLink}
					style={{ display: 'inline-flex', justifyContent: 'center' }}
				>
					<ArrowLeft size={16} /> Wróć do listy
				</Link>
			</div>
		);
	}

	// --- SUCCESS STATE ---
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
					<ProductGallery
						image={product.image || '/placeholder.png'}
						title={product.title}
					/>
					<ProductInfo product={product} />
				</div>

				{/* PRAWA STRONA (Sidebar) */}
				<aside className={styles.sidebar}>
					<ProductSidebar product={product} />
				</aside>
			</div>
		</div>
	);
}
