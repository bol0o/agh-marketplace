'use client';

import Link from 'next/link';
import { MOCK_USER } from '@/data/mockData';
import { MapPin } from 'lucide-react';
import styles from './user.module.scss';
import { getUserProducts } from '@/data/mockData';
import { ProductCard } from '@/components/marketplace/ProductCard';

export default function ProfilePage() {
	const user = MOCK_USER;
	const myProducts = getUserProducts('u2');

	return (
		<div className={styles.wrapper}>
			{/* KARTA GŁÓWNA */}
			<div className={styles.card}>
				<div className={styles.profileHeader}>
					<img src={user.avatar} alt={user.name} className={styles.avatar} />
					<div className={styles.info}>
						<h2>{user.name}</h2>
						<p>{user.email}</p>
						{user.studentInfo && (
							<span className={styles.faculty}>
								{user.studentInfo.faculty}, Rok {user.studentInfo.year}
							</span>
						)}
					</div>
				</div>

				<div className={styles.statsGrid}>
					<div className={styles.statItem}>
						<span>{user.rating!.toFixed(1)}</span>
						<label>Twoja ocena</label>
					</div>
					<div className={styles.statItem}>
						<span>{user.soldItemsCount}</span>
						<label>Sprzedane</label>
					</div>
					<div className={styles.statItem}>
						<span>{user.listedProductsCount}</span>
						<label>Aktywne oferty</label>
					</div>
				</div>
			</div>

			{/* DANE ADRESOWE */}
			<div className={styles.card}>
				<h3 className={styles.sectionTitle}>
					<MapPin size={20} /> Adres do wysyłki
				</h3>
				{user.address ? (
					<div style={{ lineHeight: '1.6', color: '#4b5563' }}>
						<strong>
							{user.address.street} {user.address.buildingNumber}/
							{user.address.apartmentNumber}
						</strong>
						<br />
						{user.address.zipCode} {user.address.city}
						<br />
						Tel: {user.address.phone}
					</div>
				) : (
					<p style={{ color: '#9ca3af' }}>Nie ustawiono adresu.</p>
				)}
				<div style={{ marginTop: 16 }}>
					<Link
						href="/user/settings/address"
						style={{
							color: '#E1251B',
							fontWeight: 600,
							fontSize: '0.9rem',
							textDecoration: 'none',
						}}
					>
						Edytuj adres &rarr;
					</Link>
				</div>
			</div>

			<div className={styles.listingsSection}>
				<div className={styles.sectionHeader}>
					<h3>Twoje aktywne ogłoszenia ({myProducts.length})</h3>
					<Link href="/marketplace/create" className={styles.addBtn}>
						+ Dodaj nowe
					</Link>
				</div>

				{myProducts.length > 0 ? (
					<div className={styles.productsGrid}>
						{myProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				) : (
					<div className={styles.emptyState}>
						<p>Nie masz jeszcze żadnych aktywnych ogłoszeń.</p>
						<Link href="/marketplace/create">Wystaw pierwszy przedmiot</Link>
					</div>
				)}
			</div>
		</div>
	);
}
