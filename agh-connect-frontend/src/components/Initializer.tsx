'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Initializer() {
	const { user, token, isAuthenticated } = useAuthStore();

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const cookies = document.cookie.split(';').reduce(
				(acc, cookie) => {
					const [key, value] = cookie.trim().split('=');
					acc[key] = value;
					return acc;
				},
				{} as Record<string, string>
			);

			const hasToken = !!cookies.token;
			const store = useAuthStore.getState();

			if (hasToken && !store.isAuthenticated) {
				console.log('Initializer: Syncing store with cookies');
			}
		}
	}, []);

	return null;
}
