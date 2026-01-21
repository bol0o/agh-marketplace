'use client';

import { ShoppingCart, Truck, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import styles from './CartSummary.module.scss';

interface CartSummaryProps {
	onCheckout?: () => void;
	checkoutDisabled?: boolean;
}

export function CartSummary({ onCheckout, checkoutDisabled = false }: CartSummaryProps) {
	const { items, getSubtotal, getShippingCost, getTotal } = useCartStore();

	if (items.length === 0) {
		return null;
	}

	const subtotal = getSubtotal();
	const shipping = getShippingCost();
	const total = getTotal();

	const isFreeShipping = shipping === 0;
	const freeShippingThreshold = 200;
	const amountToFreeShipping = freeShippingThreshold - subtotal;

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Podsumowanie zamówienia</h2>

			<div className={styles.summaryGrid}>
				<div className={styles.summaryItem}>
					<span className={styles.summaryLabel}>Wartość produktów</span>
					<span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
				</div>

				<div className={styles.summaryItem}>
					<span className={styles.summaryLabel}>
						Dostawa
						{isFreeShipping && (
							<span className={styles.freeShippingBadge}>Darmowa!</span>
						)}
					</span>
					<span
						className={`${styles.summaryValue} ${isFreeShipping ? styles.freeShipping : ''}`}
					>
						{isFreeShipping ? 'GRATIS' : formatPrice(shipping)}
					</span>
				</div>

				{!isFreeShipping && amountToFreeShipping > 0 && (
					<div className={styles.freeShippingInfo}>
						<Truck className={styles.freeShippingIcon} size={16} />
						<span>
							Dodaj produkty za <strong>{formatPrice(amountToFreeShipping)}</strong>,
							aby otrzymać darmową dostawę!
						</span>
					</div>
				)}

				<div className={styles.divider} />

				<div className={`${styles.summaryItem} ${styles.total}`}>
					<span className={styles.summaryLabel}>Łącznie do zapłaty</span>
					<span className={styles.summaryValue}>{formatPrice(total)}</span>
				</div>
			</div>

			{onCheckout && (
				<button
					className={styles.checkoutButton}
					onClick={onCheckout}
					disabled={checkoutDisabled || items.length === 0}
				>
					<CreditCard className={styles.checkoutIcon} />
					Przejdź do płatności
				</button>
			)}

			<div className={styles.securityInfo}>
				<svg className={styles.securityIcon} viewBox="0 0 24 24" fill="none">
					<path
						d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
						fill="currentColor"
					/>
				</svg>
				<span className={styles.securityText}>
					Bezpieczne płatności • Szyfrowane dane • 14-dniowe prawo do zwrotu
				</span>
			</div>
		</div>
	);
}
