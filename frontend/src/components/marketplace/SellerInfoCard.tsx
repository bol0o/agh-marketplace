'use client';

import Image from 'next/image';
import { User, Star, MessageCircle } from 'lucide-react';
import styles from './SellerInfoCard.module.scss';

interface SellerInfoCardProps {
	seller: {
		id: string;
		name: string;
		avatar: string | null;
		rating: string;
	};
	onContact?: () => void;
	onFollow?: () => void;
}

export function SellerInfoCard({ seller, onContact, onFollow }: SellerInfoCardProps) {
	return (
		<div className={styles.sellerBox}>
			<div className={styles.boxHeader}>
				<User size={18} />
				<h3>Sprzedawca</h3>
			</div>

			<div className={styles.sellerCard}>
				<div className={styles.sellerAvatar}>
					{seller.avatar ? (
						<Image
							src={seller.avatar}
							alt={seller.name}
							width={48}
							height={48}
							className={styles.avatar}
						/>
					) : (
						<div className={styles.avatarPlaceholder}>
							{seller.name
								.split(' ')
								.map((n) => n.charAt(0))
								.join('')}
						</div>
					)}
				</div>

				<div className={styles.sellerInfo}>
					<h4 className={styles.sellerName}>{seller.name}</h4>
					<div className={styles.sellerRating}>
						<Star size={14} fill="currentColor" />
						<span>{parseFloat(seller.rating).toFixed(1)}</span>
						<span className={styles.ratingLabel}>ocena</span>
					</div>

					<div className={styles.sellerActions}>
						<button onClick={onFollow} className={styles.followButton}>
							Obserwuj
						</button>
						<button onClick={onContact} className={styles.messageButton}>
							<MessageCircle size={14} />
							Wiadomość
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
