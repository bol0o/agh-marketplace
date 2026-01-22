'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { isAxiosError } from 'axios';
import { ProductForm, ProductFormData } from '@/components/marketplace/ProductForm';
import api from '@/lib/axios';
import styles from './CreateProduct.module.scss';

export default function CreateProductPage() {
	const router = useRouter();

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);

	const handleSubmit = async (productData: ProductFormData) => {
		try {
			setSubmitting(true);
			setError(undefined);

			const response = await api.post('/products', productData);

			router.push(`/marketplace/${response.data.id}`);
		} catch (err: unknown) {
			console.error('Error creating product:', err);

			if (isAxiosError(err)) {
				const errorMessage = err.response?.data?.error || 'Nie udało się dodać produktu';
				setError(errorMessage);
			} else if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Wystąpił nieoczekiwany błąd');
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<button onClick={() => router.push('/marketplace')} className={styles.backButton}>
					<ArrowLeft size={20} />
					<span>Wróć</span>
				</button>

				<h1 className={styles.title}>
					<Plus size={24} />
					<span>Dodaj nowy produkt</span>
				</h1>
			</header>

			<ProductForm
				onSubmit={handleSubmit}
				isSubmitting={submitting}
				submitError={error}
				setSubmitError={setError}
				mode="create"
			/>
		</div>
	);
}
