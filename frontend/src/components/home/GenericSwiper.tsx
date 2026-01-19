'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Loader, AlertCircle, ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { useRef, ReactNode, useState, useEffect } from 'react';
import styles from './GenericSwiper.module.scss';

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
	const swiperRef = useRef<any>(null);

	const [activeIndex, setActiveIndex] = useState(0);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);
	const [currentSlidesPerView, setCurrentSlidesPerView] = useState(slidesPerView);

	const calculatePaginationCount = () => {
		if (!items.length || !currentSlidesPerView) return 0;
		return Math.ceil(items.length / currentSlidesPerView);
	};

	const paginationCount = calculatePaginationCount();
	const paginationItems = Array.from({ length: paginationCount }, (_, i) => i);

	// Aktualizuj slidesPerView na podstawie szerokości ekranu
	useEffect(() => {
		const updateSlidesPerView = () => {
			if (!swiperRef.current?.swiper) return;

			const swiper = swiperRef.current.swiper;
			const width = window.innerWidth;

			// Sprawdź breakpoints i ustaw odpowiedni slidesPerView
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

	// Inicjalizacja nawigacji
	useEffect(() => {
		if (swiperRef.current && swiperRef.current.swiper) {
			const swiper = swiperRef.current.swiper;

			// Ustaw elementy nawigacji
			if (prevRef.current && nextRef.current) {
				// @ts-expect-error
				swiper.params.navigation.prevEl = prevRef.current;
				// @ts-expect-error
				swiper.params.navigation.nextEl = nextRef.current;
				swiper.params.navigation.disabledClass = styles.navButtonDisabled;

				swiper.navigation.init();
				swiper.navigation.update();
			}

			// Ustaw początkowy stan
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
		if (swiperRef.current?.swiper) {
			swiperRef.current.swiper.slideTo(paginationIndex * currentSlidesPerView);
		}
	};

	const getActivePaginationIndex = () => {
		return Math.floor(activeIndex / currentSlidesPerView);
	};

	if (loading) {
		return (
			<div className={`${styles.container} ${className}`}>
				<div className={styles.loading}>
					<Loader className={styles.spinner} size={32} />
					<p>{loadingText}</p>
				</div>
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
						onSlideChange={(swiper) => {
							setActiveIndex(swiper.activeIndex);
							setIsBeginning(swiper.isBeginning);
							setIsEnd(swiper.isEnd);
						}}
						onInit={(swiper) => {
							setActiveIndex(swiper.activeIndex);
							setIsBeginning(swiper.isBeginning);
							setIsEnd(swiper.isEnd);

							// Ustaw początkowy slidesPerView
							setCurrentSlidesPerView(swiper.params.slidesPerView);
						}}
						onBreakpoint={(swiper, breakpointParams) => {
							// Aktualizuj slidesPerView przy zmianie breakpointa
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

			{/* Własna paginacja z poprawną liczbą kropek */}
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
