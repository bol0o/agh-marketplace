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

export function Sidebar() {
	const pathname = usePathname();
	const isMarketplacePage = pathname.startsWith('/marketplace');
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	return (
		<>
			{/* DESKTOP SIDEBAR */}
			<aside className={styles.sidebar}>
				<SidebarContent isMarketplacePage={isMarketplacePage} />
			</aside>

			{/* MOBILE TRIGGER (Tylko Marketplace) */}
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

			{/* MOBILE DRAWER */}
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
							{/* 1. DODANO KATEGORIE NA MOBILE */}
							<CategoryNav onNavigate={() => setIsMobileOpen(false)} />

							{/* Separator estetyczny */}
							<div className="my-6 border-b border-gray-100" />

							<h3 className={styles.sectionTitle} style={{ marginTop: '24px' }}>
								<Filter size={14} /> Opcje filtrowania
							</h3>

							{/* 2. FILTRY */}
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

// --- DESKTOP CONTENT ---
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

	// Pobieramy dane z URL
	const currentType = (searchParams.get('type') as ListingType) || 'all';
	const currentConditions = searchParams.get('condition')?.split(',').filter(Boolean) || [];
	const currentStatus = searchParams.get('status')?.split(',').filter(Boolean) || [];

	// Stan lokalny inputów ceny
	const [price, setPrice] = useState({
		min: searchParams.get('minPrice') || '',
		max: searchParams.get('maxPrice') || '',
	});

	const minPriceParam = searchParams.get('minPrice');
	const maxPriceParam = searchParams.get('maxPrice');

	// 2. Synchronizacja URL -> Inputy
	useEffect(() => {
		setPrice({
			min: minPriceParam || '',
			max: maxPriceParam || '',
		});

		// 3. Tablica zależności zawiera teraz stringi, a nie obiekt
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

	// --- 1. ZABEZPIECZENIE PRZED UJEMNYMI (onChange) ---
	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		// Jeśli wartość jest ujemna, ignorujemy zmianę (nie pozwalamy wpisać minusa)
		if (value !== '' && Number(value) < 0) return;

		setPrice((prev) => ({ ...prev, [name === 'minPrice' ? 'min' : 'max']: value }));
	};

	// --- 2. INTELIGENTNA WALIDACJA (onBlur / Enter) ---
	const commitPriceFilter = () => {
		let finalMin = price.min;
		let finalMax = price.max;

		// Konwersja na liczby do porównania
		const numMin = finalMin ? Number(finalMin) : -1;
		const numMax = finalMax ? Number(finalMax) : -1;

		// LOGIKA: Jeśli oba pola są wypełnione i Min > Max -> Zamień je miejscami
		// Np. Użytkownik wpisał Od: 100, Do: 50 -> My robimy Od: 50, Do: 100
		if (finalMin && finalMax && numMin > numMax) {
			const temp = finalMin;
			finalMin = finalMax;
			finalMax = temp;
			// Aktualizujemy też stan wizualny inputów od razu, żeby użytkownik widział zamianę
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
							min="0" // HTML5 constraint
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
							min="0" // HTML5 constraint
							value={price.max}
							onChange={handlePriceChange}
							onBlur={commitPriceFilter}
							onKeyDown={(e) => e.key === 'Enter' && commitPriceFilter()}
						/>
					</div>
				</div>

				<div className={styles.filterGroup}>
					<label>Stan przedmiotu</label>
					<div className="space-y-1">
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
						<div className="space-y-1">
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
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// 1. Sprawdzamy czy to link kategorii (czy zawiera "?cat=")
	const isCategoryLink = href.includes('?cat=');

	// 2. Budujemy docelowy URL
	let finalHref = href;

	if (isCategoryLink) {
		// Parsujemy parametry z linku (np. cat=elektronika)
		const [targetPath, targetQuery] = href.split('?');
		const targetParams = new URLSearchParams(targetQuery);
		const targetCat = targetParams.get('cat');

		// Kopiujemy OBECNE parametry z URL przeglądarki
		const currentParams = new URLSearchParams(searchParams.toString());

		// Ustawiamy nową kategorię (lub usuwamy jeśli kliknięto tę samą - opcjonalne)
		if (targetCat) {
			currentParams.set('cat', targetCat);
		}

		// Jeśli jesteśmy na innej stronie niż marketplace, musimy tam wrócić
		// ale z zachowaniem parametrów
		finalHref = `${targetPath}?${currentParams.toString()}`;
	}

	// 3. Logika aktywnego linku (Poprawiona z poprzedniej odpowiedzi)
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
			// Opcjonalnie: prevent scroll reset dla płynności
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

// Nowy komponent pomocniczy (na dole pliku)
function CategoryNav({ onNavigate }: { onNavigate?: () => void }) {
	// Wrapper div onClick przechwytuje kliknięcia w linki (Event Bubbling)
	// Dzięki temu nie musimy przerabiać skomplikowanego SidebarLinka
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
