'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import styles from '../Auth.module.scss';
import AuthBranding from '@/components/auth/AuthBranding';
import { RegisterFormData } from '@/types/userCredentialsTypes';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { isAxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';
import { isValidAghEmail, validatePassword } from '@/utils/validation';

export default function RegisterForm() {
	const router = useRouter();
	const login = useAuthStore((state) => state.login);
	const addToast = useUIStore((state) => state.addToast);

	const [formData, setFormData] = useState<RegisterFormData>({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		acceptTerms: false,
	});

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isValidAghEmail(formData.email)) {
			addToast('Wymagany jest email w domenie @student.agh.edu.pl', 'error');
			return;
		}

		const passwordValidation = validatePassword(formData.password);
		if (!passwordValidation.isValid) {
			addToast(passwordValidation.message || 'Hasło nie spełnia wymagań', 'error');
			return;
		}

		if (!formData.acceptTerms) {
			addToast('Musisz zaakceptować regulamin', 'error');
			return;
		}

		setIsLoading(true);

		try {
			const response = await authService.register(formData);
			login(response);
			addToast('Konto zostało utworzone!', 'success');
			router.push('/marketplace');
		} catch (error: unknown) {
			if (isAxiosError<ApiErrorResponse>(error)) {
				const data = error.response?.data;
				const errorMessage = Array.isArray(data?.message)
					? data.message[0]
					: data?.error || 'Wystąpił błąd rejestracji';
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
				title={'Stworzone przez studentów, dla studentów.'}
				description={
					'Dołącz do ponad 5,000 użytkowników. To bezpieczne miejsce na wymianę wiedzy i przedmiotów.'
				}
			/>

			<div className={styles.formSection}>
				<div className={styles.formContainer}>
					<div className={styles.mobileLogo}>
						<div className={styles.logoIcon}>A</div>
						<span>AGH Connect</span>
					</div>

					<div className={styles.header}>
						<h1>Stwórz konto</h1>
						<p>Zajmie to tylko chwilę.</p>
					</div>

					<form onSubmit={handleSubmit} className={styles.form}>
						<div
							style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
						>
							<div className={styles.inputGroup}>
								<label>Imię</label>
								<div className={styles.inputWrapper}>
									<User size={20} />
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
										placeholder="Jan"
										required
									/>
								</div>
							</div>
							<div className={styles.inputGroup}>
								<label>Nazwisko</label>
								<div className={styles.inputWrapper}>
									<input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										placeholder="Kowalski"
										required
										style={{ paddingLeft: '16px' }}
									/>
								</div>
							</div>
						</div>

						<div className={styles.inputGroup}>
							<label>Email studencki</label>
							<div className={styles.inputWrapper}>
								<Mail size={20} />
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="nr_albumu@student.agh.edu.pl"
									required
								/>
							</div>
							<span className={styles.helperText}>
								Wymagany adres w domenie @student.agh.edu.pl
							</span>
						</div>

						<div className={styles.inputGroup}>
							<label>Hasło</label>
							<div className={styles.inputWrapper}>
								<Lock size={20} />
								<input
									type={showPassword ? 'text' : 'password'}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="Min. 8 znaków, wielka litera i cyfra"
									required
									className={styles.hasRightIcon}
									minLength={8}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className={styles.togglePassword}
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
							<span className={styles.helperText}>
								Minimum 8 znaków, w tym wielka litera i cyfra
							</span>
						</div>

						<div className={styles.checkboxGroup}>
							<input
								name="acceptTerms"
								type="checkbox"
								checked={formData.acceptTerms}
								onChange={handleChange}
								id="terms"
								required
							/>
							<label htmlFor="terms">
								Akceptuję <Link href="#">Regulamin</Link>
							</label>
						</div>

						<button type="submit" className={styles.btnPrimary} disabled={isLoading}>
							{isLoading ? (
								<Loader2 size={20} className={styles.spinner} />
							) : (
								<>
									Zarejestruj się <ArrowRight size={20} />
								</>
							)}
						</button>
					</form>

					<div className={styles.footer}>
						Masz już konto? <Link href="/login">Zaloguj się</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
