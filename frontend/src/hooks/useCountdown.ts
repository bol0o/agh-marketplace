import { useState, useEffect } from 'react';

interface UseCountdownReturn {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	hasEnded: boolean;
}

export function useCountdown(targetDate: string | Date): UseCountdownReturn {
	const [countdown, setCountdown] = useState<UseCountdownReturn>({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		hasEnded: false,
	});

	useEffect(() => {
		const calculateCountdown = () => {
			const target = new Date(targetDate).getTime();
			const now = new Date().getTime();
			const difference = target - now;

			if (difference <= 0) {
				setCountdown({
					days: 0,
					hours: 0,
					minutes: 0,
					seconds: 0,
					hasEnded: true,
				});
				return;
			}

			const days = Math.floor(difference / (1000 * 60 * 60 * 24));
			const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((difference % (1000 * 60)) / 1000);

			setCountdown({
				days,
				hours,
				minutes,
				seconds,
				hasEnded: false,
			});
		};

		calculateCountdown();
		const interval = setInterval(calculateCountdown, 1000);

		return () => clearInterval(interval);
	}, [targetDate]);

	return countdown;
}
