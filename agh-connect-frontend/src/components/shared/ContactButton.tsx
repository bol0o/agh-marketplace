'use client';

import { useRouter } from 'next/navigation';
import { Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { getOrCreateChat } from '@/data/mockData';
import { useUIStore } from '@/store/uiStore';

interface ContactButtonProps {
	targetUserId: string;
	productId?: string; // Opcjonalne (jeśli piszemy z oferty)
	className?: string; // Żebyś mógł przekazać style z parenta
	children?: React.ReactNode; // Np. tekst "Napisz wiadomość"
}

export function ContactButton({
	targetUserId,
	productId,
	className,
	children,
}: ContactButtonProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const addToast = useUIStore((s) => s.addToast);

	const handleContact = async () => {
		// Zabezpieczenie: nie mogę pisać do siebie
		if (targetUserId === 'me' || targetUserId === 'u1') {
			addToast('To Twój profil / Twoja oferta :)', 'info');
			return;
		}

		setIsLoading(true);

		// Symulacja opóźnienia sieci
		await new Promise((r) => setTimeout(r, 500));

		// 1. Pobierz ID czatu (istniejącego lub nowego)
		const chatId = getOrCreateChat(targetUserId, productId);

		if (chatId) {
			// 2. Przekieruj do czatu
			router.push(`/chats?active=${chatId}`);
			// Query param ?active=... obsłużymy na stronie czatów,
			// żeby od razu otworzył tę rozmowę
		} else {
			addToast('Nie udało się utworzyć rozmowy', 'error');
		}

		setIsLoading(false);
	};

	return (
		<button onClick={handleContact} className={className} disabled={isLoading}>
			{isLoading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
			{children || 'Napisz wiadomość'}
		</button>
	);
}
