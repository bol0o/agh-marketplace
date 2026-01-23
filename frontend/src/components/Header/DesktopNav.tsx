import Link from 'next/link';
import { PlusCircle, MessageSquare, Bell, ShoppingCart } from 'lucide-react';
import { IconButton } from './IconButton';
import { UserDropdown } from './UserDropdown';
import styles from './DesktopNav.module.scss';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

const MESSAGE_COUNT = 2;

interface DesktopNavProps {
	pathname: string;
}

export function DesktopNav({ pathname }: DesktopNavProps) {
	const { unreadCount, fetchUnreadCount, startPolling } = useNotifications();
	const { totalItems } = useCartStore();

	useEffect(() => {
		fetchUnreadCount();

		const cleanup = startPolling(30000);

		return cleanup;
	}, [fetchUnreadCount, startPolling]);

	const isActive = (path: string) => {
		if (path === '/home') return pathname === '/home';
		return pathname.startsWith(path);
	};

	return (
		<div className={styles.desktopNav}>
			<nav className={styles.navLinks}>
				<Link href="/home" className={isActive('/home') ? styles.active : ''}>
					Home
				</Link>
				<Link href="/marketplace" className={isActive('/marketplace') ? styles.active : ''}>
					Oferty
				</Link>
			</nav>

			<div className={styles.desktopIcons}>
				<Link href="/marketplace/create" className={styles.addOfferBtn}>
					<PlusCircle size={20} />
					<span>Dodaj</span>
				</Link>

				<IconButton
					href="/messages"
					icon={<MessageSquare size={20} />}
					isActive={isActive('/chats')}
					badge={MESSAGE_COUNT}
					title="Wiadomości"
				/>

				<IconButton
					href="/notifications"
					icon={<Bell size={20} />}
					isActive={isActive('/notifications')}
					badge={unreadCount}
					title="Powiadomienia"
				/>

				<IconButton
					href="/cart"
					icon={<ShoppingCart size={20} />}
					isActive={isActive('/cart')}
					badge={totalItems}
					title="Koszyk"
				/>

				<UserDropdown />
			</div>
		</div>
	);
}
