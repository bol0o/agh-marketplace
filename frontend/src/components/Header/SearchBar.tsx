'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './SearchBar.module.scss';

export function SearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		const searchQuery = searchParams.get('search');
		if (searchQuery) {
			setSearchValue(searchQuery);
		}
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const params = new URLSearchParams(searchParams.toString());

		if (searchValue.trim()) {
			params.set('search', searchValue.trim());
			params.delete('page');
		} else {
			params.delete('search');
		}

		router.push(`/marketplace?${params.toString()}`);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	return (
		<div className={styles.searchSection}>
			<form onSubmit={handleSubmit} className={styles.searchWrapper}>
				<input
					type="text"
					value={searchValue}
					onChange={handleChange}
					placeholder="Szukaj produktów..."
					aria-label="Wyszukaj produkty"
				/>
				<button type="submit" aria-label="Szukaj">
					<Search size={18} />
				</button>
			</form>
		</div>
	);
}
