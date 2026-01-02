// src/data/chats.ts

export interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: string;
}

export interface Chat {
	id: string;
	user: {
		id: string;
		name: string;
		avatar: string;
		isOnline: boolean;
		lastSeen?: string;
	};
	// NOWE POLE: Kontekst produktu
	product: {
		title: string;
		price: number;
		image: string;
		status: 'buying' | 'selling' | 'bidding'; // np. do etykiety "KUPUJESZ"
	};
	lastMessage: string;
	unreadCount: number;
	updatedAt: string;
	messages: Message[];
}

export const MOCK_CHATS: Chat[] = [
	{
		id: '1',
		user: { id: 'u1', name: 'Anna Nowak', avatar: 'AN', isOnline: true },
		product: {
			title: 'Notatki z Analizy Matematycznej 1 (ET)',
			price: 15,
			image: 'https://placehold.co/100',
			status: 'buying',
		},
		lastMessage: 'Jasne, możemy się spotkać...',
		unreadCount: 2,
		updatedAt: '10 min temu',
		messages: [
			{
				id: 'm1',
				senderId: 'me',
				text: 'Cześć! Czy te notatki są nadal aktualne?',
				timestamp: '14:30',
			},
			{ id: 'm2', senderId: 'u1', text: 'Hej, tak! Wszystko aktualne.', timestamp: '14:32' },
			{
				id: 'm3',
				senderId: 'me',
				text: 'Super, kiedy masz czas żeby podejść na uczelnię?',
				timestamp: '14:33',
			},
			{ id: 'm4', senderId: 'u1', text: 'Będę dzisiaj około 16:00.', timestamp: '14:35' },
			{
				id: 'm5',
				senderId: 'u1',
				text: 'Jasne, możemy się spotkać pod D-17.',
				timestamp: '14:36',
			},
		],
	},
	{
		id: '2',
		user: {
			id: 'u2',
			name: 'Piotr Wiśniewski',
			avatar: 'PW',
			isOnline: false,
			lastSeen: 'Wczoraj',
		},
		product: {
			title: 'Kalkulator Casio FX-991EX',
			price: 120,
			image: 'https://placehold.co/100',
			status: 'selling',
		},
		lastMessage: 'Dzięki, przelew poszedł.',
		unreadCount: 0,
		updatedAt: 'Wczoraj',
		messages: [
			{ id: 'm1', senderId: 'u2', text: 'Dzięki, przelew poszedł.', timestamp: '10:00' },
		],
	},
];
