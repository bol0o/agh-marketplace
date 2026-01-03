// src/data/cart.ts

export interface CartItemType {
	id: string;
	product: {
		id: string;
		title: string;
		price: number;
		image: string;
		condition: 'new' | 'used' | 'damaged';
		seller: string;
		location: string;
		stock: number; // <--- NOWE POLE
	};
	quantity: number;
}

export const MOCK_CART: CartItemType[] = [
	{
		id: 'c1',
		product: {
			id: 'p1',
			title: 'Podręcznik do Fizyki Halliday Resnick',
			price: 80,
			image: 'https://placehold.co/200',
			condition: 'used',
			seller: 'Jan Kowalski',
			location: 'Miasteczko Studenckie',
			stock: 1,
		},
		quantity: 1,
	},
	{
		id: 'c2',
		product: {
			id: 'p2',
			title: 'Zestaw długopisów żelowych (Nowe)',
			price: 15,
			image: 'https://placehold.co/200',
			condition: 'new',
			seller: 'Sklepik Studencki',
			location: 'WI D-17',
			stock: 50,
		},
		quantity: 2,
	},
];
