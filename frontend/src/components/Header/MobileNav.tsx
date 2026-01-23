import { useEffect } from 'react';
import Link from 'next/link';
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
	Shield,
	Lock,
} from 'lucide-react';
import { MobileLink } from './MobileLink';
import styles from './MobileNav.module.scss';
import { useState, useCallback } from 'react';
import { useAuth } from '@/store/useAuth';
import Image from 'next/image';
import { useNotifications } from '@/hooks/useNotifications';

interface MobileNavProps {
	isOpen: boolean;
	onClose: () => void;
	isAnimating?: boolean;
}

export function MobileNav({ isOpen, onClose, isAnimating }: MobileNavProps) {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const { user, logout } = useAuth();
	const { unreadCount, fetchUnreadCount, startPolling } = useNotifications();

	useEffect(() => {
		fetchUnreadCount();

		const cleanup = startPolling(30000);

		return cleanup;
	}, [fetchUnreadCount, startPolling]);

	const hasUnreadMessages = 2;

	const handleLogout = async () => {
		if (isLoggingOut) return;

		setIsLoggingOut(true);
		try {
			await logout();
			onClose();
		} catch (error) {
			console.error('Błąd podczas wylogowania:', error);
			setIsLoggingOut(false);
		}
	};

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			onClose();
		},
		[onClose]
	);

	if (!isOpen) return null;

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
								onClick={onClose}
							>
								<PlusCircle size={20} />
								Dodaj ogłoszenie
							</Link>
						</div>

						<div className={styles.section}>
							<p>Przeglądaj</p>
							<nav>
								<MobileLink
									href="/home"
									icon={<Home size={20} />}
									onClick={onClose}
								>
									Home
								</MobileLink>
								<MobileLink
									href="/marketplace"
									icon={<LayoutGrid size={20} />}
									onClick={onClose}
								>
									Oferty
								</MobileLink>
							</nav>
						</div>

						<div className={styles.section}>
							<p>Społeczność</p>
							<nav>
								<MobileLink
									href="/chats"
									icon={<MessageSquare size={20} />}
									onClick={onClose}
									badge={hasUnreadMessages}
								>
									Wiadomości
								</MobileLink>
								<MobileLink
									href="/notifications"
									icon={<Bell size={20} />}
									onClick={onClose}
									badge={unreadCount}
								>
									Powiadomienia
								</MobileLink>
							</nav>
						</div>

						<div className={styles.section}>
							<p>Konto</p>
							<nav>
								<MobileLink
									href="/user"
									icon={
										<Shield
											size={20}
											className={
												user?.role === 'admin' ? styles.adminIcon : ''
											}
										/>
									}
									onClick={onClose}
								>
									Twój Profil
									{user?.role === 'admin' && (
										<span className={styles.adminBadge}>Admin</span>
									)}
								</MobileLink>
								<MobileLink
									href="/orders"
									icon={<Package size={20} />}
									onClick={onClose}
								>
									Twoje Zamówienia
								</MobileLink>
								<MobileLink
									href="/settings"
									icon={<Settings size={20} />}
									onClick={onClose}
								>
									Ustawienia
								</MobileLink>

								{user?.role === 'admin' && (
									<div className={styles.adminLink}>
										<MobileLink
											href="/admin"
											icon={<Lock size={20} />}
											onClick={onClose}
										>
											Panel Administratora
										</MobileLink>
									</div>
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
								) : user?.avatar ? (
									<Image
										src={user.avatar}
										alt={user.name || 'User'}
										fill
										sizes="64px"
										style={{ objectFit: 'cover' }}
									/>
								) : (
									<span className={styles.avatarFallback}>
										{user?.name?.charAt(0).toUpperCase() || 'U'}
									</span>
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
