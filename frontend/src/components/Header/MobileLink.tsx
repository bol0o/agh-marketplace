'use client';

import { DelayedLink } from './DelayedLink';
import { ChevronRight } from 'lucide-react';
import styles from './MobileLink.module.scss';

interface MobileLinkProps {
	href: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	onClick: () => void;
	badge?: number;
	isActive?: boolean;
	delay?: number;
}

export function MobileLink({
	href,
	icon,
	children,
	onClick,
	badge,
	isActive = false,
	delay = 300,
}: MobileLinkProps) {
	return (
		<DelayedLink
			href={href}
			onClick={onClick}
			delay={delay}
			className={`${styles.mobileLink} ${isActive ? styles.active : ''}`}
		>
			<div className={styles.left}>
				<span className={styles.icon}>{icon}</span>
				<span>{children}</span>
			</div>
			<div className={styles.right}>
				{badge && badge > 0 && (
					<span className={styles.badge}>{badge > 99 ? '99+' : badge}</span>
				)}
				<ChevronRight size={16} className={styles.chevron} aria-hidden="true" />
			</div>
		</DelayedLink>
	);
}
