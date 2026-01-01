'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import { Product, ProductCard } from './ProductCard';
import styles from './ProductCarousel.module.scss';

interface ProductCarouselProps {
	products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
	return (
		<div className={styles.carouselContainer}>
			<Swiper
				modules={[Pagination, Autoplay]}
				pagination={{
					clickable: true,
					dynamicBullets: true,
				}}
				spaceBetween={16}
				slidesPerView="auto"
				grabCursor={true}
				breakpoints={{
					0: { slidesPerView: 1.2, spaceBetween: 16 },
					640: { slidesPerView: 2.2, spaceBetween: 20 },
					768: { slidesPerView: 3, spaceBetween: 24 },
					1024: { slidesPerView: 4, spaceBetween: 24 },
				}}
				autoplay={{
					delay: 2000,
					disableOnInteraction: true,
					pauseOnMouseEnter: true,
				}}
				style={{ padding: '4px 4px 0 4px', margin: '-4px' }}
			>
				{products.map((product) => (
					<SwiperSlide key={product.id}>
						<ProductCard product={product} />
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
