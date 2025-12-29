'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import styles from '@/styles/Auth.module.scss';
import AuthBranding from '@/components/ui/auth/AuthBranding';
import { RegisterFormData } from '@/types/userCredentialsTypes';

export default function RegisterPage() {
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
	};

	return (
		<div className={styles.container}>
			{/* RIGHT SIDE (Branding)*/}
			<AuthBranding
				title={'Stworzone przez studentów, dla studentów.'}
				description={
					'Dołącz do ponad 5,000 użytkowników. To bezpieczne miejsce na wymiane wiedzy i przedmiotów.'
				}
			/>

			{/* RIGHT SIDE (Form)*/}
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
									placeholder="Min. 8 znaków"
									required
									className={styles.hasRightIcon}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className={styles.togglePassword}
								>
									{showPassword ? (
										<EyeOff className={styles.eye} size={20} />
									) : (
										<Eye className={styles.eye} size={20} />
									)}
								</button>
							</div>
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
								<Loader2 className="animate-spin" size={20} />
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
