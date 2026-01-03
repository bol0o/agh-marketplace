'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './user.module.scss';

export default function UserRootLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === '/user' && pathname === '/user') return true;
		if (path !== '/user' && pathname.startsWith(path)) return true;
		return false;
	};

	return (
		<div className={styles.wrapper}>
			{/* GÓRNY NAGŁÓWEK (WSPÓLNY DLA CAŁEGO PROFILU) */}
			<div className={styles.header}>
				<h1>Twój Profil</h1>
				<nav className={styles.navTabs}>
					<Link href="/user" className={isActive('/user') ? styles.active : ''}>
						Przegląd
					</Link>
					<Link
						href="/user/orders"
						className={isActive('/user/orders') ? styles.active : ''}
					>
						Moje Zamówienia
					</Link>
					<Link
						href="/user/settings"
						className={isActive('/user/settings') ? styles.active : ''}
					>
						Ustawienia
					</Link>
				</nav>
			</div>

			{children}
		</div>
	);
}
