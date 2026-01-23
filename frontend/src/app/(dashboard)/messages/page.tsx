'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/store/useAuth';
import { Send, User as UserIcon, Package } from 'lucide-react';
import styles from './Messages.module.scss';

export default function MessagesPage() {
	const { user } = useAuth();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [text, setText] = useState('');
	const scrollRef = useRef<HTMLDivElement>(null);

	const { chats, messages, sendMessage, fetchMessages, fetchChats } = useChat(
		selectedId || undefined
	);

	// Pobieranie listy rozmów przy wejściu
	useEffect(() => {
		fetchChats();
	}, [fetchChats]);

	// Pobieranie historii po wyborze konkretnego czatu
	useEffect(() => {
		if (selectedId) fetchMessages(selectedId);
	}, [selectedId, fetchMessages]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
		});
	}, [messages]);

	const handleSend = async () => {
		if (!selectedId || !text.trim()) return;
		await sendMessage(selectedId, text);
		setText('');
	};

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				{/* LISTA ROZMÓW (SIDEBAR) */}
				<aside className={styles.sidebar}>
					<h2 className={styles.sidebarTitle}>Twoje rozmowy</h2>
					<div className={styles.chatList}>
						{chats.map((chat) => (
							<div
								key={chat.id}
								className={`${styles.chatItem} ${selectedId === chat.id ? styles.active : ''}`}
								onClick={() => setSelectedId(chat.id)}
							>
								<div className={styles.avatar}>
									{chat.user.avatar ? (
										<img src={chat.user.avatar} alt="" />
									) : (
										<UserIcon />
									)}
								</div>
								<div className={styles.info}>
									<div className={styles.infoTop}>
										<span className={styles.name}>{chat.user.name}</span>
										{chat.unreadCount > 0 && (
											<span className={styles.badge}>{chat.unreadCount}</span>
										)}
									</div>
									<span className={styles.productTitle}>
										<Package size={12} /> {chat.product.title}
									</span>
									<p className={styles.lastMsg}>{chat.lastMessage}</p>
								</div>
							</div>
						))}
					</div>
				</aside>

				{/* OKNO CZATU */}
				<main className={styles.chatWindow}>
					{selectedId ? (
						<>
							<div className={styles.messagesArea}>
								{messages.map((m) => (
									<div
										key={m.id}
										className={
											m.senderId === user?.id
												? styles.msgRight
												: styles.msgLeft
										}
									>
										<div className={styles.bubble}>{m.text}</div>
									</div>
								))}
								<div ref={scrollRef} />
							</div>
							<div className={styles.inputArea}>
								<input
									value={text}
									onChange={(e) => setText(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && handleSend()}
									placeholder="Napisz wiadomość..."
								/>
								<button onClick={handleSend} className={styles.sendBtn}>
									<Send size={20} />
								</button>
							</div>
						</>
					) : (
						<div className={styles.empty}>
							<p>Wybierz rozmowę z listy, aby zacząć pisać.</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
