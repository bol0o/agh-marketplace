import Image from 'next/image';
import styles from './AuthBranding.module.scss';
import Link from 'next/link';

type Props = {
	title: string;
	description: string;
};

const PLACEHOLDER_IMAGE =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

export default function AuthBranding(props: Props) {
	return (
		<div className={styles.imageSection}>
			<Image
				src="https://placehold.co/1080x1920/1e293b/FFF?text=AGH Connect"
				alt="AGH Campus"
				unoptimized
				fill
				priority
				className={styles.bgImage}
				sizes="(max-width: 1024px) 0vw, 50vw"
				placeholder="blur"
				blurDataURL={PLACEHOLDER_IMAGE}
			/>
			<div className={styles.overlay}></div>

			<div className={styles.content}>
				<Link href="/" className={styles.brand}>
					<div className={styles.logoIcon}>A</div>
					<span>AGH Connect</span>
				</Link>
				<div>
					<h2>{props.title}</h2>
					<p>{props.description}</p>
				</div>
				<div style={{ fontSize: '0.875rem', opacity: 0.7 }}>&copy; 2024 AGH Connect</div>
			</div>
		</div>
	);
}
