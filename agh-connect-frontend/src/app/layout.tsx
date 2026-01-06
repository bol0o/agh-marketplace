import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import { ToastContainer } from '@/components/shared/ToastContainer';
import QueryProvider from '@/providers/QueryProvider';
import Footer from '@/components/shared/Footer';
import Initializer from '@/components/Initializer';

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
			<body className={inter.variable}>
				<QueryProvider>
					<Initializer />
					{children}
				</QueryProvider>

				<ToastContainer />
				<Footer />
			</body>
		</html>
	);
}
