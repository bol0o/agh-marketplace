'use client';

import { useState } from 'react';
import { ShoppingBag, Trash2, Loader, ShoppingCart, XCircle } from 'lucide-react';
import Link from 'next/link';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { CheckoutModal } from '@/components/cart/CheckoutModal';
import { useCart } from '@/hooks/useCart';
import { useCartStore } from '@/store/useCartStore';
import styles from './cart.module.scss';
import { PageLoading } from '@/components/shared/PageLoading';

export default function CartPage() {
	const { items, isLoading: cartLoading } = useCartStore();
	const { updateCartItem, removeCartItem, clearCart } = useCart();
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [showClearConfirm, setShowClearConfirm] = useState(false);
	const [isClearing, setIsClearing] = useState(false);

	const handleClearCart = async () => {
		setShowClearConfirm(true);
	};

	const confirmClearCart = async () => {
		setIsClearing(true);
		try {
			await clearCart();
		} finally {
			setIsClearing(false);
			setShowClearConfirm(false);
		}
	};

	const cancelClearCart = () => {
		setShowClearConfirm(false);
	};

	if (cartLoading && items.length === 0) {
		return (
			<div className={styles.loadingContainer}>
				<PageLoading text="Ładowanie koszyka..." />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className={styles.emptyContainer}>
				<ShoppingCart className={styles.emptyIcon} size={64} />
				<h1 className={styles.emptyTitle}>Twój koszyk jest pusty</h1>
				<p className={styles.emptyDescription}>
					Dodaj produkty, które Cię interesują i wróć tutaj, aby dokończyć zakupy.
				</p>
				<Link href="/marketplace" className={styles.shopButton}>
					<ShoppingBag size={20} />
					Przeglądaj produkty
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className={styles.container}>
				<header className={styles.header}>
					<div className={styles.headerContent}>
						<h1 className={styles.title}>
							<ShoppingBag className={styles.titleIcon} />
							Twój koszyk ({items.length} {items.length === 1 ? 'produkt' : 'produkty'})
						</h1>
						<button
							className={styles.clearButton}
							onClick={handleClearCart}
							disabled={isClearing || cartLoading}
						>
							{isClearing ? (
								<Loader className={styles.clearSpinner} size={16} />
							) : (
								<Trash2 size={16} />
							)}
							Wyczyść koszyk
						</button>
					</div>
				</header>

				<div className={styles.content}>
					<div className={styles.itemsSection}>
						<div className={styles.itemsList}>
							{items.map((item) => (
								<CartItemCard
									key={item.id}
									item={item}
									onUpdateQuantity={updateCartItem}
									onRemove={removeCartItem}
									disabled={cartLoading}
								/>
							))}
						</div>
					</div>

					<div className={styles.summarySection}>
						<CartSummary
							onCheckout={() => setIsCheckoutOpen(true)}
							checkoutDisabled={cartLoading}
						/>
					</div>
				</div>

				<CheckoutModal
					isOpen={isCheckoutOpen}
					onClose={() => setIsCheckoutOpen(false)}
					items={items}
				/>
			</div>

			{showClearConfirm && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<div className={styles.modalHeader}>
							<XCircle className={styles.modalWarningIcon} size={24} />
							<h3 className={styles.modalTitle}>Wyczyścić koszyk?</h3>
						</div>
						
						<p className={styles.modalMessage}>
							Czy na pewno chcesz usunąć wszystkie produkty z koszyka? 
							Tej operacji nie można cofnąć.
						</p>

						<div className={styles.modalActions}>
							<button
								onClick={cancelClearCart}
								className={styles.modalCancel}
								disabled={isClearing}
							>
								Anuluj
							</button>
							<button
								onClick={confirmClearCart}
								className={styles.modalDelete}
								disabled={isClearing}
							>
								{isClearing ? (
									<>
										<Loader className={styles.modalSpinner} size={16} />
										<span>Czyszczenie...</span>
									</>
								) : (
									'Tak, wyczyść'
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}