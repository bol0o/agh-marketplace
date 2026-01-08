'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import CategorySection from './CategorySection';
import SortingSection from './SortingSection';
import FilterSection from './FilterSection';
import MarketplaceInfo from './MarketplaceInfo';
import MobileFilterDrawer from './MobileFilterDrawer';
import styles from './Sidebar.module.scss';

export function Sidebar() {
	const pathname = usePathname();
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const isMarketplacePage = pathname === '/marketplace' || pathname.startsWith('/marketplace/');

	const handleOpenDrawer = useCallback(() => {
		setIsMobileOpen(true);
	}, []);

	const handleCloseDrawer = useCallback(() => {
		setIsMobileOpen(false);
	}, []);

	return (
		<>
			{isMarketplacePage && (
				<button
					className={styles.mobileTrigger}
					onClick={handleOpenDrawer}
					aria-label="Otwórz filtry i sortowanie"
				>
					<SlidersHorizontal size={20} />
					<span>Filtry i sortowanie</span>
				</button>
			)}

			<aside className={styles.sidebar}>
				<div className={styles.sidebarContent}>
					<CategorySection />

					{isMarketplacePage ? (
						<>
							<SortingSection />
							<FilterSection />
						</>
					) : (
						<MarketplaceInfo />
					)}
				</div>
			</aside>

			{isMarketplacePage && (
				<MobileFilterDrawer isOpen={isMobileOpen} onClose={handleCloseDrawer} />
			)}
		</>
	);
}
