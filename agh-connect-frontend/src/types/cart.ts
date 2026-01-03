import { Product } from './marketplace';

export interface CartItemType {
	id: string;
	quantity: number;
	product: Product;
}
