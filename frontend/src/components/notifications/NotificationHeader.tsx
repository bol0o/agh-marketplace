'use client';

import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import styles from './NotificationHeader.module.scss';

interface NotificationType {
	label: string;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
}

interface NotificationHeaderProps {
	unreadCount: number;
	totalCount: number;
	markingAll: boolean;
	deletingAll: boolean;
	hasReadNotifications: boolean;
	selectedType: string;
	showOnlyUnread: boolean;
	notificationTypes: Record<string, NotificationType>;
	onMarkAllAsRead: () => void;
	onDeleteAllRead: () => void;
	onTypeChange: (type: string) => void;
	onToggleUnread: () => void;
}

export function NotificationHeader({
	unreadCount,
	totalCount,
	markingAll,
	deletingAll,
	hasReadNotifications,
	selectedType,
	showOnlyUnread,
	notificationTypes,
	onMarkAllAsRead,
	onDeleteAllRead,
	onTypeChange,
	onToggleUnread,
}: NotificationHeaderProps) {
	return (
		<header className={styles.header}>
			{/* Górna część - tytuł i przyciski akcji */}
			<div className={styles.topSection}>
				<div className={styles.titleSection}>
					<Bell size={28} />
					<div>
						<h1>Powiadomienia</h1>
						<p className={styles.subtitle}>
							Masz {unreadCount} nieprzeczytanych powiadomień
						</p>
						<p className={styles.subtitle}>
							{!showOnlyUnread &&
								selectedType === 'ALL' &&
								totalCount > 0 &&
								`Łącznie: ${totalCount}`}
						</p>
					</div>
				</div>

				<div className={styles.actionButtons}>
					<button
						onClick={onMarkAllAsRead}
						disabled={unreadCount === 0 || markingAll}
						className={styles.markAllButton}
					>
						{markingAll ? (
							<>
								<div className={styles.smallSpinner}></div>
								<span>Oznaczanie...</span>
							</>
						) : (
							<>
								<CheckCheck size={18} />
								<span>Oznacz wszystkie</span>
							</>
						)}
					</button>

					<button
						onClick={onDeleteAllRead}
						disabled={deletingAll || !hasReadNotifications}
						className={styles.deleteAllButton}
					>
						{deletingAll ? (
							<>
								<div className={styles.smallSpinner}></div>
								<span>Usuwanie...</span>
							</>
						) : (
							<>
								<Trash2 size={18} />
								<span>Usuń przeczytane</span>
							</>
						)}
					</button>
				</div>
			</div>

			{/* Dolna część - filtry */}
			<div className={styles.filterSection}>
				<div className={styles.filterControls}>
					<div className={styles.filterGroup}>
						<Filter size={18} />
						<span className={styles.filterLabel}>Filtry:</span>

						<div className={styles.typeFilters}>
							<button
								className={`${styles.typeFilter} ${
									selectedType === 'ALL' ? styles.active : ''
								}`}
								onClick={() => onTypeChange('ALL')}
							>
								Wszystkie
							</button>

							{Object.entries(notificationTypes).map(([type, config]) => (
								<button
									key={type}
									className={`${styles.typeFilter} ${
										selectedType === type ? styles.active : ''
									}`}
									onClick={() => onTypeChange(type)}
									style={{
										backgroundColor:
											selectedType === type ? config.bgColor : 'transparent',
										color: selectedType === type ? config.color : 'inherit',
									}}
								>
									{config.icon}
									<span>{config.label}</span>
								</button>
							))}
						</div>
					</div>

					<button
						type="button"
						className={`${styles.unreadFilter} ${showOnlyUnread ? styles.active : ''}`}
						onClick={onToggleUnread}
						aria-pressed={showOnlyUnread}
					>
						<Filter size={16} />
						<span>{showOnlyUnread ? 'Pokaż wszystkie' : 'Tylko nieprzeczytane'}</span>
					</button>
				</div>
			</div>
		</header>
	);
}
