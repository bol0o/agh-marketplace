import Link from 'next/link';
import { ProductCarousel } from '@/components/marketplace/ProductCarousel';
import { Product } from '@/types/marketplace';
import styles from './home.module.scss';

const now = new Date().toISOString();

const HOT_AUCTIONS: Product[] = [
	{
		id: '1',
		title: 'MacBook Pro M1 2020 - Stan Idealny',
		price: 3400,
		type: 'auction',
		category: 'elektronika',
		condition: 'used',
		image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000',
		location: 'Kraków, Kawiory',
		stock: 1,
		views: 120,
		createdAt: now,
		// Nowe wymagane pole: Sprzedawca
		seller: {
			id: 'u1',
			name: 'Krzysztof Elektronik',
			avatar: 'https://ui-avatars.com/api/?name=K+E&background=random',
			rating: 4.9,
		},
	},
	{
		id: '2',
		title: 'Kalkulator naukowy Casio FX-991EX',
		price: 45,
		type: 'auction',
		category: 'akcesoria',
		condition: 'used',
		image: 'https://images.unsplash.com/photo-1587145820266-a5951eebebb1?auto=format&fit=crop&q=80&w=1000',
		location: 'MS AGH',
		stock: 1,
		views: 45,
		createdAt: now,
		seller: {
			id: 'u2',
			name: 'Anna Studentka',
			rating: 5.0,
		},
	},
	{
		id: '3',
		title: 'Notatki z Analizy Matematycznej 1 (Wydział IET)',
		price: 15,
		type: 'auction',
		category: 'notatki',
		condition: 'used',
		image: 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?auto=format&fit=crop&q=80&w=1000',
		location: 'D-17',
		stock: 1,
		views: 200,
		createdAt: now,
		seller: {
			id: 'u3',
			name: 'Marek Z.',
			rating: 4.2,
		},
	},
	{
		id: '4',
		title: 'Monitor Dell 24 cale IPS',
		price: 210,
		type: 'auction',
		category: 'elektronika',
		condition: 'used',
		image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000',
		location: 'Miasteczko Studenckie',
		stock: 1,
		views: 80,
		createdAt: now,
		seller: {
			id: 'u4',
			name: 'Piotr W.',
			rating: 4.8,
		},
	},
];

const NEW_OFFERS: Product[] = [
	{
		id: '5',
		title: 'Podręcznik do Fizyki Halliday Resnick',
		price: 80,
		type: 'buy_now',
		category: 'ksiazki',
		condition: 'used',
		image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
		location: 'Biblioteka Główna',
		stock: 1,
		views: 12,
		createdAt: now,
		seller: {
			id: 'u5',
			name: 'Kasia N.',
			rating: 5.0,
		},
	},
	{
		id: '6',
		title: 'Wynajem miejsca w pokoju DS1 Alfa',
		price: 600,
		type: 'buy_now',
		category: 'inne', // lub np. mieszkania
		condition: 'used',
		image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
		location: 'DS1 Alfa',
		stock: 1,
		views: 500,
		createdAt: now,
		seller: {
			id: 'u6',
			name: 'Samorząd',
			rating: 4.5,
		},
	},
	{
		id: '7',
		title: 'Rower miejski Kross, po serwisie',
		price: 450,
		type: 'buy_now',
		category: 'sport', // lub akcesoria
		condition: 'used',
		image: 'https://images.unsplash.com/photo-1485965120184-e224f723d621?auto=format&fit=crop&q=80&w=1000',
		location: 'Biprostal',
		stock: 1,
		views: 30,
		createdAt: now,
		seller: {
			id: 'u7',
			name: 'Tomek Rowerzysta',
			rating: 4.7,
		},
	},
	{
		id: '8',
		title: 'Korepetycje z Javy i Springa',
		price: 50,
		type: 'buy_now',
		category: 'uslugi', // lub inne
		condition: 'new',
		image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=1000',
		location: 'Online / C-2',
		stock: 10,
		views: 150,
		createdAt: now,
		seller: {
			id: 'u8',
			name: 'Senior Dev',
			rating: 5.0,
		},
	},
];

export default function HomePage() {
	return (
		<div>
			<section className={styles.hero}>
				<h1>Cześć, Jan! 👋</h1>
				<p>Sprawdź co nowego na kampusie...</p>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2>🔥 Gorące licytacje</h2>
					<Link href="/marketplace?type=auction">Zobacz wszystkie &rarr;</Link>
				</div>

				<ProductCarousel products={HOT_AUCTIONS} />
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2>✨ Świeżo wystawione</h2>
					<Link href="/marketplace?type=buy_now">Przeglądaj oferty &rarr;</Link>
				</div>

				<ProductCarousel products={NEW_OFFERS} />
			</section>
		</div>
	);
}
