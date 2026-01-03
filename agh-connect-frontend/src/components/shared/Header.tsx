'use client';

import Link from 'next/link';
import {
	Search,
	Bell,
	MessageSquare,
	ShoppingCart,
	User,
	Menu,
	X,
	Settings,
	LogOut,
	ChevronRight,
	Package,
	Home,
	Gavel,
	LayoutGrid,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';

export function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === '/home') {
			return pathname === '/home';
		}

		return pathname.startsWith(path);
	};

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [isMobileMenuOpen]);

	return (
		<>
			<header className={styles.header}>
				<div className={styles.container}>
					<div className={styles.leftSection}>
						<button
							className={styles.hamburgerBtn}
							onClick={() => setIsMobileMenuOpen(true)}
						>
							<Menu size={24} />
						</button>

						<Link href={'/home'}>
							<div className={styles.logo}>
								<div className={styles.logoIcon}>A</div>
								<span>AGH Connect</span>
							</div>
						</Link>
					</div>

					<div className={styles.searchSection}>
						<div className={styles.searchWrapper}>
							<div>
								<input type="text" placeholder="Szukaj notatek, sprzętu..." />
								<button>
									<Search size={18} />
								</button>
							</div>
						</div>
					</div>

					<div className={styles.rightSection}>
						<div className={styles.desktopNav}>
							<nav className={styles.navLinks}>
								<Link
									href="/home"
									className={isActive('/home') ? styles.active : ''}
								>
									Home
								</Link>
								<Link
									href="/marketplace"
									className={isActive('/marketplace') ? styles.active : ''}
								>
									Oferty
								</Link>
							</nav>

							<div className={styles.desktopIcons}>
								<Link
									href="/chats"
									className={`${styles.iconBtn} ${isActive('/chats') ? styles.active : ''}`}
									title="Wiadomości"
								>
									<MessageSquare size={20} />
								</Link>

								<Link
									href="/notifications"
									className={`${styles.iconBtn} ${isActive('/notifications') ? styles.active : ''}`}
									title="Powiadomienia"
								>
									<Bell size={20} />
								</Link>

								<Link
									href="/cart"
									className={`${styles.iconBtn} ${isActive('/cart') ? styles.active : ''}`}
									title="Koszyk"
								>
									<ShoppingCart size={20} />
								</Link>

								<div className={styles.userDropdownWrapper}>
									<button className={styles.userBtn}>
										<div className={styles.avatarPlaceholder}>
											<User size={18} />
										</div>
										<span>Moje Konto</span>
									</button>

									<div className={styles.dropdownMenu}>
										<div className={styles.dropdownHeader}>
											<p>Jan Kowalski</p>
											<p>jan@student.agh.edu.pl</p>
										</div>
										<div className={styles.dropdownLinks}>
											<Link href="/user">
												<User size={16} /> Twój Profil
											</Link>

											<Link href="/user/orders">
												<Package size={16} /> Zamówienia
											</Link>

											<Link href="/user/settings">
												<Settings size={16} /> Ustawienia
											</Link>
										</div>
										<div className={styles.dropdownFooter}>
											<button>
												<LogOut size={16} /> Wyloguj
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className={styles.mobileActions}>
							<button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
								<Search size={22} />
							</button>

							<Link href="/cart" className={isActive('/cart') ? styles.active : ''}>
								<ShoppingCart size={22} />
							</Link>

							<Link href="/profile" className={styles.mobileAvatar}>
								<div>
									<User size={18} />
								</div>
							</Link>
						</div>
					</div>
				</div>

				{isMobileSearchOpen && (
					<div className={styles.mobileSearchBar}>
						<form onSubmit={(e) => e.preventDefault()} className={styles.relative}>
							<input type="text" placeholder="Wpisz czego szukasz..." autoFocus />
							<Search size={16} />
						</form>
					</div>
				)}
			</header>

			<MobileHeaderMenu
				isMobileMenuOpen={isMobileMenuOpen}
				setIsMobileMenuOpen={setIsMobileMenuOpen}
			/>
		</>
	);
}

function MobileHeaderMenu({
	isMobileMenuOpen,
	setIsMobileMenuOpen,
}: {
	isMobileMenuOpen: boolean;
	setIsMobileMenuOpen: (newOpenState: boolean) => void;
}) {
	return (
		<>
			<div
				className={`${styles.backdrop} ${isMobileMenuOpen ? styles.open : ''}`}
				onClick={() => setIsMobileMenuOpen(false)}
			/>

			<div className={`${styles.drawer} ${isMobileMenuOpen ? styles.open : ''}`}>
				<div className={styles.drawerContent}>
					<div className={styles.drawerHeader}>
						<span>AGH Connect</span>
						<button onClick={() => setIsMobileMenuOpen(false)}>
							<X size={24} />
						</button>
					</div>

					<div className={styles.drawerBody}>
						<div className={styles.section}>
							<p>Przeglądaj</p>
							<nav>
								<MobileLink
									href="/home"
									icon={<Home size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Home
								</MobileLink>

								<MobileLink
									href="/marketplace"
									icon={<LayoutGrid size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
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
									onClick={() => setIsMobileMenuOpen(false)}
									badge={2}
								>
									Wiadomości
								</MobileLink>

								<MobileLink
									href="/notifications"
									icon={<Bell size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
									badge={5}
								>
									Powiadomienia
								</MobileLink>
							</nav>
						</div>

						<div className={styles.section}>
							<p>Konto</p>
							<nav>
								<MobileLink
									href="/user/orders"
									icon={<Package size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Twoje Zamówienia
								</MobileLink>

								<MobileLink
									href="/user/settings"
									icon={<Settings size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Ustawienia
								</MobileLink>
							</nav>
						</div>
					</div>

					<div className={styles.drawerFooter}>
						<div className={styles.userInfo}>
							<div className={styles.avatar}>JK</div>
							<div className={styles.text}>
								<p>Jan Kowalski</p>
								<p>jan@student.agh.edu.pl</p>
							</div>
						</div>
						<button className={styles.logoutBtn}>
							<LogOut size={18} /> Wyloguj się
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

function MobileLink({
	href,
	icon,
	children,
	onClick,
	badge,
}: {
	href: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	onClick: () => void;
	badge?: number;
}) {
	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === '/' || path === '/home') {
			return pathname === '/' || pathname === '/home';
		}

		return pathname.startsWith(path);
	};

	return (
		<Link
			href={href}
			onClick={onClick}
			className={`${styles.mobileLink} ${isActive(href) ? styles.active : ''}`}
		>
			<div className={styles.left}>
				<span className={styles.icon}>{icon}</span>
				<span>{children}</span>
			</div>

			<div className={styles.right}>
				{badge && <span className={styles.badge}>{badge}</span>}
				<ChevronRight size={16} className={styles.chevron} />
			</div>
		</Link>
	);
}
