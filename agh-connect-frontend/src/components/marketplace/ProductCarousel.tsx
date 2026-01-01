'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
// 1. Import modułu Pagination
import { Pagination, Autoplay } from 'swiper/modules';

// 2. Import stylów CSS Swipera
import 'swiper/css';
import 'swiper/css/pagination';

import { Product, ProductCard } from './ProductCard';
// 3. Import naszych nowych stylów
import styles from './ProductCarousel.module.scss';

interface ProductCarouselProps {
	products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
	return (
		<div className={styles.carouselContainer}>
			<Swiper
				modules={[Pagination, Autoplay]} // Włączamy moduł
				pagination={{
					clickable: true,
					dynamicBullets: true, // Opcjonalnie: zmniejsza skrajne kropki (ładny efekt)
				}}
				spaceBetween={16}
				slidesPerView="auto" // Zostawiamy auto dla efektu ucięcia
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
				// Ważne: padding wewnątrz Swipera, żeby cienie kart nie były ucinane
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
