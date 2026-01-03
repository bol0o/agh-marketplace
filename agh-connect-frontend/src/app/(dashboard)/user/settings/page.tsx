'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { MOCK_USER } from '@/data/mockData';
import { useUIStore } from '@/store/uiStore';
import styles from './settings.module.scss';

const FACULTIES = [
	'Wydział Informatyki, Elektroniki i Telekomunikacji (WIEiT)',
	'Wydział Elektrotechniki, Automatyki, Informatyki i Inżynierii Biomedycznej (EAIiIB)',
	'Wydział Inżynierii Mechanicznej i Robotyki (IMiR)',
	'Wydział Fizyki i Informatyki Stosowanej (WFiIS)',
	'Inny',
];

export default function SettingsPage() {
	const [firstName, lastName] = MOCK_USER.name.split(' ');
	const [formData, setFormData] = useState({
		firstName: firstName || '',
		lastName: lastName || '',
		faculty: MOCK_USER.studentInfo?.faculty || FACULTIES[0],
		bio: 'Student 3 roku Informatyki. Sprzedaję notatki i stary sprzęt.',
	});

	const addToast = useUIStore((s) => s.addToast);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addToast('Profil publiczny został zaktualizowany', 'success');
	};

	const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();

	return (
		<main className={styles.card}>
			<div className={styles.cardHeader}>
				<h2>Profil Publiczny</h2>
				<p>To zobaczą inni użytkownicy na Twoich aukcjach.</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className={styles.avatarSection}>
					{MOCK_USER.avatar && !MOCK_USER.avatar.includes('ui-avatars') ? (
						<img
							src={MOCK_USER.avatar}
							alt=""
							style={{ width: 80, height: 80, borderRadius: '50%' }}
						/>
					) : (
						<div className={styles.avatarPlaceholder}>{initials}</div>
					)}
					<div>
						<button type="button" className={styles.changeBtn}>
							Zmień zdjęcie
						</button>
						<p className={styles.helperText}>Zalecane: 400×400px, Max 2MB</p>
					</div>
				</div>

				<div className={styles.formGrid}>
					<div className={styles.formGroup}>
						<label>Imię</label>
						<input
							type="text"
							value={formData.firstName}
							onChange={(e) =>
								setFormData({ ...formData, firstName: e.target.value })
							}
						/>
					</div>
					<div className={styles.formGroup}>
						<label>Nazwisko</label>
						<input
							type="text"
							value={formData.lastName}
							onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
						/>
					</div>
					<div className={`${styles.formGroup} ${styles.fullWidth}`}>
						<label>Wydział</label>
						<select
							value={formData.faculty}
							onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
						>
							{FACULTIES.map((f) => (
								<option key={f} value={f}>
									{f}
								</option>
							))}
						</select>
					</div>
					<div className={`${styles.formGroup} ${styles.fullWidth}`}>
						<label>Bio (O mnie)</label>
						<textarea
							rows={4}
							value={formData.bio}
							onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
							placeholder="Napisz kilka słów o sobie..."
						/>
					</div>
				</div>

				<div
					style={{
						textAlign: 'right',
						borderTop: '1px solid #f3f4f6',
						paddingTop: '24px',
					}}
				>
					<button type="submit" className={styles.submitBtn}>
						<Save size={18} />
						Zapisz zmiany
					</button>
				</div>
			</form>
		</main>
	);
}
