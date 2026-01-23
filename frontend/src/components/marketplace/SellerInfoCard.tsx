'use client';

import Image from 'next/image';
import { User, Star, MessageCircle } from 'lucide-react';
import styles from './SellerInfoCard.module.scss';
import { PageLoading } from '../shared/PageLoading';
import Link from 'next/link';

interface SellerInfoCardProps {
	seller: {
		id: string;
		name: string;
		avatar: string | null;
		rating: string;
	};
	initialIsFollowing: boolean;
	isLoading: boolean;
	onContact?: () => void;
	onFollow?: () => void;
}

export function SellerInfoCard({
	seller,
	initialIsFollowing,
	isLoading,
	onContact,
	onFollow,
}: SellerInfoCardProps) {
	if (isLoading) {
		return <PageLoading text="Ładowanie..." />;
	}

	return (
		<div className={styles.sellerBox}>
			<div className={styles.boxHeader}>
				<User size={18} />
				<h3>Sprzedawca</h3>
			</div>

			<div className={styles.sellerCard}>
				<Link href={`/user/${seller.id}`}>
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
				</Link>

				<div className={styles.sellerInfo}>
					<Link href={`/user/${seller.id}`}>
						<h4 className={styles.sellerName}>{seller.name}</h4>
					</Link>
					<div className={styles.sellerRating}>
						<Star size={14} fill="currentColor" />
						<span>{parseFloat(seller.rating).toFixed(1)}</span>
						<span className={styles.ratingLabel}>ocena</span>
					</div>

					<div className={styles.sellerActions}>
						<button onClick={onFollow} className={styles.followButton}>
							{initialIsFollowing ? 'Obserwujesz' : 'Obserwuj'}
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
