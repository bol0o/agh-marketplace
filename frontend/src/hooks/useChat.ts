import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from '@/lib/axios';
import { useAuth } from '@/store/useAuth';
import { Message, ChatListItem } from '@/types/chat';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;

interface NewMessagePayload {
	chatId: string;
	text: string;
	senderId: string;
	senderName: string;
	productTitle: string;
}

export const useChat = (activeChatId?: string) => {
	const { user } = useAuth();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [chats, setChats] = useState<ChatListItem[]>([]);

	const activeChatIdRef = useRef(activeChatId);
	useEffect(() => {
		activeChatIdRef.current = activeChatId;
	}, [activeChatId]);

	const fetchChats = useCallback(async () => {
		try {
			const { data } = await axios.get('/chat');
			setChats(data);
		} catch (err) {
			console.error('Błąd pobierania czatów', err);
		}
	}, []);

	const fetchMessages = useCallback(async (id: string) => {
		try {
			const { data } = await axios.get(`/chat/${id}/messages`);
			setMessages(data);
		} catch (err) {
			console.error('Błąd pobierania wiadomości', err);
		}
	}, []);

	useEffect(() => {
		if (user) {
			fetchChats();
		}
	}, [user, fetchChats]);

	useEffect(() => {
		if (!user) return;

		const newSocket = io(SOCKET_URL, {
			transports: ['websocket'],
			path: '/socket.io',
			autoConnect: true,
		});

		setSocket(newSocket);

		newSocket.on('connect', () => {
			console.log('Połączono z socketem');
			newSocket.emit('join_user_room', user.id);
		});

		newSocket.on('new_message', (payload: NewMessagePayload) => {
			if (payload.chatId === activeChatIdRef.current) {
				setMessages((prev) => [
					...prev,
					{
						id: `temp-${Date.now()}`,
						senderId: payload.senderId,
						text: payload.text,
						timestamp: new Date().toISOString(),
					},
				]);
			}

			axios.get('/chat').then((res) => setChats(res.data));
		});

		return () => {
			newSocket.off('new_message');
			newSocket.close();
		};
	}, [user]);

	const sendMessage = async (id: string, text: string) => {
		if (!text.trim()) return;
		try {
			const { data } = await axios.post(`/chat/${id}/messages`, { text });
			setMessages((prev) => [...prev, data]);
			fetchChats();
		} catch (err) {
			console.error('Błąd wysyłania', err);
		}
	};

	return { chats, messages, sendMessage, fetchChats, fetchMessages, socket };
};
