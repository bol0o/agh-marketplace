'use client';

import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import { ProductSwiper } from '@/components/home/ProductSwiper';
import { AuctionsSwiper } from '@/components/home/AuctionsSwiper';
import styles from './home.module.scss';

export default function HomePage() {
	return (
		<div className={styles.container}>
			<WelcomeBanner />

			<div className={styles.swipersSection}>
				<ProductSwiper />
				<AuctionsSwiper />
			</div>
		</div>
	);
}
