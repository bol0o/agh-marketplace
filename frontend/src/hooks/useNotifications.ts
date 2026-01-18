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

export const useNotifications = create<NotificationState>()(
	persist(
		(set, get) => ({
			unreadCount: 0,
			lastFetched: null,
			isPolling: false,
			isFetching: false,

			fetchUnreadCount: async () => {
				// Zapobiegaj równoczesnym requestom
				if (get().isFetching) return get().unreadCount;

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

					console.log('Fetched unread count from API:', count); // Debug
					return count;
				} catch (error) {
					console.error('Error fetching unread count:', error);
					set({ unreadCount: 0, isFetching: false });
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
					console.log('Marked as read, new count:', current - 1); // Debug
				}
			},

			markAllAsRead: () => {
				set({ unreadCount: 0 });
				console.log('Marked all as read'); // Debug
			},

			setUnreadCount: (count: number) => {
				set({ unreadCount: count });
				console.log('Set unread count to:', count); // Debug
			},

			updateUnreadCount: (change: number) => {
				const current = get().unreadCount;
				const newCount = Math.max(0, current + change);
				set({ unreadCount: newCount });
				console.log('Updated unread count:', current, '->', newCount); // Debug
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
