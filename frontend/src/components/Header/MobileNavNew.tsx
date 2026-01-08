'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
	X,
	Home,
	LayoutGrid,
	MessageSquare,
	Bell,
	Package,
	Settings,
	LogOut,
	PlusCircle,
	Lock,
	Shield,
} from 'lucide-react';
import styles from './MobileNav.module.scss';
import { useAuth } from '@/store/useAuth';

interface MobileNavProps {
	isOpen: boolean;
	isAnimating?: boolean;
	onClose: () => void;
}

export function MobileNav({ isOpen, isAnimating = false, onClose }: MobileNavProps) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const pathname = usePathname();

	const { user, logout, isAuthenticated } = useAuth();
	const hasUnreadMessages = 2;
	const hasUnreadNotifications = 5;

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const handleLinkClick = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onClose();
		},
		[onClose]
	);

	const handleLogout = async () => {
		if (isLoggingOut) return;

		setIsLoggingOut(true);
		try {
			await logout();
		} catch (error) {
			console.error('Błąd podczas wylogowania:', error);
			setIsLoggingOut(false);
		}
	};

	if (!isAuthenticated) return null;

	return (
		<>
			<div
				className={`${styles.backdrop} ${isOpen ? styles.open : ''} ${
					isAnimating ? styles.closing : ''
				}`}
				onClick={handleBackdropClick}
				aria-hidden="true"
			/>

			<div
				className={`${styles.drawer} ${isOpen ? styles.open : ''} ${
					isAnimating ? styles.closing : ''
				}`}
			>
				<div className={styles.drawerContent}>
					<div className={styles.drawerHeader}>
						<span>AGH Connect</span>
						<button onClick={onClose} aria-label="Zamknij menu">
							<X size={24} />
						</button>
					</div>

					<div className={styles.drawerBody}>
						<div className={styles.section} style={{ marginBottom: 0 }}>
							<Link
								href="/marketplace/create"
								className={styles.mobileCreateBtn}
								onClick={handleLinkClick}
							>
								<PlusCircle size={20} />
								Dodaj ogłoszenie
							</Link>
						</div>

						<div className={styles.section}>
							<p>Przeglądaj</p>
							<nav>
								<Link
									href="/home"
									className={`${styles.simpleLink} ${
										pathname === '/home' ? styles.active : ''
									}`}
									onClick={handleLinkClick}
								>
									<Home size={20} />
									<span>Home</span>
								</Link>
								<Link
									href="/marketplace"
									className={`${styles.simpleLink} ${
										pathname.startsWith('/marketplace') ? styles.active : ''
									}`}
									onClick={handleLinkClick}
								>
									<LayoutGrid size={20} />
									<span>Oferty</span>
								</Link>
							</nav>
						</div>

						<div className={styles.section}>
							<p>Społeczność</p>
							<nav>
								<Link
									href="/chats"
									className={`${styles.simpleLink} ${
										pathname.startsWith('/chats') ? styles.active : ''
									}`}
									onClick={handleLinkClick}
								>
									<MessageSquare size={20} />
									<span>Wiadomości</span>
									{hasUnreadMessages > 0 && (
										<span className={styles.badge}>{hasUnreadMessages}</span>
									)}
								</Link>
								<Link
									href="/notifications"
									className={`${styles.simpleLink} ${
										pathname.startsWith('/notifications') ? styles.active : ''
									}`}
									onClick={handleLinkClick}
								>
									<Bell size={20} />
									<span>Powiadomienia</span>
									{hasUnreadNotifications > 0 && (
										<span className={styles.badge}>
											{hasUnreadNotifications}
										</span>
									)}
								</Link>
							</nav>
						</div>

						<div className={styles.section}>
							<p>Konto</p>
							<nav>
								<Link
									href="/user"
									className={`${styles.simpleLink} ${
										pathname === '/user' ? styles.active : ''
									}`}
									onClick={handleLinkClick}
								>
									<Shield
										size={20}
										className={user?.role === 'admin' ? styles.adminIcon : ''}
									/>
									<span>
										Twój Profil
										{user?.role === 'admin' && (
											<span className={styles.adminInlineBadge}>Admin</span>
										)}
									</span>
								</Link>

								<Link
									href="/user/orders"
									className={`${styles.simpleLink} ${
										pathname.startsWith('/user/orders') ? styles.active : ''
									}`}
									onClick={handleLinkClick}
								>
									<Package size={20} />
									<span>Twoje Zamówienia</span>
								</Link>

								<Link
									href="/user/settings"
									className={`${styles.simpleLink} ${
										pathname.startsWith('/user/settings') ? styles.active : ''
									}`}
									onClick={handleLinkClick}
								>
									<Settings size={20} />
									<span>Ustawienia</span>
								</Link>

								{user?.role === 'admin' && (
									<Link
										href="/admin"
										className={`${styles.simpleLink} ${
											pathname.startsWith('/admin') ? styles.active : ''
										}`}
										onClick={handleLinkClick}
									>
										<Lock size={20} />
										<span>Panel Administratora</span>
									</Link>
								)}
							</nav>
						</div>
					</div>

					<div className={styles.drawerFooter}>
						<div className={styles.userInfo}>
							<div
								className={`${styles.avatar} ${
									user?.role === 'admin' ? styles.adminAvatar : ''
								}`}
							>
								{user?.role === 'admin' ? (
									<Shield size={20} />
								) : (
									user?.name?.charAt(0).toUpperCase() || 'U'
								)}
							</div>
							<div className={styles.text}>
								<p className={styles.userName}>
									{user?.name || 'Użytkownik'}
									{user?.role === 'admin' && (
										<span className={styles.adminTag}>
											<Shield size={12} />
											Admin
										</span>
									)}
								</p>
								<p className={styles.userEmail}>
									{user?.email || 'user@example.com'}
								</p>
							</div>
						</div>
						<button
							className={`${styles.logoutBtn} ${
								isLoggingOut ? styles.loggingOut : ''
							}`}
							onClick={handleLogout}
							disabled={isLoggingOut}
						>
							{isLoggingOut ? (
								<>
									<div className={styles.spinner} />
									<span>Wylogowywanie...</span>
								</>
							) : (
								<>
									<LogOut size={18} />
									<span>Wyloguj się</span>
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
