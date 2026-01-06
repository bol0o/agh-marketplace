'use client';

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const login = useAuth((state) => state.login);
	const router = useRouter();

	const [form, setForm] = useState({ email: '', password: '' });
	const [msg, setMsg] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMsg('Logowanie...');
		try {
			await login(form);
			setMsg('Sukces! Przekierowanie...');
			router.push('/home'); // Middleware powinien przepuścić
		} catch (err: any) {
			setMsg('Błąd: ' + (err.response?.data?.message || err.message));
		}
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>LOGIN (Test Mode)</h1>
			<form
				onSubmit={handleSubmit}
				style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300 }}
			>
				<input
					placeholder="Email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
				/>
				<input
					placeholder="Hasło"
					type="password"
					value={form.password}
					onChange={(e) => setForm({ ...form, password: e.target.value })}
				/>
				<button type="submit">Zaloguj się</button>
			</form>
			<p style={{ color: 'red' }}>{msg}</p>
			<hr />
			<a href="/register">Idź do rejestracji</a>
		</div>
	);
}
