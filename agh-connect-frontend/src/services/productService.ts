import api from '@/lib/axios';
import { Product } from '@/types/marketplace';

export const productService = {
	getAll: async () => {
		const { data } = await api.get<Product[]>('/products');
		return data;
	},

	getOne: async (id: string) => {
		const { data } = await api.get<Product>(`/products/${id}`);
		return data;
	},
};
