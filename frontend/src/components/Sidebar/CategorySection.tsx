'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tag, Book, Cpu, Headphones, Shirt, Package } from 'lucide-react';
import styles from './CategorySection.module.scss';

type CategoryType = 'BOOKS' | 'ELECTRONICS' | 'ACCESSORIES' | 'CLOTHING' | 'OTHER';

interface CategorySectionProps {
	isMobile?: boolean;
	immediateUpdate?: boolean;
	onCategoryChange?: (category: CategoryType | null) => void;
}

export default function CategorySection({
	immediateUpdate = true,
	onCategoryChange,
}: CategorySectionProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const urlCategory = searchParams.get('cat') as CategoryType | null;

	const [internalCategory, setInternalCategory] = useState<CategoryType | null>(urlCategory);

	const activeCategory = immediateUpdate ? urlCategory : internalCategory;

	const categories: Array<{
		id: CategoryType;
		label: string;
		icon: React.ReactNode;
		color: string;
	}> = [
		{ id: 'BOOKS', label: 'Książki', icon: <Book size={16} />, color: '#8b5cf6' },
		{ id: 'ELECTRONICS', label: 'Elektronika', icon: <Cpu size={16} />, color: '#3b82f6' },
		{ id: 'ACCESSORIES', label: 'Akcesoria', icon: <Headphones size={16} />, color: '#10b981' },
		{ id: 'CLOTHING', label: 'Odzież', icon: <Shirt size={16} />, color: '#ec4899' },
		{ id: 'OTHER', label: 'Inne', icon: <Package size={16} />, color: '#64748b' },
	];

	const handleCategoryClick = (categoryId: CategoryType | null) => {
		if (!immediateUpdate) {
			setInternalCategory(categoryId);
		}

		if (onCategoryChange) {
			onCategoryChange(categoryId);
		}

		if (immediateUpdate) {
			const params = new URLSearchParams(searchParams.toString());

			if (categoryId) {
				params.set('cat', categoryId);
			} else {
				params.delete('cat');
			}

			params.delete('page');

			const currentPath = window.location.pathname;

			if (!currentPath.includes('/marketplace')) {
				router.push(`/marketplace?${params.toString()}`);
			} else {
				router.push(`/marketplace?${params.toString()}`, { scroll: false });
			}
		}
	};

	const clearCategory = () => {
		handleCategoryClick(null);
	};

	const hasActiveCategory = activeCategory !== null;

	return (
		<div className={styles.categorySection}>
			<h3 className={styles.sectionTitle}>
				<Tag size={14} /> Kategorie
			</h3>

			<div className={styles.categoryList}>
				<button
					onClick={clearCategory}
					className={`${styles.categoryItem} ${!activeCategory ? styles.active : ''}`}
				>
					<div
						className={styles.categoryIcon}
						style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
					>
						<Tag size={16} style={{ color: '#3b82f6' }} />
					</div>
					<span className={styles.categoryLabel}>Wszystkie</span>
				</button>

				{categories.map((category) => (
					<button
						key={category.id}
						onClick={() => handleCategoryClick(category.id)}
						className={`${styles.categoryItem} ${
							activeCategory === category.id ? styles.active : ''
						}`}
					>
						<div
							className={styles.categoryIcon}
							style={{
								backgroundColor:
									activeCategory === category.id
										? category.color
										: `${category.color}15`,
								color: activeCategory === category.id ? '#fff' : category.color,
							}}
						>
							{category.icon}
						</div>
						<span className={styles.categoryLabel}>{category.label}</span>
					</button>
				))}
			</div>

			{hasActiveCategory && immediateUpdate && (
				<div className={styles.activeCategoryInfo}>
					<span className={styles.activeCategoryLabel}>
						Aktywna kategoria:{' '}
						<strong>{categories.find((c) => c.id === activeCategory)?.label}</strong>
					</span>
					<button onClick={clearCategory} className={styles.clearCategoryBtn}>
						Wyczyść
					</button>
				</div>
			)}
		</div>
	);
}
