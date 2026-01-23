export interface ChatParticipant {
	id: string;
	name: string;
	avatar: string | null;
	isOnline: boolean;
}

export interface ChatProduct {
	id: string;
	title: string;
	price: number;
	image: string | null;
	status: 'buying' | 'selling';
}

export interface ChatListItem {
	id: string;
	updatedAt: string;
	lastMessage: string;
	unreadCount: number;
	user: ChatParticipant;
	product: ChatProduct;
}

export interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: string;
}
