'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { MOCK_USER } from '@/data/mockData';
import { useUIStore } from '@/store/uiStore';
import styles from '../settings.module.scss';

export default function NotificationsSettingsPage() {
	const [settings, setSettings] = useState({
		email: MOCK_USER.settings?.notifications.email ?? true,
		push: MOCK_USER.settings?.notifications.push ?? true,
		marketing: MOCK_USER.settings?.notifications.marketing ?? false,
	});

	const addToast = useUIStore((s) => s.addToast);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Zapisano powiadomienia:', settings);
		addToast('Ustawienia powiadomień zaktualizowane', 'success');
	};

	return (
		<main className={styles.card}>
			<div className={styles.cardHeader}>
				<h2>Preferencje Powiadomień</h2>
				<p>Zdecyduj, w jaki sposób mamy się z Tobą kontaktować.</p>
			</div>

			<form onSubmit={handleSubmit}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
					{/* EMAIL */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div>
							<h4
								style={{
									fontSize: '1rem',
									fontWeight: 600,
									marginBottom: '4px',
								}}
							>
								Powiadomienia Email
							</h4>
							<p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
								Otrzymuj wiadomości o statusie zamówień i nowych wiadomościach.
							</p>
						</div>
						<input
							type="checkbox"
							checked={settings.email}
							onChange={(e) => setSettings({ ...settings, email: e.target.checked })}
							style={{ width: 20, height: 20, accentColor: '#E1251B' }}
						/>
					</div>

					<hr style={{ border: 'none', borderTop: '1px solid #f3f4f6' }} />

					{/* PUSH */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div>
							<h4
								style={{
									fontSize: '1rem',
									fontWeight: 600,
									marginBottom: '4px',
								}}
							>
								Powiadomienia Push
							</h4>
							<p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
								Powiadomienia w przeglądarce i na telefonie o nowych ofertach.
							</p>
						</div>
						<input
							type="checkbox"
							checked={settings.push}
							onChange={(e) => setSettings({ ...settings, push: e.target.checked })}
							style={{ width: 20, height: 20, accentColor: '#E1251B' }}
						/>
					</div>

					<hr style={{ border: 'none', borderTop: '1px solid #f3f4f6' }} />

					{/* MARKETING */}
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<div>
							<h4
								style={{
									fontSize: '1rem',
									fontWeight: 600,
									marginBottom: '4px',
								}}
							>
								Marketing i Nowości
							</h4>
							<p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
								Informacje o promocjach i zmianach w serwisie AGH Connect.
							</p>
						</div>
						<input
							type="checkbox"
							checked={settings.marketing}
							onChange={(e) =>
								setSettings({ ...settings, marketing: e.target.checked })
							}
							style={{ width: 20, height: 20, accentColor: '#E1251B' }}
						/>
					</div>
				</div>

				<div
					style={{
						textAlign: 'right',
						borderTop: '1px solid #f3f4f6',
						paddingTop: '24px',
						marginTop: '32px',
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
