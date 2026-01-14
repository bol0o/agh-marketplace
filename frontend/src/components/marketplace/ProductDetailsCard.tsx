'use client';

import { MapPin, Eye, Calendar, Clock, Package, Tag } from 'lucide-react';
import styles from './ProductDetailsCard.module.scss';

interface ProductDetailsCardProps {
	category: string;
	condition: string;
	location: string;
	views: number;
	createdAt: string;
	endsAt?: string | null;
	categoryNames: Record<string, string>;
	conditionNames: Record<string, string>;
}

export function ProductDetailsCard({
	category,
	condition,
	location,
	views,
	createdAt,
	endsAt,
	categoryNames,
	conditionNames,
}: ProductDetailsCardProps) {
	return (
		<div className={styles.detailsBox}>
			<div className={styles.boxHeader}>
				<Package size={18} />
				<h3>Szczegóły</h3>
			</div>

			<div className={styles.detailsGrid}>
				<div className={styles.detailItem}>
					<span className={styles.detailLabel}>Kategoria</span>
					<span className={styles.detailValue}>
						<Tag size={14} />
						{categoryNames[category] || category}
					</span>
				</div>

				<div className={styles.detailItem}>
					<span className={styles.detailLabel}>Stan</span>
					<span className={`${styles.detailValue} ${styles[`condition-${condition}`]}`}>
						{conditionNames[condition]}
					</span>
				</div>

				<div className={styles.detailItem}>
					<span className={styles.detailLabel}>Lokalizacja</span>
					<span className={styles.detailValue}>
						<MapPin size={14} />
						{location}
					</span>
				</div>

				<div className={styles.detailItem}>
					<span className={styles.detailLabel}>Dodano</span>
					<span className={styles.detailValue}>
						<Calendar size={14} />
						{new Date(createdAt).toLocaleDateString('pl-PL')}
					</span>
				</div>

				<div className={styles.detailItem}>
					<span className={styles.detailLabel}>Wyświetlenia</span>
					<span className={styles.detailValue}>
						<Eye size={14} />
						{views}
					</span>
				</div>

				{endsAt && (
					<div className={styles.detailItem}>
						<span className={styles.detailLabel}>Kończy się</span>
						<span className={styles.detailValue}>
							<Clock size={14} />
							{new Date(endsAt).toLocaleDateString('pl-PL')}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
