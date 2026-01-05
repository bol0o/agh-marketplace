'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import styles from '../Auth.module.scss';
import AuthBranding from '@/components/auth/AuthBranding';
import { LoginFormData } from '@/types/userCredentialsTypes';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { useUIStore } from '@/store/uiStore';

export default function LoginPage() {
	const router = useRouter();
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

		setIsLoading(true);
		try {
			const response = await authService.login(formData);

			login(response);

			addToast('Zalogowano pomyślnie!', 'success');

			if (response.user.role.toUpperCase() === 'ADMIN') {
				router.push('/admin');
			} else {
				router.push('/marketplace');
			}
		} catch (error) {
			addToast('Błąd logowania', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.container}>
			{/* LEFT SIDE (Branding)*/}
			<AuthBranding
				title={'Witaj ponownie na kampusie.'}
				description={'Twoje centrum wymiany notatek, sprzętu i wiedzy.'}
			/>

			{/* RIGHT SIDE (Form)*/}
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
						</div>

						<div className={styles.inputGroup}>
							<div style={{ display: 'flex', justifyContent: 'space-between' }}>
								<label>Hasło</label>
								<Link
									href="/forgot-password"
									style={{
										fontSize: '0.75rem',
										color: '#dc2626',
										fontWeight: 600,
									}}
								>
									Zapomniałeś hasła?
								</Link>
							</div>
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
									{showPassword ? (
										<EyeOff className={styles.eye} size={20} />
									) : (
										<Eye className={styles.eye} size={20} />
									)}
								</button>
							</div>
						</div>

						<button type="submit" className={styles.btnPrimary} disabled={isLoading}>
							{isLoading ? (
								<Loader2 className="animate-spin" size={20} />
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
