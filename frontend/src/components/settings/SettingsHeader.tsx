'use client';

import { Settings, User, MapPin, Bell } from 'lucide-react';
import styles from './SettingsHeader.module.scss';

export type SettingsTab = 'profile' | 'address' | 'notifications';

interface SettingsHeaderProps {
	activeTab: SettingsTab;
	onTabChange: (tab: SettingsTab) => void;
}

export function SettingsHeader({ activeTab, onTabChange }: SettingsHeaderProps) {
	const tabs = [
		{ id: 'profile' as SettingsTab, label: 'Profil', icon: User },
		{ id: 'address' as SettingsTab, label: 'Adres', icon: MapPin },
		{ id: 'notifications' as SettingsTab, label: 'Powiadomienia', icon: Bell },
	];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.titleSection}>
					<Settings className={styles.settingsIcon} />
					<h1 className={styles.title}>Ustawienia konta</h1>
				</div>
				<p className={styles.subtitle}>Zarządzaj danymi swojego konta i preferencjami</p>
			</div>

			<div className={styles.tabs}>
				{tabs.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;

					return (
						<button
							key={tab.id}
							className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
							onClick={() => onTabChange(tab.id)}
							aria-current={isActive ? 'page' : undefined}
						>
							<Icon className={styles.tabIcon} />
							<span className={styles.tabLabel}>{tab.label}</span>
							{isActive && <div className={styles.activeIndicator} />}
						</button>
					);
				})}
			</div>
		</div>
	);
}
