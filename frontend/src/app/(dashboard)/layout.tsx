import { Header } from '@/components/Header/index';
import { Sidebar } from '@/components/Sidebar';
// import { Sidebar } from '@/components/Sidebar/index';
// import styles from './DashboardLayout.module.scss';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header />

			<div>
				<Sidebar />
				<main>{children}</main>
			</div>
		</div>
	);
}
