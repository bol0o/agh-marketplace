'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { User, Upload, Loader } from 'lucide-react';
import { User as UserType, UpdateProfileData } from '@/types/user';
import { useImageUpload } from '@/hooks/useImageUpload';
import styles from './ProfileForm.module.scss';

interface ProfileFormProps {
	user: UserType;
	onSubmit: (data: UpdateProfileData) => Promise<void>;
	isSubmitting: boolean;
}

export function ProfileForm({ user, onSubmit, isSubmitting }: ProfileFormProps) {
	const { uploadImage, error: imageError } = useImageUpload();

	const [formData, setFormData] = useState({
		firstName: user.name.split(' ')[0] || '',
		lastName: user.name.split(' ').slice(1).join(' ') || '',
		avatarUrl: user.avatar || '',
		faculty: user.studentInfo?.faculty || '',
		year: user.studentInfo?.year?.toString() || '',
	});

	const [avatarPreview, setAvatarPreview] = useState(user.avatar);
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (user.avatar) {
			setAvatarPreview(user.avatar);
			setFormData((prev) => ({ ...prev, avatarUrl: user.avatar || '' }));
		}
	}, [user.avatar]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// max 5MB
		if (file.size > 5 * 1024 * 1024) {
			setErrors((prev) => ({
				...prev,
				avatar: 'Plik jest za duży. Maksymalny rozmiar to 5MB.',
			}));
			return;
		}

		if (!file.type.startsWith('image/')) {
			setErrors((prev) => ({ ...prev, avatar: 'Plik musi być obrazem.' }));
			return;
		}

		try {
			setIsUploadingAvatar(true);
			setErrors((prev) => ({ ...prev, avatar: '' }));

			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setAvatarPreview(result);
			};
			reader.readAsDataURL(file);

			const uploadedUrl = await uploadImage(file);

			if (uploadedUrl) {
				setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
			} else if (imageError) {
				setErrors((prev) => ({ ...prev, avatar: imageError }));
			}
		} catch (error) {
			console.error('Error uploading avatar:', error);
			setErrors((prev) => ({ ...prev, avatar: 'Nie udało się przesłać obrazka.' }));
		} finally {
			setIsUploadingAvatar(false);
		}
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'Imię jest wymagane';
		} else if (formData.firstName.trim().length < 2) {
			newErrors.firstName = 'Imię musi mieć co najmniej 2 znaki';
		}

		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Nazwisko jest wymagane';
		} else if (formData.lastName.trim().length < 2) {
			newErrors.lastName = 'Nazwisko musi mieć co najmniej 2 znaki';
		}

		if (formData.year && !/^\d+$/.test(formData.year)) {
			newErrors.year = 'Rok musi być liczbą';
		} else if (formData.year) {
			const yearNum = parseInt(formData.year);
			if (yearNum < 1 || yearNum > 5) {
				newErrors.year = 'Rok musi być w zakresie 1-5';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		const data: UpdateProfileData = {
			firstName: formData.firstName.trim(),
			lastName: formData.lastName.trim(),
			faculty: formData.faculty.trim() || undefined,
			year: formData.year ? parseInt(formData.year) : undefined,
			avatarUrl: formData.avatarUrl || undefined,
		};

		await onSubmit(data);
	};

	const faculties = [
		'Wydział Informatyki',
		'Wydział Informatyki, Elektroniki i Telekomunikacji',
		'Wydział Elektrotechniki, Automatyki, Informatyki i Inżynierii Biomedycznej',
		'Wydział Inżynierii Mechanicznej i Robotyki',
		'Wydział Geologii, Geofizyki i Ochrony Środowiska',
		'Wydział Górnictwa i Geoinżynierii',
		'Wydział Metali Nieżelaznych',
		'Wydział Odlewnictwa',
		'Wydział Inżynierii Materiałowej i Ceramiki',
		'Wydział Humanistyczny',
		'Wydział Matematyki Stosowanej',
		'Wydział Fizyki i Informatyki Stosowanej',
	];

	const isLoading = isSubmitting || isUploadingAvatar;

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<h2 className={styles.sectionTitle}>Dane osobowe</h2>

			<div className={styles.avatarSection}>
				<div className={styles.avatarContainer}>
					<div className={styles.avatar}>
						{avatarPreview ? (
							<Image
								src={avatarPreview}
								alt="Awatar"
								fill
								sizes="(max-width: 768px) 100px, 150px"
							/>
						) : (
							<div className={styles.avatarPlaceholder}>
								<User size={32} />
							</div>
						)}
					</div>
				</div>
				<div className={styles.avatarUpload}>
					<label className={styles.uploadButton}>
						{isUploadingAvatar ? (
							<Loader className={styles.spinner} size={16} />
						) : (
							<Upload size={16} />
						)}
						<span>{isUploadingAvatar ? 'Przesyłanie...' : 'Zmień zdjęcie'}</span>
						<input
							type="file"
							accept="image/*"
							onChange={handleAvatarChange}
							className={styles.fileInput}
							disabled={isUploadingAvatar || isSubmitting}
						/>
					</label>
					<p className={styles.uploadHint}>
						Zalecane wymiary: 400×400px. Maksymalny rozmiar: 5MB.
					</p>
					{errors.avatar && <p className={styles.error}>{errors.avatar}</p>}
				</div>
			</div>

			<div className={styles.formGrid}>
				<div className={styles.formGroup}>
					<label htmlFor="firstName" className={styles.label}>
						Imię *
					</label>
					<input
						id="firstName"
						name="firstName"
						type="text"
						value={formData.firstName}
						onChange={handleChange}
						className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
						placeholder="Wpisz swoje imię"
						required
						disabled={isSubmitting}
					/>
					{errors.firstName && <p className={styles.error}>{errors.firstName}</p>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="lastName" className={styles.label}>
						Nazwisko *
					</label>
					<input
						id="lastName"
						name="lastName"
						type="text"
						value={formData.lastName}
						onChange={handleChange}
						className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
						placeholder="Wpisz swoje nazwisko"
						required
						disabled={isSubmitting}
					/>
					{errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="faculty" className={styles.label}>
						Wydział
					</label>
					<select
						id="faculty"
						name="faculty"
						value={formData.faculty}
						onChange={handleChange}
						className={styles.select}
						disabled={isSubmitting}
					>
						<option value="">Wybierz wydział</option>
						{faculties.map((faculty) => (
							<option key={faculty} value={faculty}>
								{faculty}
							</option>
						))}
					</select>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="year" className={styles.label}>
						Rok studiów
					</label>
					<input
						id="year"
						name="year"
						type="number"
						min="1"
						max="5"
						value={formData.year}
						onChange={handleChange}
						className={`${styles.input} ${errors.year ? styles.inputError : ''}`}
						placeholder="np. 2"
						disabled={isSubmitting}
					/>
					{errors.year && <p className={styles.error}>{errors.year}</p>}
				</div>
			</div>

			<div className={styles.actions}>
				<button type="submit" className={styles.submitButton} disabled={isLoading}>
					{isSubmitting ? (
						<>
							<Loader className={styles.spinner} />
							Zapisywanie...
						</>
					) : (
						'Zapisz zmiany'
					)}
				</button>
			</div>
		</form>
	);
}
