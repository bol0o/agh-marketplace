'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
	ArrowLeft,
	Package,
	Truck,
	CheckCircle,
	XCircle,
	Clock,
	RefreshCw,
	ShoppingBag,
} from 'lucide-react';
import OrderDetailsItem from '@/components/orders/OrderDetailsItem';
import { useOrder } from '@/hooks/useOrder';
import { formatDate } from '@/lib/utils';
import styles from './OrderDetailsPage.module.scss';
import { PageLoading } from '@/components/shared/PageLoading';

const OrderDetailsPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);

	const { order, loading, error, cancelOrder } = useOrder({
		id: id as string,
	});

	const getStatusInfo = (status: string) => {
		switch (status) {
			case 'pending':
				return {
					text: 'Oczekujące na płatność',
					color: styles.statusPending,
					icon: <Clock size={20} />,
					description: 'Twoje zamówienie czeka na potwierdzenie płatności.',
				};
			case 'processing':
				return {
					text: 'Przetwarzanie',
					color: styles.statusProcessing,
					icon: <Package size={20} />,
					description: 'Przygotowujemy Twoje zamówienie do wysyłki.',
				};
			case 'shipped':
				return {
					text: 'Wysłane',
					color: styles.statusShipped,
					icon: <Truck size={20} />,
					description: 'Twoje zamówienie zostało wysłane.',
				};
			case 'delivered':
				return {
					text: 'Dostarczone',
					color: styles.statusDelivered,
					icon: <CheckCircle size={20} />,
					description: 'Twoje zamówienie zostało dostarczone.',
				};
			case 'cancelled':
				return {
					text: 'Anulowane',
					color: styles.statusCancelled,
					icon: <XCircle size={20} />,
					description: 'To zamówienie zostało anulowane.',
				};
			default:
				return {
					text: status,
					color: '',
					icon: <Package size={20} />,
					description: '',
				};
		}
	};

	if (loading) {
		return <PageLoading text={'Ładowanie zamówienia...'} />;
	}

	if (error || !order) {
		return (
			<div className={`${styles.errorContainer} ${styles.flexCenter}`}>
				<div className={`${styles.errorIcon} ${styles.flexCenter}`}>
					<XCircle size={32} />
				</div>
				<h3 className={styles.errorTitle}>
					{error ? 'Wystąpił błąd' : 'Nie znaleziono zamówienia'}
				</h3>
				<p className={styles.errorMessage}>
					{error || 'Zamówienie o podanym ID nie istnieje.'}
				</p>
				<button onClick={() => router.push('/orders')} className={styles.backButton}>
					<ArrowLeft size={16} />
					Wróć do listy zamówień
				</button>
			</div>
		);
	}

	const statusInfo = getStatusInfo(order.status);
	const formattedDate = formatDate(order.createdAt);

	const confirmCancelOrder = async () => {
		try {
			await cancelOrder();
			setShowCancelConfirm(false);
		} catch (err) {
			console.error(err);
			setShowCancelConfirm(false);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<button onClick={() => router.push('/orders')} className={styles.backLink}>
					<ArrowLeft size={16} />
					Wróć do zamówień
				</button>
				<h1 className={styles.title}>Szczegóły zamówienia</h1>
				<div className={styles.orderId}>Numer: #{order.id.slice(-8)}</div>
			</div>

			<div className={styles.statusSection}>
				<div className={`${styles.statusBadge} ${statusInfo.color} ${styles.flexCenter}`}>
					<span className={styles.statusIcon}>{statusInfo.icon}</span>
					<span className={styles.statusText}>{statusInfo.text}</span>
				</div>
				<p className={styles.statusDescription}>{statusInfo.description}</p>
			</div>

			<div className={styles.content}>
				<div className={styles.mainSection}>
					<div className={styles.section}>
						<h2 className={styles.sectionTitle}>
							<ShoppingBag size={20} />
							Produkty w zamówieniu
						</h2>
						<div className={styles.itemsList}>
							{order.items.map((item, index) => (
								<OrderDetailsItem key={`${item.productId}-${index}`} item={item} />
							))}
						</div>
					</div>
				</div>

				<div className={styles.sidebar}>
					<div className={styles.infoCard}>
						<h3 className={styles.infoTitle}>
							<Package size={20} />
							Podsumowanie
						</h3>

						<div className={styles.infoGroup}>
							<div className={`${styles.infoRow} ${styles.flexBetween}`}>
								<span className={styles.infoLabel}>Data zamówienia:</span>
								<span className={styles.infoValue}>{formattedDate}</span>
							</div>
							<div className={`${styles.infoRow} ${styles.flexBetween}`}>
								<span className={styles.infoLabel}>ID płatności:</span>
								<span className={styles.infoValue}>{order.paymentId}</span>
							</div>
						</div>

						<div className={styles.divider} />

						<div className={styles.infoGroup}>
							<h4 className={styles.infoSubtitle}>Dostawa</h4>
							<div className={styles.address}>
								<div className={styles.addressLine}>
									{order.shippingAddress.street}
									{order.shippingAddress.apartmentNumber &&
										` m. ${order.shippingAddress.apartmentNumber}`}
								</div>
								<div className={styles.addressLine}>
									{order.shippingAddress.zipCode} {order.shippingAddress.city}
								</div>
								<div className={styles.addressLine}>
									Tel: {order.shippingAddress.phone}
								</div>
							</div>
						</div>

						<div className={styles.divider} />

						<div className={styles.infoGroup}>
							<h4 className={styles.infoSubtitle}>Koszty</h4>
							<div className={`${styles.summaryRow} ${styles.flexBetween}`}>
								<span>Wartość produktów:</span>
								<span>
									{(order.totalAmount - order.shippingCost).toFixed(2)} zł
								</span>
							</div>
							<div className={`${styles.summaryRow} ${styles.flexBetween}`}>
								<span>Koszt dostawy:</span>
								<span>{order.shippingCost.toFixed(2)} zł</span>
							</div>
							<div
								className={`${styles.summaryRow} ${styles.flexBetween} ${styles.total}`}
							>
								<span>Razem do zapłaty:</span>
								<span>{order.totalAmount.toFixed(2)} zł</span>
							</div>
						</div>
					</div>

					{order.status === 'pending' && (
						<div className={styles.actionsCard}>
							<h3 className={styles.actionsTitle}>
								<RefreshCw size={20} />
								Akcje
							</h3>
							<div className={styles.actionsGrid}>
								<button
									onClick={() => setShowCancelConfirm(true)}
									className={`${styles.actionButton} ${styles.cancelButton}`}
									disabled={loading}
								>
									<XCircle size={20} />
									<span className={styles.actionText}>Anuluj zamówienie</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{showCancelConfirm && (
				<div className={styles.modalOverlay}>
					<div className={styles.modal}>
						<h3>Anulowanie zamówienia</h3>
						<p>
							Czy na pewno chcesz anulować zamówienie #{order.id.slice(-8)}? Tej
							operacji nie można cofnąć.
						</p>
						<div className={styles.modalActions}>
							<button
								onClick={() => setShowCancelConfirm(false)}
								className={styles.modalCancel}
							>
								Wróć
							</button>
							<button
								onClick={confirmCancelOrder}
								className={styles.modalDelete}
								disabled={loading}
							>
								{loading ? 'Anulowanie...' : 'Tak, anuluj'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderDetailsPage;
