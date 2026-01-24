// hooks/useReport.ts
import { useState } from 'react';
import { isAxiosError } from 'axios';
import api from '@/lib/axios';
import { useUIStore } from '@/store/uiStore';

interface CreateReportData {
	targetId: string;
	targetType: 'user' | 'product';
	reason: string;
	description: string;
}

export const useReport = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { addToast } = useUIStore();

	const createReport = async ({
		targetId,
		targetType,
		reason,
		description
	}: CreateReportData) => {
		if (!targetId || !targetType) {
			throw new Error('ID lub typ celu nie został określony');
		}

		try {
			setLoading(true);
			setError(null);

			const response = await api.post('/reports', {
				targetId,
				targetType,
				reason,
				description,
			});

			addToast('Zgłoszenie zostało wysłane pomyślnie', 'success');
			return response.data;
		} catch (err: unknown) {
			console.error('Error creating report:', err);

			let errorMessage = 'Nie udało się wysłać zgłoszenia';

			if (isAxiosError(err)) {
				errorMessage = err.response?.data?.message || errorMessage;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			setError(errorMessage);
			addToast(`Błąd: ${errorMessage}`, 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		createReport,
	};
};