'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
	Filter,
	Tag,
	Bookmark,
	ChevronRight,
	Star,
	Clock,
	X,
	HelpCircle,
	ArrowRight,
	SlidersHorizontal,
} from 'lucide-react';
import styles from './Sidebar.module.scss';

export type ListingType = 'all' | 'buy_now' | 'auction';

interface CheckboxProps {
	label: string;
	checked: boolean;
	onChange: () => void;
}

export function Sidebar() {
	const pathname = usePathname();
	const isMarketplacePage = pathname.startsWith('/marketplace');
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	return (
		<>
			<aside className={styles.sidebar}>
				<SidebarContent isMarketplacePage={isMarketplacePage} />
			</aside>

			{isMarketplacePage && (
				<div className={styles.mobileTriggerWrapper}>
					<button
						className={styles.mobileFilterBtn}
						onClick={() => setIsMobileOpen(true)}
					>
						<SlidersHorizontal size={18} /> Kategorie i Filtry
					</button>
				</div>
			)}

			{isMobileOpen && (
				<div className={styles.mobileDrawerOverlay} onClick={() => setIsMobileOpen(false)}>
					<div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
						<div className={styles.drawerHeader}>
							<h3>Kategorie i filtrowanie</h3>
							<button onClick={() => setIsMobileOpen(false)}>
								<X size={24} />
							</button>
						</div>
						<div className={styles.drawerBody}>
							<h3 className={styles.sectionTitle} style={{ marginTop: '24px' }}>
								<Filter size={14} /> Filtrowanie
							</h3>

							<FilterLogicContent closeDrawer={() => setIsMobileOpen(false)} />

							<CategoryNav onNavigate={() => setIsMobileOpen(false)} />
						</div>
						<div className={styles.drawerFooter}>
							<button
								className={styles.applyBtn}
								onClick={() => setIsMobileOpen(false)}
							>
								Pokaż wyniki
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function SidebarContent({ isMarketplacePage }: { isMarketplacePage: boolean }) {
	return (
		<>
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>
					<Filter size={14} /> Filtrowanie
				</h3>
				{isMarketplacePage ? <FilterLogicContent /> : <InfoBox />}
			</div>

			<CategoryNav />

			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>
					<Bookmark size={14} /> Na skróty
				</h3>
				<nav className={styles.navLinks}>
					<SidebarLink
						href="/top-rated"
						label="Najlepiej oceniane"
						icon={<Star size={16} />}
					/>
					<SidebarLink
						href="/recent"
						label="Ostatnio dodane"
						icon={<Clock size={16} />}
					/>
					<SidebarLink
						href="/help"
						label="Centrum Pomocy"
						icon={<HelpCircle size={16} />}
					/>
				</nav>
			</div>
		</>
	);
}

function FilterLogicContent({ closeDrawer }: { closeDrawer?: () => void }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentType = (searchParams.get('type') as ListingType) || 'all';
	const currentConditions = searchParams.get('condition')?.split(',').filter(Boolean) || [];
	const currentStatus = searchParams.get('status')?.split(',').filter(Boolean) || [];

	const [price, setPrice] = useState({
		min: searchParams.get('minPrice') || '',
		max: searchParams.get('maxPrice') || '',
	});

	const minPriceParam = searchParams.get('minPrice');
	const maxPriceParam = searchParams.get('maxPrice');

	useEffect(() => {
		setPrice({
			min: minPriceParam || '',
			max: maxPriceParam || '',
		});
	}, [minPriceParam, maxPriceParam]);

	const updateURL = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set(key, value);
		else params.delete(key);

		router.push(`/marketplace?${params.toString()}`, { scroll: false });
	};

	const handleTypeChange = (type: ListingType) => {
		updateURL('type', type === 'all' ? null : type);
	};

	const handleCheckboxChange = (
		paramName: 'condition' | 'status',
		currentValues: string[],
		value: string
	) => {
		const newValues = currentValues.includes(value)
			? currentValues.filter((v) => v !== value)
			: [...currentValues, value];
		updateURL(paramName, newValues.length > 0 ? newValues.join(',') : null);
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (value !== '' && Number(value) < 0) return;

		setPrice((prev) => ({ ...prev, [name === 'minPrice' ? 'min' : 'max']: value }));
	};

	const commitPriceFilter = () => {
		let finalMin = price.min;
		let finalMax = price.max;

		const numMin = finalMin ? Number(finalMin) : -1;
		const numMax = finalMax ? Number(finalMax) : -1;

		if (finalMin && finalMax && numMin > numMax) {
			const temp = finalMin;
			finalMin = finalMax;
			finalMax = temp;

			setPrice({ min: finalMin, max: finalMax });
		}

		const params = new URLSearchParams(searchParams.toString());

		if (finalMin) params.set('minPrice', finalMin);
		else params.delete('minPrice');

		if (finalMax) params.set('maxPrice', finalMax);
		else params.delete('maxPrice');

		router.push(`/marketplace?${params.toString()}`, { scroll: false });
	};

	const clearFilters = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete('type');
		params.delete('minPrice');
		params.delete('maxPrice');
		params.delete('condition');
		params.delete('status');
		setPrice({ min: '', max: '' });
		router.push(`/marketplace?${params.toString()}`, { scroll: false });
		if (closeDrawer) closeDrawer();
	};

	return (
		<>
			<div className={styles.typeToggle}>
				<button
					onClick={() => handleTypeChange('all')}
					className={`${styles.toggleBtn} ${currentType === 'all' ? styles.active : ''}`}
				>
					Wszystkie
				</button>
				<button
					onClick={() => handleTypeChange('buy_now')}
					className={`${styles.toggleBtn} ${currentType === 'buy_now' ? styles.active : ''}`}
				>
					Oferty
				</button>
				<button
					onClick={() => handleTypeChange('auction')}
					className={`${styles.toggleBtn} ${currentType === 'auction' ? styles.active : ''}`}
				>
					Aukcje
				</button>
			</div>

			<div className={styles.filtersContainer}>
				<div className={styles.filterGroup}>
					<label>Cena (PLN)</label>
					<div className={styles.priceInputs}>
						<input
							type="number"
							name="minPrice"
							placeholder="Od"
							min="0"
							value={price.min}
							onChange={handlePriceChange}
							onBlur={commitPriceFilter}
							onKeyDown={(e) => e.key === 'Enter' && commitPriceFilter()}
						/>
						<span>-</span>
						<input
							type="number"
							name="maxPrice"
							placeholder="Do"
							min="0"
							value={price.max}
							onChange={handlePriceChange}
							onBlur={commitPriceFilter}
							onKeyDown={(e) => e.key === 'Enter' && commitPriceFilter()}
						/>
					</div>
				</div>

				<div className={styles.filterGroup}>
					<label>Stan przedmiotu</label>
					<div className={styles.itemStateFilters}>
						<Checkbox
							label="Nowy"
							checked={currentConditions.includes('new')}
							onChange={() =>
								handleCheckboxChange('condition', currentConditions, 'new')
							}
						/>
						<Checkbox
							label="Używany"
							checked={currentConditions.includes('used')}
							onChange={() =>
								handleCheckboxChange('condition', currentConditions, 'used')
							}
						/>
						<Checkbox
							label="Uszkodzony"
							checked={currentConditions.includes('damaged')}
							onChange={() =>
								handleCheckboxChange('condition', currentConditions, 'damaged')
							}
						/>
					</div>
				</div>

				{(currentType === 'auction' || currentType === 'all') && (
					<div className={styles.filterGroup}>
						<label>Status aukcji</label>
						<div className={styles.auctionStatusFilters}>
							<Checkbox
								label="Kończące się (< 24h)"
								checked={currentStatus.includes('ending_soon')}
								onChange={() =>
									handleCheckboxChange('status', currentStatus, 'ending_soon')
								}
							/>
							<Checkbox
								label="Bez ofert kupna"
								checked={currentStatus.includes('no_bids')}
								onChange={() =>
									handleCheckboxChange('status', currentStatus, 'no_bids')
								}
							/>
						</div>
					</div>
				)}

				<button onClick={clearFilters} className={styles.clearBtn}>
					<X size={14} /> Wyczyść filtry
				</button>
			</div>
		</>
	);
}

function InfoBox() {
	return (
		<div className={styles.infoBox}>
			<p>Zaawansowane filtrowanie dostępne tylko w marketplace.</p>
			<Link href="/marketplace" className={styles.infoBtn}>
				Przejdź do Ofert <ArrowRight size={16} />
			</Link>
		</div>
	);
}

function SidebarLink({
	href,
	label,
	icon,
}: {
	href: string;
	label: string;
	icon?: React.ReactNode;
}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const isCategoryLink = href.includes('?cat=');

	let finalHref = href;

	if (isCategoryLink) {
		const [targetPath, targetQuery] = href.split('?');
		const targetParams = new URLSearchParams(targetQuery);
		const targetCat = targetParams.get('cat');

		const currentParams = new URLSearchParams(searchParams.toString());

		if (targetCat) {
			currentParams.set('cat', targetCat);
		}

		finalHref = `${targetPath}?${currentParams.toString()}`;
	}

	let isActive = false;
	if (href.includes('?')) {
		const [targetPath, targetQuery] = href.split('?');
		const targetParams = new URLSearchParams(targetQuery);
		const isPathMatch = pathname === targetPath;

		let areParamsMatch = true;
		targetParams.forEach((value, key) => {
			if (searchParams.get(key) !== value) areParamsMatch = false;
		});
		isActive = isPathMatch && areParamsMatch;
	} else {
		isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
	}

	return (
		<Link
			href={finalHref}
			className={`${styles.navLink} ${isActive ? styles.active : ''}`}
			scroll={false}
		>
			<div className={styles.content}>
				{icon && <span className={styles.icon}>{icon}</span>}
				<span className="truncate">{label}</span>
			</div>
			<ChevronRight size={14} className={styles.chevron} />
		</Link>
	);
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
	return (
		<label className={styles.checkboxLabel}>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className={styles.hiddenInput}
			/>

			<div className={styles.checkmark}></div>
			<span className={styles.labelText}>{label}</span>
		</label>
	);
}

function CategoryNav({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<div className={styles.section}>
			<h3 className={styles.sectionTitle}>
				<Tag size={14} /> Kategorie
			</h3>
			<nav className={styles.navLinks} onClick={onNavigate}>
				<SidebarLink href="/marketplace?cat=elektronika" label="Elektronika" />
				<SidebarLink href="/marketplace?cat=ksiazki" label="Książki i Notatki" />
				<SidebarLink href="/marketplace?cat=akademik" label="Do Akademika" />
				<SidebarLink href="/marketplace?cat=uslugi" label="Usługi Studenckie" />
				<SidebarLink href="/marketplace?cat=inne" label="Inne" />
			</nav>
		</div>
	);
}
