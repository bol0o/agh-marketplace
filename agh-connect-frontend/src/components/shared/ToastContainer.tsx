'use client';

import { useState, useEffect } from 'react';
import { useUIStore, Toast } from '@/store/uiStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import styles from './ToastContainer.module.scss';

export function ToastContainer() {
	const { toasts, removeToast } = useUIStore();

	if (toasts.length === 0) return null;

	return (
		<div className={styles.container}>
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
			))}
		</div>
	);
}

// --- SUB-KOMPONENT (Zarządza własnym życiem) ---

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
	const [isClosing, setIsClosing] = useState(false);

	useEffect(() => {
		// Czas życia powiadomienia (np. 3 sekundy widoczności)
		const timer = setTimeout(() => {
			setIsClosing(true); // Rozpocznij animację wyjścia
		}, 3000);

		return () => clearTimeout(timer);
	}, []);

	const handleAnimationEnd = () => {
		// Jeśli skończyła się animacja zamykania, usuń ze store'a
		if (isClosing) {
			onRemove();
		}
	};

	// Wymuszenie zamknięcia kliknięciem X
	const handleManualClose = () => {
		setIsClosing(true);
	};

	return (
		<div
			className={`${styles.toast} ${styles[toast.type]} ${isClosing ? styles.closing : ''}`}
			onAnimationEnd={handleAnimationEnd}
		>
			<div className={styles.icon}>
				{toast.type === 'success' && <CheckCircle size={20} />}
				{toast.type === 'error' && <AlertCircle size={20} />}
				{toast.type === 'info' && <Info size={20} />}
			</div>

			<p className={styles.message}>{toast.message}</p>

			<button onClick={handleManualClose} className={styles.closeBtn}>
				<X size={16} />
			</button>
		</div>
	);
}
