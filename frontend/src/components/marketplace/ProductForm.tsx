'use client';

import { useState, useEffect } from 'react';
import {
	AlertCircle,
	Image as ImageIcon,
	X,
	Clock,
	Book,
	Cpu,
	Headphones,
	Shirt,
	Package,
	Tag,
	Coins,
	Gavel,
} from 'lucide-react';
import { Product, ProductCategory, ProductCondition } from '@/types/marketplace';
import { useImageUpload } from '@/hooks/useImageUpload';
import styles from './ProductForm.module.scss';
import Image from 'next/image';

const CATEGORIES: {
	value: ProductCategory;
	label: string;
	icon: React.ReactNode;
	color: string;
}[] = [
	{
		value: 'BOOKS',
		label: 'Książki',
		icon: <Book size={16} />,
		color: '#8b5cf6',
	},
	{
		value: 'ELECTRONICS',
		label: 'Elektronika',
		icon: <Cpu size={16} />,
		color: '#3b82f6',
	},
	{
		value: 'ACCESSORIES',
		label: 'Akcesoria',
		icon: <Headphones size={16} />,
		color: '#10b981',
	},
	{
		value: 'CLOTHING',
		label: 'Odzież',
		icon: <Shirt size={16} />,
		color: '#ec4899',
	},
	{
		value: 'OTHER',
		label: 'Inne',
		icon: <Package size={16} />,
		color: '#64748b',
	},
];

const CONDITIONS: { value: ProductCondition; label: string; color: string }[] = [
	{ value: 'new', label: 'Nowy', color: '#16a34a' },
	{ value: 'used', label: 'Używany', color: '#f59e0b' },
	{ value: 'damaged', label: 'Uszkodzony', color: '#dc2626' },
];

export interface ProductFormProps {
	initialData?: Partial<Product> & { auctionEnd?: string };
	onSubmit: (data: ProductFormData) => Promise<void>;
	isSubmitting: boolean;
	submitError?: string;
	mode: 'create' | 'edit';
	setSubmitError: (error: string | undefined) => void;
}

export type ProductFormData = Omit<Product, 'id' | 'seller' | 'views' | 'createdAt' | 'status'> & {
	isAuction?: boolean;
	auctionEnd?: string;
};

export function ProductForm({
	initialData,
	onSubmit,
	isSubmitting,
	submitError,
	mode,
	setSubmitError,
}: ProductFormProps) {
	const { uploadImage, uploading: imageUploading, error: uploadError } = useImageUpload();

	const [formData, setFormData] = useState<ProductFormData>({
		title: '',
		description: '',
		price: 0,
		category: 'OTHER',
		condition: 'used',
		type: 'buy_now',
		location: '',
		stock: 1,
		image: undefined,
		endsAt: null,
	});

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	useEffect(() => {
		if (initialData) {
			const transformedData: ProductFormData = {
				title: initialData.title || '',
				description: initialData.description || '',
				price: initialData.price || 0,
				category: initialData.category || 'OTHER',
				condition: initialData.condition || 'used',
				type: initialData.type || 'buy_now',
				location: initialData.location || '',
				stock: initialData.stock || 1,
				image: initialData.image || undefined,
				endsAt: initialData.endsAt || null,
			};

			setFormData(transformedData);

			if (initialData.image) {
				setImagePreview(initialData.image);
			}
		}
	}, [initialData]);

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			if (file.size > 5 * 1024 * 1024) {
				throw new Error('Plik jest zbyt duży. Maksymalny rozmiar to 5MB.');
			}

			if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
				return;
			}

			setSelectedImage(file);

			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	const removeImage = () => {
		setSelectedImage(null);
		setImagePreview(null);
		setFormData((prev) => ({ ...prev, image: undefined }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (!formData.title || formData.title.length < 3) {
				throw new Error('Tytuł musi mieć co najmniej 3 znaki');
			}

			if (!formData.description || formData.description.length < 10) {
				throw new Error('Opis musi mieć co najmniej 10 znaków');
			}

			if (formData.price <= 0) {
				throw new Error('Cena musi być większa niż 0');
			}

			if (formData.stock < 1) {
				throw new Error('Ilość musi być większa niż 0');
			}

			if (!formData.location) {
				throw new Error('Podaj lokalizację');
			}

			if (formData.type === 'auction' && !formData.endsAt) {
				throw new Error('Podaj datę zakończenia aukcji');
			}

			if (formData.type === 'auction' && formData.endsAt) {
				const auctionEnd = new Date(formData.endsAt);
				if (auctionEnd <= new Date()) {
					throw new Error('Data zakończenia aukcji musi być w przyszłości');
				}
			}

			let finalImage = formData.image || undefined;

			if (selectedImage) {
				try {
					const uploadedUrl = await uploadImage(selectedImage);
					if (!uploadedUrl) {
						throw new Error('Nie udało się przesłać obrazka');
					}
					finalImage = uploadedUrl;
				} catch (uploadErr: unknown) {
					console.error('Image upload error:', uploadErr);
					const errorMessage =
						uploadErr instanceof Error ? uploadErr.message : 'Nieznany błąd';
					throw new Error(`Błąd przesyłania obrazka: ${errorMessage}`);
				}
			}

			let endsAtFormatted = undefined;
			if (formData.type === 'auction' && formData.endsAt) {
				const date = new Date(formData.endsAt);
				endsAtFormatted = date.toISOString();
			} else if (formData.type === 'buy_now') {
				endsAtFormatted = null;
			}

			const apiPayload = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				price: Number(formData.price),
				category: formData.category,
				condition: formData.condition,
				type: formData.type,
				location: formData.location.trim(),
				stock: Number(formData.stock),
				imageUrl: finalImage,
				endsAt: endsAtFormatted,
			};

			await onSubmit(apiPayload as unknown as ProductFormData);
		} catch (err: unknown) {
			console.error(err);
			if (err instanceof Error) {
				setSubmitError(err.message);
			} else {
				setSubmitError('Wystąpił nieoczekiwany błąd formularza');
			}
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;

		if (type === 'checkbox') {
			const checked = (e.target as HTMLInputElement).checked;
			setFormData((prev) => ({
				...prev,
				[name]: checked,
			}));
		} else if (name === 'type') {
			const productType = value as 'auction' | 'buy_now';
			setFormData((prev) => ({
				...prev,
				type: productType,
				endsAt: productType === 'auction' ? prev.endsAt : null,
			}));
		} else if (type === 'number') {
			setFormData((prev) => ({
				...prev,
				[name]: value === '' ? '' : parseFloat(value),
			}));
		} else if (type === 'datetime-local') {
			setFormData((prev) => ({
				...prev,
				[name]: value ? value + ':00' : null,
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleConditionSelect = (condition: ProductCondition) => {
		setFormData((prev) => ({ ...prev, condition }));
	};

	const handleCategorySelect = (category: ProductCategory) => {
		setFormData((prev) => ({ ...prev, category }));
	};

	const formatForDateTimeLocal = (date: Date | string | null) => {
		if (!date) return '';

		const d = new Date(date);
		d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
		return d.toISOString().slice(0, 16);
	};

	const isAuction = formData.type === 'auction';

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<div className={styles.formGrid}>
				<div className={styles.imageSection}>
					<h2 className={styles.sectionTitle}>Zdjęcie produktu</h2>

					<div className={styles.imageUploadArea}>
						{imagePreview ? (
							<div className={styles.imagePreviewContainer}>
								<Image
									src={imagePreview}
									alt="Podgląd produktu"
									fill
									className={styles.imagePreview}
									sizes="(max-width: 768px) 100vw, 50vw"
									priority={mode === 'create'}
								/>
								<button
									type="button"
									onClick={removeImage}
									className={styles.removeImageButton}
								>
									<X size={20} />
									<span>Usuń</span>
								</button>
							</div>
						) : (
							<label className={styles.uploadZone}>
								<ImageIcon size={48} />
								<span>Kliknij aby wybrać zdjęcie</span>
								<small>Zalecane: 1200×800px, JPG/PNG, max 5MB</small>
								<input
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className={styles.fileInput}
									disabled={imageUploading}
								/>
							</label>
						)}

						{imageUploading && (
							<div className={styles.uploadingOverlay}>
								<div className={styles.uploadingSpinner}></div>
								<span>Przesyłanie obrazka...</span>
							</div>
						)}

						{uploadError && (
							<div className={styles.uploadError}>
								<AlertCircle size={16} />
								<span>{uploadError}</span>
							</div>
						)}
					</div>

					<div className={styles.imageTips}>
						<h4>Wskazówki:</h4>
						<ul>
							<li>Używaj wyraźnych, dobrze oświetlonych zdjęć</li>
							<li>Pokazuj produkt z różnych stron</li>
							<li>Zdjęcia pomagają zwiększyć sprzedaż!</li>
						</ul>
					</div>
				</div>

				<div className={styles.detailsSection}>
					<h2 className={styles.sectionTitle}>Szczegóły produktu</h2>

					<div className={styles.formGroup}>
						<label htmlFor="title">Tytuł *</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
							placeholder="Co sprzedajesz?"
							maxLength={100}
						/>
						<small className={styles.charCounter}>
							{formData.title.length}/100 znaków
						</small>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="description">Opis *</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							required
							rows={5}
							placeholder="Opisz szczegółowo swój produkt..."
							maxLength={2000}
						/>
						<small className={styles.charCounter}>
							{formData.description.length}/2000 znaków
						</small>
					</div>

					<div className={styles.grid2}>
						<div className={styles.formGroup}>
							<label htmlFor="price">Cena (zł) *</label>
							<div className={styles.priceInput}>
								<input
									type="number"
									id="price"
									name="price"
									value={formData.price || ''}
									onChange={handleChange}
									required
									min="0"
									step="0.01"
									placeholder="0.00"
								/>
								<span className={styles.currency}>zł</span>
							</div>
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="stock">Ilość *</label>
							<input
								type="number"
								id="stock"
								name="stock"
								value={formData.stock || ''}
								onChange={handleChange}
								required
								min="1"
								placeholder="1"
							/>
						</div>
					</div>

					<div className={styles.grid2}>
						<div className={styles.formGroup}>
							<label htmlFor="category">Kategoria *</label>
							<div className={styles.categoryButtons}>
								<button
									type="button"
									className={`${styles.categoryButton} ${styles.categoryAll} ${
										!formData.category ? styles.active : ''
									}`}
									onClick={() => handleCategorySelect('OTHER')}
									disabled={mode === 'create'}
								>
									<div className={styles.categoryIconWrapper}>
										<Tag size={16} />
									</div>
									<span>Wybierz</span>
								</button>

								{CATEGORIES.map((category) => {
									const isActive = formData.category === category.value;
									return (
										<button
											key={category.value}
											type="button"
											className={`${styles.categoryButton} ${
												isActive ? styles.active : ''
											}`}
											onClick={() => handleCategorySelect(category.value)}
										>
											<div
												className={styles.categoryIconWrapper}
												style={{
													backgroundColor: isActive
														? category.color
														: `${category.color}15`,
													color: isActive ? '#fff' : category.color,
												}}
											>
												{category.icon}
											</div>
											<span>{category.label}</span>
										</button>
									);
								})}
							</div>
						</div>

						<div className={styles.formGroup}>
							<label>Stan *</label>
							<div className={styles.conditionButtons}>
								{CONDITIONS.map((cond) => {
									const isActive = formData.condition === cond.value;
									return (
										<button
											key={cond.value}
											type="button"
											className={styles.conditionButton}
											onClick={() => handleConditionSelect(cond.value)}
											style={
												isActive
													? {
															borderColor: cond.color,
															backgroundColor: `${cond.color}10`,
														}
													: {}
											}
										>
											<span
												className={styles.conditionDot}
												style={{ backgroundColor: cond.color }}
											/>
											{cond.label}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="location">Lokalizacja *</label>
						<input
							type="text"
							id="location"
							name="location"
							value={formData.location}
							onChange={handleChange}
							required
							placeholder="Np. Kraków, Małopolskie"
						/>
					</div>
				</div>

				<div className={styles.offerSection}>
					<h2 className={styles.sectionTitle}>Typ oferty</h2>

					<div className={styles.offerTypes}>
						<label
							className={`${styles.offerType} ${
								formData.type === 'buy_now' ? styles.active : ''
							}`}
						>
							<input
								type="radio"
								name="type"
								value="buy_now"
								checked={formData.type === 'buy_now'}
								onChange={handleChange}
							/>
							<div className={styles.offerContent}>
								<div
									className={styles.offerIcon}
									style={{
										backgroundColor:
											formData.type === 'buy_now' ? '#10b981' : '#f3f4f6',
										color: formData.type === 'buy_now' ? 'white' : '#10b981',
									}}
								>
									<Coins size={24} />
								</div>
								<div>
									<h3>Kup Teraz</h3>
									<p>Stała cena, natychmiastowy zakup</p>
								</div>
							</div>
						</label>

						<label
							className={`${styles.offerType} ${
								formData.type === 'auction' ? styles.active : ''
							}`}
						>
							<input
								type="radio"
								name="type"
								value="auction"
								checked={formData.type === 'auction'}
								onChange={handleChange}
							/>
							<div className={styles.offerContent}>
								<div
									className={styles.offerIcon}
									style={{
										backgroundColor:
											formData.type === 'auction' ? '#a855f7' : '#f3f4f6',
										color: formData.type === 'auction' ? 'white' : '#a855f7',
									}}
								>
									<Gavel size={24} />
								</div>
								<div>
									<h3>Aukcja</h3>
									<p>Licytacja, wygrywa najwyższa oferta</p>
								</div>
							</div>
						</label>
					</div>

					{isAuction && (
						<div className={styles.auctionSettings}>
							<div className={styles.formGroup}>
								<label htmlFor="endsAt">
									<Clock size={16} />
									Data zakończenia aukcji *
								</label>
								<input
									type="datetime-local"
									id="endsAt"
									name="endsAt"
									value={
										formData.endsAt
											? formatForDateTimeLocal(formData.endsAt)
											: ''
									}
									onChange={handleChange}
									required={isAuction}
									min={formatForDateTimeLocal(new Date())}
								/>
							</div>

							<div className={styles.auctionTips}>
								<h4>Wskazówki dla aukcji:</h4>
								<ul>
									<li>Ustaw rozsądny czas trwania (3-7 dni)</li>
									<li>Dodaj wyraźne zdjęcia produktu</li>
									<li>Opisz dokładnie stan produktu</li>
								</ul>
							</div>
						</div>
					)}
				</div>
			</div>

			{submitError && (
				<div className={styles.errorMessage}>
					<AlertCircle size={18} />
					<span>{submitError}</span>
				</div>
			)}

			{/* Przyciski */}
			<div className={styles.formActions}>
				<button
					type="button"
					onClick={() => window.history.back()}
					className={styles.cancelButton}
					disabled={isSubmitting || imageUploading}
				>
					Anuluj
				</button>

				<button type="submit" disabled={isSubmitting} className={styles.submitButton}>
					{isSubmitting || imageUploading ? (
						<>
							<div className={styles.spinner}></div>
							<span>{mode === 'edit' ? 'Zapisywanie...' : 'Dodawanie...'}</span>
						</>
					) : (
						<span>{mode === 'edit' ? 'Zapisz zmiany' : 'Dodaj produkt'}</span>
					)}
				</button>
			</div>
		</form>
	);
}
