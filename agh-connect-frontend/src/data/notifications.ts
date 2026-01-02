// src/data/notifications.ts

export type NotificationType = 'system' | 'offer' | 'payment' | 'message';

export interface NotificationItem {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	link?: string; // Np. link do oferty
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
	{
		id: '1',
		type: 'offer',
		title: 'Zostałeś przelicytowany!',
		message:
			'Użytkownik Marek przebił Twoją ofertę w aukcji "Monitor Dell 24 cale". Aktualna cena: 220 zł.',
		timestamp: '15 min temu',
		isRead: false,
		link: '/marketplace/4',
	},
	{
		id: '2',
		type: 'payment',
		title: 'Płatność otrzymana',
		message: 'Otrzymaliśmy potwierdzenie wpłaty za "Kalkulator Casio". Możesz wysłać paczkę.',
		timestamp: '2 godz. temu',
		isRead: false,
		link: '/chats', // lub link do zamówienia
	},
	{
		id: '3',
		type: 'system',
		title: 'Witaj w AGH Connect!',
		message:
			'Dziękujemy za rejestrację. Uzupełnij swój profil, aby zwiększyć zaufanie kupujących.',
		timestamp: '1 dzień temu',
		isRead: true,
		link: '/profile',
	},
	{
		id: '4',
		type: 'offer',
		title: 'Obserwowana oferta kończy się',
		message: 'Aukcja "Notatki z Fizyki" kończy się za 1 godzinę.',
		timestamp: '2 dni temu',
		isRead: true,
		link: '/marketplace/3',
	},
	{
		id: '5',
		type: 'system',
		title: 'Przerwa techniczna',
		message: 'W nocy z soboty na niedzielę planujemy przerwę techniczną (02:00 - 04:00).',
		timestamp: '3 dni temu',
		isRead: true,
	},
];
