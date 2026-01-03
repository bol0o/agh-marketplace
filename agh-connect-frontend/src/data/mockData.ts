// src/data/mockData.ts
import { Product } from '@/types/marketplace';
import { CartItemType } from '@/types/cart';
import { Chat } from '@/types/social';
import { NotificationItem } from '@/types/notifications';
import { User } from '@/types/user';

// --- HELPERY ---
const now = new Date().toISOString();
const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();

// ==========================================
// 1. MOCK PRODUKTÓW (Baza dla wszystkiego)
// ==========================================

export const MOCK_PRODUCTS: Product[] = [
	{
		id: 'p1',
		title: 'Podręcznik do Fizyki Halliday Resnick (Tom 1)',
		description:
			'Podręcznik w stanie bardzo dobrym. Używany tylko przez jeden semestr. Brak podkreśleń w środku. Odbiór osobisty na MS AGH lub wysyłka.',
		price: 80.0,
		image: 'https://placehold.co/400x300?text=Fizyka+Resnick',
		category: 'ksiazki',
		condition: 'used',
		type: 'buy_now',
		location: 'MS AGH (Kapitol)',
		stock: 1,
		seller: {
			id: 'u2',
			name: 'Jan Kowalski',
			avatar: 'https://ui-avatars.com/api/?name=Jan+Kowalski&background=random',
			rating: 4.8,
		},
		views: 124,
		createdAt: twoDaysAgo,
	},
	{
		id: 'p2',
		title: 'Zestaw długopisów żelowych Pilot (Czarne)',
		description: 'Nowe, nieotwierane opakowanie. Sprzedaję, bo kupiłem za dużo.',
		price: 15.0,
		image: 'https://placehold.co/400x300?text=Dlugopisy',
		category: 'akcesoria',
		condition: 'new',
		type: 'buy_now',
		location: 'Budynek U-2',
		stock: 50,
		seller: {
			id: 'u3',
			name: 'Sklepik Studencki',
			avatar: 'https://ui-avatars.com/api/?name=Sklepik&background=0D8ABC&color=fff',
			rating: 4.9,
		},
		views: 45,
		createdAt: now,
	},
	{
		id: 'p3',
		title: 'Monitor Dell P2419H 24" IPS',
		description:
			'Monitor w pełni sprawny, idealny do akademika. Matryca bez bad pixeli. Dołączam kabel HDMI.',
		price: 350.0,
		image: 'https://placehold.co/400x300?text=Monitor+Dell',
		category: 'elektronika',
		condition: 'used',
		type: 'auction',
		location: 'Miasteczko Studenckie',
		stock: 1,
		seller: {
			id: 'u4',
			name: 'Marek Nowak',
			avatar: 'https://ui-avatars.com/api/?name=Marek+Nowak&background=random',
			rating: 4.5,
		},
		views: 340,
		createdAt: twoDaysAgo,
		endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Kończy się za 3 dni
	},
	{
		id: 'p4',
		title: 'Notatki z Analizy Matematycznej 1 (ET)',
		description: 'Kompletny skrypt z wykładów i ćwiczeń. Wszystko czytelnie rozpisane.',
		price: 15.0,
		image: 'https://placehold.co/400x300?text=Notatki+Analiza',
		category: 'notatki',
		condition: 'used',
		type: 'buy_now',
		location: 'D-17',
		stock: 1,
		seller: {
			id: 'u5',
			name: 'Anna Nowak',
			avatar: 'https://ui-avatars.com/api/?name=Anna+Nowak&background=ff0000&color=fff',
			rating: 5.0,
		},
		views: 88,
		createdAt: now,
	},
];

// ==========================================
// 2. MOCK KOSZYKA
// ==========================================

export const MOCK_CART: CartItemType[] = [
	{
		id: 'c1',
		quantity: 1,
		// Tutaj po prostu bierzemy obiekt z MOCK_PRODUCTS
		product: MOCK_PRODUCTS[0], // Fizyka
	},
	{
		id: 'c2',
		quantity: 2,
		product: MOCK_PRODUCTS[1], // Długopisy
	},
];

// ==========================================
// 3. MOCK CZATÓW
// ==========================================

export const MOCK_CHATS: Chat[] = [
	{
		id: 'chat1',
		updatedAt: '10 min temu',
		lastMessage: 'Jasne, możemy się spotkać pod D-17.',
		unreadCount: 2,
		user: {
			id: 'u5',
			name: 'Anna Nowak',
			avatar: 'AN', // Lub URL, zależnie jak obsługujesz w UI
			isOnline: true,
		},
		product: {
			id: 'p4',
			title: 'Notatki z Analizy Matematycznej 1 (ET)',
			price: 15.0,
			image: 'https://placehold.co/100',
			status: 'buying',
		},
		messages: [
			{
				id: 'm1',
				senderId: 'me',
				text: 'Cześć! Czy te notatki są nadal aktualne?',
				timestamp: '14:30',
			},
			{ id: 'm2', senderId: 'u5', text: 'Hej, tak! Wszystko aktualne.', timestamp: '14:32' },
			{
				id: 'm3',
				senderId: 'me',
				text: 'Super, kiedy masz czas żeby podejść na uczelnię?',
				timestamp: '14:33',
			},
			{ id: 'm4', senderId: 'u5', text: 'Będę dzisiaj około 16:00.', timestamp: '14:35' },
			{
				id: 'm5',
				senderId: 'u5',
				text: 'Jasne, możemy się spotkać pod D-17.',
				timestamp: '14:36',
			},
		],
	},
	{
		id: 'chat2',
		updatedAt: 'Wczoraj',
		lastMessage: 'Dzięki, przelew poszedł.',
		unreadCount: 0,
		user: {
			id: 'u2',
			name: 'Jan Kowalski',
			avatar: 'JK',
			isOnline: false,
			lastSeen: '2h temu',
		},
		product: {
			id: 'p1',
			title: 'Podręcznik do Fizyki Halliday Resnick',
			price: 80.0,
			image: 'https://placehold.co/100',
			status: 'buying',
		},
		messages: [
			{ id: 'm1', senderId: 'u2', text: 'Dzięki, przelew poszedł.', timestamp: '10:00' },
		],
	},
];

// ==========================================
// 4. MOCK POWIADOMIEŃ
// ==========================================

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
	{
		id: 'n1',
		type: 'offer',
		title: 'Zostałeś przelicytowany!',
		message:
			'Użytkownik Marek przebił Twoją ofertę w aukcji "Monitor Dell 24 cale". Aktualna cena: 360 zł.',
		timestamp: '15 min temu',
		isRead: false,
		link: '/marketplace/p3',
	},
	{
		id: 'n2',
		type: 'payment',
		title: 'Płatność otrzymana',
		message: 'Otrzymaliśmy potwierdzenie wpłaty za "Kalkulator Casio". Możesz wysłać paczkę.',
		timestamp: '2 godz. temu',
		isRead: false,
		link: '/chats/chat2',
	},
	{
		id: 'n3',
		type: 'system',
		title: 'Witaj w AGH Connect!',
		message:
			'Dziękujemy za rejestrację. Uzupełnij swój profil, aby zwiększyć zaufanie kupujących.',
		timestamp: '1 dzień temu',
		isRead: true,
		link: '/profile',
	},
	{
		id: 'n4',
		type: 'message',
		title: 'Nowa wiadomość od Anny',
		message: 'Anna Nowak wysłała Ci wiadomość dotyczącą "Notatki z Analizy".',
		timestamp: '10 min temu',
		isRead: false,
		link: '/chats/chat1',
	},
];

// ==========================================
// 5. MOCK UŻYTKOWNIKA (JA)
// ==========================================

export const MOCK_USER: User = {
	id: 'me',
	email: 'student@student.agh.edu.pl',
	name: 'Kamil Ślimak',
	avatar: 'https://ui-avatars.com/api/?name=Kamil+Slimak&background=0D8ABC&color=fff',
	role: 'student',
	studentInfo: {
		faculty: 'Wiet',
		year: 2,
	},
	rating: 5.0,
	ratingCount: 12,
	joinedAt: '2023-10-01T00:00:00Z',
	listedProductsCount: 2,
	soldItemsCount: 5,
	address: {
		street: 'Kawiory',
		buildingNumber: '26a',
		apartmentNumber: '102',
		city: 'Kraków',
		zipCode: '30-055',
		phone: '+48 123 456 789',
	},
	settings: {
		notifications: {
			email: true,
			push: true,
			marketing: false,
		},
	},
};
