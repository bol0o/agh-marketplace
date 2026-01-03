import { Header } from '@/components/shared/Header';
import { Sidebar } from '@/components/shared/Sidebar';
import styles from './DashboardLayout.module.scss';
import { ToastContainer } from '@/components/shared/ToastContainer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={styles.wrapper}>
			<Header />

			<div className={styles.container}>
				<Sidebar />

				<main className={styles.mainContent}>{children}</main>
				<ToastContainer />
			</div>
		</div>
	);
}
