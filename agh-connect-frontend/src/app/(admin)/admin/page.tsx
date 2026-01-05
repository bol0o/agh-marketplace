'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminPage.module.scss';
import {
	ShieldAlert,
	Users,
	Package,
	ShoppingBag,
	Search,
	LogOut,
	MoreVertical,
	Ban,
	CheckCircle2,
	ShieldCheck,
	Flag,
} from 'lucide-react';

// --- MOCK DATA ---
const STATS = {
	users: 142,
	products: 890,
	orders: 56,
	reports: 5, // Czerwony alert
};

const INITIAL_USERS = [
	{
		id: '1',
		firstName: 'Jan',
		lastName: 'Kowalski',
		email: 'jan@student.agh.edu.pl',
		role: 'STUDENT',
		status: 'active',
		joinedAt: '12.10.2023',
		avatarColor: '#dc2626',
	},
	{
		id: '2',
		firstName: 'Anna',
		lastName: 'Nowak',
		email: 'anna@student.agh.edu.pl',
		role: 'STUDENT',
		status: 'pending',
		joinedAt: 'Wczoraj',
		avatarColor: '#4f46e5',
	},
	{
		id: '3',
		firstName: 'Piotr',
		lastName: 'Fake',
		email: 'scam@gmail.com',
		role: 'STUDENT',
		status: 'banned',
		joinedAt: '01.11.2023',
		avatarColor: '#d97706',
	},
	{
		id: '4',
		firstName: 'Admin',
		lastName: 'Główny',
		email: 'admin@agh.edu.pl',
		role: 'ADMIN',
		status: 'active',
		joinedAt: '20.09.2021',
		avatarColor: '#059669',
	},
];

export default function AdminDashboard() {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [users] = useState(INITIAL_USERS);

	const filteredUsers = users.filter(
		(u) =>
			u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className={styles.container}>
			{/* HEADER */}
			<header className={styles.header}>
				<div className={styles.title}>
					<h1>
						<ShieldAlert size={32} /> AGH Admin Panel
					</h1>
					<p>Witaj w centrum dowodzenia.</p>
				</div>

				{/* PRZYCISK POWROTU DO SKLEPU */}
				<button className={styles.btnBack} onClick={() => router.push('/home')}>
					<LogOut size={18} />
					Wróć do sklepu
				</button>
			</header>

			{/* STATYSTYKI */}
			<section className={styles.statsGrid}>
				<StatCard label="Użytkownicy" value={STATS.users} icon={<Users size={20} />} />
				<StatCard label="Oferty" value={STATS.products} icon={<Package size={20} />} />
				<StatCard
					label="Zamówienia"
					value={STATS.orders}
					icon={<ShoppingBag size={20} />}
				/>
				{/* Karta ze zgłoszeniami jest aktywna (czerwona) */}
				<StatCard
					label="Zgłoszenia"
					value={STATS.reports}
					icon={<Flag size={20} />}
					active={true}
				/>
			</section>

			{/* TABELA UŻYTKOWNIKÓW */}
			<section className={styles.tableSection}>
				<div className={styles.toolbar}>
					<h2>Baza Użytkowników</h2>
					<div className={styles.searchBox}>
						<Search size={18} />
						<input
							type="text"
							placeholder="Szukaj studenta..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead>
							<tr>
								<th>Użytkownik</th>
								<th>Status</th>
								<th>Rola</th>
								<th>Data Dołączenia</th>
								<th style={{ textAlign: 'right' }}>Akcje</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user.id}>
									<td>
										<div className={styles.userCell}>
											<div
												className={styles.avatar}
												style={{ background: user.avatarColor }}
											>
												{user.firstName[0]}
												{user.lastName[0]}
											</div>
											<div className={styles.info}>
												<span className={styles.name}>
													{user.firstName} {user.lastName}
												</span>
												<span className={styles.email}>{user.email}</span>
											</div>
										</div>
									</td>
									<td>
										<span
											className={`${styles.statusBadge} ${styles[user.status]}`}
										>
											{user.status === 'active'
												? 'Aktywny'
												: user.status === 'pending'
													? 'Weryfikacja'
													: 'Zbanowany'}
										</span>
									</td>
									<td>
										<div
											className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.admin : ''}`}
										>
											{user.role === 'ADMIN' && <ShieldCheck size={14} />}
											{user.role}
										</div>
									</td>
									<td>{user.joinedAt}</td>
									<td>
										<div className={styles.actions}>
											<button title="Zbanuj" className={styles.danger}>
												<Ban size={18} />
											</button>
											<button title="Opcje">
												<MoreVertical size={18} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}

// Helper Component do Kart
function StatCard({ label, value, icon, active = false }: any) {
	return (
		<div className={styles.statCard}>
			<div className={styles.cardHeader}>
				<div className={`${styles.iconBox} ${active ? styles.active : ''}`}>{icon}</div>
			</div>
			<div className={styles.label}>{label}</div>
			<div className={styles.value} style={active ? { color: '#ef4444' } : {}}>
				{value}
			</div>
		</div>
	);
}
