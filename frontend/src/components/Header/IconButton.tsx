import Link from 'next/link';
import styles from './IconButton.module.scss';

interface IconButtonProps {
	href: string;
	icon: React.ReactNode;
	isActive?: boolean;
	badge?: number;
	title: string;
}

export function IconButton({ href, icon, isActive = false, badge, title }: IconButtonProps) {
	return (
		<Link
			href={href}
			className={`${styles.iconBtn} ${isActive ? styles.active : ''}`}
			title={title}
			aria-label={title}
		>
			{icon}
			{badge !== undefined && badge > 0 && (
				<span className={styles.badge}>{badge > 99 ? '99+' : badge}</span>
			)}
		</Link>
	);
}
