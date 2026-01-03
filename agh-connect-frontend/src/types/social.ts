export interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: string;
}

export interface Chat {
	id: string;
	updatedAt: string;
	lastMessage: string;
	unreadCount: number;

	// Rozmówca
	user: {
		id: string;
		name: string;
		avatar: string;
		isOnline: boolean;
		lastSeen?: string;
	};

	// Kontekst produktu
	product: {
		id: string;
		title: string;
		price: number;
		image: string;
		status: 'buying' | 'selling' | 'archived';
	};

	// Opcjonalnie: pobierane dopiero po wejściu w szczegóły
	messages?: Message[];
}
