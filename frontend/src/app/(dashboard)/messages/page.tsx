'use client';

import { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/store/useAuth';
import { Send, User as UserIcon, Package, ArrowLeft } from 'lucide-react';
import styles from './Messages.module.scss';
import Image from 'next/image';

export default function MessagesPage() {
    const { user } = useAuth();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [text, setText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const { chats, messages, sendMessage, fetchMessages, fetchChats } = useChat(
        selectedId || undefined
    );

    const activeChat = chats.find((c) => c.id === selectedId);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

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
                
                {/* NAPRAWIONE: Jeden ASIDE z warunkową klasą */}
                <aside className={`${styles.sidebar} ${selectedId ? styles.hiddenOnMobile : ''}`}>
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
                                        <Image 
                                            src={chat.user.avatar} 
                                            alt={chat.user.name} 
                                            fill
                                            className={styles.avatarImg}
                                            sizes="(max-width: 768px) 100px, 150px"
                                        />
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
                        {chats.length === 0 && (
                            <p className={styles.empty}>Brak rozpoczętych rozmów.</p>
                        )}
                    </div>
                </aside>

                <main className={`${styles.chatWindow} ${!selectedId ? styles.hiddenOnMobile : ''}`}>
                    {selectedId && activeChat ? (
                        <>
                            <div className={styles.chatHeader}>
                                <button
                                    className={styles.backButton}
                                    onClick={() => setSelectedId(null)}
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div className={styles.headerInfo}>
                                    <span className={styles.headerName}>
                                        {activeChat.user.name}
                                    </span>
                                    <span className={styles.headerProduct}>
                                        {activeChat.product.title}
                                    </span>
                                </div>
                            </div>

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
                                        <span className={styles.timestamp}>
                                            {new Date(m.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>

                            <div className={styles.inputArea}>
                                <input
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Napisz wiadomość..."
                                />
                                <button onClick={handleSend} className={styles.sendBtn}>
                                    <Send size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={`${styles.empty} ${styles.desktopOnly}`}>
                            <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>Wybierz rozmowę z listy, aby zacząć pisać.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}