import { Header } from '@/components/shared/Header';
import { Sidebar } from '@/components/shared/Sidebar';
import styles from '@/styles/DashboardLayout.module.scss';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={styles.wrapper}>
			<Header />

			<div className={styles.container}>
				<Sidebar />

				<main className={styles.mainContent}>{children}</main>
			</div>
		</div>
	);
}
