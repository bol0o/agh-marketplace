'use client';

import { User } from '@/types/user';
import { Package, ShoppingBag, Star, Clock } from 'lucide-react';
import styles from './UserStats.module.scss';

interface UserStatsProps {
	user: User;
}

export function UserStats({ user }: UserStatsProps) {
	return (
		<div className={styles.container}>
			<div className={styles.grid}>
				<div className={styles.statCard}>
					<div className={styles.statIcon}>
						<Package />
					</div>
					<div className={styles.statContent}>
						<div className={styles.statValue}>{user.listedProductsCount}</div>
						<div className={styles.statLabel}>Ogłoszeń</div>
					</div>
				</div>

				<div className={styles.statCard}>
					<div className={styles.statIcon}>
						<ShoppingBag />
					</div>
					<div className={styles.statContent}>
						<div className={styles.statValue}>{user.soldItemsCount}</div>
						<div className={styles.statLabel}>Sprzedanych</div>
					</div>
				</div>

				<div className={styles.statCard}>
					<div className={styles.statIcon}>
						<Star />
					</div>
					<div className={styles.statContent}>
						<div className={styles.statValue}>{user.rating.toFixed(1)}</div>
						<div className={styles.statLabel}>Średnia ocena</div>
					</div>
				</div>

				<div className={styles.statCard}>
					<div className={styles.statIcon}>
						<Clock />
					</div>
					<div className={styles.statContent}>
						<div className={styles.statValue}>{user.ratingCount}</div>
						<div className={styles.statLabel}>Opinii</div>
					</div>
				</div>
			</div>
		</div>
	);
}
