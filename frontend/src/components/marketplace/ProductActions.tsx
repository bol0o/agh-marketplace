'use client';

import { ShoppingBag, Gavel, MessageCircle } from 'lucide-react';
import styles from './ProductActions.module.scss';

interface ProductActionsProps {
	isAuction: boolean;
	isActive: boolean;
	price: number;
	stock: number;
	endsAt?: string | null;
	onBuy: () => void;
	onBid: () => void;
	onContact: () => void;
}

export function ProductActions({
	isAuction,
	isActive,
	price,
	stock,
	onBuy,
	onBid,
	onContact,
}: ProductActionsProps) {
	if (!isActive) return null;

	return (
		<div className={styles.mainActions}>
			{isAuction ? (
				<div className={styles.auctionSection}>
					<div className={styles.auctionPrice}>
						<span className={styles.priceLabel}>Aktualna oferta</span>
						<span className={styles.price}>{price.toLocaleString('pl-PL')} zł</span>
					</div>
					<button onClick={onBid} className={styles.bidButton}>
						<Gavel size={20} />
						<span>Zalicytuj</span>
					</button>
				</div>
			) : (
				<div className={styles.buySection}>
					<div className={styles.buyPrice}>
						<span className={styles.priceLabel}>Cena</span>
						<span className={styles.price}>{price.toLocaleString('pl-PL')} zł</span>
						{stock > 0 && (
							<div className={styles.stockInfo}>
								<span>Dostępnych: {stock} szt.</span>
							</div>
						)}
					</div>
					<button onClick={onBuy} className={styles.buyButton} disabled={stock === 0}>
						<ShoppingBag size={20} />
						<span>{stock > 0 ? 'Dodaj do koszyka' : 'Brak na stanie'}</span>
					</button>
				</div>
			)}

			<button onClick={onContact} className={styles.contactButton}>
				<MessageCircle size={18} />
				<span>Zapytaj o produkt</span>
			</button>
		</div>
	);
}
