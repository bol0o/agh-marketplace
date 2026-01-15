'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Product } from '@/types/marketplace';
import { useAuth } from '@/store/useAuth';
import { ProductImageSection } from '@/components/marketplace/ProductImageSection';
import { SellerInfoCard } from '@/components/marketplace/SellerInfoCard';
import { ProductDetailsCard } from '@/components/marketplace/ProductDetailsCard';
import { ProductActions } from '@/components/marketplace/ProductActions';
import { BidHistory } from '@/components/marketplace/BidHistory';
import { BidForm } from '@/components/marketplace/BidForm';
import { AuctionTimer } from '@/components/marketplace/AuctionTimer';
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
	const { id } = useParams() as { id: string };
	const router = useRouter();
	const { user, isLoading: authLoading, isAuthenticated } = useAuth();

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [refreshBids, setRefreshBids] = useState(0);
	const [authChecked, setAuthChecked] = useState(false);

	const isInitialMount = useRef(true);

	useEffect(() => {
		if (!isInitialMount.current) {
			return;
		}
		isInitialMount.current = false;

		fetchProduct();
	}, [id]);

	useEffect(() => {
		if (!authLoading && product) {
			checkOwnership();
			setAuthChecked(true);
		}
	}, [authLoading, product, user]);

	const fetchProduct = async (): Promise<void> => {
		try {
			setLoading(true);
			const response = await api.get<Product>(`/products/${id}`);
			const productData = response.data;
			setProduct(productData);
		} catch (err: any) {
			setError(err.response?.data?.error || 'Nie udało się pobrać produktu');
		} finally {
			setLoading(false);
		}
	};

	const checkOwnership = (): void => {
		if (user && product && product.seller.id === user.id) {
			setIsOwner(true);
		} else {
			setIsOwner(false);
		}
	};

	const handleDelete = async (): Promise<void> => {
		try {
			setIsDeleting(true);
			await api.delete(`/products/${id}`);
			router.push('/marketplace');
			router.refresh();
		} catch {
			setError('Nie udało się usunąć produktu');
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleEdit = (): void => {
		router.push(`/marketplace/${id}/edit`);
	};

	const handleContactSeller = (): void => {
		console.log('Otwórz chat z sprzedawcą');
	};

	const handleBuyNow = (): void => {
		console.log('Kup teraz');
	};

	const handleBid = (): void => {
		const bidSection = document.getElementById('bid-form-section');
		if (bidSection) {
			bidSection.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	};

	const handleBidSuccess = (newBidAmount: number): void => {
		if (product) {
			setProduct({
				...product,
				price: newBidAmount,
			});
		}
		setRefreshBids((prev) => prev + 1);
	};

	const handleFollowSeller = (): void => {
		console.log('Obserwuj sprzedawcę');
	};

	const renderOwnerActions = () => {
		if (authLoading || !authChecked) {
			return null;
		}

		if (isOwner) {
			return (
				<div className={styles.ownerActions}>
					<button onClick={handleEdit} className={styles.editButton}>
						<Edit size={18} />
						<span>Edytuj</span>
					</button>

					<button
						onClick={() => setShowDeleteConfirm(true)}
						className={styles.deleteButton}
						disabled={isDeleting}
					>
						<Trash2 size={18} />
						<span>{isDeleting ? 'Usuwanie...' : 'Usuń'}</span>
					</button>
				</div>
			);
		}

		return null;
	};

	if (loading) {
		return (
			<div className={styles.loadingWrapper}>
				<Loader2 className={styles.spinner} size={48} />
				<p className={styles.loadingText}>Ładowanie produktu...</p>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className={styles.errorWrapper}>
				<AlertCircle size={48} />
				<h3>Błąd</h3>
				<p>{error || 'Produkt nie został znaleziony'}</p>
				<Link href="/marketplace" className={styles.backButton}>
					Wróć do przeglądania
				</Link>
			</div>
		);
	}

	const isAuction = product.type === 'auction';
	const isActive = product.status === 'active';
	const auctionEnded = isAuction && product.endsAt && new Date(product.endsAt) <= new Date();
	const canBid = isAuction && isActive && !auctionEnded && isAuthenticated && user && !isOwner;

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<Link href="/marketplace" className={styles.backLink}>
					<ArrowLeft size={20} />
					<span>Wróć do przeglądania</span>
				</Link>

				{renderOwnerActions()}
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

						{isAuction && product.endsAt && (
							<div className={styles.auctionTimerSection}>
								<AuctionTimer endsAt={product.endsAt} />
							</div>
						)}
					</div>
				</div>

				<div className={styles.rightColumn}>
					<div className={styles.productHeader}>
						<div className={styles.categoryBadge}>
							<span className={styles.category}>
								{CATEGORY_NAMES[product.category]}
							</span>
						</div>
						<h1 className={styles.productTitle}>{product.title}</h1>
					</div>

					<ProductActions
						isAuction={isAuction}
						isActive={isActive}
						price={product.price}
						stock={product.stock}
						endsAt={product.endsAt}
						onBuy={handleBuyNow}
						onBid={handleBid}
						onContact={handleContactSeller}
					/>

					<div className={styles.descriptionSection}>
						<h3>Opis produktu</h3>
						<p className={styles.description}>{product.description}</p>
					</div>

					{isAuction && (
						<div className={styles.auctionSection}>
							{isActive && !auctionEnded ? (
								<>
									<BidHistory
										productId={product.id}
										currentPrice={product.price}
										key={refreshBids}
									/>

									<div id="bid-form-section" className={styles.bidFormSection}>
										{canBid ? (
											<BidForm
												productId={product.id}
												currentPrice={product.price}
												onBidSuccess={handleBidSuccess}
												minBidIncrement={1}
											/>
										) : !isAuthenticated ? (
											<div className={styles.loginPrompt}>
												<p>
													Aby złożyć ofertę, musisz się{' '}
													<Link href="/login">zalogować</Link>
												</p>
											</div>
										) : isOwner ? (
											<div className={styles.ownerNote}>
												<p>
													Jesteś właścicielem tej aukcji i nie możesz
													składać ofert
												</p>
											</div>
										) : null}
									</div>
								</>
							) : (
								<div className={styles.auctionEnded}>
									<h3>
										{auctionEnded ? 'Aukcja zakończona' : 'Produkt niedostępny'}
									</h3>
									<p>
										{auctionEnded
											? 'Ten produkt nie jest już dostępny do licytacji'
											: 'Ten produkt jest aktualnie niedostępny'}
									</p>
								</div>
							)}
						</div>
					)}
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
