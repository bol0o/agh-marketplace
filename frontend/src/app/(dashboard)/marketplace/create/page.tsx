'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { ProductForm } from '@/components/marketplace/ProductForm';
import api from '@/lib/axios';
import styles from './CreateProduct.module.scss';
import { Product } from '@/types/marketplace';

export default function CreateProductPage() {
	const router = useRouter();

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (productData: Product) => {
		try {
			setSubmitting(true);
			setError(null);

			const response = await api.post('/products', productData);

			router.push(`/marketplace/${response.data.id}`);
		} catch (err: any) {
			setError(err.response?.data?.error || 'Nie udało się dodać produktu');
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
				mode="create"
			/>
		</div>
	);
}
