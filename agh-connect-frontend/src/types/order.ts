import { Address } from './user';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface OrderItem {
	productId: string;
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
	updatedAt: string;
	status: OrderStatus;

	// Kto kupił?
	buyerId: string;

	// Łączna kwota
	totalAmount: number;
	shippingCost: number;

	// Adres dostawy użyty w TYM zamówieniu
	shippingAddress: Address;

	// Lista przedmiotów
	items: OrderItem[];
}
