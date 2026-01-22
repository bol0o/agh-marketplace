'use client';

import Image from 'next/image';
import { Gavel, ShoppingBag } from 'lucide-react';
import styles from './ProductImageSection.module.scss';

interface ProductImageSectionProps {
	imageUrl: string | undefined;
	type: 'auction' | 'buy_now';
	status?: string;
	title: string;
}

export function ProductImageSection({ imageUrl, type, status, title }: ProductImageSectionProps) {
	const isAuction = type === 'auction';

	return (
		<div className={styles.imageContainer}>
			{imageUrl ? (
				<Image
					src={imageUrl}
					alt={title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
					className={styles.image}
				/>
			) : (
				<div className={styles.imagePlaceholder}>{title}</div>
			)}

			{status && status !== 'active' && (
				<div className={`${styles.statusBadge} ${styles[status]}`}>
					{status === 'sold' && 'Sprzedane'}
					{status === 'ended' && 'Zakończone'}
					{status === 'reserved' && 'Zarezerwowane'}
				</div>
			)}

			<div className={`${styles.typeBadge} ${styles[type]}`}>
				{isAuction ? (
					<>
						<Gavel size={16} />
						<span>Aukcja</span>
					</>
				) : (
					<>
						<ShoppingBag size={16} />
						<span>Kup Teraz</span>
					</>
				)}
			</div>
		</div>
	);
}
