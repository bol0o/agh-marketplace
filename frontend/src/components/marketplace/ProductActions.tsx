'use client';

import { ShoppingBag, Gavel, MessageCircle, Clock } from 'lucide-react';
import styles from './ProductActions.module.scss';

interface ProductActionsProps {
	isAuction: boolean;
	isActive: boolean;
	price: number;
	stock: number;
	endsAt?: string | null;
	isOwner: boolean;
	isLoading: boolean;
	onBuy: () => void;
	onBid: () => void;
	onContact: () => void;
}

export function ProductActions({
	isAuction,
	isActive,
	price,
	stock,
	endsAt,
	isOwner,
	isLoading,
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
						{endsAt && (
							<div className={styles.endsAt}>
								<Clock size={14} />
								<span>
									Kończy się: {new Date(endsAt).toLocaleDateString('pl-PL')}
								</span>
							</div>
						)}
					</div>
					<button
						onClick={onBid}
						className={styles.bidButton}
						disabled={isOwner}
						title={isOwner ? 'Nie możesz licytować własnej aukcji' : 'Zalicytuj'}
					>
						<Gavel size={20} />
						<span>{isOwner ? 'Twoja aukcja' : 'Zalicytuj'}</span>
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
					<button
						onClick={onBuy}
						className={styles.buyButton}
						disabled={stock === 0 || isOwner}
						title={
							isOwner
								? 'Nie możesz kupić własnego produktu'
								: stock > 0
									? 'Dodaj do koszyka'
									: 'Brak na stanie'
						}
					>
						<ShoppingBag size={20} />
						<span>
							{isOwner
								? 'Twój produkt'
								: stock > 0
									? 'Dodaj do koszyka'
									: 'Brak na stanie'}
						</span>
					</button>
				</div>
			)}

			<button
				onClick={onContact}
				className={styles.contactButton}
				disabled={isOwner}
				title={isOwner ? 'Nie możesz wysłać wiadomości do siebie' : 'Zapytaj o produkt'}
			>
				<MessageCircle size={18} />
				<span>{isOwner ? 'Twój produkt' : 'Zapytaj o produkt'}</span>
			</button>
		</div>
	);
}
