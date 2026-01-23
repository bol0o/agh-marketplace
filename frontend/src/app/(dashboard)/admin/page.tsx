'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!user || (user.role !== 'admin' && user.role !== 'ADMIN'))) {
			router.push('/');
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
				Ładowanie uprawnień...
			</div>
		);
	}

	if (!user || (user.role !== 'admin' && user.role !== 'ADMIN')) return null;

	return <AdminDashboard />;
}
