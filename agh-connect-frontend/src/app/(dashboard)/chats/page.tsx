'use client';

import { useState } from 'react';
import { MOCK_CHATS } from '@/data/mockData';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import styles from './chats.module.scss';

export default function ChatsPage() {
	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredChats = MOCK_CHATS.filter(
		(chat) =>
			chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			chat.product.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const selectedChat = MOCK_CHATS.find((c) => c.id === selectedChatId);

	return (
		<div className={styles.layoutWrapper}>
			<div className={styles.pageHeader}>
				<div className={styles.titleGroup}>
					<h1>Wiadomości</h1>
				</div>
			</div>

			<div className={styles.container}>
				<ChatSidebar
					chats={filteredChats}
					selectedChatId={selectedChatId}
					onSelectChat={setSelectedChatId}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					className={selectedChatId ? styles.hiddenOnMobile : ''}
				/>

				<ChatWindow
					chat={selectedChat}
					onBack={() => setSelectedChatId(null)}
					className={!selectedChatId ? styles.hiddenOnMobile : ''}
				/>
			</div>
		</div>
	);
}
