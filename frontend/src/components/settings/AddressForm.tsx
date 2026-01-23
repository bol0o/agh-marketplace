'use client';

import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { User as UserType, UpdateAddressData } from '@/types/user';
import styles from './AddressForm.module.scss';

interface AddressFormProps {
	user: UserType;
	onSubmit: (data: UpdateAddressData) => Promise<void>;
	isSubmitting: boolean;
}

export function AddressForm({ user, onSubmit, isSubmitting }: AddressFormProps) {
	const [formData, setFormData] = useState({
		street: user.address?.street || '',
		buildingNumber: user.address?.buildingNumber || '',
		apartmentNumber: user.address?.apartmentNumber || '',
		city: user.address?.city || '',
		zipCode: user.address?.zipCode || '',
		phone: user.address?.phone || '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		const incomingData = {
			street: user.address?.street || '',
			buildingNumber: user.address?.buildingNumber || '',
			apartmentNumber: user.address?.apartmentNumber || '',
			city: user.address?.city || '',
			zipCode: user.address?.zipCode || '',
			phone: user.address?.phone || '',
		};

		setFormData((prev) => {
			if (JSON.stringify(prev) === JSON.stringify(incomingData)) {
				return prev;
			}
			return incomingData;
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(user.address)]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, '');

		if (value.length > 0) {
			if (value.length <= 3) {
				// value = value;
			} else if (value.length <= 6) {
				value = `${value.slice(0, 3)} ${value.slice(3)}`;
			} else if (value.length <= 9) {
				value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
			} else {
				value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 9)}`;
			}
		}

		setFormData((prev) => ({ ...prev, phone: value }));

		if (errors.phone) {
			setErrors((prev) => ({ ...prev, phone: '' }));
		}
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.street.trim()) {
			newErrors.street = 'Ulica jest wymagana';
		}

		if (!formData.buildingNumber.trim()) {
			newErrors.buildingNumber = 'Numer budynku jest wymagany';
		}

		if (!formData.city.trim()) {
			newErrors.city = 'Miasto jest wymagane';
		}

		if (!formData.zipCode.trim()) {
			newErrors.zipCode = 'Kod pocztowy jest wymagany';
		} else if (!/^\d{2}-\d{3}$/.test(formData.zipCode)) {
			newErrors.zipCode = 'Nieprawidłowy format kodu pocztowego (np. 30-059)';
		}

		if (!formData.phone.trim()) {
			newErrors.phone = 'Numer telefonu jest wymagany';
		} else if (!/^[+\d\s-]{9,}$/.test(formData.phone.replace(/\s/g, ''))) {
			newErrors.phone = 'Nieprawidłowy numer telefonu';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		const data: UpdateAddressData = {
			street: formData.street.trim(),
			buildingNumber: formData.buildingNumber.trim(),
			apartmentNumber: formData.apartmentNumber?.trim() || null,
			city: formData.city.trim(),
			zipCode: formData.zipCode.trim(),
			phone: formData.phone.trim(),
		};

		await onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit} className={styles.container}>
			<h2 className={styles.sectionTitle}>Adres dostawy</h2>

			<div className={styles.formGrid}>
				<div className={styles.formGroup}>
					<label htmlFor="street" className={styles.label}>
						Ulica *
					</label>
					<input
						id="street"
						name="street"
						type="text"
						value={formData.street}
						onChange={handleChange}
						className={`${styles.input} ${errors.street ? styles.inputError : ''}`}
						placeholder="np. Mickiewicza"
						required
					/>
					{errors.street && <p className={styles.error}>{errors.street}</p>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="buildingNumber" className={styles.label}>
						Numer budynku *
					</label>
					<input
						id="buildingNumber"
						name="buildingNumber"
						type="text"
						value={formData.buildingNumber}
						onChange={handleChange}
						className={`${styles.input} ${errors.buildingNumber ? styles.inputError : ''}`}
						placeholder="np. 30"
						required
					/>
					{errors.buildingNumber && (
						<p className={styles.error}>{errors.buildingNumber}</p>
					)}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="apartmentNumber" className={styles.label}>
						Numer mieszkania (opcjonalnie)
					</label>
					<input
						id="apartmentNumber"
						name="apartmentNumber"
						type="text"
						value={formData.apartmentNumber || ''}
						onChange={handleChange}
						className={styles.input}
						placeholder="np. 12"
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="city" className={styles.label}>
						Miasto *
					</label>
					<input
						id="city"
						name="city"
						type="text"
						value={formData.city}
						onChange={handleChange}
						className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
						placeholder="np. Kraków"
						required
					/>
					{errors.city && <p className={styles.error}>{errors.city}</p>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="zipCode" className={styles.label}>
						Kod pocztowy *
					</label>
					<input
						id="zipCode"
						name="zipCode"
						type="text"
						value={formData.zipCode}
						onChange={handleChange}
						className={`${styles.input} ${errors.zipCode ? styles.inputError : ''}`}
						placeholder="np. 30-059"
						required
					/>
					{errors.zipCode && <p className={styles.error}>{errors.zipCode}</p>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="phone" className={styles.label}>
						Numer telefonu *
					</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						value={formData.phone}
						onChange={handlePhoneChange}
						className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
						placeholder="np. +48 123 456 789"
						required
					/>
					{errors.phone && <p className={styles.error}>{errors.phone}</p>}
				</div>
			</div>

			<div className={styles.note}>
				<p className={styles.noteText}>
					<strong>Uwaga:</strong> Ten adres będzie używany do wysyłki zakupionych
					przedmiotów. Upewnij się, że dane są poprawne i aktualne.
				</p>
			</div>

			<div className={styles.actions}>
				<button type="submit" className={styles.submitButton} disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<Loader className={styles.spinner} />
							Zapisywanie...
						</>
					) : (
						'Zapisz adres'
					)}
				</button>
			</div>
		</form>
	);
}
