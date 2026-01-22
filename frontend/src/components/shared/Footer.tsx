'use client';

import Link from 'next/link';
import styles from './Footer.module.scss';

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.topSection}>
					<div className={styles.brandColumn}>
						<div className={styles.logo}>
							<div className={styles.logoIcon}>A</div>
							<span className={styles.logoText}>AGH Connect</span>
						</div>
						<p className={styles.description}>
							Platforma stworzona przez studentów dla studentów. Bezpieczna wymiana
							wiedzy i przedmiotów na kampusie.
						</p>
					</div>

					<div className={styles.linksGrid}>
						<div className={styles.linkGroup}>
							<h3>Platforma</h3>
							<Link href="#">Giełda</Link>
							<Link href="#">Notatki</Link>
							<Link href="#">O nas</Link>
						</div>

						<div className={styles.linkGroup}>
							<h3>Wsparcie</h3>
							<Link href="#">FAQ</Link>
							<Link href="#">Kontakt</Link>
							<Link href="#">Zgłoś błąd</Link>
						</div>

						<div className={styles.linkGroup}>
							<h3>Prawne</h3>
							<Link href="#">Regulamin</Link>
							<Link href="#">Polityka Prywatności</Link>
							<Link href="#">Cookies</Link>
						</div>
					</div>
				</div>

				<div className={styles.bottomSection}>
					<p className={styles.copy}>
						&copy; {new Date().getFullYear()} AGH Connect. Paweł Bolek, Kamil
						Kaczmarczyk.
					</p>
					<div className={styles.legalLine}>Projekt studencki AGH</div>
				</div>
			</div>
		</footer>
	);
}
