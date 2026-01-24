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
	const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number>(slidesPerView);
	const [totalSlides, setTotalSlides] = useState(0);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setTotalSlides(items.length);
	}, [items]);

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
				swiper.navigation.init();
				swiper.navigation.update();
			}
		}
	}, [items, currentSlidesPerView]);

	useEffect(() => {
		const calculateProgress = () => {
			if (!items.length || !currentSlidesPerView || currentSlidesPerView >= items.length) {
				return isBeginning ? 0 : 1;
			}
			
			const maxIndex = items.length - currentSlidesPerView;
			if (maxIndex <= 0) return 1;
			
			const currentProgress = activeIndex / maxIndex;
			return Math.min(Math.max(currentProgress, 0), 1);
		};

		const newProgress = calculateProgress();
		setProgress(newProgress);
	}, [activeIndex, currentSlidesPerView, items.length, isBeginning]);

	const handlePrevClick = () => {
		if (swiperRef.current?.swiper && !isBeginning) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	const handleNextClick = () => {
		if (swiperRef.current?.swiper && !isEnd) {
			swiperRef.current.swiper.slideNext();
		}
	};

	const calculatePaginationDots = () => {
		if (!items.length || !currentSlidesPerView) return { count: 0, items: [] };
		
		const totalGroups = Math.ceil(totalSlides / currentSlidesPerView);
		const currentGroup = Math.floor(activeIndex / currentSlidesPerView);
		
		return {
			count: totalGroups,
			currentGroup,
			items: Array.from({ length: totalGroups }, (_, i) => i)
		};
	};

	const pagination = calculatePaginationDots();

	const goToSlide = (paginationIndex: number) => {
		if (swiperRef.current?.swiper) {
			const targetIndex = paginationIndex * currentSlidesPerView;
			swiperRef.current.swiper.slideTo(Math.min(targetIndex, totalSlides - 1));
		}
	};

	const handleSlideChange = (swiper: SwiperType) => {
		setActiveIndex(swiper.activeIndex);
		setIsBeginning(swiper.isBeginning);
		setIsEnd(swiper.isEnd);
		
		if (items.length && currentSlidesPerView && currentSlidesPerView < items.length) {
			const maxIndex = items.length - currentSlidesPerView;
			if (maxIndex > 0) {
				const currentProgress = swiper.activeIndex / maxIndex;
				setProgress(Math.min(Math.max(currentProgress, 0), 1));
			} else {
				setProgress(1);
			}
		}
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
						onSlideChange={handleSlideChange}
						onInit={(swiper: SwiperType) => {
							setActiveIndex(swiper.activeIndex);
							setIsBeginning(swiper.isBeginning);
							setIsEnd(swiper.isEnd);
							setCurrentSlidesPerView(swiper.params.slidesPerView as number);
							
							if (items.length && swiper.params.slidesPerView) {
								const slidesView = swiper.params.slidesPerView as number;
								if (slidesView < items.length) {
									const maxIndex = items.length - slidesView;
									const currentProgress = swiper.activeIndex / maxIndex;
									setProgress(Math.min(Math.max(currentProgress, 0), 1));
								} else {
									setProgress(1);
								}
							}
						}}
						onBreakpoint={(swiper: SwiperType) => {
							const newSlidesPerView = swiper.params.slidesPerView as number;
							setCurrentSlidesPerView(newSlidesPerView);
							
							if (items.length && newSlidesPerView) {
								if (newSlidesPerView < items.length) {
									const maxIndex = items.length - newSlidesPerView;
									const currentProgress = swiper.activeIndex / maxIndex;
									setProgress(Math.min(Math.max(currentProgress, 0), 1));
								} else {
									setProgress(1);
								}
							}
						}}
						onReachEnd={(swiper: SwiperType) => {
							setIsEnd(swiper.isEnd);
							setProgress(1);
						}}
						onReachBeginning={(swiper: SwiperType) => {
							setIsBeginning(swiper.isBeginning);
							setProgress(0);
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

			{pagination.count > 1 && (
				<div className={styles.customPagination}>
					<div className={`${styles.progressContainer} ${styles.desktopOnly}`}>
						<div 
							className={styles.progressTrack} 
							role="progressbar"
							aria-valuenow={Math.round(progress * 100)}
							aria-valuemin={0}
							aria-valuemax={100}
							aria-label="Postęp przewijania slidera"
						>
							<div 
								className={styles.progressBar} 
								style={{ width: `${progress * 100}%` }}
							/>
						</div>
					</div>
					
					<div className={`${styles.dotsContainer} ${styles.mobileOnly}`}>
						{pagination.items.map((index) => {
							const isActive = index === pagination.currentGroup;
							return (
								<button
									key={index}
									className={`${styles.paginationDot} ${
										isActive ? styles.paginationDotActive : ''
									}`}
									onClick={() => goToSlide(index)}
									aria-label={`Przejdź do slajdów ${index + 1}`}
									aria-current={isActive ? 'page' : undefined}
								/>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}