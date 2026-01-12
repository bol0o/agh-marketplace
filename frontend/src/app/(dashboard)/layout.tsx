import { Header } from '@/components/Header/index';
import { Sidebar } from '@/components/Sidebar';
import styles from './DashboardLayout.module.scss';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<div className={styles.container}>
				<Sidebar />
				<main className={styles.mainContent}>{children}</main>
			</div>
		</>
	);
}
