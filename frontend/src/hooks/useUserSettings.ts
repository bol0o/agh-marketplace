import { useState } from 'react';
import { isAxiosError } from 'axios';
import api from '@/lib/axios';
import { UpdateProfileData, UpdateAddressData, UpdateSettingsData, User } from '@/types/user';

interface UseUserSettingsOptions {
	onSuccess?: (message: string) => void;
	onError?: (message: string) => void;
}

export const useUserSettings = (user: User | null, options?: UseUserSettingsOptions) => {
	const [isUpdating, setIsUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const updateProfile = async (data: UpdateProfileData) => {
		if (!user) {
			const errorMsg = 'Nie jesteś zalogowany';
			setError(errorMsg);
			options?.onError?.(errorMsg);
			return null;
		}

		try {
			setIsUpdating(true);
			setError(null);
			setSuccess(null);

			const response = await api.patch('/users/me', data);

			const successMsg = 'Profil został zaktualizowany pomyślnie';
			setSuccess(successMsg);
			options?.onSuccess?.(successMsg);

			return response.data;
		} catch (err: unknown) {
			console.error('Error updating profile:', err);

			let errorMsg = 'Nie udało się zaktualizować profilu';

			if (isAxiosError(err)) {
				errorMsg = err.response?.data?.message || errorMsg;
			}

			setError(errorMsg);
			options?.onError?.(errorMsg);
			return null;
		} finally {
			setIsUpdating(false);
		}
	};

	const updateAddress = async (data: UpdateAddressData) => {
		if (!user) {
			const errorMsg = 'Nie jesteś zalogowany';
			setError(errorMsg);
			options?.onError?.(errorMsg);
			return null;
		}

		try {
			setIsUpdating(true);
			setError(null);
			setSuccess(null);

			const response = await api.patch('/users/me/address', data);

			const successMsg = 'Adres został zaktualizowany pomyślnie';
			setSuccess(successMsg);
			options?.onSuccess?.(successMsg);

			return response.data;
		} catch (err: unknown) {
			console.error('Error updating address:', err);

			let errorMsg = 'Nie udało się zaktualizować adresu';

			if (isAxiosError(err)) {
				errorMsg = err.response?.data?.message || errorMsg;
			}

			setError(errorMsg);
			options?.onError?.(errorMsg);
			return null;
		} finally {
			setIsUpdating(false);
		}
	};

	const updateSettings = async (data: UpdateSettingsData) => {
		if (!user) {
			const errorMsg = 'Nie jesteś zalogowany';
			setError(errorMsg);
			options?.onError?.(errorMsg);
			return null;
		}

		try {
			setIsUpdating(true);
			setError(null);
			setSuccess(null);

			await api.patch('/users/me/settings', data);

			const successMsg = 'Ustawienia powiadomień zostały zaktualizowane pomyślnie';
			setSuccess(successMsg);
			options?.onSuccess?.(successMsg);

			return {
				...user,
				settings: {
					...user.settings,
					...data,
				},
			};
		} catch (err: unknown) {
			console.error('Error updating settings:', err);

			let errorMsg = 'Nie udało się zaktualizować ustawień';

			if (isAxiosError(err)) {
				errorMsg = err.response?.data?.message || errorMsg;
			}

			setError(errorMsg);
			options?.onError?.(errorMsg);
			return null;
		} finally {
			setIsUpdating(false);
		}
	};

	const clearMessages = () => {
		setError(null);
		setSuccess(null);
	};

	return {
		updateProfile,
		updateAddress,
		updateSettings,
		isUpdating,
		error,
		success,
		clearMessages,
	};
};
