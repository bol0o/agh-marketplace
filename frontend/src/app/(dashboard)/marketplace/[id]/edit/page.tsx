'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { ProductForm } from '@/components/marketplace/ProductForm';
import api from '@/lib/axios';
import styles from '../../create/CreateProduct.module.scss';
import { Product } from '@/types/marketplace';

export default function EditProductPage() {
	const { id } = useParams();
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [product, setProduct] = useState<any>(null);

	useEffect(() => {
		fetchProduct();
	}, [id]);

	const fetchProduct = async () => {
		try {
			const response = await api.get(`/products/${id}`);
			const productData = response.data;

			const formData = {
				...productData,
			};

			setProduct(formData);
		} catch (err: any) {
			setError('Nie udało się pobrać produktu');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (productData: Product) => {
		try {
			setSubmitting(true);
			setError(null);

			await api.patch(`/products/${id}`, productData);

			router.push(`/marketplace/${id}`);
			router.refresh();
		} catch (err: any) {
			setError(err.response?.data?.error || 'Nie udało się zapisać zmian');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className={styles.loadingWrapper}>
				<div className={styles.spinner}></div>
				<p>Ładowanie...</p>
			</div>
		);
	}

	if (error && !product) {
		return (
			<div className={styles.errorWrapper}>
				<AlertCircle size={48} />
				<h3>Błąd</h3>
				<p>{error}</p>
				<button onClick={() => router.back()} className={styles.backButton}>
					Wróć
				</button>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<button
					onClick={() => router.push(`/marketplace/${id}`)}
					className={styles.backButton}
				>
					<ArrowLeft size={20} />
					<span>Wróć do produktu</span>
				</button>

				<h1 className={styles.title}>
					<Save size={24} />
					<span>Edytuj produkt</span>
				</h1>
			</header>

			<ProductForm
				initialData={product}
				onSubmit={handleSubmit}
				isSubmitting={submitting}
				submitError={error}
				mode="edit"
			/>
		</div>
	);
}
