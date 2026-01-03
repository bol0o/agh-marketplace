import { ArrowRight } from 'lucide-react';
import styles from './CartSummary.module.scss';

interface CartSummaryProps {
	subtotal: number;
	shippingCost: number;
	onCheckout: () => void;
}

export function CartSummary({ subtotal, shippingCost, onCheckout }: CartSummaryProps) {
	const total = subtotal + shippingCost;

	return (
		<div className={styles.summaryCard}>
			<h3>Podsumowanie</h3>

			<div className={styles.rows}>
				<div className={styles.row}>
					<span>Wartość przedmiotów</span>
					<span>{subtotal.toFixed(2)} zł</span>
				</div>
				<div className={styles.row}>
					<span>Dostawa (szacowana)</span>
					<span>{shippingCost === 0 ? 'Gratis' : `${shippingCost} zł`}</span>
				</div>
			</div>

			<div className={styles.divider} />

			<div className={`${styles.row} ${styles.total}`}>
				<span>Do zapłaty</span>
				<span>{total.toFixed(2)} zł</span>
			</div>

			<button className={styles.checkoutBtn} onClick={onCheckout}>
				Przejdź do płatności <ArrowRight size={18} />
			</button>
		</div>
	);
}
