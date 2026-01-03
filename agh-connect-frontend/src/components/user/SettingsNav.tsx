'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MapPin, Bell, LogOut } from 'lucide-react';
import styles from '@/app/(dashboard)/user/settings/settings.module.scss'; // Używamy tych samych styli

const NAV_ITEMS = [
	{ href: '/user/settings', label: 'Profil Publiczny', icon: User },
	{ href: '/user/settings/address', label: 'Adres', icon: MapPin },
	{ href: '/user/settings/notifications', label: 'Powiadomienia', icon: Bell },
];

export function SettingsNav() {
	const pathname = usePathname();

	return (
		<aside className={styles.sidebarNav}>
			{NAV_ITEMS.map((item) => {
				const Icon = item.icon;
				const isActive = pathname === item.href;

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`${styles.navLink} ${isActive ? styles.active : ''}`}
					>
						<Icon size={20} />
						{item.label}
					</Link>
				);
			})}

			<button className={`${styles.navLink} ${styles.logout}`}>
				<LogOut size={20} />
				Wyloguj się
			</button>
		</aside>
	);
}
