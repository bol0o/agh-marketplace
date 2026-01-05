'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import styles from './AuthGuard.module.scss';

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push('/login');
		}
	}, [isLoading, isAuthenticated, router]);

	if (isLoading || !isAuthenticated) {
		return (
			<div className={styles.loadingContainer}>
				<span className={styles.text}>Weryfikacja sesji...</span>
			</div>
		);
	}

	return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
	const { user, isAuthenticated, isLoading } = useAuthStore();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			console.log(user);
			if (!isAuthenticated) {
				router.push('/login');
			} else if (user?.role !== 'admin') {
				router.push('/marketplace');
			}
		}
	}, [isLoading, isAuthenticated, user, router]);

	if (isLoading || !isAuthenticated || user?.role !== 'admin') {
		return (
			<div className={styles.loadingContainer}>
				<span className={`${styles.text} ${styles.admin}`}>
					Sprawdzanie uprawnień administratora...
				</span>
			</div>
		);
	}

	return <>{children}</>;
}
