import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/data/mockData';
import { ProductFormData } from '@/components/marketplace/product/ProductForm';
import EditProductClient from './EditProductClient'; // Importujemy nasz komponent kliencki

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: PageProps) {
	const { id } = await params;

	// 1. Logika serwerowa: Pobranie danych
	const product = MOCK_PRODUCTS.find((p) => p.id === id);

	if (!product) {
		notFound();
	}

	// 2. Mapowanie danych na format formularza
	const initialData: ProductFormData = {
		title: product.title,
		description: product.description || '',
		price: product.price,
		category: product.category,
		condition: product.condition as any,
		type: product.type as any,
		location: product.location,
		image: product.image,
	};

	// 3. Renderujemy komponent kliencki i przekazujemy mu dane
	return <EditProductClient initialData={initialData} id={id} />;
}
