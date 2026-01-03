'use client';

import { useRouter } from 'next/navigation';
import { ShoppingBag, MessageSquare, Edit, Heart, Trash2 } from 'lucide-react';
// import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import styles from './ProductSidebar.module.scss';
import { Product } from '@/types/marketplace';
import Link from 'next/link';

export function ProductSidebar({ product }: { product: Product }) {
	const router = useRouter();
	// const addItem = useCartStore((state) => state.addItem);
	const addToast = useUIStore((state) => state.addToast);

	const handleAddToCart = () => {
		// addItem({
		// 	id: product.id, // UWAGA: Normalnie generujemy unikalne ID dla pozycji w koszyku
		// 	title: product.title,
		// 	price: product.price,
		// 	image: product.image,
		// 	type: product.type,
		// });
		addToast('Dodano produkt do koszyka!', 'success');
	};

	const seller = product.seller;
	const CURRENT_USER_ID = 'u2';
	const isOwner = product.seller.id === CURRENT_USER_ID;

	const handleDelete = async () => {
		if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie? Tej operacji nie można cofnąć.'))
			return;

		// MOCK DELETE
		addToast('Ogłoszenie zostało usunięte', 'info');
		router.push('/marketplace');
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
					{isOwner ? (
						// WIDOK WŁAŚCICIELA
						<>
							<button
								className={styles.editBtn}
								onClick={() => router.push(`/marketplace/${product.id}/edit`)}
							>
								<Edit size={18} /> Edytuj ofertę
							</button>
							<button className={styles.deleteBtn} onClick={handleDelete}>
								<Trash2 size={18} /> Usuń
							</button>
						</>
					) : product.type === 'buy_now' ? (
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
						<div className={styles.auctionBox}>
							<p>Aktualna oferta:</p>
							<div className={styles.bidPrice}>{product.price} zł</div>
							<button className={styles.buyBtn}>Licytuj</button>
						</div>
					)}
				</div>
			</div>

			{/* KARTA SPRZEDAWCY */}
			<div className={styles.sellerCard}>
				<h3>Sprzedawca</h3>
				<Link href={`/users/${product.seller.id}`}>
					<div className={styles.sellerProfile}>
						<img src={seller.avatar} alt={seller.name} className={seller.avatar} />
						<div className={styles.sellerInfo}>
							<h4>{seller.name}</h4>
							<div className={styles.rating}>⭐ {seller.rating} / 5</div>
						</div>
					</div>
				</Link>
				<button className={styles.messageBtn}>
					<MessageSquare size={18} />
					Napisz wiadomość
				</button>
			</div>
		</div>
	);
}
