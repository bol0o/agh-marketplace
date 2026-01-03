'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { MOCK_CART } from '@/data/mockData';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import styles from './cart.module.scss';

export default function CartPage() {
	const [cartItems, setCartItems] = useState(MOCK_CART);

	// LOGIKA
	const updateQuantity = (id: string, newQuantity: number) => {
		if (newQuantity < 1) return;
		setCartItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
		);
	};

	const removeItem = (id: string) => {
		setCartItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleCheckout = () => {
		alert('Przekierowanie do bramki płatności...');
	};

	// Obliczanie sumy
	const subtotal = cartItems.reduce((acc, item) => {
		return acc + item.product.price * item.quantity;
	}, 0);

	const shippingCost = subtotal > 200 ? 0 : 15; // Darmowa dostawa od 200zł

	// EMPTY STATE
	if (cartItems.length === 0) {
		return (
			<div className={styles.emptyContainer}>
				<div className={styles.emptyContent}>
					<div className={styles.iconCircle}>
						<ShoppingBag size={48} />
					</div>
					<h1>Twój koszyk jest pusty</h1>
					<p>Wygląda na to, że nie dodałeś jeszcze żadnych przedmiotów.</p>
					<Link href="/marketplace" className={styles.shopBtn}>
						Wróć do zakupów
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.layoutWrapper}>
			<div className={styles.pageHeader}>
				<h1>Twój Koszyk ({cartItems.length})</h1>
			</div>

			<div className={styles.grid}>
				<div className={styles.itemsList}>
					{cartItems.map((item) => (
						<CartItem
							key={item.id}
							item={item}
							onRemove={removeItem}
							onUpdateQuantity={updateQuantity}
						/>
					))}
				</div>

				<aside className={styles.summarySidebar}>
					<CartSummary
						subtotal={subtotal}
						shippingCost={shippingCost}
						onCheckout={handleCheckout}
					/>
				</aside>
			</div>
		</div>
	);
}
