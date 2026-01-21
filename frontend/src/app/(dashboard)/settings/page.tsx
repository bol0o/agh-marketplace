'use client';

import { useState, useEffect, useCallback } from 'react';
import { SettingsHeader, SettingsTab } from '@/components/settings/SettingsHeader';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { AddressForm } from '@/components/settings/AddressForm';
import { NotificationsForm } from '@/components/settings/NotificationsForm';
import { Loader, AlertCircle } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/store/useAuth';
import { useUIStore } from '@/store/uiStore';
import styles from './settings.module.scss';

export default function SettingsPage() {
	const { user: currentUser } = useAuth();
	const { user, loading, error: userError, refresh } = useUser();
	const {
		updateProfile,
		updateAddress,
		updateSettings,
		isUpdating,
		error: settingsError,
		success,
		clearMessages,
	} = useUserSettings(user);

	const addToast = useUIStore((state) => state.addToast);

	const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
	const [shouldRefresh, setShouldRefresh] = useState(false);

	useEffect(() => {
		if (success) {
			addToast(success, 'success');
			setShouldRefresh(true);
			clearMessages();
		}

		if (settingsError) {
			addToast(settingsError, 'error');
			clearMessages();
		}
	}, [success, settingsError, addToast, clearMessages]);

	useEffect(() => {
		if (shouldRefresh && !isUpdating) {
			refresh();
			setShouldRefresh(false);
		}
	}, [shouldRefresh, isUpdating, refresh]);

	const handleTabChange = useCallback((tab: SettingsTab) => {
		setActiveTab(tab);
	}, []);

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<Loader className={styles.spinner} size={48} />
				<p>Ładowanie ustawień...</p>
			</div>
		);
	}

	if (userError || !user) {
		return (
			<div className={styles.errorContainer}>
				<AlertCircle className={styles.errorIcon} size={48} />
				<h2>Wystąpił błąd</h2>
				<p>{userError || 'Nie udało się załadować danych użytkownika'}</p>
			</div>
		);
	}

	if (!currentUser) {
		return (
			<div className={styles.errorContainer}>
				<AlertCircle className={styles.errorIcon} size={48} />
				<h2>Dostęp zabroniony</h2>
				<p>Musisz być zalogowany, aby uzyskać dostęp do ustawień.</p>
			</div>
		);
	}

	if (currentUser.id !== user.id) {
		return (
			<div className={styles.errorContainer}>
				<AlertCircle className={styles.errorIcon} size={48} />
				<h2>Dostęp zabroniony</h2>
				<p>Możesz edytować tylko swój własny profil.</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<SettingsHeader activeTab={activeTab} onTabChange={handleTabChange} />

			{activeTab === 'profile' && (
				<ProfileForm user={user} onSubmit={updateProfile} isSubmitting={isUpdating} />
			)}

			{activeTab === 'address' && (
				<AddressForm user={user} onSubmit={updateAddress} isSubmitting={isUpdating} />
			)}

			{activeTab === 'notifications' && (
				<NotificationsForm
					user={user}
					onSubmit={updateSettings}
					isSubmitting={isUpdating}
				/>
			)}
		</div>
	);
}
