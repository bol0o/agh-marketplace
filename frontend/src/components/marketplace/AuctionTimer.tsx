'use client';

import { Clock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import styles from './AuctionTimer.module.scss';

interface AuctionTimerProps {
	endsAt: string;
	compact?: boolean;
}

export function AuctionTimer({ endsAt, compact = false }: AuctionTimerProps) {
	const { days, hours, minutes, seconds, hasEnded } = useCountdown(endsAt);

	if (hasEnded) {
		return (
			<div className={`${styles.timer} ${styles.ended}`}>
				<Clock size={compact ? 14 : 16} />
				<span>Aukcja zakończona</span>
			</div>
		);
	}

	if (compact) {
		return (
			<div className={styles.timerCompact}>
				<Clock size={14} />
				<span>
					{days}d {hours}h {minutes}m
				</span>
			</div>
		);
	}

	return (
		<div className={styles.timer}>
			<div className={styles.timerIcon}>
				<Clock size={20} />
			</div>
			<div className={styles.timerContent}>
				<div className={styles.timerLabel}>Kończy się za:</div>
				<div className={styles.timerDigits}>
					{days > 0 && (
						<div className={styles.timeUnit}>
							<span className={styles.number}>
								{days.toString().padStart(2, '0')}
							</span>
							<span className={styles.label}>dni</span>
						</div>
					)}
					<div className={styles.timeUnit}>
						<span className={styles.number}>{hours.toString().padStart(2, '0')}</span>
						<span className={styles.label}>godz</span>
					</div>
					<div className={styles.timeUnit}>
						<span className={styles.number}>{minutes.toString().padStart(2, '0')}</span>
						<span className={styles.label}>min</span>
					</div>
					<div className={styles.timeUnit}>
						<span className={styles.number}>{seconds.toString().padStart(2, '0')}</span>
						<span className={styles.label}>sek</span>
					</div>
				</div>
			</div>
		</div>
	);
}
