import { User } from '@/types/admin';
import styles from './AdminDashboard.module.scss';

interface UsersTableProps {
	users: User[];
	onToggleStatus: (userId: string) => void;
}

const UsersTable = ({ users, onToggleStatus }: UsersTableProps) => {
	if (users.length === 0) {
		return <div className={styles.emptyState}>Brak użytkowników.</div>;
	}

	return (
		<div className={styles.tableContainer}>
			<table className={styles.table}>
				<thead className={styles.tableHeader}>
					<tr>
						<th className={styles.tableHeaderCell}>Użytkownik</th>
						<th className={styles.tableHeaderCell}>Rola</th>
						<th className={styles.tableHeaderCell}>Status</th>
						<th className={styles.tableHeaderCell}>Aktywność</th>
						<th className={styles.tableHeaderCell}>Akcje</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id} className={styles.tableRow}>
							<td className={styles.tableCell}>
								<div className={styles.userInfo}>
									<span className={styles.userName}>
										{user.firstName} {user.lastName}
									</span>
									<span className={styles.userEmail}>{user.email}</span>
								</div>
							</td>
							<td className={styles.tableCell}>
								<span className={`${styles.roleBadge} ${user.role.toLowerCase()}`}>
									{user.role}
								</span>
							</td>
							<td className={styles.tableCell}>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<span
										className={`${styles.statusDot} ${user.isActive ? styles.active : styles.banned}`}
									/>
									{user.isActive ? 'Aktywny' : 'Zablokowany'}
								</div>
							</td>
							<td className={styles.tableCell}>
								<div className={styles.userInfo}>
									<span className={styles.userEmail}>
										Oferty: {user._count.products}
									</span>
									<span className={styles.userEmail}>
										Zamówienia: {user._count.orders}
									</span>
								</div>
							</td>
							<td className={styles.tableCell}>
								<button
									onClick={() => onToggleStatus(user.id)}
									className={`${styles.actionButton} ${user.isActive ? styles.ban : styles.unban}`}
								>
									{user.isActive ? 'Zablokuj' : 'Odblokuj'}
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UsersTable;
