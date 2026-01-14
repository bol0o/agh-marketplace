'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/types/marketplace';
import { useAuth } from '@/store/useAuth';
import { ProductImageSection } from '@/components/marketplace/ProductImageSection';
import { SellerInfoCard } from '@/components/marketplace/SellerInfoCard';
import { ProductDetailsCard } from '@/components/marketplace/ProductDetailsCard';
import { ProductActions } from '@/components/marketplace/ProductActions';
import styles from './ProductPage.module.scss';
import api from '@/lib/axios';

const CATEGORY_NAMES: Record<string, string> = {
	BOOKS: 'Książki',
	ELECTRONICS: 'Elektronika',
	ACCESSORIES: 'Akcesoria',
	CLOTHING: 'Odzież',
	OTHER: 'Inne',
};

const CONDITION_NAMES: Record<string, string> = {
	new: 'Nowy',
	used: 'Używany',
	damaged: 'Uszkodzony',
};

export default function ProductPage() {
	const { id } = useParams();
	const router = useRouter();
	const { user } = useAuth();

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	useEffect(() => {
		fetchProduct();
	}, [id]);

	const fetchProduct = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/products/${id}`);
			const productData = response.data;

			setProduct(productData);

			if (user && productData.seller.id === user.id) {
				setIsOwner(true);
			}
		} catch (err: any) {
			setError(err.response?.data?.error || 'Nie udało się pobrać produktu');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await api.delete(`/products/${id}`);
			router.push('/marketplace');
		} catch {
			setError('Nie udało się usunąć produktu');
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleEdit = () => {
		router.push(`/marketplace/${id}/edit`);
	};

	const handleContactSeller = () => {
		console.log('Otwórz chat z sprzedawcą');
	};

	const handleBuyNow = () => {
		console.log('Kup teraz');
	};

	const handleBid = () => {
		console.log('Licytuj');
	};

	const handleFollowSeller = () => {
		console.log('Licytuj');
	};

	if (loading) {
		return <div className={styles.loadingWrapper}>Ładowanie...</div>;
	}

	if (error || !product) {
		return <div className={styles.errorWrapper}>Błąd: {error}</div>;
	}

	const isAuction = product.type === 'auction';
	const isActive = product.status === 'active';

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<Link href="/marketplace" className={styles.backLink}>
					<ArrowLeft size={20} />
					<span>Wróć do przeglądania</span>
				</Link>

				{isOwner && (
					<div className={styles.ownerActions}>
						<button onClick={handleEdit} className={styles.editButton}>
							<Edit size={18} />
							<span>Edytuj</span>
						</button>

						<button
							onClick={() => setShowDeleteConfirm(true)}
							className={styles.deleteButton}
						>
							<Trash2 size={18} />
							<span>Usuń</span>
						</button>
					</div>
				)}
			</header>

			<div className={styles.mainContent}>
				<div className={styles.leftColumn}>
					<ProductImageSection
						imageUrl={product.image || '/images/placeholder.jpg'}
						type={product.type}
						status={product.status}
						title={product.title}
					/>

					<div className={styles.infoBoxes}>
						<SellerInfoCard
							seller={product.seller}
							onContact={handleContactSeller}
							onFollow={handleFollowSeller}
						/>

						<ProductDetailsCard
							category={product.category}
							condition={product.condition}
							location={product.location}
							views={product.views}
							createdAt={product.createdAt}
							endsAt={product.endsAt}
							categoryNames={CATEGORY_NAMES}
							conditionNames={CONDITION_NAMES}
						/>
					</div>
				</div>

				<div className={styles.rightColumn}>
					<div className={styles.productHeader}>
						<h1 className={styles.productTitle}>{product.title}</h1>
					</div>

					<ProductActions
						isAuction={isAuction}
						isActive={isActive}
						price={product.price}
						stock={product.stock}
						onBuy={handleBuyNow}
						onBid={handleBid}
						onContact={handleContactSeller}
					/>

					<div className={styles.descriptionSection}>
						<h3>Opis produktu</h3>
						<p>{product.description}</p>
					</div>
				</div>
			</div>

			{showDeleteConfirm && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<h3>Potwierdź usunięcie</h3>
						<p>Czy na pewno chcesz usunąć produkt &quot;{product.title}&quot;?</p>
						<div className={styles.modalActions}>
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className={styles.modalCancel}
							>
								Anuluj
							</button>
							<button
								onClick={handleDelete}
								className={styles.modalDelete}
								disabled={isDeleting}
							>
								{isDeleting ? 'Usuwanie...' : 'Usuń'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
