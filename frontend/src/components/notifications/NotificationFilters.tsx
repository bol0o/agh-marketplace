'use client';

import { Filter } from 'lucide-react';
import styles from './NotificationFilters.module.scss';

interface NotificationType {
	label: string;
	icon: React.ReactNode;
	color: string;
	bgColor: string;
}

interface NotificationFiltersProps {
	selectedType: string;
	showOnlyUnread: boolean;
	notificationTypes: Record<string, NotificationType>;
	onTypeChange: (type: string) => void;
	onToggleUnread: () => void;
}

export function NotificationFilters({
	selectedType,
	showOnlyUnread,
	notificationTypes,
	onTypeChange,
	onToggleUnread,
}: NotificationFiltersProps) {
	return (
		<div className={styles.filters}>
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
				className={`${styles.filterButton} ${showOnlyUnread ? styles.active : ''}`}
				onClick={onToggleUnread}
			>
				<Filter size={16} />
				<span>{showOnlyUnread ? 'Pokaż wszystkie' : 'Pokaż tylko nieprzeczytane'}</span>
			</button>
		</div>
	);
}
