'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import styles from './Pagination.module.scss';

interface PaginationProps {
	totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const currentPage = Number(searchParams.get('page')) || 1;

	const createPageURL = (pageNumber: number | string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};

	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages || page === currentPage) return;
		router.push(createPageURL(page), { scroll: true });
	};

	const getPageNumbers = () => {
		const delta = 2;
		const range = [];
		const rangeWithDots = [];

		for (let i = 1; i <= totalPages; i++) {
			if (
				i === 1 ||
				i === totalPages ||
				(i >= currentPage - delta && i <= currentPage + delta)
			) {
				range.push(i);
			}
		}

		let prev = 0;
		for (const i of range) {
			if (prev) {
				if (i - prev === 2) {
					rangeWithDots.push(prev + 1);
				} else if (i - prev !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);
			prev = i;
		}

		return rangeWithDots;
	};

	if (totalPages <= 1) return null;

	const pageNumbers = getPageNumbers();

	return (
		<div className={styles.pagination}>
			<button
				className={`${styles.navButton} ${styles.prevButton}`}
				disabled={currentPage <= 1}
				onClick={() => handlePageChange(currentPage - 1)}
				aria-label="Poprzednia strona"
			>
				<ChevronLeft size={18} />
				<span className={styles.navText}>Poprzednia</span>
			</button>

			<div className={styles.pageNumbers}>
				{pageNumbers.map((page, index) => {
					if (page === '...') {
						return (
							<span key={`dots-${index}`} className={styles.dots}>
								<MoreHorizontal size={16} />
							</span>
						);
					}

					return (
						<button
							key={`page-${page}`}
							onClick={() => handlePageChange(page as number)}
							className={`${styles.pageButton} ${
								currentPage === page ? styles.active : ''
							}`}
							aria-current={currentPage === page ? 'page' : undefined}
							aria-label={`Strona ${page}`}
						>
							{page}
						</button>
					);
				})}
			</div>

			<button
				className={`${styles.navButton} ${styles.nextButton}`}
				disabled={currentPage >= totalPages}
				onClick={() => handlePageChange(currentPage + 1)}
				aria-label="Następna strona"
			>
				<span className={styles.navText}>Następna</span>
				<ChevronRight size={18} />
			</button>
		</div>
	);
}
