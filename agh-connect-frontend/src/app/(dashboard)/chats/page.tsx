'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // 1. Importujemy hooka
import { MOCK_CHATS } from '@/data/mockData';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import styles from './chats.module.scss';

// Przenosimy logikę do wewnętrznego komponentu
function ChatsContent() {
	// 2. Pobieramy parametry z URL
	const searchParams = useSearchParams();
	const activeChatId = searchParams.get('active');

	const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	// 3. Ten efekt uruchomi się po wejściu na stronę (np. z przycisku "Napisz wiadomość")
	useEffect(() => {
		if (activeChatId) {
			setSelectedChatId(activeChatId);
		}
	}, [activeChatId]);

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
					// Twoja logika RWD:
					className={selectedChatId ? styles.hiddenOnMobile : ''}
				/>

				<ChatWindow
					chat={selectedChat}
					onBack={() => setSelectedChatId(null)}
					// Twoja logika RWD:
					className={!selectedChatId ? styles.hiddenOnMobile : ''}
				/>
			</div>
		</div>
	);
}

// 4. Główny komponent z Suspense (Wymagane przez Next.js dla useSearchParams)
export default function ChatsPage() {
	return (
		<Suspense fallback={<div className={styles.loading}>Ładowanie czatów...</div>}>
			<ChatsContent />
		</Suspense>
	);
}
