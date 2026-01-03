'use client';

import { ShoppingBag, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
// import { useCartStore } from '@/store/cartStore';
// import { useUIStore } from '@/store/uiStore';
import styles from './ProductSidebar.module.scss';
import { Product } from '@/components/marketplace/ProductCard';

// Mock sprzedawcy (normalnie z bazy przez 'authorId')
const MOCK_SELLER = {
	name: 'Jan Kowalski',
	avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=random',
	rating: 4.8,
	joined: '2 lata temu',
};

export function ProductSidebar({ product }: { product: Product }) {
	// const addItem = useCartStore((state) => state.addItem);
	// const addToast = useUIStore((state) => state.addToast);

	const handleAddToCart = () => {
		// addItem({
		// 	id: product.id, // UWAGA: Normalnie generujemy unikalne ID dla pozycji w koszyku
		// 	title: product.title,
		// 	price: product.price,
		// 	image: product.image,
		// 	type: product.type,
		// });
		// addToast('Dodano produkt do koszyka!', 'success');
	};

	return (
		<div className={styles.sidebarWrapper}>
			{/* KARTA PRODUKTU */}
			<div className={styles.card}>
				<div className={styles.priceRow}>
					<span className={styles.price}>{product.price} zł</span>
					<button className={styles.favBtn} title="Dodaj do obserwowanych">
						<Heart size={20} />
					</button>
				</div>

				<div className={styles.actions}>
					{product.type === 'buy_now' ? (
						<>
							<button className={styles.buyBtn} onClick={handleAddToCart}>
								Kup Teraz
							</button>
							<button className={styles.cartBtn} onClick={handleAddToCart}>
								<ShoppingBag size={20} />
								Dodaj do koszyka
							</button>
						</>
					) : (
						// Widok dla Licytacji
						<div className={styles.auctionBox}>
							<p>Aktualna oferta:</p>
							<div className={styles.bidPrice}>{product.price} zł</div>
							<button className={styles.buyBtn}>Licytuj</button>
						</div>
					)}
				</div>

				<div className={styles.safetyInfo}>
					<ShieldCheck size={16} />
					<span>Ochrona Kupującego AGH Protect</span>
				</div>
			</div>

			{/* KARTA SPRZEDAWCY */}
			<div className={styles.sellerCard}>
				<h3>Sprzedawca</h3>
				<div className={styles.sellerProfile}>
					<img
						src={MOCK_SELLER.avatar}
						alt={MOCK_SELLER.name}
						className={styles.avatar}
					/>
					<div className={styles.sellerInfo}>
						<h4>{MOCK_SELLER.name}</h4>
						<div className={styles.rating}>⭐ {MOCK_SELLER.rating} / 5</div>
					</div>
				</div>
				<button className={styles.messageBtn}>
					<MessageSquare size={18} />
					Napisz wiadomość
				</button>
			</div>
		</div>
	);
}
