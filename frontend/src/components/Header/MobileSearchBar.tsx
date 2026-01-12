'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import styles from './MobileSearchBar.module.scss';

export function MobileSearchBar() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inputRef = useRef<HTMLInputElement>(null);
	const [searchValue, setSearchValue] = useState('');

	useEffect(() => {
		const searchQuery = searchParams.get('search');
		if (searchQuery) {
			setSearchValue(searchQuery);
		}
	}, [searchParams]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

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

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setSearchValue('');
		}

		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<div className={styles.mobileSearchBar}>
			<form onSubmit={handleSubmit} className={styles.searchForm}>
				<Search size={16} />
				<input
					ref={inputRef}
					type="text"
					value={searchValue}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Wpisz czego szukasz..."
					autoFocus
					aria-label="Wyszukaj"
				/>
			</form>
		</div>
	);
}
