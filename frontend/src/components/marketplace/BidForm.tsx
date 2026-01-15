'use client';

import { useState } from 'react';
import { Gavel, AlertCircle } from 'lucide-react';
import { BidFormData, BidResponse } from '@/types/marketplace';
import api from '@/lib/axios';
import styles from './BidForm.module.scss';

interface BidFormProps {
	productId: string;
	currentPrice: number;
	onBidSuccess: (newBidAmount: number) => void;
	minBidIncrement?: number;
}

export function BidForm({
	productId,
	currentPrice,
	onBidSuccess,
	minBidIncrement = 1,
}: BidFormProps) {
	const [amount, setAmount] = useState<number>(currentPrice + minBidIncrement);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();

		const minBid = currentPrice + minBidIncrement;

		if (amount < minBid) {
			setError(`Twoja oferta musi być co najmniej ${minBid.toLocaleString('pl-PL')} zł`);
			return;
		}

		try {
			setSubmitting(true);
			setError(null);
			setSuccess(null);

			const bidData: BidFormData = {
				amount,
				productId,
			};

			const response = await api.post<BidResponse>('/bids', bidData);

			setSuccess(response.data.message);
			onBidSuccess(response.data.bid.amount);

			setTimeout(() => {
				setAmount(currentPrice + minBidIncrement);
				setSuccess(null);
			}, 2000);
		} catch (err: any) {
			console.log(err.response);
			setError(err.response?.data?.message || 'Nie udało się złożyć oferty');
		} finally {
			setSubmitting(false);
		}
	};

	const handleQuickBid = (increment: number): void => {
		const newAmount = currentPrice + increment;
		setAmount(newAmount);
	};

	return (
		<div className={styles.bidForm}>
			<h3 className={styles.title}>Złóż ofertę</h3>

			<form onSubmit={handleSubmit}>
				<div className={styles.priceInputGroup}>
					<label htmlFor="bidAmount">Twoja oferta (zł)</label>
					<div className={styles.inputWrapper}>
						<input
							type="number"
							id="bidAmount"
							value={amount}
							onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
							min={currentPrice + minBidIncrement}
							step="0.01"
							required
							className={styles.input}
						/>
						<span className={styles.currency}>zł</span>
					</div>

					<div className={styles.quickBids}>
						<span className={styles.quickBidsLabel}>Szybkie oferty:</span>
						<div className={styles.quickBidButtons}>
							{[1, 5, 10, 20, 50].map((increment) => (
								<button
									key={increment}
									type="button"
									onClick={() => handleQuickBid(increment)}
									className={styles.quickBidButton}
								>
									+{increment} zł
								</button>
							))}
						</div>
					</div>

					<div className={styles.priceInfo}>
						<span className={styles.current}>
							Aktualnie: {currentPrice.toLocaleString('pl-PL')} zł
						</span>
						<span className={styles.minimum}>
							Minimalna: {(currentPrice + minBidIncrement).toLocaleString('pl-PL')} zł
						</span>
					</div>
				</div>

				{error && (
					<div className={styles.error}>
						<AlertCircle size={16} />
						<span>{error}</span>
					</div>
				)}

				{success && (
					<div className={styles.success}>
						<span>{success}</span>
					</div>
				)}

				<button
					type="submit"
					disabled={submitting || amount < currentPrice + minBidIncrement}
					className={styles.submitButton}
				>
					<Gavel size={18} />
					<span>{submitting ? 'Składanie oferty...' : 'Zaliczytuj'}</span>
				</button>
			</form>
		</div>
	);
}
