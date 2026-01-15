export type ProductCategory = 'BOOKS' | 'ELECTRONICS' | 'ACCESSORIES' | 'CLOTHING' | 'OTHER';
export type ProductCondition = 'new' | 'used' | 'damaged';
export type ProductStatus = 'active' | 'sold' | 'ended' | 'reserved';

export interface Seller {
	id: string;
	name: string;
	avatar: string | null;
	rating: string;
}

export interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
	image?: string;
	category: ProductCategory;
	condition: ProductCondition;
	type: 'auction' | 'buy_now';
	location: string;
	stock: number;
	status: ProductStatus;
	seller: Seller;
	views: number;
	createdAt: string;
	endsAt?: string | null;
}

export interface ProductCardProps {
	product: Product;
	variant?: 'default' | 'compact';
	className?: string;
}

export interface PaginationData {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	itemsPerPage: number;
}

export interface ProductsResponse {
	pagination: PaginationData;
	products: Product[];
}

export interface UserInfo {
	firstName: string;
	lastName: string;
	avatarUrl: string | null;
}

export interface Bid {
	id: string;
	amount: number;
	userId: string;
	productId: string;
	createdAt: string;
	user: UserInfo;
}

export interface BidResponse {
	message: string;
	bid: Omit<Bid, 'user'>;
}

export interface BidFormData {
	amount: number;
	productId: string;
}

export interface Product {
	id: string;
	title: string;
	description: string;
	price: number;
	image?: string;
	category: ProductCategory;
	condition: ProductCondition;
	type: 'auction' | 'buy_now';
	location: string;
	stock: number;
	status: ProductStatus;
	seller: Seller;
	views: number;
	createdAt: string;
	endsAt?: string | null;
	bids?: Bid[];
}

export interface ProductWithBids extends Product {
	bids: Bid[];
}
