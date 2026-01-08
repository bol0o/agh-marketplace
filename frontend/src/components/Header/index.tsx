'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import Link from 'next/link';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { SearchBar } from './SearchBar';
import { MobileSearchBar } from './MobileSearchBar';
import styles from './Header.module.scss';

export function Header() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobileMenuAnimating, setIsMobileMenuAnimating] = useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
	const pathname = usePathname();

	const handleMobileMenuClose = () => {
		setIsMobileMenuAnimating(true);

		setTimeout(() => {
			setIsMobileMenuOpen(false);
			setIsMobileMenuAnimating(false);
		}, 300);
	};

	return (
		<>
			<header className={styles.header}>
				<div className={styles.container}>
					{/* Left Section */}
					<div className={styles.leftSection}>
						<button
							className={styles.hamburgerBtn}
							onClick={() => setIsMobileMenuOpen(true)}
							aria-label="Otwórz menu"
							aria-expanded={isMobileMenuOpen}
						>
							<Menu size={24} />
						</button>

						<Link href="/home" className={styles.logoLink}>
							<div className={styles.logo}>
								<div className={styles.logoIcon}>A</div>
								<span>AGH Connect</span>
							</div>
						</Link>
					</div>

					{/* Desktop Search */}
					<SearchBar />

					{/* Right Section */}
					<div className={styles.rightSection}>
						<DesktopNav pathname={pathname} />

						{/* Mobile Actions */}
						<div className={styles.mobileActions}>
							<button
								onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
								aria-label="Wyszukaj"
								aria-expanded={isMobileSearchOpen}
							>
								<Search size={22} />
							</button>

							<Link
								href="/cart"
								className={`${styles.mobileIcon} ${
									pathname.startsWith('/cart') ? styles.active : ''
								}`}
								aria-label="Koszyk"
							>
								<ShoppingCart size={22} />
							</Link>

							<Link
								href="/profile"
								className={styles.mobileAvatar}
								aria-label="Profil"
							>
								<div>
									<User size={18} />
								</div>
							</Link>
						</div>
					</div>
				</div>

				{/* Mobile Search Bar */}
				{isMobileSearchOpen && (
					<MobileSearchBar onClose={() => setIsMobileSearchOpen(false)} />
				)}
			</header>

			{/* Mobile Menu */}
			{(isMobileMenuOpen || isMobileMenuAnimating) && (
				<MobileNav
					isOpen={isMobileMenuOpen}
					isAnimating={isMobileMenuAnimating}
					onClose={handleMobileMenuClose}
				/>
			)}
		</>
	);
}
