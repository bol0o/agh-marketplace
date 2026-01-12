'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import styles from './SortingSection.module.scss';

type SortOption =
	| 'price_asc'
	| 'price_desc'
	| 'name_asc'
	| 'name_desc'
	| 'newest'
	| 'date_desc'
	| 'views_desc';

interface SortingSectionProps {
	isMobile?: boolean;
	immediateUpdate?: boolean;
	onSortChange?: (sort: SortOption) => void;
}

export default function SortingSection({
	isMobile = false,
	immediateUpdate = true,
	onSortChange,
}: SortingSectionProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [localSort, setLocalSort] = useState<SortOption>(
		(searchParams.get('sort') as SortOption) || 'newest'
	);

	useEffect(() => {
		setLocalSort((searchParams.get('sort') as SortOption) || 'newest');
	}, [searchParams]);

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'newest', label: 'Najnowsze' },
		{ value: 'date_desc', label: 'Najstarsze' },
		{ value: 'price_asc', label: 'Cena: rosnąco' },
		{ value: 'price_desc', label: 'Cena: malejąco' },
		{ value: 'name_asc', label: 'Nazwa: A-Z' },
		{ value: 'name_desc', label: 'Nazwa: Z-A' },
		{ value: 'views_desc', label: 'Wyświetlenia: malejąco' },
	];

	const handleSortChange = (value: SortOption) => {
		setLocalSort(value);

		if (onSortChange) {
			onSortChange(value);
		}

		if (immediateUpdate) {
			const params = new URLSearchParams(searchParams.toString());

			if (value === 'newest') {
				params.delete('sort');
			} else {
				params.set('sort', value);
			}

			router.push(`/marketplace?${params.toString()}`, { scroll: false });
		}
	};

	return (
		<div className={styles.sortingSection}>
			<h3 className={styles.sectionTitle}>
				<ArrowUpDown size={14} /> Sortowanie
			</h3>

			<div className={styles.sortOptions}>
				{sortOptions.map((option) => (
					<button
						key={option.value}
						onClick={() => handleSortChange(option.value)}
						className={`${styles.sortOption} ${
							localSort === option.value ? styles.active : ''
						}`}
						aria-pressed={localSort === option.value}
					>
						<span>{option.label}</span>
						{localSort === option.value && <div className={styles.activeDot} />}
					</button>
				))}
			</div>
		</div>
	);
}
