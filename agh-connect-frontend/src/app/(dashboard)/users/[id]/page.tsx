import { notFound } from 'next/navigation';
import { getUserById, getUserProducts } from '@/data/mockData';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { Calendar, Star, MapPin } from 'lucide-react';
import styles from './publicProfile.module.scss';
import { ContactButton } from '@/components/shared/ContactButton';

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
	const { id } = await params;

	// 1. Pobieramy dane użytkownika
	const user = getUserById(id);
	if (!user) notFound();

	// 2. Pobieramy jego oferty
	const userProducts = getUserProducts(id);

	return (
		<div className={styles.container}>
			{/* KARTA WIZYTÓWKI */}
			<div className={styles.profileCard}>
				<div className={styles.header}>
					<img src={user.avatar || ''} alt={user.name} className={styles.avatar} />
					<div className={styles.info}>
						<h1 className={styles.name}>{user.name}</h1>
						<div className={styles.badges}>
							<span className={styles.badge}>
								{user.role === 'student' ? 'Student' : 'Admin'}
							</span>
							{user.studentInfo && (
								<span className={styles.facultyBadge}>
									{user.studentInfo.faculty}
								</span>
							)}
						</div>
					</div>

					{/* Akcja kontaktu */}
					<ContactButton targetUserId={user.id} className={styles.contactBtn}>
						Napisz wiadomość
					</ContactButton>
				</div>

				<div className={styles.statsRow}>
					<div className={styles.stat}>
						<Star size={18} className={styles.starIcon} />
						<span>
							<strong>{user.rating?.toFixed(1) || 'N/A'}</strong> (
							{user.ratingCount || 0} opinii)
						</span>
					</div>
					<div className={styles.stat}>
						<Calendar size={18} className={styles.icon} />
						<span>Dołączył: {new Date(user.joinedAt).toLocaleDateString()}</span>
					</div>
					<div className={styles.stat}>
						<MapPin size={18} className={styles.icon} />
						<span>Kraków, AGH</span>
					</div>
				</div>
			</div>

			{/* SEKCJA OFERT */}
			<div className={styles.listingsSection}>
				<h2>Ogłoszenia użytkownika ({userProducts.length})</h2>

				{userProducts.length > 0 ? (
					<div className={styles.grid}>
						{userProducts.map((p) => (
							<ProductCard key={p.id} product={p} />
						))}
					</div>
				) : (
					<p className={styles.empty}>
						Ten użytkownik nie ma aktualnie żadnych ogłoszeń.
					</p>
				)}
			</div>
		</div>
	);
}
