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

interface ProductSeller {
    firstName: string;
    lastName: string;
    avgRating: number;
    reviewsCount: number;
}

export interface OrderItem {
	productId: string;
	quantity: number;
	snapshot: OrderItemSnapshot;
    seller: ProductSeller;
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
