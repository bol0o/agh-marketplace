import React from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Order } from '@/types/order';
import { formatDate } from '@/lib/utils';
import styles from './OrderCard.module.scss';

interface OrderCardProps {
	order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
	const getStatusInfo = (status: Order['status']) => {
		switch (status) {
			case 'pending':
				return {
					color: styles.statusPending,
					icon: <Clock size={16} />,
					text: 'Oczekujące',
				};
			case 'processing':
				return {
					color: styles.statusProcessing,
					icon: <Package size={16} />,
					text: 'Przetwarzane',
				};
			case 'shipped':
				return {
					color: styles.statusShipped,
					icon: <Truck size={16} />,
					text: 'Wysłane',
				};
			case 'delivered':
				return {
					color: styles.statusDelivered,
					icon: <CheckCircle size={16} />,
					text: 'Dostarczone',
				};
			case 'cancelled':
				return {
					color: styles.statusCancelled,
					icon: <XCircle size={16} />,
					text: 'Anulowane',
				};
			default:
				return {
					color: '',
					icon: <Package size={16} />,
					text: status,
				};
		}
	};

	const statusInfo = getStatusInfo(order.status);
	const formattedDate = formatDate(order.createdAt);

	return (
		<div className={styles.card}>
			<div className={`${styles.cardHeader} ${styles.flexBetween}`}>
				<div className={styles.headerLeft}>
					<span className={styles.orderNumber}>Zamówienie #{order.id.slice(-8)}</span>
					<span className={styles.date}>{formattedDate}</span>
				</div>
				<div className={`${styles.status} ${statusInfo.color} ${styles.flexCenter}`}>
					{statusInfo.icon}
					{statusInfo.text}
				</div>
			</div>

			<div className={styles.itemsPreview}>
				<div className={styles.itemsList}>
					{order.items.slice(0, 2).map((item, index) => (
						<div key={index} className={styles.item}>
							<div className={styles.itemImage}>
								<img src={item.snapshot.image} alt={item.snapshot.title} />
							</div>
							<div className={styles.itemInfo}>
								<h4 className={styles.itemTitle}>{item.snapshot.title}</h4>
								<div className={styles.itemDetails}>
									<span className={styles.quantity}>{item.quantity} ×</span>
									<span className={styles.price}>
										{item.snapshot.price.toFixed(2)} zł
									</span>
								</div>
							</div>
						</div>
					))}
				</div>
				{order.items.length > 2 && (
					<div className={styles.moreItems}>
						+{order.items.length - 2} więcej produktów
					</div>
				)}
			</div>

			<div className={`${styles.cardFooter} ${styles.flexBetween}`}>
				<div className={styles.footerLeft}>
					<div className={styles.address}>
						<span className={styles.addressLabel}>
							<MapPin size={14} />
							Adres dostawy:
						</span>
						<span>
							{order.shippingAddress.street}, {order.shippingAddress.city}
						</span>
					</div>
				</div>
				<div className={styles.footerRight}>
					<div className={styles.totalAmount}>
						<span className={styles.totalLabel}>Razem:</span>
						<span className={styles.totalValue}>{order.totalAmount.toFixed(2)} zł</span>
					</div>
					<a href={`/orders/${order.id}`} className={styles.detailsLink}>
						Szczegóły zamówienia
						<ChevronRight size={16} />
					</a>
				</div>
			</div>
		</div>
	);
};

export default OrderCard;
