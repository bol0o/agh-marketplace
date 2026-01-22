export const formatPrice = (price: number): string => {
	return new Intl.NumberFormat('pl-PL', {
		style: 'currency',
		currency: 'PLN',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};

export const formatDate = (dateString: string): string => {
	return new Date(dateString).toLocaleDateString('pl-PL', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};
