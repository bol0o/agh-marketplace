'use client';

import { useState, useRef, useEffect } from 'react';
import { Chat } from '@/data/chats';
import { Send, ArrowLeft, MoreVertical, Trash2, Flag, MessageSquare } from 'lucide-react';
import { ProductContextBar } from './ProductContextBar';
import styles from './ChatWindow.module.scss';

interface ChatWindowProps {
	chat: Chat | undefined;
	onBack: () => void;
	className?: string;
}

export function ChatWindow({ chat, onBack, className }: ChatWindowProps) {
	const [messageInput, setMessageInput] = useState('');
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setIsMenuOpen(false);
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [chat?.id, chat?.messages]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageInput.trim()) return;
		console.log('Wysłano:', messageInput);
		setMessageInput('');
	};

	const handleMenuAction = (action: 'delete' | 'report') => {
		console.log(`Akcja: ${action}`);
		setIsMenuOpen(false);
	};

	if (!chat) {
		return (
			<main className={`${styles.main} ${className || ''}`}>
				<div className={styles.emptyState}>
					<div
						style={{
							width: 80,
							height: 80,
							borderRadius: '50%',
							background: '#f3f4f6',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							marginBottom: 24,
						}}
					>
						<MessageSquare size={40} />
					</div>
					<h3>Wybierz konwersację</h3>
					<p>Kliknij na osobę z listy, aby wyświetlić czat.</p>
				</div>
			</main>
		);
	}

	return (
		<main className={`${styles.main} ${className || ''}`}>
			<div className={styles.chatHeader}>
				<button className={styles.backBtn} onClick={onBack}>
					<ArrowLeft size={24} />
				</button>

				<div
					className={`${styles.avatar} ${chat.user.isOnline ? styles.online : ''}`}
					style={{ width: 40, height: 40 }}
				>
					<img
						src={
							chat.user.avatar ||
							`https://ui-avatars.com/api/?name=${chat.user.name}&background=random`
						}
						alt={chat.user.name}
					/>
				</div>

				<div className={styles.headerInfo}>
					<h3>{chat.user.name}</h3>
					<p className={chat.user.isOnline ? '' : styles.offline}>
						{chat.user.isOnline ? 'Dostępny teraz' : 'Offline'}
					</p>
				</div>

				<div className={styles.actions} ref={menuRef}>
					<button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
						<MoreVertical size={20} />
					</button>

					{isMenuOpen && (
						<div className={styles.dropdownMenu}>
							<button
								className={styles.danger}
								onClick={() => handleMenuAction('delete')}
							>
								<Trash2 size={16} /> Usuń konwersację
							</button>
							<button
								className={styles.danger}
								onClick={() => handleMenuAction('report')}
							>
								<Flag size={16} /> Zgłoś użytkownika
							</button>
						</div>
					)}
				</div>
			</div>

			<ProductContextBar product={chat.product} />

			<div className={styles.messagesArea}>
				{chat.messages.map((msg) => {
					const isMe = msg.senderId === 'me';
					return (
						<div
							key={msg.id}
							className={`${styles.messageBubble} ${isMe ? styles.me : styles.them}`}
						>
							{msg.text}
							<span className={styles.time}>{msg.timestamp}</span>
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			<form className={styles.inputArea} onSubmit={handleSendMessage}>
				<input
					type="text"
					placeholder="Napisz wiadomość..."
					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
				/>
				<button type="submit">
					<Send size={20} />
				</button>
			</form>
		</main>
	);
}
