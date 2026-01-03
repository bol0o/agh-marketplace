import { Search } from 'lucide-react';
import { Chat } from '@/types/social';
import styles from './ChatSidebar.module.scss';

interface ChatSidebarProps {
	chats: Chat[];
	selectedChatId: string | null;
	onSelectChat: (id: string) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	className?: string;
}

export function ChatSidebar({
	chats,
	selectedChatId,
	onSelectChat,
	searchQuery,
	onSearchChange,
	className,
}: ChatSidebarProps) {
	return (
		<div className={`${styles.sidebar} ${className || ''}`}>
			<div className={styles.searchBar}>
				<div className={styles.inputWrapper}>
					<Search size={18} />
					<input
						type="text"
						placeholder="Szukaj rozmowy..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
					/>
				</div>
			</div>

			<div className={styles.chatList}>
				{chats.map((chat) => (
					<div
						key={chat.id}
						className={`${styles.chatItem} ${selectedChatId === chat.id ? styles.active : ''}`}
						onClick={() => onSelectChat(chat.id)}
					>
						<div
							className={`${styles.avatar} ${chat.user.isOnline ? styles.online : ''}`}
						>
							<img
								src={
									chat.user.avatar ||
									`https://ui-avatars.com/api/?name=${chat.user.name}&background=random`
								}
								alt={chat.user.name}
							/>
						</div>
						<div className={styles.chatInfo}>
							<div className={styles.topRow}>
								<h4>{chat.user.name}</h4>
								<span>{chat.updatedAt}</span>
							</div>

							<div className={styles.topicRow}>Dotyczy: {chat.product.title}</div>

							<div
								className={`${styles.msgRow} ${chat.unreadCount > 0 ? styles.unread : ''}`}
							>
								<p>{chat.lastMessage}</p>
								{chat.unreadCount > 0 && (
									<span className={styles.unreadBadge}>{chat.unreadCount}</span>
								)}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
