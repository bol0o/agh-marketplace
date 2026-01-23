import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';
import { useUIStore } from '@/store/uiStore';
import { Report } from '@/types/report';
import { DashboardStats, User } from '@/types/admin';
import ReportsTable from './ReportsTable';
import UsersTable from './UsersTable';
import styles from './AdminDashboard.module.scss';

type Tab = 'overview' | 'users' | 'reports';

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState<Tab>('reports'); // Domyślnie raporty
	const { addToast } = useUIStore();

	// Data State
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [reports, setReports] = useState<Report[]>([]);
	const [users, setUsers] = useState<User[]>([]);

	// Loading States
	const [loading, setLoading] = useState(true);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// 1. Fetch Dashboard Data
	const fetchAllData = useCallback(async () => {
		try {
			setLoading(true);

			const [statsRes, reportsRes, usersRes] = await Promise.all([
				axios.get<DashboardStats>('/admin/stats'),
				axios.get<any[]>('/admin/reports'),
				axios.get<{ data: User[] }>('/admin/users?limit=50'), // Limit dla demo
			]);

			setStats(statsRes.data);

			const formattedReports: Report[] = reportsRes.data.map((report) => ({
				...report,
				reporter: {
					id: report.reporter?.id,
					name: report.reporter?.firstName
						? `${report.reporter.firstName} ${report.reporter.lastName}`
						: 'Anonim',
					email: report.reporter?.email || '',
				},
				targetId: report.targetId,
				targetType: report.targetType,
			}));
			setReports(formattedReports);

			setUsers(usersRes.data.data);
		} catch (err) {
			console.error('Admin fetch error:', err);
			addToast('Błąd pobierania danych panelu', 'error');
		} finally {
			setLoading(false);
		}
	}, [refreshTrigger, addToast]);

	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	// 2. Actions
	const handleResolveReport = async (reportId: string, action: 'ban' | 'dismiss') => {
		try {
			await axios.patch(`/admin/reports/${reportId}/resolve`, { action });

			addToast(
				action === 'ban' ? 'Zablokowano i zamknięto' : 'Zgłoszenie odrzucone',
				'success'
			);
			setRefreshTrigger((prev) => prev + 1);
		} catch (err: any) {
			addToast(err.response?.data?.error || 'Błąd akcji', 'error');
		}
	};

	const handleToggleUserStatus = async (userId: string) => {
		try {
			await axios.patch(`/admin/users/${userId}/status`);
			addToast('Status użytkownika zmieniony', 'success');

			setUsers((prev) =>
				prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
			);
		} catch (err) {
			addToast('Błąd zmiany statusu', 'error');
		}
	};

	if (loading && !stats) {
		return (
			<div className={styles.loadingContainer}>
				<div className={styles.spinner}></div>
				<p>Ładowanie panelu...</p>
			</div>
		);
	}

	return (
		<div className={styles.dashboard}>
			{/* HEADER & STATS */}
			<header className={styles.header}>
				<div>
					<h1 className={styles.title}>Panel Administratora</h1>
					<p style={{ color: '#6b7280' }}>Zarządzaj rynkiem AGH</p>
				</div>

				<div className={styles.stats}>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{stats?.totalUsers || 0}</span>
						<span className={styles.statLabel}>Użytkownicy</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{stats?.activeListings || 0}</span>
						<span className={styles.statLabel}>Ogłoszenia</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{stats?.pendingReports || 0}</span>
						<span className={styles.statLabel}>Zgłoszenia</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statNumber}>{stats?.totalRevenue || 0} PLN</span>
						<span className={styles.statLabel}>Obrót</span>
					</div>
				</div>
			</header>

			{/* TABS NAVIGATION */}
			<div className={styles.tabsContainer}>
				<button
					className={`${styles.tabButton} ${activeTab === 'reports' ? styles.active : ''}`}
					onClick={() => setActiveTab('reports')}
				>
					Zgłoszenia ({reports.filter((r) => r.status === 'open').length})
				</button>
				<button
					className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
					onClick={() => setActiveTab('users')}
				>
					Użytkownicy
				</button>
			</div>

			{/* MAIN CONTENT AREA */}
			<main className={styles.content}>
				{activeTab === 'reports' && (
					<ReportsTable
						reports={reports}
						onBanUser={(userId, reportId) => handleResolveReport(reportId, 'ban')}
						onCloseReport={(reportId) => handleResolveReport(reportId, 'dismiss')}
					/>
				)}

				{activeTab === 'users' && (
					<UsersTable users={users} onToggleStatus={handleToggleUserStatus} />
				)}
			</main>
		</div>
	);
};

export default AdminDashboard;
