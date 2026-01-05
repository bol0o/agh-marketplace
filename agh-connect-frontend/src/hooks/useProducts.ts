// src/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';

export const useProducts = () => {
	return useQuery({
		queryKey: ['products'], // Unikalny klucz cache'a
		queryFn: productService.getAll, // Funkcja pobierająca dane
		staleTime: 1000 * 60 * 5, // Dane uznajemy za świeże przez 5 minut (nie odpytujemy API w tym czasie przy przełączaniu okien)
	});
};
