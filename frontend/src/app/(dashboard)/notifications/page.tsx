'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	AlertCircle,
	Shield,
	UserPlus,
	Package,
	TrendingUp,
	ShoppingCart,
	MessageSquare,
} from 'lucide-react';
import api from '@/lib/axios';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationHeader } from '@/components/notifications/NotificationHeader';
import { NotificationList } from '@/components/notifications/NotificationList';

import styles from './notifications.module.scss';

interface Notification {
	id: string;
	type: 'SYSTEM' | 'FOLLOW' | 'OFFER' | 'BID' | 'ORDER' | 'MESSAGE';
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	link: string | null;
}

const NOTIFICATION_TYPES = {
	SYSTEM: {
		label: 'Systemowe',
		icon: <Shield size={16} />,
		color: '#6b7280',
		bgColor: '#f3f4f6',
	},
	FOLLOW: {
		label: 'Obserwacje',
		icon: <UserPlus size={16} />,
		color: '#10b981',
		bgColor: '#d1fae5',
	},
	OFFER: {
		label: 'Oferty',
		icon: <Package size={16} />,
		color: '#3b82f6',
		bgColor: '#dbeafe',
	},
	BID: {
		label: 'Licytacje',
		icon: <TrendingUp size={16} />,
		color: '#8b5cf6',
		bgColor: '#ede9fe',
	},
	ORDER: {
		label: 'Zamówienia',
		icon: <ShoppingCart size={16} />,
		color: '#f59e0b',
		bgColor: '#fef3c7',
	},
	MESSAGE: {
		label: 'Wiadomości',
		icon: <MessageSquare size={16} />,
		color: '#ec4899',
		bgColor: '#fce7f3',
	},
};

export default function NotificationsPage() {
	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';

	const {
		unreadCount: storeUnreadCount,
		fetchUnreadCount: fetchStoreCount,
		markAsRead: markStoreAsRead,
		markAllAsRead: markAllStoreAsRead,
		setUnreadCount,
	} = useNotifications();

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedType, setSelectedType] = useState<string>('ALL');
	const [showOnlyUnread, setShowOnlyUnread] = useState(false);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [markingAll, setMarkingAll] = useState(false);
	const [deletingAll, setDeletingAll] = useState(false);

	useEffect(() => {
		fetchNotifications();
		fetchStoreCount();
	}, [page, selectedType, showOnlyUnread]);

	const fetchNotifications = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await api.get(`/notifications`);

			if (Array.isArray(response.data)) {
				setNotifications(response.data);
				setTotalPages(1);
				setTotalCount(response.data.length);

				const localUnreadCount = response.data.filter((n) => !n.isRead).length;
				if (localUnreadCount !== storeUnreadCount) {
					setUnreadCount(localUnreadCount);
				}
			} else if (response.data.notifications) {
				setNotifications(response.data.notifications);
				setTotalPages(response.data.totalPages || 1);
				setTotalCount(response.data.total || response.data.notifications.length);
			} else {
				setNotifications([]);
			}
		} catch (err: any) {
			console.error('Error fetching notifications:', err);
			setError('Nie udało się pobrać powiadomień');
			setNotifications([]);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsRead = async (id: string) => {
		try {
			await api.patch(`/notifications/${id}/read`);

			setNotifications((prev) =>
				Array.isArray(prev)
					? prev.map((notification) =>
							notification.id === id
								? { ...notification, isRead: true }
								: notification
						)
					: []
			);

			markStoreAsRead();
		} catch (err) {
			console.error('Error marking as read:', err);
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			setMarkingAll(true);
			await api.patch('/notifications/mark-all-read');

			setNotifications((prev) =>
				Array.isArray(prev)
					? prev.map((notification) => ({ ...notification, isRead: true }))
					: []
			);

			markAllStoreAsRead();
		} catch (err) {
			console.error('Error marking all as read:', err);
		} finally {
			setMarkingAll(false);
		}
	};

	const handleDeleteAllRead = async () => {
		if (!confirm('Czy na pewno chcesz usunąć wszystkie przeczytane powiadomienia?')) {
			return;
		}

		try {
			setDeletingAll(true);

			const readNotifications = Array.isArray(notifications)
				? notifications.filter((n) => n.isRead)
				: [];

			for (const notification of readNotifications) {
				try {
					await api.delete(`/notifications/${notification.id}`);
				} catch (deleteErr) {
					console.error(`Error deleting notification ${notification.id}:`, deleteErr);
				}
			}

			await fetchNotifications();
			await fetchStoreCount();
		} catch (err) {
			console.error('Error deleting read notifications:', err);
		} finally {
			setDeletingAll(false);
		}
	};

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString);
			if (isNaN(date.getTime())) return dateString;

			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const diffMins = Math.floor(diffMs / 60000);
			const diffHours = Math.floor(diffMs / 3600000);
			const diffDays = Math.floor(diffMs / 86400000);

			if (diffMins < 1) {
				return 'przed chwilą';
			} else if (diffMins < 60) {
				return `${diffMins} min temu`;
			} else if (diffHours < 24) {
				return `${diffHours} godz. temu`;
			} else if (diffDays < 7) {
				return `${diffDays} dni temu`;
			} else {
				return date.toLocaleDateString('pl-PL', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				});
			}
		} catch (err) {
			return dateString;
		}
	};

	const getNotificationType = (type: string) => {
		return (
			NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES] || NOTIFICATION_TYPES.SYSTEM
		);
	};

	const hasReadNotifications =
		Array.isArray(notifications) && notifications.some((n) => n.isRead);

	if (loading && notifications.length === 0) {
		return (
			<div className={styles.loadingWrapper}>
				<div className={styles.spinner}></div>
				<p>Ładowanie powiadomień...</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<NotificationHeader
				unreadCount={storeUnreadCount}
				totalCount={totalCount}
				markingAll={markingAll}
				deletingAll={deletingAll}
				hasReadNotifications={hasReadNotifications}
				selectedType={selectedType}
				showOnlyUnread={showOnlyUnread}
				notificationTypes={NOTIFICATION_TYPES}
				onMarkAllAsRead={handleMarkAllAsRead}
				onDeleteAllRead={handleDeleteAllRead}
				onTypeChange={setSelectedType}
				onToggleUnread={() => setShowOnlyUnread(!showOnlyUnread)}
			/>

			{error && (
				<div className={styles.errorAlert}>
					<AlertCircle size={20} />
					<span>{error}</span>
					<button onClick={fetchNotifications}>Spróbuj ponownie</button>
				</div>
			)}

			<div className={styles.mainContent}>
				<NotificationList
					notifications={notifications}
					totalPages={totalPages}
					showOnlyUnread={showOnlyUnread}
					selectedType={selectedType}
					notificationTypes={NOTIFICATION_TYPES}
					getNotificationType={getNotificationType}
					formatDate={formatDate}
					onMarkAsRead={handleMarkAsRead}
				/>
			</div>
		</div>
	);
}
