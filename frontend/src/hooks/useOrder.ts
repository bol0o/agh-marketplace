import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { Order } from '@/types/order';
import api from '@/lib/axios';
import { useUIStore } from '@/store/uiStore';

interface UseOrderProps {
	id?: string;
}

export const useOrder = ({ id }: UseOrderProps) => {
	const [order, setOrder] = useState<Order | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const addToast = useUIStore((state) => state.addToast);

	const fetchOrder = useCallback(
		async (orderId: string) => {
			try {
				setLoading(true);
				setError(null);

				const response = await api.get<Order>(`/orders/${orderId}`);
				setOrder(response.data);
			} catch (err: unknown) {
				console.error('Error fetching order:', err);

				let message = 'Nie udało się pobrać zamówienia';

				if (isAxiosError(err)) {
					message = err.response?.data?.message || message;
				} else if (err instanceof Error) {
					message = err.message;
				}

				setError(message);
				addToast(message, 'error');
			} finally {
				setLoading(false);
			}
		},
		[addToast]
	);

	useEffect(() => {
		if (id) {
			fetchOrder(id);
		}
	}, [id, fetchOrder]);

	const cancelOrder = async () => {
		if (!order) return;

		try {
			setLoading(true);
			await api.patch(`/orders/${order.id}/cancel`);

			setOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
			addToast('Zamówienie zostało anulowane', 'success');
		} catch (err: unknown) {
			console.error('Error cancelling order:', err);

			let message = 'Nie udało się anulować zamówienia';

			if (isAxiosError(err)) {
				message = err.response?.data?.message || message;
			}

			addToast(message, 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const resendInvoice = async () => {
		if (!order) return;

		try {
			setLoading(true);
			await api.post(`/orders/${order.id}/resend-invoice`);

			addToast('Faktura została ponownie wysłana', 'success');
		} catch (err: unknown) {
			console.error('Error resending invoice:', err);

			let message = 'Nie udało się wysłać faktury';

			if (isAxiosError(err)) {
				message = err.response?.data?.message || message;
			}

			addToast(message, 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		order,
		loading,
		error,
		refresh: () => (order ? fetchOrder(order.id) : Promise.resolve()),
		cancelOrder,
		resendInvoice,
	};
};
