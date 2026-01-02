import { Chat } from '@/data/chats';
import styles from './ProductContextBar.module.scss';

export function ProductContextBar({ product }: { product: Chat['product'] }) {
	return (
		<div className={styles.productContextBar}>
			<div className={styles.productThumb}>
				<img src={product.image || 'https://via.placeholder.com/40'} alt="" />
			</div>
			<div className={styles.productInfo}>
				<span className={styles.statusLabel}>
					{product.status === 'selling' ? 'Sprzedajesz' : 'Licytujesz / Kupujesz'}
				</span>
				<h4>{product.title}</h4>
			</div>
			<div className={styles.productPrice}>{product.price} zł</div>
		</div>
	);
}
