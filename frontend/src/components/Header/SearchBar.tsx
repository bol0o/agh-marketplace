import { Search } from 'lucide-react';
import styles from './SearchBar.module.scss';

export function SearchBar() {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className={styles.searchSection}>
			<form onSubmit={handleSubmit} className={styles.searchWrapper}>
				<input type="text" placeholder="Szukaj notatek, sprzętu..." aria-label="Wyszukaj" />
				<button type="submit" aria-label="Szukaj">
					<Search size={18} />
				</button>
			</form>
		</div>
	);
}
