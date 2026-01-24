import React from 'react';
import { OrderItem } from '@/types/order';
import styles from './OrderDetailsItem.module.scss';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface OrderDetailsItemProps {
	item: OrderItem;
}

const OrderDetailsItem: React.FC<OrderDetailsItemProps> = ({ item }) => {
	const itemTotal = item.snapshot.price * item.quantity;

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`${styles.star} ${i < Math.round(rating) ? styles.starFilled : ''}`}
				size={14}
			/>
		));
	};

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
				
				{item.seller && (
					<div className={styles.sellerSection}>
						<div className={styles.sellerInfo}>
							<span className={styles.sellerLabel}>Sprzedawca:</span>
							<span className={styles.sellerName}>
								{item.seller.firstName} {item.seller.lastName}
							</span>
						</div>
						{item.seller.avgRating > 0 && (
							<div className={styles.ratingSection}>
								<div className={styles.starsContainer}>
									{renderStars(item.seller.avgRating)}
								</div>
								<span className={styles.ratingValue}>
									{item.seller.avgRating.toFixed(1)}
								</span>
								{item.seller.reviewsCount > 0 && (
									<span className={styles.reviewsCount}>
										({item.seller.reviewsCount} {item.seller.reviewsCount === 1 ? 'opinia' : 
										item.seller.reviewsCount < 5 ? 'opinie' : 'opinii'})
									</span>
								)}
							</div>
						)}
					</div>
				)}

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