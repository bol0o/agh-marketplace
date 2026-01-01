import Link from 'next/link';
import { Gavel, ShoppingBag, Clock } from 'lucide-react';
import styles from './ProductCard.module.scss';
import Image from 'next/image';

// Typ, który pewnie później przeniesiesz do pliku types.ts
export interface Product {
	id: string;
	title: string;
	image: string;
	price: number;
	type: 'auction' | 'buy_now';
	endsAt?: string; // Np. "2024-02-20T12:00:00"
}

export function ProductCard({ product }: { product: Product }) {
	const isAuction = product.type === 'auction';

	return (
		<Link href={`/marketplace/${product.id}`} className={styles.card}>
			<div className={styles.imageContainer}>
				<Image
					src={product.image}
					alt={product.title}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
					className={styles.image}
				/>

				<div className={`${styles.badge} ${isAuction ? styles.auction : styles.buyNow}`}>
					{isAuction ? (
						<>
							<Gavel size={14} /> Licytacja
						</>
					) : (
						<>
							<ShoppingBag size={14} /> Kup Teraz
						</>
					)}
				</div>
			</div>

			{/* 2. TREŚĆ */}
			<div className={styles.content}>
				<h3 className={styles.title}>{product.title}</h3>

				<div className={styles.details}>
					<div>
						<p className={styles.priceLabel}>
							{isAuction ? 'Aktualna oferta' : 'Cena'}
						</p>
						<p className={styles.price}>{product.price} zł</p>
					</div>

					{/* Jeśli aukcja, pokaż licznik (mockowany) */}
					{isAuction && (
						<div className={styles.auctionInfo}>
							<p className={styles.priceLabel}>Koniec za:</p>
							<div className={styles.timer}>
								<Clock size={14} /> 2h 15m
							</div>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
}
