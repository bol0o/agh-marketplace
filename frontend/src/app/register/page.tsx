'use client';

import { useState } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const register = useAuth((state) => state.register);
	const router = useRouter();

	// Domyślne dane, żebyś nie musiał wpisywać za każdym razem
	const [form, setForm] = useState({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		studentId: '', // To pole z Twojego API
		acceptTerms: false,
	});
	const [msg, setMsg] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMsg('Rejestracja...');
		try {
			await register(form);
			setMsg('Zarejestrowano! Przekierowanie...');
			router.push('/home');
		} catch (err: any) {
			console.error(err);
			setMsg('Błąd: ' + (err.response?.data?.message || err.message));
		}
	};

	const handleChange = (e: any) => {
		const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		setForm({ ...form, [e.target.name]: value });
	};

	return (
		<div style={{ padding: 20 }}>
			<h1>REJESTRACJA (Test Mode)</h1>
			<form
				onSubmit={handleSubmit}
				style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 300 }}
			>
				<input name="email" placeholder="Email (@student...)" onChange={handleChange} />
				<input
					name="password"
					type="password"
					placeholder="Hasło"
					onChange={handleChange}
				/>
				<input name="firstName" placeholder="Imię" onChange={handleChange} />
				<input name="lastName" placeholder="Nazwisko" onChange={handleChange} />
				<input
					name="studentId"
					placeholder="Nr albumu (studentId)"
					onChange={handleChange}
				/>

				<label>
					<input name="acceptTerms" type="checkbox" onChange={handleChange} />
					Akceptuję regulamin
				</label>

				<button type="submit">Zarejestruj</button>
			</form>
			<p style={{ color: 'red' }}>{msg}</p>
			<hr />
			<a href="/login">Wróć do logowania</a>
		</div>
	);
}
