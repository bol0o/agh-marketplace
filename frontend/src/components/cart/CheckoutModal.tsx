'use client';

import { useState, useEffect } from 'react';
import { X, Loader, MapPin, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/store/useAuth';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/uiStore';
import { CartItem } from '@/types/cart';
import { CreateOrderRequest, OrderAddress } from '@/types/order';
import { formatPrice } from '@/lib/utils';
import api from '@/lib/axios';
import styles from './CheckoutModal.module.scss';
import { useRouter } from 'next/navigation';

interface CheckoutModalProps {
	isOpen: boolean;
	onClose: () => void;
	items: CartItem[];
}

export function CheckoutModal({ isOpen, onClose, items }: CheckoutModalProps) {
	const { user } = useAuth();
	const router = useRouter();
	const { getTotal, clearCart } = useCartStore();
	const addToast = useUIStore((state) => state.addToast);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [address, setAddress] = useState<OrderAddress>({
		street: user?.address?.street || '',
		city: user?.address?.city || '',
		zipCode: user?.address?.zipCode || '',
		phone: user?.address?.phone || '',
		buildingNumber: user?.address?.buildingNumber || '',
		apartmentNumber: user?.address?.apartmentNumber || '',
	});

	useEffect(() => {
		if (user?.address) {
			setAddress({
				street: user.address.street || '',
				city: user.address.city || '',
				zipCode: user.address.zipCode || '',
				phone: user.address.phone || '',
				buildingNumber: user?.address?.buildingNumber || '',
				apartmentNumber: user.address.apartmentNumber || '',
			});
		}
	}, [user]);

	if (!isOpen) return null;

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!address.street.trim()) {
			newErrors.street = 'Ulica jest wymagana';
		}

		if (!address.city.trim()) {
			newErrors.city = 'Miasto jest wymagane';
		}

		if (!address.zipCode.trim()) {
			newErrors.zipCode = 'Kod pocztowy jest wymagany';
		} else if (!/^\d{2}-\d{3}$/.test(address.zipCode)) {
			newErrors.zipCode = 'Nieprawidłowy format kodu pocztowego';
		}

		if (!address.phone.trim()) {
			newErrors.phone = 'Numer telefonu jest wymagany';
		} else if (!/^[+\d\s-]{9,}$/.test(address.phone.replace(/\s/g, ''))) {
			newErrors.phone = 'Nieprawidłowy numer telefonu';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			setIsSubmitting(true);

			const orderData: CreateOrderRequest = {
				address: {
					buildingNumber: address.buildingNumber.trim(),
					street: address.street.trim(),
					city: address.city.trim(),
					zipCode: address.zipCode.trim(),
					phone: address.phone.trim(),
					apartmentNumber: address.apartmentNumber?.trim() || undefined,
				},
			};

			const response = await api.post('/orders', orderData);

			clearCart();

			addToast('Zamówienie zostało złożone pomyślnie!', 'success');
			onClose();

			router.push(`/orders/${response.data.id}`);
		} catch (err: any) {
			console.error('Error creating order:', err);
			const message = err.response?.data?.message || 'Nie udało się złożyć zamówienia';
			addToast(message, 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (field: keyof OrderAddress, value: string) => {
		setAddress((prev) => ({ ...prev, [field]: value }));

		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: '' }));
		}
	};

	const total = getTotal();

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<div className={styles.header}>
					<h2 className={styles.title}>
						<CreditCard className={styles.titleIcon} />
						Podsumowanie zamówienia
					</h2>
					<button className={styles.closeButton} onClick={onClose} aria-label="Zamknij">
						<X size={24} />
					</button>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>
							<MapPin className={styles.sectionIcon} />
							Adres dostawy
						</h3>

						<div className={styles.formGrid}>
							<div className={styles.formGroup}>
								<label htmlFor="street" className={styles.label}>
									Ulica *
								</label>
								<input
									id="street"
									type="text"
									value={address.street}
									onChange={(e) => handleChange('street', e.target.value)}
									className={`${styles.input} ${errors.street ? styles.inputError : ''}`}
									placeholder="np. Mickiewicza"
									disabled={isSubmitting}
								/>
								{errors.street && (
									<span className={styles.error}>{errors.street}</span>
								)}
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="city" className={styles.label}>
									Miasto *
								</label>
								<input
									id="city"
									type="text"
									value={address.city}
									onChange={(e) => handleChange('city', e.target.value)}
									className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
									placeholder="np. Kraków"
									disabled={isSubmitting}
								/>
								{errors.city && <span className={styles.error}>{errors.city}</span>}
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="buildingNumber" className={styles.label}>
									Numer budynku *
								</label>
								<input
									id="building"
									type="text"
									value={address.buildingNumber || ''}
									onChange={(e) => handleChange('buildingNumber', e.target.value)}
									className={styles.input}
									placeholder="np. 67"
									disabled={isSubmitting}
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="apartmentNumber" className={styles.label}>
									Numer mieszkania
								</label>
								<input
									id="apartmentNumber"
									type="text"
									value={address.apartmentNumber || ''}
									onChange={(e) =>
										handleChange('apartmentNumber', e.target.value)
									}
									className={styles.input}
									placeholder="np. 12"
									disabled={isSubmitting}
								/>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="zipCode" className={styles.label}>
									Kod pocztowy *
								</label>
								<input
									id="zipCode"
									type="text"
									value={address.zipCode}
									onChange={(e) => handleChange('zipCode', e.target.value)}
									className={`${styles.input} ${errors.zipCode ? styles.inputError : ''}`}
									placeholder="np. 30-059"
									disabled={isSubmitting}
								/>
								{errors.zipCode && (
									<span className={styles.error}>{errors.zipCode}</span>
								)}
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="phone" className={styles.label}>
									Numer telefonu *
								</label>
								<input
									id="phone"
									type="tel"
									value={address.phone}
									onChange={(e) => handleChange('phone', e.target.value)}
									className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
									placeholder="np. +48 123 456 789"
									disabled={isSubmitting}
								/>
								{errors.phone && (
									<span className={styles.error}>{errors.phone}</span>
								)}
							</div>
						</div>
					</div>

					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>
							<Shield className={styles.sectionIcon} />
							Podsumowanie
						</h3>

						<div className={styles.orderSummary}>
							<div className={styles.summaryItem}>
								<span>Liczba produktów:</span>
								<span>{items.length}</span>
							</div>
							<div className={styles.summaryItem}>
								<span>Wartość zamówienia:</span>
								<span>{formatPrice(total)}</span>
							</div>
							<div className={styles.summaryTotal}>
								<span>Do zapłaty:</span>
								<span className={styles.totalAmount}>{formatPrice(total)}</span>
							</div>
						</div>

						<div className={styles.terms}>
							<p className={styles.termsText}>
								Klikając "Złóż zamówienie", akceptujesz
								<a href="/terms" className={styles.termsLink}>
									{' '}
									Regulamin
								</a>{' '}
								oraz
								<a href="/privacy" className={styles.termsLink}>
									{' '}
									Politykę prywatności
								</a>
								.
							</p>
						</div>
					</div>

					<div className={styles.actions}>
						<button
							type="button"
							className={styles.cancelButton}
							onClick={onClose}
							disabled={isSubmitting}
						>
							Anuluj
						</button>
						<button
							type="submit"
							className={styles.submitButton}
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Loader className={styles.spinner} />
									Przetwarzanie...
								</>
							) : (
								'Złóż zamówienie'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
