'use client';

import Link from 'next/link';
import { Gavel, ShoppingBag, MapPin, Eye, Star } from 'lucide-react';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import { Product } from '@/types/marketplace';
import { AuctionTimer } from './AuctionTimer';

const CATEGORY_NAMES: Record<string, string> = {
	BOOKS: 'Książki',
	ELECTRONICS: 'Elektronika',
	ACCESSORIES: 'Akcesoria',
	CLOTHING: 'Odzież',
	OTHER: 'Inne',
};

const CONDITION_NAMES: Record<string, string> = {
	new: 'Nowy',
	used: 'Używany',
	damaged: 'Uszkodzony',
};

export function ProductCard({ product }: { product: Product }) {
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return 'Dzisiaj';
		} else if (diffDays === 1) {
			return 'Wczoraj';
		} else if (diffDays < 7) {
			return `${diffDays} dni temu`;
		} else {
			return date.toLocaleDateString('pl-PL', {
				day: 'numeric',
				month: 'short',
			});
		}
	};

	const isActive = product.status === 'active';
	const rating = parseFloat(product.seller.rating) || 0;

	return (
		<Link href={`/marketplace/${product.id}`} className={styles.card}>
			<div className={styles.imageContainer}>
				{product.imageUrl ? (
					<Image
						src={product.imageUrl}
						alt={product.title}
						fill
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
						className={styles.image}
					/>
				) : (
					<div className={styles.imagePlaceholder}>{product.title}</div>
				)}

				<div
					className={`${styles.badge} ${
						product.type === 'auction' ? styles.auction : styles.buyNow
					}`}
				>
					{product.type === 'auction' ? (
						<>
							<Gavel size={14} /> Aukcja
						</>
					) : (
						<>
							<ShoppingBag size={14} /> Kup Teraz
						</>
					)}
				</div>

				<div className={`${styles.conditionBadge} ${styles[product.condition]}`}>
					{CONDITION_NAMES[product.condition]}
				</div>

				{!isActive && (
					<div className={styles.statusBadge}>
						{product.status === 'sold'
							? 'Sprzedane'
							: product.status === 'reserved'
								? 'Zarezerwowane'
								: 'Zakończone'}
					</div>
				)}
			</div>

			<div className={styles.content}>
				<h3 className={styles.title}>{product.title}</h3>

				<div className={styles.metaInfo}>
					<div className={styles.location}>
						<MapPin size={14} />
						<span>{product.location}</span>
					</div>

					<div className={styles.views}>
						<Eye size={14} />
						<span>{product.views} wyświetleń</span>
					</div>
				</div>

				<div className={styles.categoryDate}>
					<span className={styles.category}>{CATEGORY_NAMES[product.category]}</span>
					<span className={styles.date}>{formatDate(product.createdAt)}</span>
				</div>

				<div className={styles.priceSection}>
					<div className={styles.priceContainer}>
						<span className={styles.priceLabel}>
							{product.type === 'auction' ? 'Aktualna oferta' : 'Cena'}
						</span>
						<span className={styles.price}>
							{product.price.toLocaleString('pl-PL')} zł
						</span>
					</div>

					{product.type === 'auction' && product.endsAt && isActive && (
						<div className={styles.auctionTimer}>
							<AuctionTimer endsAt={product.endsAt} compact />
						</div>
					)}
				</div>

				<div className={styles.sellerInfo}>
					<div className={styles.sellerAvatar}>
						{product.seller.avatar ? (
							<Image
								src={product.seller.avatar}
								alt={product.seller.name}
								width={32}
								height={32}
								className={styles.avatar}
							/>
						) : (
							<div className={styles.avatarPlaceholder}>
								{(product.seller?.name || 'Użytkownik')
									.split(' ')
									.map((n: string) => n.charAt(0))
									.join('')}
							</div>
						)}
					</div>
					<div className={styles.sellerDetails}>
						<span className={styles.sellerName}>{product.seller.name}</span>
						<div className={styles.sellerRating}>
							<Star size={12} fill="currentColor" />
							<span>{rating.toFixed(1)}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
