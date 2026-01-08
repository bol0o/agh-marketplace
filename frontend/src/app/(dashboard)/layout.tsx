import { Header } from '@/components/Header';
// import { Sidebar } from '@/components/shared/Sidebar';
// import styles from './DashboardLayout.module.scss';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header />

			<div>
				{/* <Sidebar /> */}

				<main>{children}</main>
			</div>
		</div>
	);
}
