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
import styles from '@/styles/Header.module.scss';

export function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const pathname = usePathname();

	const isHomePage = pathname === '/';

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
					{/* LEWA STRONA */}
					<div className={styles.leftSection}>
						<button
							className={styles.hamburgerBtn}
							onClick={() => setIsMobileMenuOpen(true)}
						>
							<Menu size={24} />
						</button>

						<Link href="/" className={styles.logo}>
							<span>AGH Connect</span>
						</Link>
					</div>

					{/* ŚRODEK (Szukajka Desktop) */}
					<div className={styles.searchSection}>
						<div className={styles.searchWrapper}>
							{!isHomePage && (
								<div>
									<input type="text" placeholder="Szukaj notatek, sprzętu..." />
									<button>
										<Search size={18} />
									</button>
								</div>
							)}
						</div>
					</div>

					{/* PRAWA STRONA */}
					<div className={styles.rightSection}>
						{/* DESKTOP NAV */}
						<div className={styles.desktopNav}>
							<nav className={styles.navLinks}>
								<Link href="/home">Home</Link>
								<Link href="/marketplace">Oferty</Link>
							</nav>

							<div className={styles.desktopIcons}>
								<Link href="/chats" className={styles.iconBtn} title="Wiadomości">
									<MessageSquare size={20} />
								</Link>
								<Link
									href="/notifications"
									className={styles.iconBtn}
									title="Powiadomienia"
								>
									<Bell size={20} />
								</Link>
								<Link href="/cart" className={styles.iconBtn} title="Koszyk">
									<ShoppingCart size={20} />
								</Link>

								{/* DROPDOWN PROFILU */}
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
											<Link href="/profile">
												<User size={16} /> Twój Profil
											</Link>
											<Link href="/orders">
												<Package size={16} /> Zamówienia
											</Link>
											<Link href="/settings">
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

						{/* MOBILE ICONS */}
						<div className={styles.mobileActions}>
							{!isHomePage && (
								<button onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
									<Search size={22} />
								</button>
							)}
							<Link href="/cart">
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

				{/* MOBILE SEARCH (Rozwijane) */}
				{isMobileSearchOpen && (
					<div className={styles.mobileSearchBar}>
						<form onSubmit={(e) => e.preventDefault()} className={styles.relative}>
							<input type="text" placeholder="Wpisz czego szukasz..." autoFocus />
							<Search size={16} />
						</form>
					</div>
				)}
			</header>

			{/* MOBILE MENU (Drawer) */}
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
									href="/"
									icon={<Home size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Strona Główna
								</MobileLink>
								<MobileLink
									href="/products"
									icon={<LayoutGrid size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Oferty
								</MobileLink>
								<MobileLink
									href="/auctions"
									icon={<Gavel size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Aukcje
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
									href="/orders"
									icon={<Package size={20} />}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									Twoje Zamówienia
								</MobileLink>
								<MobileLink
									href="/settings"
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

// Komponent Pomocniczy (Mobile Link)
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
	return (
		<Link href={href} onClick={onClick} className={styles.mobileLink}>
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
