// src/components/admin/ReportsTable.tsx
import { Report } from '@/types/report';
import styles from './AdminDashboard.module.scss';

interface ReportsTableProps {
	reports: Report[];
	onBanUser: (userId: string, reportId: string) => void;
	onCloseReport: (reportId: string) => void;
}

const ReportsTable = ({ reports, onBanUser, onCloseReport }: ReportsTableProps) => {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pl-PL', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getStatusBadgeClass = (status: Report['status']) => {
		switch (status) {
			case 'open':
				return styles.statusOpen;
			case 'in_progress':
				return styles.statusInProgress;
			case 'closed':
				return styles.statusClosed;
			default:
				return '';
		}
	};

	if (reports.length === 0) {
		return (
			<div className={styles.emptyState}>
				<p className={styles.emptyMessage}>Brak zgłoszeń do wyświetlenia</p>
			</div>
		);
	}

	return (
		<div className={styles.tableContainer}>
			<table className={styles.table}>
				<thead className={styles.tableHeader}>
					<tr>
						<th className={styles.tableHeaderCell}>Powód</th>
						<th className={styles.tableHeaderCell}>Typ</th>
						<th className={styles.tableHeaderCell}>Status</th>
						<th className={styles.tableHeaderCell}>Data</th>
						<th className={styles.tableHeaderCell}>Zgłaszający</th>
						<th className={styles.tableHeaderCell}>Akcje</th>
					</tr>
				</thead>
				<tbody className={styles.tableBody}>
					{reports.map((report) => (
						<tr key={report.id} className={styles.tableRow}>
							<td className={styles.tableCell}>
								<div className={styles.reasonCell}>
									<span className={styles.reasonText}>{report.reason}</span>
									{report.details && (
										<span className={styles.detailsText}>{report.details}</span>
									)}
								</div>
							</td>
							<td className={styles.tableCell}>
								<span className={styles.detailsText}>{report.targetType}</span>
							</td>
							<td className={styles.tableCell}>
								<span
									className={`${styles.statusBadge} ${getStatusBadgeClass(report.status)}`}
								>
									{report.status === 'open' && 'Otwarte'}
									{report.status === 'in_progress' && 'W trakcie'}
									{report.status === 'closed' && 'Zamknięte'}
								</span>
							</td>
							<td className={styles.tableCell}>
								<span className={styles.dateText}>
									{formatDate(report.createdAt)}
								</span>
							</td>
							<td className={styles.tableCell}>
								<div className={styles.reporterInfo}>
									<span className={styles.reporterName}>
										{report.reporter?.name || 'Anonim'}
									</span>
									<span className={styles.reporterEmail}>
										{report.reporter?.email || ''}
									</span>
								</div>
							</td>
							<td className={styles.tableCell}>
								<div className={styles.actions}>
									{report.status !== 'closed' && (
										<>
											<button
												onClick={() =>
													onBanUser(report.targetId, report.id)
												}
												className={`${styles.actionButton} ${styles.banButton}`}
												title="Zbanuj użytkownika"
											>
												Zbanuj
											</button>
											<button
												onClick={() => onCloseReport(report.id)}
												className={`${styles.actionButton} ${styles.closeButton}`}
												title="Zamknij"
											>
												Zamknij
											</button>
										</>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ReportsTable;
