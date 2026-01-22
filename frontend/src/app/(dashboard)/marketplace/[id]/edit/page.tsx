'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, ShieldAlert, Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import { ProductForm } from '@/components/marketplace/ProductForm';
import api from '@/lib/axios';
import styles from '../../create/CreateProduct.module.scss';
import { Product } from '@/types/marketplace';
import { useAuth } from '@/store/useAuth';

export default function EditProductPage() {
	const { id } = useParams() as { id: string };
	const router = useRouter();
	const { user, isAuthenticated, isLoading: authLoading } = useAuth();

	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [product, setProduct] = useState<Product | null>(null);
	const [isOwner, setIsOwner] = useState<boolean>(false);

	const fetchProduct = useCallback(async (): Promise<void> => {
		try {
			setLoading(true);
			const response = await api.get<Product>(`/products/${id}`);
			const productData = response.data;

			setProduct(productData);

			if (user) {
				const ownerCheck = productData.seller.id === user.id || user.role === 'admin';
				setIsOwner(ownerCheck);

				if (!ownerCheck) {
					setError('Nie masz uprawnień do edycji tego produktu');
					setTimeout(() => {
						router.push(`/marketplace/${id}`);
					}, 3000);
				}
			}
		} catch (err: unknown) {
			console.error('Error fetching product:', err);

			if (isAxiosError(err)) {
				if (err.response?.status === 404) {
					setError('Produkt nie istnieje');
				} else {
					setError('Nie udało się pobrać produktu');
				}
			} else {
				setError('Wystąpił nieoczekiwany błąd');
			}
		} finally {
			setLoading(false);
		}
	}, [id, user, router]);

	useEffect(() => {
		if (!authLoading) {
			if (!isAuthenticated || !user) {
				router.push(
					'/login?redirect=' + encodeURIComponent(`/marketplace/products/${id}/edit`)
				);
				return;
			}
			fetchProduct();
		}
	}, [id, authLoading, isAuthenticated, user, router, fetchProduct]);

	const handleSubmit = async (
		productData: Omit<Product, 'id' | 'seller' | 'views' | 'createdAt' | 'status'> & {
			isAuction?: boolean;
			auctionEnd?: string;
		}
	): Promise<void> => {
		try {
			setSubmitting(true);
			setError(undefined);

			if (!isOwner) {
				throw new Error('Nie masz uprawnień do edycji tego produktu');
			}

			await api.patch(`/products/${id}`, productData);

			router.push(`/marketplace/${id}`);
			router.refresh();
		} catch (err: unknown) {
			console.error('Error updating product:', err);

			let errorMessage = 'Nie udało się zapisać zmian';

			if (isAxiosError(err)) {
				errorMessage = err.response?.data?.error || err.message || errorMessage;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			setError(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	if (authLoading || loading) {
		return (
			<div className={styles.loadingWrapper}>
				<Loader2 className={styles.spinner} size={48} />
				<p className={styles.loadingText}>Ładowanie produktu...</p>
			</div>
		);
	}

	if (!isOwner && product) {
		return (
			<div className={styles.errorWrapper}>
				<ShieldAlert size={48} />
				<h3>Brak uprawnień</h3>
				<p>Nie masz uprawnień do edycji tego produktu.</p>
				<p>Przekierowanie na stronę produktu za 3 sekundy...</p>
				<button
					onClick={() => router.push(`/marketplace/${id}`)}
					className={styles.backButton}
				>
					Przejdź do produktu
				</button>
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
					{user?.role === 'admin' && (
						<span className={styles.adminBadge}>Tryb administratora</span>
					)}
				</h1>
			</header>

			{product && isOwner && (
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
