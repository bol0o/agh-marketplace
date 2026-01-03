import Link from 'next/link';
// Dodajemy MapPin do importów
import { Trash2, Minus, Plus, MapPin } from 'lucide-react';
import { CartItemType } from '@/types/cart';
import styles from './CartItem.module.scss';

interface CartItemProps {
	item: CartItemType;
	onRemove: (id: string) => void;
	onUpdateQuantity: (id: string, newQuantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
	const { product } = item;
	const isMaxQuantity = item.quantity >= product.stock;

	return (
		<div className={styles.item}>
			<div className={styles.imageWrapper}>
				<img src={product.image} alt={product.title} />
			</div>

			<div className={styles.content}>
				<div className={styles.details}>
					<Link href={`/marketplace/${product.id}`} className={styles.title}>
						{product.title}
					</Link>

					<p className={styles.seller}>Sprzedawca: {product.seller.name}</p>

					{/* NOWOŚĆ: Lokalizacja */}
					<div className={styles.location}>
						<MapPin size={14} />
						<span>{product.location}</span>
					</div>

					<div className={styles.metaRow}>
						<span className={`${styles.badge} ${styles[product.condition]}`}>
							{product.condition === 'new' ? 'Nowy' : 'Używany'}
						</span>
						{product.stock < 5 && (
							<span className={styles.lowStock}>
								Ostatnie sztuki: {product.stock}
							</span>
						)}
					</div>
				</div>

				<div className={styles.actions}>
					<div className={styles.quantityControl}>
						<button
							onClick={() =>
								item.quantity > 1 && onUpdateQuantity(item.id, item.quantity - 1)
							}
							disabled={item.quantity <= 1}
						>
							<Minus size={16} />
						</button>
						<span>{item.quantity}</span>
						<button
							onClick={() =>
								!isMaxQuantity && onUpdateQuantity(item.id, item.quantity + 1)
							}
							disabled={isMaxQuantity}
						>
							<Plus size={16} />
						</button>
					</div>

					<div className={styles.priceGroup}>
						<span className={styles.price}>
							{(product.price * item.quantity).toFixed(2)} zł
						</span>
						{item.quantity > 1 && (
							<span className={styles.unitPrice}>{product.price} zł / szt.</span>
						)}
					</div>
				</div>
			</div>

			{/* ZMIANA: Przycisk z tekstem */}
			<button className={styles.removeBtn} onClick={() => onRemove(item.id)}>
				<Trash2 size={18} />
				<span>Usuń</span>
			</button>
		</div>
	);
}
