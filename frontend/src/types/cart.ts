export interface CartItem {
	id: string;
	quantity: number;
	product: {
		id: string;
		title: string;
		price: number;
		image: string;
		category: string;
		condition: string;
		location: string;
		seller: {
			id: string;
			name: string;
			avatar: string | null;
		};
	};
}

export interface CartResponse {
	items: CartItem[];
}

export interface AddToCartRequest {
	productId: string;
	quantity: number;
}

export interface AddToCartResponse {
	message: string;
	cartItem: {
		id: string;
		cartId: string;
		productId: string;
		quantity: number;
		createdAt: string;
	};
}

export interface UpdateCartItemRequest {
	quantity: number;
}

export interface UpdateCartItemResponse {
	message: string;
	item: {
		id: string;
		cartId: string;
		productId: string;
		quantity: number;
		createdAt: string;
	};
}

export interface DeleteCartItemResponse {
	message: string;
}
