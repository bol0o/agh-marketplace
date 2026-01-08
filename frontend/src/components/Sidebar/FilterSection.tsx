'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import styles from './FilterSection.module.scss';

type ListingType = 'all' | 'buy_now' | 'auction';

interface FilterSectionProps {
	closeDrawer?: () => void;
	isMobile?: boolean;
	isCompact?: boolean;
	immediateUpdate?: boolean;
	onTypeChange?: (type: ListingType) => void;
	onConditionChange?: (condition: string[]) => void;
	onPriceChange?: (minPrice: string, maxPrice: string) => void;
}

export default function FilterSection({
	closeDrawer,
	isCompact = false,
	immediateUpdate = true,
	onTypeChange,
	onConditionChange,
	onPriceChange,
}: FilterSectionProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const [price, setPrice] = useState({
		min: searchParams.get('minPrice') || '',
		max: searchParams.get('maxPrice') || '',
	});

	const [localFilters, setLocalFilters] = useState({
		type: (searchParams.get('type') as ListingType) || 'all',
		condition: searchParams.get('condition')?.split(',').filter(Boolean) || [],
	});

	const updateURL = useCallback(
		(updates: Record<string, string | null>) => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}

			const performUpdate = () => {
				const params = new URLSearchParams(searchParams.toString());

				Object.entries(updates).forEach(([key, value]) => {
					if (value) {
						params.set(key, value);
					} else {
						params.delete(key);
					}
				});

				router.push(`/marketplace?${params.toString()}`, { scroll: false });
			};

			updateTimeoutRef.current = setTimeout(performUpdate, 300);
		},
		[router, searchParams]
	);

	const handleTypeChange = (type: ListingType) => {
		const value = type === 'all' ? null : type;
		setLocalFilters((prev) => ({ ...prev, type }));

		if (onTypeChange) {
			onTypeChange(type);
		}

		if (immediateUpdate) {
			updateURL({ type: value });
		}
	};

	const handleCheckboxChange = (value: string) => {
		const newCondition = localFilters.condition.includes(value)
			? localFilters.condition.filter((v) => v !== value)
			: [...localFilters.condition, value];

		setLocalFilters((prev) => ({ ...prev, condition: newCondition }));

		if (onConditionChange) {
			onConditionChange(newCondition);
		}

		if (immediateUpdate) {
			updateURL({ condition: newCondition.length > 0 ? newCondition.join(',') : null });
		}
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const numericValue = value.replace(/[^0-9]/g, '');

		const newPrice = {
			...price,
			[name === 'minPrice' ? 'min' : 'max']: numericValue,
		};

		setPrice(newPrice);

		if (onPriceChange) {
			onPriceChange(newPrice.min, newPrice.max);
		}
	};

	const applyPriceFilter = () => {
		let finalMin = price.min;
		let finalMax = price.max;

		if (finalMin && finalMax && Number(finalMin) > Number(finalMax)) {
			const temp = finalMin;
			finalMin = finalMax;
			finalMax = temp;
			setPrice({ min: finalMin, max: finalMax });

			if (onPriceChange) {
				onPriceChange(finalMin, finalMax);
			}
		}

		if (immediateUpdate) {
			updateURL({
				minPrice: finalMin || null,
				maxPrice: finalMax || null,
			});
		}
	};

	const handlePriceKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			applyPriceFilter();
		}
	};

	const clearFilters = () => {
		setLocalFilters({ type: 'all', condition: [] });
		setPrice({ min: '', max: '' });

		if (onTypeChange) {
			onTypeChange('all');
		}
		if (onConditionChange) {
			onConditionChange([]);
		}
		if (onPriceChange) {
			onPriceChange('', '');
		}

		if (immediateUpdate) {
			router.push('/marketplace', { scroll: false });
			if (closeDrawer) closeDrawer();
		}
	};

	const hasActiveFilters = useMemo(() => {
		return (
			localFilters.type !== 'all' ||
			price.min ||
			price.max ||
			localFilters.condition.length > 0
		);
	}, [localFilters, price]);

	useEffect(() => {
		return () => {
			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current);
			}
		};
	}, []);

	const priceInputsClass = `${styles.priceInputs} ${isCompact ? styles.compact : ''}`;

	return (
		<div className={styles.filterSection}>
			<h3 className={styles.sectionTitle}>
				<Filter size={14} /> Filtry
			</h3>

			<div className={styles.filterContent}>
				<div className={styles.typeToggle}>
					<button
						onClick={() => handleTypeChange('all')}
						className={`${styles.toggleBtn} ${
							localFilters.type === 'all' ? styles.active : ''
						}`}
					>
						Wszystkie
					</button>
					<button
						onClick={() => handleTypeChange('buy_now')}
						className={`${styles.toggleBtn} ${
							localFilters.type === 'buy_now' ? styles.active : ''
						}`}
					>
						Oferty
					</button>
					<button
						onClick={() => handleTypeChange('auction')}
						className={`${styles.toggleBtn} ${
							localFilters.type === 'auction' ? styles.active : ''
						}`}
					>
						Aukcje
					</button>
				</div>

				<div className={styles.filterGroups}>
					<div className={styles.filterGroup}>
						<label className={styles.filterLabel}>Cena (PLN)</label>
						<div className={priceInputsClass}>
							<input
								type="number"
								name="minPrice"
								placeholder="Od"
								min="0"
								value={price.min}
								onChange={handlePriceChange}
								onBlur={applyPriceFilter}
								onKeyDown={handlePriceKeyDown}
								className={styles.priceInput}
							/>
							<span className={styles.priceSeparator}>–</span>
							<input
								type="number"
								name="maxPrice"
								placeholder="Do"
								min="0"
								value={price.max}
								onChange={handlePriceChange}
								onBlur={applyPriceFilter}
								onKeyDown={handlePriceKeyDown}
								className={styles.priceInput}
							/>
						</div>
					</div>

					<div className={styles.filterGroup}>
						<label className={styles.filterLabel}>Stan przedmiotu</label>
						<div className={styles.checkboxGroup}>
							<Checkbox
								label="Nowy"
								checked={localFilters.condition.includes('new')}
								onChange={() => handleCheckboxChange('new')}
							/>
							<Checkbox
								label="Używany"
								checked={localFilters.condition.includes('used')}
								onChange={() => handleCheckboxChange('used')}
							/>
							<Checkbox
								label="Uszkodzony"
								checked={localFilters.condition.includes('damaged')}
								onChange={() => handleCheckboxChange('damaged')}
							/>
						</div>
					</div>
				</div>

				{immediateUpdate && (
					<button onClick={clearFilters} className={styles.clearBtn}>
						<X size={14} /> Wyczyść wszystkie filtry
					</button>
				)}
			</div>
		</div>
	);
}

interface CheckboxProps {
	label: string;
	checked: boolean;
	onChange: () => void;
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
	return (
		<label className={styles.checkboxLabel}>
			<input
				type="checkbox"
				checked={checked}
				onChange={onChange}
				className={styles.checkboxInput}
			/>
			<span className={styles.customCheckboxWrapper}>
				<div className={`${styles.customCheckbox} ${checked ? styles.checked : ''}`}>
					{checked && <div className={styles.checkmark} />}
				</div>
				<span className={styles.checkboxText}>{label}</span>
			</span>
		</label>
	);
}
