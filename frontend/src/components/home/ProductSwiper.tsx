'use client';

import { GenericSwiper } from '@/components/home/GenericSwiper';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Clock } from 'lucide-react';
import { useHomeProducts } from '@/hooks/useHomeProducts';
import type { Product } from '@/types/marketplace';

export function ProductSwiper({
	title = 'Od obserwowanych',
	subtitle = 'Produkty od osób które obserwujesz',
	limit = 12,
	className = '',
}) {
	const { products, loading, error } = useHomeProducts({
		limit,
		onlyFollowed: true,
	});

	return (
		<GenericSwiper<Product>
			title={title}
			subtitle={subtitle}
			className={className}
			items={products}
			loading={loading}
			error={error}
			renderItem={(product) => <ProductCard product={product} />}
			emptyIcon={Clock}
			emptyTitle="Brak produktów od obserwowanych osób"
			emptyDescription="Zacznij obserwować więcej osób aby zobaczyć ich produkty"
			autoplayDelay={5000}
			loadingText="Ładowanie produktów..."
		/>
	);
}
