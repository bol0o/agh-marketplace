'use client';

import { Minus, Plus, Trash2, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/lib/utils';
import styles from './CartItemCard.module.scss';

interface CartItemCardProps {
	item: CartItem;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onRemove: (itemId: string) => void;
	disabled?: boolean;
}

export function CartItemCard({
	item,
	onUpdateQuantity,
	onRemove,
	disabled = false,
}: CartItemCardProps) {
	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity >= 1 && newQuantity <= 99) {
			onUpdateQuantity(item.id, newQuantity);
		}
	};

	const handleIncrement = () => {
		handleQuantityChange(item.quantity + 1);
	};

	const handleDecrement = () => {
		if (item.quantity > 1) {
			handleQuantityChange(item.quantity - 1);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.productInfo}>
				<Link href={`/product/${item.product.id}`} className={styles.imageLink}>
					<div className={styles.imageContainer}>
						<Image
							src={item.product.image}
							alt={item.product.title}
							width={120}
							height={120}
							className={styles.image}
						/>
					</div>
				</Link>

				<div className={styles.details}>
					<div className={styles.header}>
						<Link href={`/product/${item.product.id}`} className={styles.titleLink}>
							<h3 className={styles.title}>{item.product.title}</h3>
						</Link>
						<button
							className={styles.removeButton}
							onClick={() => onRemove(item.id)}
							disabled={disabled}
							aria-label="Usuń z koszyka"
						>
							<Trash2 size={18} />
						</button>
					</div>

					<div className={styles.sellerInfo}>
						<Link
							href={`/user/${item.product.seller.id}`}
							className={styles.sellerLink}
						>
							<div className={styles.sellerAvatar}>
								{item.product.seller.avatar ? (
									<Image
										src={item.product.seller.avatar}
										alt={item.product.seller.name}
										width={24}
										height={24}
										className={styles.avatarImage}
									/>
								) : (
									<div className={styles.avatarFallback}>
										{item.product.seller.name.charAt(0)}
									</div>
								)}
							</div>
							<span className={styles.sellerName}>{item.product.seller.name}</span>
						</Link>

						<div className={styles.location}>
							<MapPin size={14} />
							<span>{item.product.location}</span>
						</div>
					</div>

					<div className={styles.productMeta}>
						<span className={styles.category}>{item.product.category}</span>
						<span className={styles.condition}>{item.product.condition}</span>
					</div>
				</div>
			</div>

			<div className={styles.actions}>
				<div className={styles.quantityControl}>
					<button
						className={styles.quantityButton}
						onClick={handleDecrement}
						disabled={item.quantity <= 1 || disabled}
						aria-label="Zmniejsz ilość"
					>
						<Minus size={16} />
					</button>

					<span className={styles.quantityValue}>{item.quantity}</span>

					<button
						className={styles.quantityButton}
						onClick={handleIncrement}
						disabled={disabled}
						aria-label="Zwiększ ilość"
					>
						<Plus size={16} />
					</button>
				</div>

				<div className={styles.priceSection}>
					<div className={styles.pricePerUnit}>
						{formatPrice(item.product.price)} / szt.
					</div>
					<div className={styles.totalPrice}>
						{formatPrice(item.product.price * item.quantity)}
					</div>
				</div>
			</div>
		</div>
	);
}
