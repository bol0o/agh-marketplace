// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import styles from '../Auth.module.scss';
import AuthBranding from '@/components/auth/AuthBranding';
import { LoginFormData } from '@/types/userCredentialsTypes';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { isAxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { isValidAghEmail } from '@/utils/validation';

export default function LoginPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const login = useAuthStore((state) => state.login);
	const addToast = useUIStore((state) => state.addToast);

	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isValidAghEmail(formData.email)) {
			addToast('Wymagany jest email w domenie @student.agh.edu.pl', 'error');
			return;
		}

		setIsLoading(true);

		try {
			const response = await authService.login(formData);

			// Zapisz w store (to ustawi cookies)
			login(response);

			const name = response.user.name.split(' ')[0];
			addToast(`Witaj spowrotem, ${name}`, 'success');

			// Sprawdź redirect URL z middleware
			const redirectTo = searchParams.get('redirect');
			if (redirectTo) {
				router.push(redirectTo);
			} else {
				// Middleware automatycznie przekieruje na podstawie roli
				// Ale na wszelki wypadek:
				if (response.user.role.toUpperCase() === 'ADMIN') {
					router.push('/admin');
				} else {
					router.push('/marketplace');
				}
			}
		} catch (error: unknown) {
			if (isAxiosError<ApiErrorResponse>(error)) {
				const data = error.response?.data;
				const errorMessage = Array.isArray(data?.message)
					? data.message[0]
					: data?.error || 'Wystąpił błąd logowania';
				addToast(errorMessage, 'error');
			} else {
				addToast('Wystąpił nieoczekiwany błąd', 'error');
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			<AuthBranding
				title={'Witaj ponownie na kampusie.'}
				description={'Twoje centrum wymiany notatek, sprzętu i wiedzy.'}
			/>

			<div className={styles.formSection}>
				<div className={styles.formContainer}>
					<div className={styles.mobileLogo}>
						<div className={styles.logoIcon}>A</div>
						<span>AGH Connect</span>
					</div>

					<div className={styles.header}>
						<h1>Zaloguj się</h1>
						<p>Wpisz swoje dane, aby kontynuować.</p>
					</div>

					<form onSubmit={handleLogin} className={styles.form}>
						<div className={styles.inputGroup}>
							<label>Email studencki</label>
							<div className={styles.inputWrapper}>
								<Mail size={20} />
								<input
									name="email"
									type="text"
									placeholder="nr_albumu@student.agh.edu.pl"
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>
							<span className={styles.helperText}>
								Wymagany adres w domenie @student.agh.edu.pl
							</span>
						</div>

						<div className={styles.inputGroup}>
							<div className={styles.inputWrapper}>
								<Lock size={20} />
								<input
									name="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									required
									value={formData.password}
									onChange={handleChange}
									className={styles.hasRightIcon}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className={styles.togglePassword}
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						<button type="submit" className={styles.btnPrimary} disabled={isLoading}>
							{isLoading ? (
								<Loader2 size={20} className={styles.spinner} />
							) : (
								<>
									Zaloguj się <ArrowRight size={20} />
								</>
							)}
						</button>
					</form>

					<div className={styles.footer}>
						Nie masz jeszcze konta? <Link href="/register">Zarejestruj się</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
