'use client';

import { GenericSwiper } from '@/components/home/GenericSwiper';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Clock } from 'lucide-react';
import { useHomeProducts } from '@/hooks/useHomeProducts';
import type { Product } from '@/types/marketplace';

export function AuctionsSwiper({
	title = 'Kończące się aukcje',
	subtitle = 'Sprawdź aukcje które za chwilę się kończą',
	limit = 12,
	className = '',
}) {
	const { products, loading, error } = useHomeProducts({
		limit,
		sort: 'ending_soon',
	});

	const endingAuctions = products.filter((product) => product.type === 'auction');

	return (
		<GenericSwiper<Product>
			title={title}
			subtitle={subtitle}
			className={className}
			items={endingAuctions}
			loading={loading}
			error={error}
			renderItem={(auction) => <ProductCard product={auction} />}
			emptyIcon={Clock}
			emptyTitle="Brak kończących się aukcji"
			emptyDescription="Wróć później lub rozpocznij własną aukcję"
			autoplayDelay={4000}
			loadingText="Ładowanie aukcji..."
		/>
	);
}
