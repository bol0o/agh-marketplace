import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';

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
			<body className={inter.variable}>{children}</body>
		</html>
	);
}
