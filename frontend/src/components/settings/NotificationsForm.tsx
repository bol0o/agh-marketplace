'use client';

import { useState, useEffect } from 'react';
import { Loader, Mail, Bell, Megaphone } from 'lucide-react';
import { User as UserType, UpdateSettingsData } from '@/types/user';
import styles from './NotificationsForm.module.scss';

interface NotificationsFormProps {
	user: UserType;
	onSubmit: (data: UpdateSettingsData) => Promise<void>;
	isSubmitting: boolean;
}

export function NotificationsForm({ user, onSubmit, isSubmitting }: NotificationsFormProps) {
	const [formData, setFormData] = useState({
		email: user.settings.notifications.email,
		push: user.settings.notifications.push,
		marketing: user.settings.notifications.marketing,
	});

	useEffect(() => {
		const { email, push, marketing } = user.settings.notifications;

		if (
			formData.email !== email ||
			formData.push !== push ||
			formData.marketing !== marketing
		) {
			setFormData({
				email,
				push,
				marketing,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user.settings.notifications]);

	const handleToggle = (field: keyof typeof formData) => {
		setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const data: UpdateSettingsData = {
			email: formData.email,
			push: formData.push,
			marketing: formData.marketing,
		};

		await onSubmit(data);
	};

	const notificationSettings = [
		{
			id: 'email' as const,
			label: 'Powiadomienia email',
			description:
				'Otrzymuj powiadomienia o nowych wiadomościach, ofertach i aktualizacjach na swoją skrzynkę email.',
			icon: Mail,
			recommended: true,
		},
		{
			id: 'push' as const,
			label: 'Powiadomienia push',
			description:
				'Otrzymuj powiadomienia w przeglądarce lub aplikacji o ważnych wydarzeniach.',
			icon: Bell,
			recommended: true,
		},
		{
			id: 'marketing' as const,
			label: 'Powiadomienia marketingowe',
			description: 'Otrzymuj informacje o promocjach, nowościach i specjalnych ofertach.',
			icon: Megaphone,
			recommended: false,
		},
	];

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<h2 className={styles.sectionTitle}>Ustawienia powiadomień</h2>

			<p className={styles.description}>
				Wybierz, jakie rodzaje powiadomień chcesz otrzymywać. Możesz w każdej chwili zmienić
				te ustawienia.
			</p>

			<div className={styles.notificationsList}>
				{notificationSettings.map((setting) => {
					const Icon = setting.icon;
					const isEnabled = formData[setting.id];

					return (
						<div key={setting.id} className={styles.notificationItem}>
							<div className={styles.notificationHeader}>
								<div className={styles.notificationIcon}>
									<Icon className={styles.icon} />
								</div>
								<div className={styles.notificationInfo}>
									<div className={styles.notificationTitle}>
										<h3 className={styles.notificationLabel}>
											{setting.label}
										</h3>
										{setting.recommended && (
											<span className={styles.recommendedBadge}>
												Zalecane
											</span>
										)}
									</div>
									<p className={styles.notificationDescription}>
										{setting.description}
									</p>
								</div>
							</div>

							<button
								type="button"
								className={`${styles.toggleButton} ${isEnabled ? styles.toggleOn : ''}`}
								onClick={() => handleToggle(setting.id)}
								aria-label={`${isEnabled ? 'Wyłącz' : 'Włącz'} ${setting.label}`}
								aria-pressed={isEnabled}
								disabled={isSubmitting}
							>
								<div className={styles.toggleTrack}>
									<div className={styles.toggleThumb} />
								</div>
							</button>
						</div>
					);
				})}
			</div>

			<div className={styles.actions}>
				<button type="submit" className={styles.submitButton} disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<Loader className={styles.spinner} />
							Zapisywanie...
						</>
					) : (
						'Zapisz ustawienia'
					)}
				</button>
			</div>
		</form>
	);
}
