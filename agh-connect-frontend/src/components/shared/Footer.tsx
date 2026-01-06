'use client';

import styles from './Footer.module.scss';

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerContainer}>
				<p className={styles.copy}>
					&copy; 2024 AGH Connect. Paweł Bolek, Kamil Kaczmarczyk
				</p>
			</div>
		</footer>
	);
}
