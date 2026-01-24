'use client';

import { useEffect, useState, useCallback } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import CategorySection from './CategorySection';
import SortingSection from './SortingSection';
import FilterSection from './FilterSection';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './MobileFilterDrawer.module.scss';

interface MobileFilterDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

type CategoryType = 'BOOKS' | 'ELECTRONICS' | 'ACCESSORIES' | 'CLOTHING' | 'OTHER';
type ListingType = 'all' | 'buy_now' | 'auction';
type SortOption =
	| 'price_asc'
	| 'price_desc'
	| 'name_asc'
	| 'name_desc'
	| 'newest'
	| 'date_asc'
	| 'views_desc';

export default function MobileFilterDrawer({ isOpen, onClose }: MobileFilterDrawerProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [isClosing, setIsClosing] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const [isCompact, setIsCompact] = useState(false);

	const [mobileFilters, setMobileFilters] = useState({
		category: searchParams.get('cat') as CategoryType | null,
		sort: (searchParams.get('sort') as SortOption) || 'newest',
		type: (searchParams.get('type') as ListingType) || 'all',
		condition: searchParams.get('condition')?.split(',').filter(Boolean) || [],
		minPrice: searchParams.get('minPrice') || '',
		maxPrice: searchParams.get('maxPrice') || '',
		onlyFollowed: searchParams.get('onlyFollowed') === 'true',
	});

	useEffect(() => {
		if (isOpen) {
			setMobileFilters({
				category: searchParams.get('cat') as CategoryType | null,
				sort: (searchParams.get('sort') as SortOption) || 'newest',
				type: (searchParams.get('type') as ListingType) || 'all',
				condition: searchParams.get('condition')?.split(',').filter(Boolean) || [],
				minPrice: searchParams.get('minPrice') || '',
				maxPrice: searchParams.get('maxPrice') || '',
				onlyFollowed: searchParams.get('onlyFollowed') === 'true',
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsCompact(window.innerWidth < 400);
		};

		checkScreenSize();
		window.addEventListener('resize', checkScreenSize);

		return () => window.removeEventListener('resize', checkScreenSize);
	}, []);

	useEffect(() => {
		if (isOpen && !isVisible) {
			setIsVisible(true);
			setIsClosing(false);
			document.body.style.overflow = 'hidden';
		} else if (!isOpen && isVisible && !isClosing) {
		}

		return () => {
			if (!isOpen) {
				document.body.style.overflow = 'unset';
			}
		};
	}, [isOpen, isVisible, isClosing]);

	const handleClose = useCallback(() => {
		setIsClosing(true);
		setTimeout(() => {
			setIsVisible(false);
			onClose();
			setIsClosing(false);
			document.body.style.overflow = 'unset';
		}, 250);
	}, [onClose]);

	const handleCategoryChange = useCallback((category: CategoryType | null) => {
		setMobileFilters((prev) => ({ ...prev, category }));
	}, []);

	const handleSortChange = useCallback((sort: SortOption) => {
		setMobileFilters((prev) => ({ ...prev, sort }));
	}, []);

	const handleTypeChange = useCallback((type: ListingType) => {
		setMobileFilters((prev) => ({ ...prev, type }));
	}, []);

	const handleConditionChange = useCallback((condition: string[]) => {
		setMobileFilters((prev) => ({ ...prev, condition }));
	}, []);

	const handlePriceChange = useCallback((minPrice: string, maxPrice: string) => {
		setMobileFilters((prev) => ({ ...prev, minPrice, maxPrice }));
	}, []);

	const handleOnlyFollowedChange = useCallback((isFollowed: boolean) => {
		setMobileFilters((prev) => ({ ...prev, onlyFollowed: isFollowed }));
	}, []);

	const applyAllFilters = () => {
		const params = new URLSearchParams(searchParams.toString());

		if (mobileFilters.category) {
			params.set('cat', mobileFilters.category);
		} else {
			params.delete('cat');
		}

		if (mobileFilters.sort !== 'newest') {
			params.set('sort', mobileFilters.sort);
		} else {
			params.delete('sort');
		}

		if (mobileFilters.type !== 'all') {
			params.set('type', mobileFilters.type);
		} else {
			params.delete('type');
		}

		if (mobileFilters.condition.length > 0) {
			params.set('condition', mobileFilters.condition.join(','));
		} else {
			params.delete('condition');
		}

		if (mobileFilters.minPrice) {
			params.set('minPrice', mobileFilters.minPrice);
		} else {
			params.delete('minPrice');
		}

		if (mobileFilters.maxPrice) {
			params.set('maxPrice', mobileFilters.maxPrice);
		} else {
			params.delete('maxPrice');
		}

		if (mobileFilters.onlyFollowed) {
			params.set('onlyFollowed', 'true');
		} else {
			params.delete('onlyFollowed');
		}

		router.push(`/marketplace?${params.toString()}`, { scroll: false });

		handleClose();
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen && !isClosing) {
				handleClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, isClosing, handleClose]);

	if (!isOpen && !isVisible) return null;

	return (
		<div
			className={`${styles.drawerOverlay} ${isClosing ? styles.closing : ''}`}
			onClick={handleOverlayClick}
			aria-modal="true"
			aria-hidden={!isOpen}
			role="dialog"
		>
			<div
				className={`${styles.drawer} ${isOpen && !isClosing ? styles.open : ''} ${
					isClosing ? styles.closing : ''
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={styles.drawerHeader}>
					<div className={styles.drawerTitleWrapper}>
						<SlidersHorizontal size={20} />
						<h3 className={styles.drawerTitle}>Filtry i sortowanie</h3>
					</div>
					<button
						onClick={handleClose}
						className={styles.closeButton}
						aria-label="Zamknij"
					>
						<X size={24} />
					</button>
				</div>

				<div className={styles.drawerContent}>
					<CategorySection
						isMobile={true}
						immediateUpdate={false}
						onCategoryChange={handleCategoryChange}
					/>
					<SortingSection
						isMobile={true}
						immediateUpdate={false}
						onSortChange={handleSortChange}
					/>
					<FilterSection
						isMobile={true}
						isCompact={isCompact}
						immediateUpdate={false}
						onTypeChange={handleTypeChange}
						onConditionChange={handleConditionChange}
						onPriceChange={handlePriceChange}
						onOnlyFollowedChange={handleOnlyFollowedChange}
					/>
				</div>

				<div className={styles.drawerFooter}>
					<button onClick={applyAllFilters} className={styles.applyButton}>
						Zastosuj zmiany
					</button>
				</div>
			</div>
		</div>
	);
}
