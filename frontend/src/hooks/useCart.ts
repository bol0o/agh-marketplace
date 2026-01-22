import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/uiStore';
import { CartItem, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

export const useCart = () => {
	const {
		items,
		setCart,
		addItem: addItemToStore,
		updateItem: updateItemInStore,
		removeItem: removeItemFromStore,
		setLoading,
		setError,
	} = useCartStore();

	const addToast = useUIStore((state) => state.addToast);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (!isInitialized) {
			fetchCart();
			setIsInitialized(true);
		}
	}, [isInitialized]);

	const fetchCart = async () => {
		try {
			setLoading(true);
			const response = await api.get('/cart');
			setCart(response.data.items);
		} catch (err: any) {
			console.error('Error fetching cart:', err);
			setError('Nie udało się załadować koszyka');
		} finally {
			setLoading(false);
		}
	};

	const addToCart = async (productId: string, quantity: number = 1) => {
		try {
			setLoading(true);
			const request: AddToCartRequest = { productId, quantity };
			const response = await api.post('/cart', request);

			await fetchCart();

			addToast('Produkt dodany do koszyka', 'success');
			return response.data;
		} catch (err: any) {
			console.error('Error adding to cart:', err);
			const message =
				err.response?.data?.message || 'Nie udało się dodać produktu do koszyka';
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
		} catch (err: any) {
			console.error('Error updating cart item:', err);
			const message = err.response?.data?.message || 'Nie udało się zaktualizować koszyka';
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
		} catch (err: any) {
			console.error('Error removing cart item:', err);
			const message =
				err.response?.data?.message || 'Nie udało się usunąć produktu z koszyka';
			addToast(message, 'error');
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const clearCart = async () => {
		try {
			setLoading(true);
			for (const item of items) {
				await api.delete(`/cart/${item.id}`);
			}

			setCart([]);
			addToast('Koszyk został wyczyszczony', 'success');
		} catch (err: any) {
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
