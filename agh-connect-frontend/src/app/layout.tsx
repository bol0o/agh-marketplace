import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import { ToastContainer } from '@/components/shared/ToastContainer';
import AuthProvider from '@/providers/AuthProvider';
import QueryProvider from '@/providers/QueryProvider';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'AGH Connect',
	description: 'Studencki Marketplace AGH',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pl">
			{/* 3. Dodanie klasy fontu do body */}

			<body className={inter.variable}>
				<QueryProvider>
					<AuthProvider>{children}</AuthProvider>
				</QueryProvider>

				<ToastContainer />
			</body>
		</html>
	);
}
