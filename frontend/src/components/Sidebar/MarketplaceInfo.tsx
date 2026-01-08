'use client';

import Link from 'next/link';
import { ArrowRight, Filter } from 'lucide-react';
import styles from './MarketplaceInfo.module.scss';

export default function MarketplaceInfo() {
	return (
		<div className={styles.marketplaceInfo}>
			<div className={styles.infoIcon}>
				<Filter size={24} />
			</div>
			<h4 className={styles.infoTitle}>Zaawansowane filtrowanie</h4>
			<p className={styles.infoText}>
				Pełne możliwości filtrowania i sortowania dostępne są na stronie marketplace.
				Znajdziesz tam więcej opcji wyszukiwania ofert.
			</p>
			<Link href="/marketplace" className={styles.marketplaceButton}>
				Przejdź do marketplace
				<ArrowRight size={16} />
			</Link>
		</div>
	);
}
