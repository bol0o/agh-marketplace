'use client';

import { useRouter } from 'next/navigation';
import { useUIStore } from '@/store/uiStore';
import { ProductForm, ProductFormData } from '@/components/marketplace/product/ProductForm';

interface EditProductClientProps {
	initialData: ProductFormData;
	id: string;
}

export default function EditProductClient({ initialData, id }: EditProductClientProps) {
	const router = useRouter();
	const addToast = useUIStore((s) => s.addToast);

	const handleUpdate = async (data: ProductFormData) => {
		// MOCK: Tutaj normalnie byłby PATCH /api/products/:id
		console.log('Updating product:', id, data);

		// Symulacja czasu zapisu
		await new Promise((r) => setTimeout(r, 1000));

		addToast('Zmiany zostały zapisane', 'success');
		router.push(`/marketplace/${id}`); // Przekierowanie
	};

	return (
		<div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
			<h1 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: 800 }}>
				Edytuj ogłoszenie
			</h1>
			<ProductForm initialData={initialData} onSubmit={handleUpdate} isEditing />
		</div>
	);
}
