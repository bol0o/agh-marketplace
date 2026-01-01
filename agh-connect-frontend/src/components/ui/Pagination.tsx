'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/Pagination.module.scss';

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
		router.push(createPageURL(page));
	};

	if (totalPages <= 1) return null;

	return (
		<div className={styles.pagination}>
			<button
				className={styles.arrowBtn}
				disabled={currentPage <= 1}
				onClick={() => handlePageChange(currentPage - 1)}
			>
				<ChevronLeft size={20} />
			</button>

			<div className={styles.pages}>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
					<button
						key={page}
						onClick={() => handlePageChange(page)}
						className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
					>
						{page}
					</button>
				))}
			</div>

			<button
				className={styles.arrowBtn}
				disabled={currentPage >= totalPages}
				onClick={() => handlePageChange(currentPage + 1)}
			>
				<ChevronRight size={20} />
			</button>
		</div>
	);
}
