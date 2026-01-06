import { Loader2 } from 'lucide-react';
import styles from './LoadingSpinner.module.scss';

interface LoadingSpinnerProps {
	fullScreen?: boolean;
	size?: number;
}

export default function LoadingSpinner({ fullScreen = true, size = 48 }: LoadingSpinnerProps) {
	if (fullScreen) {
		return (
			<div className={styles.container}>
				<Loader2 className={styles.spinner} size={size} />
			</div>
		);
	}

	return <Loader2 className={styles.spinner} size={size} />;
}
