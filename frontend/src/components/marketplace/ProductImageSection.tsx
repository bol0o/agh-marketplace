'use client';

import Image from 'next/image';
import { Gavel, ShoppingBag } from 'lucide-react';
import styles from './ProductImageSection.module.scss';

interface ProductImageSectionProps {
	imageUrl: string;
	type: 'auction' | 'buy_now';
	status?: string;
	title: string;
}

export function ProductImageSection({ imageUrl, type, status, title }: ProductImageSectionProps) {
	const isAuction = type === 'auction';

	return (
		<div className={styles.imageContainer}>
			<Image
				src={imageUrl || '/images/placeholder.jpg'}
				alt={title}
				fill
				className={styles.productImage}
				sizes="(max-width: 768px) 100vw, 60vw"
			/>

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
