import React from 'react';
import { OrderItem } from '@/types/order';
import styles from './OrderDetailsItem.module.scss';
import Image from 'next/image';

interface OrderDetailsItemProps {
	item: OrderItem;
}

const OrderDetailsItem: React.FC<OrderDetailsItemProps> = ({ item }) => {
	const itemTotal = item.snapshot.price * item.quantity;

	return (
		<div className={styles.item}>
			{item.snapshot.image ? (
				<div className={styles.imageContainer}>
					<Image
						src={item.snapshot.image}
						alt={item.snapshot.title}
						fill
						sizes="(max-width: 768px) 100vw, 100px"
						className={styles.img}
					/>
				</div>
			) : (
				<div className={styles.imageContainer}>
					<div className={styles.imagePlaceholder}>{item.snapshot.title}</div>
				</div>
			)}

			<div className={styles.details}>
				<h4 className={styles.title}>{item.snapshot.title}</h4>
				<div className={styles.infoGrid}>
					<div className={styles.infoItem}>
						<span className={styles.label}>Cena jednostkowa:</span>
						<span className={styles.value}>{item.snapshot.price.toFixed(2)} zł</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>Ilość:</span>
						<span className={styles.value}>{item.quantity}</span>
					</div>
					<div className={styles.infoItem}>
						<span className={styles.label}>Razem:</span>
						<span className={styles.total}>{itemTotal.toFixed(2)} zł</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetailsItem;
