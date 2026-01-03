import { SettingsNav } from '@/components/user/SettingsNav';
import styles from './settings.module.scss';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div className={styles.settingsLayout}>
				<SettingsNav />

				{children}
			</div>
		</div>
	);
}
