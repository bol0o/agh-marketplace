'use client';

import { useAuth } from '@/store/useAuth';
import api from '@/lib/axios';
import { useState } from 'react';

export default function Home() {
	const { user, logout } = useAuth();
	const [apiResponse, setApiResponse] = useState('Kliknij guzik, żeby sprawdzić token');

	// Funkcja sprawdzająca czy axios poprawnie dokleja token
	const testApi = async () => {
		try {
			setApiResponse('Ładowanie...');
			// Strzelamy do endpointu wymagającego logowania
			const { data } = await api.get('/users/me');
			setApiResponse('SUKCES! Dane z API: ' + JSON.stringify(data, null, 2));
		} catch (err: any) {
			setApiResponse('BŁĄD: ' + err.message);
		}
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>HOME - STREFA CHRONIONA</h1>
			<p>Jeśli to widzisz, to Middleware Cię wpuścił.</p>

			<div style={{ border: '1px solid black', padding: 10, margin: '10px 0' }}>
				<h3>Dane z Zustand Store (Lokalnie):</h3>
				<pre>{JSON.stringify(user, null, 2)}</pre>
			</div>

			<div style={{ display: 'flex', gap: 10 }}>
				<button onClick={testApi}>Test API (/users/me)</button>
				<button onClick={logout} style={{ background: 'red', color: 'white' }}>
					Wyloguj
				</button>
			</div>

			<div style={{ marginTop: 20, background: '#f0f0f0', padding: 10 }}>
				<h4>Wynik testu API:</h4>
				<pre>{apiResponse}</pre>
			</div>

			<br />
			<a href="/admin">Spróbuj wejść na /admin</a>
		</div>
	);
}
