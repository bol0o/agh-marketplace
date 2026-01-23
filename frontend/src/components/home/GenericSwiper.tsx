'use client';

import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import { AlertCircle, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { useRef, ReactNode, useState, useEffect } from 'react';
import styles from './GenericSwiper.module.scss';
import { PageLoading } from '../shared/PageLoading';

interface GenericSwiperProps<T> {
	title?: string;
	subtitle?: string;
	className?: string;
	items: T[];
	loading?: boolean;
	error?: string | null;
	renderItem: (item: T) => ReactNode;
	emptyIcon?: LucideIcon;
	emptyTitle?: string;
	emptyDescription?: string;
	autoplayDelay?: number;
	spaceBetween?: number;
	slidesPerView?: number;
	breakpoints?: Record<number, { slidesPerView: number; spaceBetween: number }>;
	loadingText?: string;
	errorText?: string;
}

export function GenericSwiper<T>({
	title = 'Kolekcja',
	subtitle = 'Przeglądaj elementy',
	className = '',
	items = [],
	loading = false,
	error = null,
	renderItem,
	emptyIcon: EmptyIcon = AlertCircle,
	emptyTitle = 'Brak elementów',
	emptyDescription = 'Spróbuj ponownie później',
	autoplayDelay = 5000,
	spaceBetween = 16,
	slidesPerView = 1,
	breakpoints = {
		480: { slidesPerView: 2, spaceBetween: 16 },
		768: { slidesPerView: 3, spaceBetween: 20 },
		1024: { slidesPerView: 4, spaceBetween: 24 },
	},
	loadingText = 'Ładowanie...',
	errorText = 'Wystąpił błąd',
}: GenericSwiperProps<T>) {
	const prevRef = useRef<HTMLButtonElement>(null);
	const nextRef = useRef<HTMLButtonElement>(null);
	const swiperRef = useRef<SwiperRef>(null);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number | any>(slidesPerView);

	const calculatePaginationCount = () => {
		if (!items.length || !currentSlidesPerView || typeof currentSlidesPerView !== 'number')
			return 0;
		return Math.ceil(items.length / currentSlidesPerView);
	};

	const paginationCount = calculatePaginationCount();
	const paginationItems = Array.from({ length: paginationCount }, (_, i) => i);

	useEffect(() => {
		const updateSlidesPerView = () => {
			if (!swiperRef.current?.swiper) return;

			const width = window.innerWidth;

			let newSlidesPerView = slidesPerView;

			if (width >= 1024 && breakpoints[1024]) {
				newSlidesPerView = breakpoints[1024].slidesPerView;
			} else if (width >= 768 && breakpoints[768]) {
				newSlidesPerView = breakpoints[768].slidesPerView;
			} else if (width >= 480 && breakpoints[480]) {
				newSlidesPerView = breakpoints[480].slidesPerView;
			}

			setCurrentSlidesPerView(newSlidesPerView);
		};

		updateSlidesPerView();
		window.addEventListener('resize', updateSlidesPerView);

		return () => window.removeEventListener('resize', updateSlidesPerView);
	}, [slidesPerView, breakpoints]);

	useEffect(() => {
		if (swiperRef.current && swiperRef.current.swiper) {
			const swiper = swiperRef.current.swiper;

			if (
				prevRef.current &&
				nextRef.current &&
				swiper.params.navigation &&
				typeof swiper.params.navigation !== 'boolean'
			) {
				swiper.params.navigation.prevEl = prevRef.current;
				swiper.params.navigation.nextEl = nextRef.current;
				swiper.params.navigation.disabledClass = styles.navButtonDisabled;

				if (swiper.navigation) {
					swiper.navigation.init();
					swiper.navigation.update();
				}
			}

			setIsBeginning(swiper.isBeginning);
			setIsEnd(swiper.isEnd);
		}
	}, [items]);

	const handlePrevClick = () => {
		if (swiperRef.current?.swiper) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	const handleNextClick = () => {
		if (swiperRef.current?.swiper) {
			swiperRef.current.swiper.slideNext();
		}
	};

	const goToSlide = (paginationIndex: number) => {
		if (swiperRef.current?.swiper && typeof currentSlidesPerView === 'number') {
			swiperRef.current.swiper.slideTo(paginationIndex * currentSlidesPerView);
		}
	};

	const getActivePaginationIndex = () => {
		if (typeof currentSlidesPerView !== 'number') return 0;
		return Math.floor(activeIndex / currentSlidesPerView);
	};

	if (loading) {
		return (
			<div className={`${styles.container} ${className}`}>
				<PageLoading text={loadingText} />
			</div>
		);
	}

	if (error) {
		return (
			<div className={`${styles.container} ${className}`}>
				<div className={styles.error}>
					<AlertCircle size={32} />
					<p>{errorText}</p>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className={`${styles.container} ${className}`}>
				<div className={styles.empty}>
					<EmptyIcon size={48} />
					<p>{emptyTitle}</p>
					<small>{emptyDescription}</small>
				</div>
			</div>
		);
	}

	return (
		<div className={`${styles.container} ${className}`}>
			<header className={styles.header}>
				<h2 className={styles.title}>{title}</h2>
				<p className={styles.subtitle}>{subtitle}</p>
			</header>

			<div className={styles.swiperWrapper}>
				<button
					ref={prevRef}
					className={`${styles.navButton} ${styles.prevButton} ${isBeginning ? styles.navButtonDisabled : ''}`}
					aria-label="Poprzednie"
					onClick={handlePrevClick}
					disabled={isBeginning}
				>
					<ChevronLeft size={24} />
				</button>

				<button
					ref={nextRef}
					className={`${styles.navButton} ${styles.nextButton} ${isEnd ? styles.navButtonDisabled : ''}`}
					aria-label="Następne"
					onClick={handleNextClick}
					disabled={isEnd}
				>
					<ChevronRight size={24} />
				</button>

				<div className={styles.swiperContainer}>
					<Swiper
						ref={swiperRef}
						modules={[Navigation, Autoplay]}
						spaceBetween={spaceBetween}
						slidesPerView={slidesPerView}
						autoplay={{
							delay: autoplayDelay,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						breakpoints={breakpoints}
						className={styles.swiper}
						onSlideChange={(swiper: SwiperType) => {
							setActiveIndex(swiper.activeIndex);
							setIsBeginning(swiper.isBeginning);
							setIsEnd(swiper.isEnd);
						}}
						onInit={(swiper: SwiperType) => {
							setActiveIndex(swiper.activeIndex);
							setIsBeginning(swiper.isBeginning);
							setIsEnd(swiper.isEnd);

							setCurrentSlidesPerView(swiper.params.slidesPerView);
						}}
						onBreakpoint={(swiper: SwiperType) => {
							setCurrentSlidesPerView(swiper.params.slidesPerView);
						}}
					>
						{items.map((item, index) => (
							<SwiperSlide key={index} className={styles.slide}>
								{renderItem(item)}
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>

			{paginationCount > 1 && (
				<div className={styles.customPagination}>
					{paginationItems.map((index) => {
						const isActive = index === getActivePaginationIndex();
						return (
							<button
								key={index}
								className={`${styles.paginationDot} ${
									isActive ? styles.paginationDotActive : ''
								}`}
								onClick={() => goToSlide(index)}
								aria-label={`Przejdź do grupy slajdów ${index + 1}`}
								aria-current={isActive ? 'page' : undefined}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
