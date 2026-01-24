import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartStore {
	items: CartItem[];
	totalItems: number;
	totalPrice: number;
	isLoading: boolean;
	error: string | null;

	setCart: (items: CartItem[]) => void;
	addItem: (item: CartItem) => void;
	updateItem: (itemId: string, quantity: number) => void;
	removeItem: (itemId: string) => void;
	clearCart: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	getItem: (productId: string) => CartItem | undefined;
	getSubtotal: () => number;
	getShippingCost: () => number;
	getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			totalItems: 0,
			totalPrice: 0,
			isLoading: false,
			error: null,

			setCart: (items) => {
				const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
				const totalPrice = items.reduce(
					(sum, item) => sum + item.product.price * item.quantity,
					0
				);

				set({
					items,
					totalItems,
					totalPrice,
					error: null,
				});
			},

			addItem: (item) => {
				const state = get();
				const existingItemIndex = state.items.findIndex(
					(i) => i.product.id === item.product.id
				);

				let newItems;
				if (existingItemIndex >= 0) {
					newItems = [...state.items];
					newItems[existingItemIndex] = {
						...newItems[existingItemIndex],
						quantity: newItems[existingItemIndex].quantity + item.quantity,
					};
				} else {
					newItems = [...state.items, item];
				}

				const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
				const totalPrice = newItems.reduce(
					(sum, item) => sum + item.product.price * item.quantity,
					0
				);

				set({
					items: newItems,
					totalItems,
					totalPrice,
				});
			},

			updateItem: (itemId, quantity) => {
				const state = get();
				const itemIndex = state.items.findIndex((item) => item.id === itemId);

				if (itemIndex >= 0) {
					const newItems = [...state.items];
					newItems[itemIndex] = {
						...newItems[itemIndex],
						quantity,
					};

					const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
					const totalPrice = newItems.reduce(
						(sum, item) => sum + item.product.price * item.quantity,
						0
					);

					set({
						items: newItems,
						totalItems,
						totalPrice,
					});
				}
			},

			removeItem: (itemId) => {
				const state = get();
				const newItems = state.items.filter((item) => item.id !== itemId);

				const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
				const totalPrice = newItems.reduce(
					(sum, item) => sum + item.product.price * item.quantity,
					0
				);

				set({
					items: newItems,
					totalItems,
					totalPrice,
				});
			},

			clearCart: () => {
				set({
					items: [],
					totalItems: 0,
					totalPrice: 0,
					error: null,
				});
			},

			setLoading: (isLoading) => {
				set({ isLoading });
			},

			setError: (error) => {
				set({ error });
			},

			getItem: (productId) => {
				return get().items.find((item) => item.product.id === productId);
			},

			getSubtotal: () => {
				return get().items.reduce(
					(sum, item) => sum + item.product.price * item.quantity,
					0
				);
			},

			getShippingCost: () => {
				const subtotal = get().getSubtotal();
				return subtotal > 200 ? 0 : 15;
			},

			getTotal: () => {
				const subtotal = get().getSubtotal();
				const shipping = get().getShippingCost();
				return subtotal + shipping;
			},
		}),
		{
			name: 'cart-storage',
			partialize: (state) => ({
				items: state.items,
				totalItems: state.totalItems,
				totalPrice: state.totalPrice,
			}),
		}
	)
);
