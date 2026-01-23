import { useState, useEffect, useCallback } from 'react';
import { isAxiosError } from 'axios';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/uiStore';
import { AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

export const useCart = () => {
	const {
		items,
		setCart,
		updateItem: updateItemInStore,
		removeItem: removeItemFromStore,
		setLoading,
		setError,
	} = useCartStore();

	const addToast = useUIStore((state) => state.addToast);
	const [isInitialized, setIsInitialized] = useState(false);

	const fetchCart = useCallback(async () => {
		try {
			setLoading(true);
			const response = await api.get('/cart');
			setCart(response.data.items);
		} catch (err: unknown) {
			console.error('Error fetching cart:', err);
			setError('Nie udało się załadować koszyka');
		} finally {
			setLoading(false);
		}
	}, [setLoading, setCart, setError]);

	useEffect(() => {
		if (!isInitialized) {
			fetchCart();
			setIsInitialized(true);
		}
	}, [isInitialized, fetchCart]);

	const addToCart = async (productId: string, quantity: number = 1) => {
		try {
			setLoading(true);
			const request: AddToCartRequest = { productId, quantity };
			const response = await api.post('/cart', request);

			await fetchCart();

			addToast('Produkt dodany do koszyka', 'success');
			return response.data;
		} catch (err: unknown) {
			console.error('Error adding to cart:', err);

			let message = 'Nie udało się dodać produktu do koszyka';

			if (isAxiosError(err)) {
				message = err.response?.data?.message || message;
			}

			addToast(message, 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateCartItem = async (itemId: string, quantity: number) => {
		try {
			if (quantity < 1) {
				await removeCartItem(itemId);
				return;
			}

			setLoading(true);
			const request: UpdateCartItemRequest = { quantity };
			const response = await api.patch(`/cart/${itemId}`, request);

			updateItemInStore(itemId, quantity);
			addToast('Zaktualizowano ilość', 'success');
			return response.data;
		} catch (err: unknown) {
			console.error('Error updating cart item:', err);

			let message = 'Nie udało się zaktualizować koszyka';

			if (isAxiosError(err)) {
				message = err.response?.data?.message || message;
			}

			addToast(message, 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const removeCartItem = async (itemId: string) => {
		try {
			setLoading(true);
			await api.delete(`/cart/${itemId}`);

			removeItemFromStore(itemId);
			addToast('Usunięto z koszyka', 'success');
		} catch (err: unknown) {
			console.error('Error removing cart item:', err);

			let message = 'Nie udało się usunąć produktu z koszyka';

			if (isAxiosError(err)) {
				message = err.response?.data?.message || message;
			}

			addToast(message, 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const clearCart = async () => {
		try {
			setLoading(true);
            api.delete('/cart');

			setCart([]);
			addToast('Koszyk został wyczyszczony', 'success');
		} catch (err: unknown) {
			console.error('Error clearing cart:', err);
			addToast('Nie udało się wyczyścić koszyka', 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		items,
		addToCart,
		updateCartItem,
		removeCartItem,
		clearCart,
		fetchCart,
	};
};
