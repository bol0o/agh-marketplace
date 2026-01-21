'use client';

import React from 'react';
import OrderCard from '@/components/orders/OrderCard';
import { useOrders } from '@/hooks/useOrders';
import styles from './orders.module.scss';
import Link from 'next/link';

const OrdersPage: React.FC = () => {
	const { orders, loading, error, refresh, getOrderStats } = useOrders();

	if (loading) {
		return (
			<div className={styles.loadingContainer}>
				<p className={styles.loadingText}>Ładowanie zamówień...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.errorContainer}>
				<div className={styles.errorIcon}>!</div>
				<h3 className={styles.errorTitle}>Wystąpił błąd</h3>
				<p className={styles.errorMessage}>{error}</p>
				<button onClick={refresh} className={styles.retryButton}>
					Spróbuj ponownie
				</button>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className={styles.emptyContainer}>
				<div className={styles.emptyIcon}>
					<svg
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
					</svg>
				</div>
				<h2 className={styles.emptyTitle}>Brak zamówień</h2>
				<p className={styles.emptyDescription}>
					Nie złożyłeś jeszcze żadnego zamówienia. Przejdź do sklepu i znajdź coś dla
					siebie!
				</p>
				<Link href="/marketplace" className={styles.shopButton}>
					Przejdź do sklepu
				</Link>
			</div>
		);
	}

	const stats = getOrderStats();

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.headerContent}>
					<h1 className={styles.title}>
						<svg
							className={styles.titleIcon}
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
						>
							<path
								d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								stroke="currentColor"
								strokeWidth="2"
							/>
						</svg>
						Moje zamówienia
					</h1>
					<button onClick={refresh} className={styles.refreshButton}>
						Odśwież
					</button>
				</div>

				<div className={styles.stats}>
					<div className={styles.statItem}>
						<span className={styles.statValue}>{stats.total}</span>
						<span className={styles.statLabel}>Wszystkie</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statValue}>{stats.pending}</span>
						<span className={styles.statLabel}>Oczekujące</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statValue}>{stats.delivered}</span>
						<span className={styles.statLabel}>Dostarczone</span>
					</div>
					<div className={styles.statItem}>
						<span className={styles.statValue}>{stats.totalAmount.toFixed(2)} zł</span>
						<span className={styles.statLabel}>Łączna wartość</span>
					</div>
				</div>
			</div>

			<div className={styles.ordersList}>
				{orders.map((order) => (
					<OrderCard key={order.id} order={order} />
				))}
			</div>
		</div>
	);
};

export default OrdersPage;
