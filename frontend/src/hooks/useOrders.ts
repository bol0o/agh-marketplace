import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from 'axios';
import { Order } from '@/types/order';
import api from '@/lib/axios';
import { useUIStore } from '@/store/uiStore';

export const useOrders = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const addToast = useUIStore((state) => state.addToast);

	const fetchOrders = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await api.get<Order[]>('/orders');
			setOrders(response.data);
		} catch (err: unknown) {
			console.error('Error fetching orders:', err);

			let message = 'Nie udało się pobrać zamówień';

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
	}, [addToast]);

	useEffect(() => {
		fetchOrders();
	}, [fetchOrders]);

	const cancelOrder = async (orderId: string) => {
		try {
			setLoading(true);
			await api.patch(`/orders/${orderId}/cancel`);

			setOrders((prev) =>
				prev.map((order) =>
					order.id === orderId ? { ...order, status: 'cancelled' } : order
				)
			);

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

	const getOrderStats = () => {
		const stats = {
			total: orders.length,
			pending: orders.filter((o) => o.status === 'pending').length,
			processing: orders.filter((o) => o.status === 'processing').length,
			shipped: orders.filter((o) => o.status === 'shipped').length,
			delivered: orders.filter((o) => o.status === 'delivered').length,
			cancelled: orders.filter((o) => o.status === 'cancelled').length,
			totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
		};

		return stats;
	};

	return {
		orders,
		loading,
		error,
		refresh: fetchOrders,
		cancelOrder,
		getOrderStats,
	};
};
