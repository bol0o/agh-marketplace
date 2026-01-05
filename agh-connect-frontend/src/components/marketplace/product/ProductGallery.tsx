import Image from 'next/image';
import styles from './ProductGallery.module.scss';

export function ProductGallery({ image, title }: { image: string; title: string }) {
	return (
		<div className={styles.gallery}>
			<div className={styles.mainImageWrapper}>
				<Image
					src={image}
					alt={title}
					fill
					className={styles.image}
					sizes="(max-width: 768px) 100vw, 50vw"
					priority
				/>
			</div>
		</div>
	);
}
