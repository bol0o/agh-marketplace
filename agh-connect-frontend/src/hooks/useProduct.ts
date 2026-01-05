// src/hooks/useProduct.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';

export const useProduct = (id: string) => {
	return useQuery({
		queryKey: ['product', id], // Klucz zawiera ID, żeby cache'ować per produkt
		queryFn: () => productService.getOne(id),
		enabled: !!id, // Nie odpalaj zapytania, dopóki nie mamy ID
		staleTime: 1000 * 60 * 5, // 5 minut świeżości
		retry: 1, // Jeśli błąd (np. 404), spróbuj raz jeszcze i tyle
	});
};
