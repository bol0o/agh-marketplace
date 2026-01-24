import Link from 'next/link';
import { ArrowRight, ShoppingBag, Gavel, ShieldCheck, Users, GraduationCap } from 'lucide-react';
import styles from './Home.module.scss';

export default function Home() {
	return (
		<div className={styles.container}>
			<nav className={styles.navbar}>
				<div className={styles.navContainer}>
					<div className={styles.logo}>
						<div className={styles.logoIcon}>A</div>
						<span className={styles.logoText}>AGH Connect</span>
					</div>
					<div className={styles.navLinks}>
						<Link href="/login" className={styles.linkLogin}>
							Zaloguj się
						</Link>
						<Link href="/register" className={styles.btnJoin}>
							Dołącz teraz
						</Link>
					</div>
				</div>
			</nav>

			<section className={styles.heroSection}>
				<div className={styles.content}>
					<h1 className={styles.headline}>
						Twój kampus.
						<br />
						<span className={styles.gradientText}>Twoje zasady.</span>
					</h1>

					<p className={styles.subheadline}>
						Kupuj notatki, licytuj sprzęt do akademika i wymieniaj się wiedzą w
						zamkniętej, społeczności AGH. Bez scamów, bez botów.
					</p>

					<div className={styles.ctaGroup}>
						<Link href="/register" className={styles.btnPrimary}>
							Zacznij tutaj <ArrowRight size={20} />
						</Link>
						<Link href="/login" className={styles.btnSecondary}>
							Mam już konto
						</Link>
					</div>

					<div className={styles.socialProof}>
						<div className={styles.proofItem}>
							<GraduationCap size={24} /> ZWERYFIKOWANI STUDENCI
						</div>
						<div className={styles.proofItem}>
							<ShieldCheck size={24} /> BEZPIECZNE TRANSAKCJE
						</div>
						<div className={styles.proofItem}>
							<Users size={24} /> SPOŁECZNOŚĆ KAMPUSU
						</div>
					</div>
				</div>
			</section>

			<section className={styles.featuresSection}>
				<div className={styles.gridContainer}>
					<div className={styles.featureCard}>
						<div className={`${styles.iconWrapper} ${styles.red}`}>
							<ShoppingBag size={24} />
						</div>
						<h3>Marketplace</h3>
						<p>
							Znajdź tanie podręczniki, notatki z konkretnych przedmiotów czy lodówkę
							do akademika. Odbiór osobisty na wydziale? Żaden problem.
						</p>
					</div>

					<div className={styles.featureCard}>
						<div className={`${styles.iconWrapper} ${styles.purple}`}>
							<Gavel size={24} />
						</div>
						<h3>Aukcje od 1 zł</h3>
						<p>
							Masz niepotrzebne gadżety? Wystaw je na licytację. Pozbądź się gratów i
							zarób sobie na browara.
						</p>
					</div>

					<div className={styles.featureCard}>
						<div className={`${styles.iconWrapper} ${styles.blue}`}>
							<ShieldCheck size={24} />
						</div>
						<h3>Tylko zweryfikowani</h3>
						<p>
							Koniec z anonimowymi oszustami z OLX. Tutaj każdy ma zweryfikowany
							status studenta. Wiesz, od kogo kupujesz.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
