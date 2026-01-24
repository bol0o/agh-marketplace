'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, Package, Lock, Shield } from 'lucide-react';
import styles from './UserDropdown.module.scss';
import { useAuth } from '@/store/useAuth';
import { useUIStore } from '@/store/uiStore';
import Image from 'next/image';

export function UserDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const addToast = useUIStore((state) => state.addToast);

	const { user, logout } = useAuth();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const toggleDropdown = () => setIsOpen(!isOpen);
	const closeDropdown = () => setIsOpen(false);

	const handleLogout = async () => {
		if (isLoggingOut) return;

		setIsLoggingOut(true);
		try {
			await logout();
			closeDropdown();
		} catch (error) {
			console.error('Błąd podczas wylogowania:', error);
			addToast('Błąd podczas wylogowywania', 'error');
			setIsLoggingOut(false);
		}
	};

	return (
		<div className={styles.userDropdownWrapper} ref={dropdownRef}>
			<button
				className={`${styles.userBtn} ${isOpen ? styles.active : ''}`}
				onClick={toggleDropdown}
				aria-expanded={isOpen}
				aria-label="Moje konto"
			>
				 <div
                    className={styles.avatarPlaceholder}
                >
                    {user?.role === 'admin' ? (
                        <Shield size={20} />
                    ) : user?.avatar ? (
                        <Image
                            src={user.avatar}
                            alt={user.name || 'User'}
                            fill
                            sizes="64px"
                            style={{ objectFit: 'cover', borderRadius: 999 }}
                        />
                    ) : (
                        <span className={styles.avatarFallback}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    )}
                </div>

				<span>Moje Konto</span>
			</button>

			<div className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''}`}>
				<div className={styles.dropdownHeader}>
					<div className={styles.userInfo}>
						<p className={styles.userName}>
							{user?.name}
							{user?.role === 'admin' && (
								<span className={styles.adminBadge}>
									<Shield size={12} />
									Admin
								</span>
							)}
						</p>
						<p className={styles.userEmail}>{user?.email}</p>
					</div>
				</div>
				<div className={styles.dropdownLinks}>
					<Link href="/user" onClick={closeDropdown}>
						<User size={16} />
						Twój Profil
					</Link>

					<Link href="/orders" onClick={closeDropdown}>
						<Package size={16} />
						Zamówienia
					</Link>

					<Link href="/settings" onClick={closeDropdown}>
						<Settings size={16} />
						Ustawienia
					</Link>

					{user?.role === 'admin' && (
						<Link href="/admin" onClick={closeDropdown} className={styles.adminLink}>
							<Lock size={16} />
							Panel Administratora
						</Link>
					)}
				</div>
				<div className={styles.dropdownFooter}>
					<button
						onClick={handleLogout}
						disabled={isLoggingOut}
						className={isLoggingOut ? styles.loggingOut : ''}
					>
						{isLoggingOut ? (
							<>
								<div className={styles.spinner} />
								<span>Wylogowywanie...</span>
							</>
						) : (
							<>
								<LogOut size={16} />
								<span>Wyloguj</span>
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
