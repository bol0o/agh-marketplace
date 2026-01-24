import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';

interface NotificationState {
	unreadCount: number;
	lastFetched: string | null;
	isPolling: boolean;
	isFetching: boolean;

	fetchUnreadCount: () => Promise<number>;
	startPolling: (interval?: number) => () => void;
	markAsRead: () => void;
	markAllAsRead: () => void;
	reset: () => void;
	setUnreadCount: (count: number) => void;
	updateUnreadCount: (change: number) => void;
}

let globalPollInterval: NodeJS.Timeout | null = null;

export const useNotifications = create<NotificationState>()(
	persist(
		(set, get) => ({
			unreadCount: 0,
			lastFetched: null,
			isPolling: false,
			isFetching: false,

			fetchUnreadCount: async () => {
				if (get().isFetching) return get().unreadCount;
				const now = new Date().getTime();
				const last = get().lastFetched ? new Date(get().lastFetched!).getTime() : 0;
				if (now - last < 5000) return get().unreadCount;

				try {
					set({ isFetching: true });
					const response = await api.get<{ count: number }>(
						'/notifications/unread-count'
					);
					const count = response.data.count || 0;

					set({
						unreadCount: count,
						lastFetched: new Date().toISOString(),
						isFetching: false,
					});

					return count;
				} catch (error) {
					set({ isFetching: false });
					console.error('Error fetching unread count:', error);
					return get().unreadCount;
				}
			},

			startPolling: (interval = 60000) => {
				if (globalPollInterval) return () => {};

				set({ isPolling: true });

				get().fetchUnreadCount();

				globalPollInterval = setInterval(() => {
					get().fetchUnreadCount();
				}, interval);

				return () => {
					if (globalPollInterval) {
						clearInterval(globalPollInterval);
						globalPollInterval = null;
						set({ isPolling: false });
					}
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

			updateUnreadCount: (change: number) => {
				const current = get().unreadCount;
				const newCount = Math.max(0, current + change);
				set({ unreadCount: newCount });
			},

			reset: () => {
				if (globalPollInterval) {
					clearInterval(globalPollInterval);
					globalPollInterval = null;
				}
				set({ unreadCount: 0, lastFetched: null, isPolling: false });
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
