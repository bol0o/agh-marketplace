import { Header } from '@/components/shared/Header';
import { Sidebar } from '@/components/shared/Sidebar';
import styles from './DashboardLayout.module.scss';
import { RequireAuth } from '@/components/auth/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<RequireAuth>
			<div className={styles.wrapper}>
				<Header />

				<div className={styles.container}>
					<Sidebar />

					<main className={styles.mainContent}>{children}</main>
				</div>
			</div>
		</RequireAuth>
	);
}
