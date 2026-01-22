'use client';
import { useAuth } from '@/store/useAuth';

export default function AdminPage() {
	const { logout } = useAuth();

	return (
		<div style={{ padding: 20, background: '#ffebeb' }}>
			<h1 style={{ color: 'red' }}>ADMIN PANEL</h1>
			<p>Gratulacje, masz rolę ADMIN i middleware Cię wpuścił.</p>
			<button onClick={logout}>Wyloguj</button>
			<br />
			<br />
			<a href="/home">Wróć do Home</a>
		</div>
	);
}
