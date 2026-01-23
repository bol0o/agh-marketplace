'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image'; // 1. Import komponentu Image
import { Gavel, User, TrendingUp, AlertCircle } from 'lucide-react';
import { Bid } from '@/types/marketplace';
import api from '@/lib/axios';
import styles from './BidHistory.module.scss';
import { PageLoading } from '../shared/PageLoading';

interface BidHistoryProps {
	productId: string;
	currentPrice: number;
}

export function BidHistory({ productId, currentPrice }: BidHistoryProps) {
	const [bids, setBids] = useState<Bid[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// 2. Używamy useCallback dla fetchBids
	const fetchBids = useCallback(async (): Promise<void> => {
		try {
			setLoading(true);
			const response = await api.get<Bid[]>(`/bids/product/${productId}`);

			const sortedBids = response.data.sort((a, b) => b.amount - a.amount);
			setBids(sortedBids);
		} catch (err: unknown) {
			// 3. Zmiana any na unknown
			setError('Nie udało się pobrać historii ofert');
			console.error('Błąd pobierania ofert:', err);
		} finally {
			setLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		fetchBids();
	}, [fetchBids]);

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('pl-PL', {
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getUserFullName = (user: { firstName: string; lastName: string }): string => {
		return `${user.firstName} ${user.lastName}`;
	};

	if (loading) {
		return <PageLoading text={'Ładowanie historii ofert...'} />;
	}

	if (error) {
		return (
			<div className={styles.error}>
				<AlertCircle size={24} />
				<p>{error}</p>
			</div>
		);
	}

	if (bids.length === 0) {
		return (
			<div className={styles.empty}>
				<Gavel size={32} />
				<h4>Brak ofert</h4>
				<p>Bądź pierwszym, który zaoferuje cenę!</p>
			</div>
		);
	}

	return (
		<div className={styles.bidHistory}>
			<div className={styles.header}>
				<TrendingUp size={20} />
				<h3>Historia ofert ({bids.length})</h3>
			</div>

			<div className={styles.currentPrice}>
				<span className={styles.label}>Aktualna cena:</span>
				<span className={styles.price}>{currentPrice.toLocaleString('pl-PL')} zł</span>
			</div>

			<div className={styles.bidsList}>
				{bids.map((bid, index) => (
					<div key={bid.id} className={styles.bidItem}>
						<div className={styles.bidPosition}>
							<span className={styles.position}>#{index + 1}</span>
						</div>

						<div className={styles.bidderInfo}>
							<div className={styles.bidderAvatar}>
								{bid.user.avatarUrl ? (
									<Image
										src={bid.user.avatarUrl}
										alt={getUserFullName(bid.user)}
										width={32}
										height={32}
										className={styles.avatarImage}
									/>
								) : (
									<User size={16} />
								)}
							</div>
							<div className={styles.bidderName}>
								<strong>{getUserFullName(bid.user)}</strong>
								<small>{formatDate(bid.createdAt)}</small>
							</div>
						</div>

						<div className={styles.bidAmount}>
							<span className={styles.amount}>
								{bid.amount.toLocaleString('pl-PL')} zł
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
