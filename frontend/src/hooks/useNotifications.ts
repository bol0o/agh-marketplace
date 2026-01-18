import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

interface NotificationState {
	unreadCount: number;
	lastFetched: string | null;
	isPolling: boolean;

	fetchUnreadCount: () => Promise<number>;
	startPolling: (interval?: number) => () => void;
	markAsRead: () => void;
	markAllAsRead: () => void;
	reset: () => void;
	setUnreadCount: (count: number) => void;
}

export const useNotifications = create<NotificationState>()(
	persist(
		(set, get) => ({
			unreadCount: 0,
			lastFetched: null,
			isPolling: false,

			fetchUnreadCount: async () => {
				try {
					const response = await api.get<{ count: number }>(
						'/notifications/unread-count'
					);
					console.log(response);
					const count = response.data.count || 0;

					set({
						unreadCount: count,
						lastFetched: new Date().toISOString(),
					});

					return count;
				} catch (error) {
					console.error('Error fetching unread count:', error);
					set({ unreadCount: 0 });
					return 0;
				}
			},

			startPolling: (interval = 30000) => {
				if (get().isPolling) return () => {};

				set({ isPolling: true });

				get().fetchUnreadCount();

				const pollInterval = setInterval(() => {
					get().fetchUnreadCount();
				}, interval);

				return () => {
					clearInterval(pollInterval);
					set({ isPolling: false });
				};
			},

			markAsRead: () => {
				const current = get().unreadCount;
				if (current > 0) {
					set({ unreadCount: current - 1 });
				}
			},

			markAllAsRead: () => {
				set({ unreadCount: 0 });
			},

			setUnreadCount: (count: number) => {
				set({ unreadCount: count });
			},

			reset: () => {
				set({ unreadCount: 0, lastFetched: null });
			},
		}),
		{
			name: 'notifications-storage',
			partialize: (state) => ({
				unreadCount: state.unreadCount,
				lastFetched: state.lastFetched,
			}),
		}
	)
);
