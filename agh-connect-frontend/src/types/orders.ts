import { Address } from './user';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface OrderItem {
	productId: string;
	// Snapshot: Dane produktu w momencie zakupu (cena mogła się zmienić)
	snapshot: {
		title: string;
		image: string;
		price: number;
	};
	quantity: number;
}

export interface Order {
	id: string;
	createdAt: string;
	status: OrderStatus;
	buyerId: string;

	totalAmount: number;
	shippingCost: number;
	shippingAddress: Address;

	items: OrderItem[];
	paymentId?: string;
}
