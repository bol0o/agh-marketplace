export interface Product {
	id: string;
	title: string;
	description?: string;
	price: number;
	image: string;

	category: string;
	condition: 'new' | 'used' | 'damaged';
	type: 'auction' | 'buy_now';

	location: string;
	stock: number;

	seller: {
		id: string;
		name: string;
		avatar?: string;
		rating?: number;
	};

	views: number;
	createdAt: string;
	endsAt?: string;
}
