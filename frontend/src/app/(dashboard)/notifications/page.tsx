'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	AlertCircle,
	Shield,
	UserPlus,
	Package,
	TrendingUp,
	ShoppingCart,
	MessageSquare,
	XCircle,
	Loader,
} from 'lucide-react';
import { isAxiosError } from 'axios';
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

interface ApiResponse {
	pagination: {
		totalItems: number;
		totalPages: number;
		currentPage: number;
		itemsPerPage: number;
	};
	notifications: Notification[];
}

export default function NotificationsPage() {
	const searchParams = useSearchParams();
	const page = searchParams.get('page') || '1';
	const limit = searchParams.get('limit') || '6';

	const {
		unreadCount: storeUnreadCount,
		fetchUnreadCount: fetchStoreCount,
		markAsRead: markStoreAsRead,
		markAllAsRead: markAllStoreAsRead,
	} = useNotifications();

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedType, setSelectedType] = useState<string>('ALL');
	const [showOnlyUnread, setShowOnlyUnread] = useState(false);
	const [pagination, setPagination] = useState({
		totalItems: 0,
		totalPages: 1,
		currentPage: 1,
		itemsPerPage: 12,
	});
	const [markingAll, setMarkingAll] = useState(false);
	const [deletingAll, setDeletingAll] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const fetchNotifications = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const params = new URLSearchParams({
				page,
				limit,
			});

			if (selectedType !== 'ALL') {
				params.append('type', selectedType);
			}

			if (showOnlyUnread) {
				params.append('unread', 'true');
			}

			const response = await api.get<ApiResponse>(`/notifications?${params}`);
			const data = response.data;

			setNotifications(data.notifications);
			setPagination(data.pagination);

			if (selectedType === 'ALL' && !showOnlyUnread) {
				const localUnread = data.notifications.filter((n) => !n.isRead).length;

				if (Math.abs(localUnread - storeUnreadCount) > 5) {
					await fetchStoreCount();
				}
			}
		} catch (err: unknown) {
			console.error('Error fetching notifications:', err);

			if (isAxiosError(err)) {
				setError('Nie udało się pobrać powiadomień');
			} else {
				setError('Wystąpił nieoczekiwany błąd');
			}

			setNotifications([]);
		} finally {
			setLoading(false);
		}
	}, [page, limit, selectedType, showOnlyUnread, storeUnreadCount, fetchStoreCount]);

	useEffect(() => {
		fetchNotifications();
		fetchStoreCount();
	}, [fetchNotifications, fetchStoreCount]);

	const handleMarkAsRead = async (id: string) => {
		try {
			await api.patch(`/notifications/${id}/read`);

			setNotifications((prev) =>
				prev.map((notification) =>
					notification.id === id ? { ...notification, isRead: true } : notification
				)
			);

			markStoreAsRead();
		} catch (err: unknown) {
			console.error('Error marking as read:', err);
		}
	};

	const handleMarkAllAsRead = async () => {
		try {
			setMarkingAll(true);
			await api.patch('/notifications/mark-all-read');

			setNotifications((prev) =>
				prev.map((notification) => ({ ...notification, isRead: true }))
			);

			markAllStoreAsRead();

			await fetchNotifications();
		} catch (err: unknown) {
			console.error('Error marking all as read:', err);
		} finally {
			setMarkingAll(false);
		}
	};

	const handleDeleteAllRead = () => {
		setShowDeleteConfirm(true);
	};

	const confirmDeleteAllRead = async () => {
		try {
			setDeletingAll(true);

			const readNotifications = notifications.filter((n) => n.isRead);

			for (const notification of readNotifications) {
				try {
					await api.delete(`/notifications/${notification.id}`);
				} catch {
					console.error(`Error deleting notification ${notification.id}`);
				}
			}

			await fetchNotifications();
			await fetchStoreCount();
		} catch (err: unknown) {
			console.error('Error deleting read notifications:', err);
		} finally {
			setDeletingAll(false);
			setShowDeleteConfirm(false);
		}
	};

	const cancelDeleteAllRead = () => {
		setShowDeleteConfirm(false);
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
		} catch {
			return dateString;
		}
	};

	const getNotificationType = (type: string) => {
		return (
			NOTIFICATION_TYPES[type as keyof typeof NOTIFICATION_TYPES] || NOTIFICATION_TYPES.SYSTEM
		);
	};

	const hasReadNotifications = notifications.some((n) => n.isRead);

	if (loading && notifications.length === 0) {
		return (
			<div className={styles.loadingWrapper}>
				<div className={styles.spinner}></div>
				<p>Ładowanie powiadomień...</p>
			</div>
		);
	}

	return (
		<>
			<div className={styles.container}>
				<NotificationHeader
					unreadCount={storeUnreadCount}
					totalCount={pagination.totalItems}
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
						totalPages={pagination.totalPages}
						showOnlyUnread={showOnlyUnread}
						selectedType={selectedType}
						notificationTypes={NOTIFICATION_TYPES}
						getNotificationType={getNotificationType}
						formatDate={formatDate}
						onMarkAsRead={handleMarkAsRead}
					/>
				</div>
			</div>

			{showDeleteConfirm && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<div className={styles.modalHeader}>
							<XCircle className={styles.modalWarningIcon} size={24} />
							<h3 className={styles.modalTitle}>Usunąć przeczytane powiadomienia?</h3>
						</div>
						
						<p className={styles.modalMessage}>
							Czy na pewno chcesz usunąć wszystkie przeczytane powiadomienia? 
							Tej operacji nie można cofnąć.
						</p>

						<div className={styles.modalActions}>
							<button
								onClick={cancelDeleteAllRead}
								className={styles.modalCancel}
								disabled={deletingAll}
							>
								Anuluj
							</button>
							<button
								onClick={confirmDeleteAllRead}
								className={styles.modalDelete}
								disabled={deletingAll}
							>
								{deletingAll ? (
									<>
										<Loader className={styles.modalSpinner} size={16} />
										<span>Usuwanie...</span>
									</>
								) : (
									'Tak, usuń'
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}