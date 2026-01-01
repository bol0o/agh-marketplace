import Link from 'next/link';
import { ProductCarousel } from '@/components/marketplace/ProductCarousel';
import { Product } from '@/components/marketplace/ProductCard';
import styles from '@/styles/home.module.scss';

// MOCK DATA (Dane tymczasowe, póki nie ma backendu)
const HOT_AUCTIONS: Product[] = [
	{
		id: '1',
		title: 'MacBook Pro M1 2020 - Stan Idealny, gwarancja',
		price: 3400,
		type: 'auction',
		image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000',
	},
	{
		id: '2',
		title: 'Kalkulator naukowy Casio FX-991EX',
		price: 45,
		type: 'auction',
		image: 'https://images.unsplash.com/photo-1587145820266-a5951eebebb1?auto=format&fit=crop&q=80&w=1000',
	},
	{
		id: '3',
		title: 'Notatki z Analizy Matematycznej 1 (Wydział IET)',
		price: 15,
		type: 'auction',
		image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&q=80&w=1000',
	},
	{
		id: '4',
		title: 'Monitor Dell 24 cale IPS',
		price: 210,
		type: 'auction',
		image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
	},
];

const NEW_OFFERS: Product[] = [
	{
		id: '5',
		title: 'Podręcznik do Fizyki Halliday Resnick',
		price: 80,
		type: 'buy_now',
		image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
	},
	{
		id: '6',
		title: 'Wynajem miejsca w pokoju DS1 Alfa',
		price: 600,
		type: 'buy_now',
		image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
	},
	{
		id: '7',
		title: 'Rower miejski Kross, po serwisie',
		price: 450,
		type: 'buy_now',
		image: 'https://images.unsplash.com/photo-1485965120184-e224f723d621?auto=format&fit=crop&q=80&w=1000',
	},
	{
		id: '8',
		title: 'Korepetycje z Javy i Springa',
		price: 50,
		type: 'buy_now',
		image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000',
	},
];

export default function HomePage() {
	return (
		<div>
			{/* HERO SECTION (bez zmian) */}
			<section className={styles.hero}>
				<h1>Cześć, Jan! 👋</h1>
				<p>Sprawdź co nowego na kampusie...</p>
			</section>

			{/* 2. GORĄCE AUKCJE - KARUZELA */}
			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2>🔥 Gorące licytacje</h2>
					<Link href="/marketplace?type=auction">Zobacz wszystkie &rarr;</Link>
				</div>

				{/* Zamiast div.grid i mapowania, używamy karuzeli */}
				<ProductCarousel products={HOT_AUCTIONS} />
			</section>

			{/* 3. OSTATNIO DODANE - KARUZELA */}
			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2>✨ Świeżo wystawione</h2>
					<Link href="/marketplace?type=buy_now">Przeglądaj oferty &rarr;</Link>
				</div>

				{/* Używamy karuzeli ponownie */}
				<ProductCarousel products={NEW_OFFERS} />
			</section>
		</div>
	);
}
