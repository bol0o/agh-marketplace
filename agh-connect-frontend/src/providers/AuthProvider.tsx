'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const checkAuth = useAuthStore((state) => state.checkAuth);

	const initialized = useRef(false);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			checkAuth();
		}
	}, [checkAuth]);

	return <>{children}</>;
}
