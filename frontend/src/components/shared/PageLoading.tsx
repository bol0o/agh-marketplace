import { Loader2 } from 'lucide-react';
import styles from './PageLoading.module.scss';

interface PageLoadingProps {
	text: string;
}

export function PageLoading({ text }: PageLoadingProps) {
	return (
		<div className={styles.loadingWrapper}>
			<Loader2 className={styles.spinner} size={48} />
			<p className={styles.loadingText}>{text}</p>
		</div>
	);
}
