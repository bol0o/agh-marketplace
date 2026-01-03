'use client';

import { MOCK_ORDERS } from '@/data/mockData';
import { Package } from 'lucide-react';
import styles from '../user.module.scss'; // Importujemy styl rodzica

export default function OrdersPage() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.card}>
				{MOCK_ORDERS.length > 0 ? (
					MOCK_ORDERS.map((order) => (
						<div key={order.id} className={styles.orderItem}>
							<div className={styles.orderHeader}>
								<div>
									<h4>Zamówienie #{order.id}</h4>
									<span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
										{new Date(order.createdAt).toLocaleDateString()}
									</span>
								</div>
								<div style={{ textAlign: 'right' }}>
									<span className={`${styles.status} ${styles[order.status]}`}>
										{order.status}
									</span>
									<div
										style={{
											fontSize: '0.9rem',
											fontWeight: 700,
											marginTop: 4,
										}}
									>
										{order.totalAmount + order.shippingCost} zł
									</div>
								</div>
							</div>

							{/* Lista produktów w zamówieniu */}
							{order.items.map((item, idx) => (
								<div key={idx} className={styles.orderProduct}>
									<img src={item.snapshot.image} alt="" />
									<div>
										<div>{item.snapshot.title}</div>
										<div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
											{item.quantity} x {item.snapshot.price} zł
										</div>
									</div>
								</div>
							))}
						</div>
					))
				) : (
					<div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
						<Package size={48} style={{ margin: '0 auto 16px' }} />
						<p>Nie masz jeszcze żadnych zamówień.</p>
					</div>
				)}
			</div>
		</div>
	);
}
