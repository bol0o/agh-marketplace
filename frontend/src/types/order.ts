export interface OrderAddress {
	street: string;
	city: string;
	zipCode: string;
	phone: string;
	buildingNumber: string;
	apartmentNumber?: string;
}

export interface OrderItemSnapshot {
	title: string;
	image: string;
	price: number;
}

export interface OrderItem {
	productId: string;
	quantity: number;
	snapshot: OrderItemSnapshot;
}

export interface Order {
	id: string;
	createdAt: string;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
	buyerId: string;
	totalAmount: number;
	shippingCost: number;
	shippingAddress: OrderAddress;
	items: OrderItem[];
	paymentId: string;
}

export interface CreateOrderRequest {
	address: OrderAddress;
}

export interface CreateOrderResponse {
	id: string;
	createdAt: string;
	status: string;
	buyerId: string;
	totalAmount: number;
	shippingCost: number;
	shippingAddress: OrderAddress;
	items: OrderItem[];
	paymentId: string;
}
