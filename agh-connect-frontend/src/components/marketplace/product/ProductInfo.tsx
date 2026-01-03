import { MapPin, Tag } from 'lucide-react';
import { Product } from '@/types/marketplace'; // Zakładam, że masz ten typ
import styles from './ProductInfo.module.scss';

export function ProductInfo({ product }: { product: Product }) {
	const conditionMap = {
		new: 'Nowy',
		used: 'Używany',
		damaged: 'Uszkodzony',
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span className={styles.date}>Dodano: {product.createdAt || 'Dzisiaj'}</span>
				<h1 className={styles.title}>{product.title}</h1>
				<div className={styles.priceMobile}>{product.price} zł</div>
			</div>

			<div className={styles.tags}>
				<div className={styles.tag}>
					<Tag size={16} />
					<span>
						Stan:{' '}
						<strong>
							{conditionMap[product.condition as keyof typeof conditionMap] ||
								'Używany'}
						</strong>
					</span>
				</div>
				<div className={styles.tag}>
					<MapPin size={16} />
					<span>
						Lokalizacja: <strong>{product.location || 'Kraków, AGH'}</strong>
					</span>
				</div>
			</div>

			<div className={styles.divider} />

			<div className={styles.description}>
				<h3>Opis</h3>
				<p>
					{product.description ||
						'Sprzedawca nie dodał szczegółowego opisu. Skontaktuj się z nim, aby dowiedzieć się więcej o przedmiocie.'}
				</p>
			</div>
		</div>
	);
}
