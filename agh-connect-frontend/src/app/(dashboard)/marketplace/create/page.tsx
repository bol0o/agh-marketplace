'use client';

import { useRouter } from 'next/navigation';
import { ProductForm, ProductFormData } from '@/components/marketplace/product/ProductForm';
import { useUIStore } from '@/store/uiStore';

export default function CreateListingPage() {
	const router = useRouter();
	const addToast = useUIStore((s) => s.addToast);

	const handleCreate = async (data: ProductFormData) => {
		// MOCK: Symulacja zapytania do API (POST /api/products)
		console.log('Sending data:', data);

		await new Promise((r) => setTimeout(r, 1000)); // Czekamy chwilę

		addToast('Ogłoszenie zostało dodane pomyślnie!', 'success');
		router.push('/marketplace'); // Przekierowanie do listy
	};

	return (
		<div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
			<h1 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: 800 }}>
				Dodaj nowe ogłoszenie
			</h1>
			<ProductForm onSubmit={handleCreate} />
		</div>
	);
}
