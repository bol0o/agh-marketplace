'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2 } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import styles from './ProductForm.module.scss';

// Typ danych formularza (to co wysyłamy do backendu)
export interface ProductFormData {
	title: string;
	description: string;
	price: number;
	category: string;
	condition: 'new' | 'used' | 'damaged';
	type: 'auction' | 'buy_now';
	location: string;
	image: string | null;
}

interface ProductFormProps {
	initialData?: ProductFormData;
	onSubmit: (data: ProductFormData) => Promise<void>;
	isEditing?: boolean;
}

const CATEGORIES = ['Elektronika', 'Książki', 'Notatki', 'Akcesoria', 'Mieszkania', 'Inne'];

export function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
	const router = useRouter();
	const addToast = useUIStore((s) => s.addToast);
	const [isLoading, setIsLoading] = useState(false);

	// Stan formularza
	const [formData, setFormData] = useState<ProductFormData>(
		initialData || {
			title: '',
			description: '',
			price: 0,
			category: CATEGORIES[0],
			condition: 'used',
			type: 'buy_now',
			location: '',
			image: null,
		}
	);

	// SYMULACJA UPLOADU ZDJĘCIA (Tutaj w przyszłości wepniesz Cloudinary)
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Symulujemy czas uploadu
		setIsLoading(true);
		setTimeout(() => {
			// W prawdziwej appce tu dostaniesz URL z API Cloudinary
			const fakeUrl = URL.createObjectURL(file);
			setFormData((prev) => ({ ...prev, image: fakeUrl }));
			setIsLoading(false);
			addToast('Zdjęcie dodane (symulacja)', 'success');
		}, 1000);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.image) {
			addToast('Dodaj zdjęcie przedmiotu', 'error');
			return;
		}

		setIsLoading(true);
		try {
			await onSubmit(formData);
		} catch (error) {
			addToast('Wystąpił błąd', 'error');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className={styles.formWrapper}>
			{/* SEKCJA ZDJĘCIA */}
			<div className={styles.imageSection}>
				{formData.image ? (
					<div className={styles.preview}>
						<img src={formData.image} alt="Podgląd" />
						<button
							type="button"
							className={styles.removeImgBtn}
							onClick={() => setFormData((p) => ({ ...p, image: null }))}
						>
							<X size={20} />
						</button>
					</div>
				) : (
					<label className={styles.uploadArea}>
						<input type="file" hidden accept="image/*" onChange={handleImageUpload} />
						<Upload size={32} />
						<span>Kliknij, aby dodać zdjęcie</span>
						<small>JPG, PNG max 5MB</small>
					</label>
				)}
			</div>

			{/* POLA TEKSTOWE */}
			<div className={styles.fieldsGrid}>
				<div className={styles.formGroup}>
					<label>Tytuł ogłoszenia</label>
					<input
						required
						type="text"
						value={formData.title}
						onChange={(e) => setFormData({ ...formData, title: e.target.value })}
						placeholder="np. Podręcznik do Fizyki"
					/>
				</div>

				<div className={styles.row}>
					<div className={styles.formGroup}>
						<label>Cena (PLN)</label>
						<input
							required
							type="number"
							min="0"
							value={formData.price}
							onChange={(e) =>
								setFormData({ ...formData, price: Number(e.target.value) })
							}
						/>
					</div>
					<div className={styles.formGroup}>
						<label>Typ oferty</label>
						<select
							value={formData.type}
							onChange={(e) =>
								setFormData({ ...formData, type: e.target.value as any })
							}
						>
							<option value="buy_now">Kup Teraz</option>
							<option value="auction">Licytacja</option>
						</select>
					</div>
				</div>

				<div className={styles.row}>
					<div className={styles.formGroup}>
						<label>Kategoria</label>
						<select
							value={formData.category}
							onChange={(e) => setFormData({ ...formData, category: e.target.value })}
						>
							{CATEGORIES.map((c) => (
								<option key={c} value={c}>
									{c}
								</option>
							))}
						</select>
					</div>
					<div className={styles.formGroup}>
						<label>Stan</label>
						<select
							value={formData.condition}
							onChange={(e) =>
								setFormData({ ...formData, condition: e.target.value as any })
							}
						>
							<option value="new">Nowy</option>
							<option value="used">Używany</option>
							<option value="damaged">Uszkodzony</option>
						</select>
					</div>
				</div>

				<div className={styles.formGroup}>
					<label>Lokalizacja odbioru</label>
					<input
						required
						type="text"
						value={formData.location}
						onChange={(e) => setFormData({ ...formData, location: e.target.value })}
						placeholder="np. MS AGH, Budynek C-2"
					/>
				</div>

				<div className={styles.formGroup}>
					<label>Opis przedmiotu</label>
					<textarea
						required
						rows={5}
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						placeholder="Opisz szczegóły, wady, powód sprzedaży..."
					/>
				</div>
			</div>

			<div className={styles.actions}>
				<button type="button" className={styles.cancelBtn} onClick={() => router.back()}>
					Anuluj
				</button>
				<button type="submit" className={styles.submitBtn} disabled={isLoading}>
					{isLoading && <Loader2 className={styles.spin} size={18} />}
					{isEditing ? 'Zapisz zmiany' : 'Dodaj ogłoszenie'}
				</button>
			</div>
		</form>
	);
}
