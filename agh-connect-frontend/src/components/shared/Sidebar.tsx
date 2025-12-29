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
import styles from '@/styles/Sidebar.module.scss';

export type ListingType = 'all' | 'buy_now' | 'auction';

interface FilterState {
	minPrice: string;
	maxPrice: string;
	condition: string[];
	auctionStatus: string[];
}

// --- GŁÓWNY KOMPONENT SIDEBAR ---
export function Sidebar() {
	const pathname = usePathname();
	const isMarketplacePage = pathname.startsWith('/marketplace');
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	// Jeśli nie jesteśmy na marketplace, nie pokazujemy nic na mobile
	// Na desktopie pokazujemy Sidebar z linkami
	return (
		<>
			{/* DESKTOP SIDEBAR */}
			<aside className={styles.sidebar}>
				<SidebarContent isMarketplacePage={isMarketplacePage} />
			</aside>

			{/* MOBILE TRIGGER BUTTON (Tylko na Marketplace) */}
			{isMarketplacePage && (
				<div className={styles.mobileTriggerWrapper}>
					<button
						className={styles.mobileFilterBtn}
						onClick={() => setIsMobileOpen(true)}
					>
						<SlidersHorizontal size={18} /> Filtrowanie i Sortowanie
					</button>
				</div>
			)}

			{/* MOBILE DRAWER (MODAL) */}
			{isMobileOpen && (
				<div className={styles.mobileDrawerOverlay} onClick={() => setIsMobileOpen(false)}>
					<div className={styles.mobileDrawer} onClick={(e) => e.stopPropagation()}>
						<div className={styles.drawerHeader}>
							<h3>Filtrowanie</h3>
							<button onClick={() => setIsMobileOpen(false)}>
								<X size={24} />
							</button>
						</div>
						<div className={styles.drawerBody}>
							<FilterLogicContent closeDrawer={() => setIsMobileOpen(false)} />
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

// --- ZAWARTOŚĆ SIDEBARA (Kategorie + Filtry lub InfoBox) ---
function SidebarContent({ isMarketplacePage }: { isMarketplacePage: boolean }) {
	return (
		<>
			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>
					<Filter size={14} /> Filtrowanie
				</h3>
				{isMarketplacePage ? <FilterLogicContent /> : <InfoBox />}
			</div>

			<div className={styles.section}>
				<h3 className={styles.sectionTitle}>
					<Tag size={14} /> Kategorie
				</h3>
				<nav className={styles.navLinks}>
					<SidebarLink href="/marketplace?cat=elektronika" label="Elektronika" />
					<SidebarLink href="/marketplace?cat=ksiazki" label="Książki i Notatki" />
					<SidebarLink href="/marketplace?cat=akademik" label="Do Akademika" />
					<SidebarLink href="/marketplace?cat=uslugi" label="Usługi Studenckie" />
				</nav>
			</div>

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

// --- LOGIKA FILTRÓW (Wydzielona, by używać na Mobile i Desktop) ---
function FilterLogicContent({ closeDrawer }: { closeDrawer?: () => void }) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [listingType, setListingType] = useState<ListingType>('all');
	const [filters, setFilters] = useState<FilterState>({
		minPrice: '',
		maxPrice: '',
		condition: [],
		auctionStatus: [],
	});

	useEffect(() => {
		const type = searchParams.get('type') as ListingType;
		if (type) setListingType(type);
		setFilters({
			minPrice: searchParams.get('minPrice') || '',
			maxPrice: searchParams.get('maxPrice') || '',
			condition: searchParams.get('condition')?.split(',') || [],
			auctionStatus: searchParams.get('status')?.split(',') || [],
		});
	}, [searchParams]);

	const applyFilters = (newType: ListingType, newFilters: FilterState) => {
		const params = new URLSearchParams();
		if (newType !== 'all') params.set('type', newType);
		if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
		if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
		if (newFilters.condition.length > 0)
			params.set('condition', newFilters.condition.join(','));
		if (newFilters.auctionStatus.length > 0)
			params.set('status', newFilters.auctionStatus.join(','));

		router.push(`/marketplace?${params.toString()}`);
	};

	const handleTypeChange = (type: ListingType) => {
		setListingType(type);
		applyFilters(type, filters);
	};

	const handleCheckboxChange = (category: keyof FilterState, value: string) => {
		setFilters((prev) => {
			const current = prev[category] as string[];
			const updated = current.includes(value)
				? current.filter((item) => item !== value)
				: [...current, value];
			const newFilters = { ...prev, [category]: updated };
			applyFilters(listingType, newFilters);
			return newFilters;
		});
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const commitPriceFilter = () => {
		applyFilters(listingType, filters);
	};

	const clearFilters = () => {
		const resetFilters = { minPrice: '', maxPrice: '', condition: [], auctionStatus: [] };
		setFilters(resetFilters);
		applyFilters(listingType, resetFilters);
		if (closeDrawer) closeDrawer();
	};

	return (
		<>
			<div className={styles.typeToggle}>
				<button
					onClick={() => handleTypeChange('all')}
					className={`${styles.toggleBtn} ${listingType === 'all' ? styles.active : ''}`}
				>
					Wszystkie
				</button>
				<button
					onClick={() => handleTypeChange('buy_now')}
					className={`${styles.toggleBtn} ${listingType === 'buy_now' ? styles.active : ''}`}
				>
					Oferty
				</button>
				<button
					onClick={() => handleTypeChange('auction')}
					className={`${styles.toggleBtn} ${listingType === 'auction' ? styles.active : ''}`}
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
							value={filters.minPrice}
							onChange={handlePriceChange}
							onBlur={commitPriceFilter}
						/>
						<span>-</span>
						<input
							type="number"
							name="maxPrice"
							placeholder="Do"
							value={filters.maxPrice}
							onChange={handlePriceChange}
							onBlur={commitPriceFilter}
						/>
					</div>
				</div>

				<div className={styles.filterGroup}>
					<label>Stan przedmiotu</label>
					<div className="space-y-1">
						<Checkbox
							label="Nowy"
							checked={filters.condition.includes('new')}
							onChange={() => handleCheckboxChange('condition', 'new')}
						/>
						<Checkbox
							label="Używany"
							checked={filters.condition.includes('used')}
							onChange={() => handleCheckboxChange('condition', 'used')}
						/>
						<Checkbox
							label="Uszkodzony"
							checked={filters.condition.includes('damaged')}
							onChange={() => handleCheckboxChange('condition', 'damaged')}
						/>
					</div>
				</div>

				{(listingType === 'auction' || listingType === 'all') && (
					<div className={styles.filterGroup}>
						<label>Status aukcji</label>
						<div className="space-y-1">
							<Checkbox
								label="Kończące się (< 24h)"
								checked={filters.auctionStatus.includes('ending_soon')}
								onChange={() =>
									handleCheckboxChange('auctionStatus', 'ending_soon')
								}
							/>
							<Checkbox
								label="Bez ofert kupna"
								checked={filters.auctionStatus.includes('no_bids')}
								onChange={() => handleCheckboxChange('auctionStatus', 'no_bids')}
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

// --- HELPERY (InfoBox, SidebarLink, Checkbox) ---
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
	return (
		<Link href={href} className={styles.navLink}>
			<div className={styles.content}>
				{icon && <span className={styles.icon}>{icon}</span>}
				<span className="truncate">{label}</span>
			</div>
			<ChevronRight size={14} className={styles.chevron} />
		</Link>
	);
}

function Checkbox({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: () => void;
}) {
	return (
		<label className={styles.checkboxLabel}>
			<input type="checkbox" checked={checked} onChange={onChange} />
			<div className={styles.checkmark}></div>
			<span className={styles.labelText}>{label}</span>
		</label>
	);
}
