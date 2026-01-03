'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { MOCK_USER } from '@/data/mockData';
import { useUIStore } from '@/store/uiStore';
import styles from '../settings.module.scss';

export default function AddressSettingsPage() {
	const [formData, setFormData] = useState({
		street: MOCK_USER.address?.street || '',
		buildingNumber: MOCK_USER.address?.buildingNumber || '',
		apartmentNumber: MOCK_USER.address?.apartmentNumber || '',
		city: MOCK_USER.address?.city || '',
		zipCode: MOCK_USER.address?.zipCode || '',
		phone: MOCK_USER.address?.phone || '',
	});

	const addToast = useUIStore((s) => s.addToast);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Zapisano adres:', formData);
		addToast('Adres został zaktualizowany', 'success');
	};

	return (
		<main className={styles.card}>
			<div className={styles.cardHeader}>
				<h2>Adres do wysyłki</h2>
				<p>Te dane będą automatycznie uzupełniane przy składaniu zamówień.</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div className={styles.formGrid}>
					<div className={`${styles.formGroup} ${styles.fullWidth}`}>
						<label>Ulica</label>
						<input
							type="text"
							value={formData.street}
							onChange={(e) => setFormData({ ...formData, street: e.target.value })}
							placeholder="np. Czarnowiejska"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Numer budynku</label>
						<input
							type="text"
							value={formData.buildingNumber}
							onChange={(e) =>
								setFormData({ ...formData, buildingNumber: e.target.value })
							}
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Numer lokalu (opcjonalnie)</label>
						<input
							type="text"
							value={formData.apartmentNumber}
							onChange={(e) =>
								setFormData({
									...formData,
									apartmentNumber: e.target.value,
								})
							}
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Kod pocztowy</label>
						<input
							type="text"
							value={formData.zipCode}
							onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
							placeholder="00-000"
						/>
					</div>

					<div className={styles.formGroup}>
						<label>Miasto</label>
						<input
							type="text"
							value={formData.city}
							onChange={(e) => setFormData({ ...formData, city: e.target.value })}
						/>
					</div>

					<div className={`${styles.formGroup} ${styles.fullWidth}`}>
						<label>Numer telefonu</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
							placeholder="+48 000 000 000"
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
