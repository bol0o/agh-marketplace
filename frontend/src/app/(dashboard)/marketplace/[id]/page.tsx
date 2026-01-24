'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Trash2, AlertCircle, Flag } from 'lucide-react';
import { isAxiosError } from 'axios';
import { Product } from '@/types/marketplace';
import { useAuth } from '@/store/useAuth';
import { useCart } from '@/hooks/useCart';
import { useReport } from '@/hooks/useReport';
import { ProductImageSection } from '@/components/marketplace/ProductImageSection';
import { SellerInfoCard } from '@/components/marketplace/SellerInfoCard';
import { ProductDetailsCard } from '@/components/marketplace/ProductDetailsCard';
import { ProductActions } from '@/components/marketplace/ProductActions';
import { BidHistory } from '@/components/marketplace/BidHistory';
import { BidForm } from '@/components/marketplace/BidForm';
import { AuctionTimer } from '@/components/marketplace/AuctionTimer';
import { ReportModal } from '@/components/shared/ReportModal';
import styles from './ProductPage.module.scss';
import api from '@/lib/axios';
import { useUIStore } from '@/store/uiStore';
import { PageLoading } from '@/components/shared/PageLoading';

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
	const { addToCart } = useCart();
	const { addToast } = useUIStore();
	const { createReport, loading: isReporting } = useReport(); // Dodano

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [refreshBids, setRefreshBids] = useState(0);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [isFollowingSeller, setIsFollowingSeller] = useState(false);
	const [isFollowingLoading, setIsFollowingLoading] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false); // Dodano

	const isOwner = !!(user && product && product.seller.id === user.id);

	const fetchProduct = useCallback(async (): Promise<void> => {
		try {
			setLoading(true);
			const response = await api.get<Product>(`/products/${id}`);
			const productData = response.data;
			setProduct(productData);
		} catch (err: unknown) {
			if (isAxiosError(err)) {
				setError(err.response?.data?.error || 'Nie udało się pobrać produktu');
			} else {
				setError('Wystąpił nieoczekiwany błąd');
			}
		} finally {
			setLoading(false);
		}
	}, [id]);

	const checkFollowStatus = useCallback(async () => {
		if (!user || !product || product.seller.id === user.id) return;

		try {
			const response = await api.get(`/social/follow/status/${product.seller.id}`);
			setIsFollowingSeller(response.data.isFollowing);
		} catch (error) {
			console.error('Error checking follow status:', error);
			setIsFollowingSeller(false);
		}
	}, [user, product]);

	useEffect(() => {
		fetchProduct();
	}, [fetchProduct]);

	useEffect(() => {
		if (!authLoading && product && user && product.seller.id !== user.id) {
			checkFollowStatus();
		}
	}, [authLoading, product, user, checkFollowStatus]);

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

	const handleContactSeller = async (): Promise<void> => {
		if (!isAuthenticated) {
			addToast('Musisz być zalogowany, aby napisać do sprzedawcy', 'info');
			router.push('/login');
			return;
		}

		if (isOwner) {
			addToast('Nie możesz pisać do samego siebie', 'info');
			return;
		}

		if (!product) return;

		try {
			await api.post('/chat', {
				productId: product.id,
				initialMessage: `Cześć! Jestem zainteresowany Twoim ogłoszeniem: ${product.title}`,
			});

			addToast('Rozpoczęto nową rozmowę', 'success');
			router.push('/messages');
		} catch (err: unknown) {
			console.error('Błąd podczas rozpoczynania czatu:', err);

			let message = 'Nie udało się rozpocząć rozmowy';
			if (isAxiosError(err)) {
				message = err.response?.data?.error || message;
			}

			addToast(message, 'error');
		}
	};

	const handleBuyNow = async (): Promise<void> => {
		if (!product) return;

		try {
			setIsAddingToCart(true);
			await addToCart(product.id, 1);
		} catch (err) {
			console.error('Error adding to cart:', err);
		} finally {
			setIsAddingToCart(false);
		}
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

	const handleFollowSeller = async (): Promise<void> => {
		if (!user) {
			addToast('Musisz być zalogowany, aby obserwować użytkowników', 'error');
			return;
		}

		if (isOwner) {
			addToast('Nie możesz obserwować samego siebie', 'info');
			return;
		}

		if (!product) return;

		try {
			setIsFollowingLoading(true);

			if (isFollowingSeller) {
				await api.delete(`/social/unfollow/${product.seller.id}`);
				setIsFollowingSeller(false);
				addToast(`Przestałeś obserwować ${product.seller.name}`, 'success');
			} else {
				await api.post('/social/follow', { followingId: product.seller.id });
				setIsFollowingSeller(true);
				addToast(`Zacząłeś obserwować ${product.seller.name}`, 'success');
			}
		} catch (error: unknown) {
			console.error('Error toggling follow:', error);

			let message = isFollowingSeller
				? 'Nie udało się przestać obserwować'
				: 'Nie udało się obserwować użytkownika';

			if (isAxiosError(error)) {
				message = error.response?.data?.message || message;
			}

			addToast(message, 'error');
		} finally {
			setIsFollowingLoading(false);
		}
	};

	const handleReportProduct = async (reason: string, description: string) => {
		if (!product) return;

		try {
			await createReport({
				targetId: product.id,
				targetType: 'product',
				reason,
				description,
			});
			setShowReportModal(false);
		} catch (error) {
			console.error('Report submission error:', error);
		}
	};

	const renderOwnerActions = () => {
		if (authLoading) {
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

	const renderReportButton = () => {
		if (isOwner || !product || !isAuthenticated) {
			return null;
		}

		return (
			<button
				className={styles.reportButton}
				onClick={() => setShowReportModal(true)}
				aria-label="Zgłoś produkt"
			>
				<Flag size={18} />
				<span className={styles.reportText}>Zgłoś produkt</span>
			</button>
		);
	};

	if (loading) {
		return <PageLoading text={'Ładowanie produktu'} />;
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

				<div className={styles.headerActions}>
					{renderOwnerActions()}
					{renderReportButton()}
				</div>
			</header>

			<div className={styles.mainContent}>
				<div className={styles.leftColumn}>
					<ProductImageSection
						imageUrl={product.image}
						type={product.type}
						status={product.status}
						title={product.title}
					/>

					<div className={styles.infoBoxes}>
						<SellerInfoCard
							seller={product.seller}
							onContact={handleContactSeller}
							onFollow={handleFollowSeller}
							initialIsFollowing={isFollowingSeller}
							isLoading={isFollowingLoading}
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
						isOwner={isOwner}
						stock={product.stock}
						endsAt={product.endsAt}
						onBuy={handleBuyNow}
						onBid={handleBid}
						onContact={handleContactSeller}
						isLoading={isAddingToCart}
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

			<ReportModal
				isOpen={showReportModal}
				onClose={() => setShowReportModal(false)}
				onSubmit={handleReportProduct}
				targetName={product.title}
				targetType="product"
				isSubmitting={isReporting}
			/>
		</div>
	);
}