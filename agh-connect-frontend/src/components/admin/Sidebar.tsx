'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, LogOut, Flag, Settings } from 'lucide-react';
import styles from './Sidebar.module.scss';

export default function AdminSidebar() {
	const pathname = usePathname();

	return (
		<aside className={styles.sidebar}>
			<div className={styles.brand}>
				<ShieldAlert size={28} />
				<span>AGH Admin</span>
			</div>

			<nav>
				{/* Link do endpointu /admin/stats */}
				<Link
					href="/admin"
					className={`${styles.navItem} ${pathname === '/admin' ? styles.active : ''}`}
				>
					<LayoutDashboard size={20} /> Dashboard
				</Link>

				{/* Link do endpointu /admin/users */}
				<Link
					href="/admin/users"
					className={`${styles.navItem} ${pathname.includes('/admin/users') ? styles.active : ''}`}
				>
					<Users size={20} /> Użytkownicy
				</Link>

				{/* Placeholdery (brak endpointów na screenie) */}
				<div className={`${styles.navItem} ${styles.disabled}`}>
					<Flag size={20} /> Zgłoszenia
				</div>
				<div className={`${styles.navItem} ${styles.disabled}`}>
					<Settings size={20} /> Ustawienia
				</div>
			</nav>

			<div className={styles.logoutWrapper}>
				<Link href="/marketplace" className={styles.navItem}>
					<LogOut size={20} /> Wyjdź do sklepu
				</Link>
			</div>
		</aside>
	);
}
