import { Search } from 'lucide-react';
import styles from './MobileSearchBar.module.scss';

interface MobileSearchBarProps {
	onClose: () => void;
}

export function MobileSearchBar({ onClose }: MobileSearchBarProps) {
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onClose();
	};

	return (
		<div className={styles.mobileSearchBar}>
			<form onSubmit={handleSubmit} className={styles.searchForm}>
				<Search size={16} />
				<input
					type="text"
					placeholder="Wpisz czego szukasz..."
					autoFocus
					aria-label="Wyszukaj"
				/>
			</form>
		</div>
	);
}
