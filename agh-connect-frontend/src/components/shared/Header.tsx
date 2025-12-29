'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Bell, MessageSquare, ShoppingCart, Menu } from 'lucide-react';
import styles from '@/styles/Header.module.scss';

export function Header() {
	const pathname = usePathname();

	// Mock danych - w przyszłości z Contextu lub API
	const unreadMessages = 2;
	const cartItems = 1;
	const notifications = 5;

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				{/* 1. LOGO */}
				<Link href="/products" className={styles.logoArea}>
					<div className={styles.logoIcon}>A</div>
					<span className={styles.logoText}>AGH Connect</span>
				</Link>

				{/* 2. WYSZUKIWARKA (Desktop) */}
				<div className={styles.searchContainer}>
					<Search size={18} />
					<input type="text" placeholder="Szukaj notatek, przedmiotów, ludzi..." />
				</div>

				{/* 3. AKCJE */}
				<div className={styles.actions}>
					{/* Przycisk Menu (tylko mobile - opcjonalnie do sterowania sidebarem) */}
					{/* <button className={`${styles.iconBtn} lg:hidden`}>
             <Menu size={20} />
          </button> */}

					<Link
						href="/chats"
						className={`${styles.iconBtn} ${pathname.startsWith('/chats') ? styles.active : ''}`}
					>
						<MessageSquare size={20} />
						{unreadMessages > 0 && (
							<span className={styles.badge}>{unreadMessages}</span>
						)}
					</Link>

					<Link
						href="/notifications"
						className={`${styles.iconBtn} ${pathname.startsWith('/notifications') ? styles.active : ''}`}
					>
						<Bell size={20} />
						{notifications > 0 && <span className={styles.badge}>{notifications}</span>}
					</Link>

					<Link
						href="/cart"
						className={`${styles.iconBtn} ${pathname.startsWith('/cart') ? styles.active : ''}`}
					>
						<ShoppingCart size={20} />
						{cartItems > 0 && <span className={styles.badge}>{cartItems}</span>}
					</Link>

					{/* 4. PROFIL */}
					<Link href="/profile" className={styles.userProfile}>
						<div className={styles.userInfo}>
							<span className={styles.userName}>Jan Kowalski</span>
							<span className={styles.userRole}>Student (WIEiT)</span>
						</div>
						<div className={styles.avatar}>
							<Image
								src="https://ui-avatars.com/api/?name=Jan+Kowalski&background=ef4444&color=fff"
								alt="Avatar"
								fill
							/>
						</div>
					</Link>
				</div>
			</div>
		</header>
	);
}
