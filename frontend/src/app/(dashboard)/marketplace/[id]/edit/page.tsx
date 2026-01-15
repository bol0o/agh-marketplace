'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { ProductForm } from '@/components/marketplace/ProductForm';
import api from '@/lib/axios';
import styles from '../../create/CreateProduct.module.scss';
import { Product } from '@/types/marketplace';

export default function EditProductPage() {
	const { id } = useParams() as { id: string };
	const router = useRouter();

	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [product, setProduct] = useState<Product | null>(null);

	useEffect(() => {
		fetchProduct();
	}, [id]);

	const fetchProduct = async (): Promise<void> => {
		try {
			const response = await api.get<Product>(`/products/${id}`);

			console.log(response.data);

			setProduct(response.data);
		} catch (err: any) {
			setError('Nie udało się pobrać produktu');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (
		productData: Omit<Product, 'id' | 'seller' | 'views' | 'createdAt' | 'status'> & {
			isAuction?: boolean;
			auctionEnd?: string;
		}
	): Promise<void> => {
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

			{product && (
				<ProductForm
					initialData={product}
					onSubmit={handleSubmit}
					isSubmitting={submitting}
					submitError={error}
					setSubmitError={setError}
					mode="edit"
				/>
			)}
		</div>
	);
}
