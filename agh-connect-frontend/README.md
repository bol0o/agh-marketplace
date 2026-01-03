## 0. Auth

```ts
export interface LoginFormData {
	email: string;
	password: string;
}

export interface RegisterFormData extends LoginFormData {
	firstName: string;
	lastName: string;
	acceptTerms: boolean;
}

export interface AuthResponse {
	user: User; // Typ z sekcji 1. User
	token: string; // JWT
}
```

- POST /api/auth/login – Logowanie użytkownika. **Body**: LoginFormData
  **Response**: AuthResponse

- POST /api/auth/register – Rejestracja nowego konta.
  **Body**: RegisterFormData
  **Response**: AuthResponse (lub tylko status 201, jeśli wymagacie potwierdzenia emaila przed logowaniem)

- POST /api/auth/logout – Wylogowanie (unieważnienie tokenu/ciasteczka).

- POST /api/auth/refresh – Odświeżenie tokenu, jeśli wygasł.

## 1. User

```ts
export interface Address {
	street: string;
	city: string;
	zipCode: string;
	buildingNumber: string;
	apartmentNumber?: string;
	phone: string;
}

export interface UserSettings {
	notifications: {
		email: boolean;
		push: boolean;
		marketing: boolean;
	};
}

export interface User {
	id: string;
	email: string;
	name: string;
	avatar?: string;
	role: 'student' | 'admin';

	studentInfo?: {
		faculty: string; // np. "WI", "EAIiIB"
		year: number;
	};

	rating?: number; // Średnia ocen
	ratingCount: number; // Liczba opinii
	joinedAt: string; // Data dołączenia

	// Dane prywatne
	address?: Address;
	settings?: UserSettings;

	// Statystyki
	listedProductsCount: number;
	soldItemsCount: number;
}

export type PublicUserProfile = Pick<
	User,
	| 'id'
	| 'name'
	| 'avatar'
	| 'studentInfo'
	| 'rating'
	| 'ratingCount'
	| 'joinedAt'
	| 'listedProductsCount'
>;
```

- **GET** /api/users/me – Pełne dane zalogowanego.

- **PATCH** /api/users/me – Aktualizacja profilu (avatar, imię, wydział).

- **PATCH** /api/users/me/address – Aktualizacja adresu.

- **PATCH** /api/users/me/settings – Aktualizacja ustawień.

- **GET** /api/users/:id – Pobiera PublicUserProfile innego usera.

## 2. Orders

```ts
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface OrderItem {
	productId: string;
	// Snapshot: Dane produktu w momencie zakupu (cena mogła się zmienić)
	snapshot: {
		title: string;
		image: string;
		price: number;
	};
	quantity: number;
}

export interface Order {
	id: string;
	createdAt: string;
	status: OrderStatus;
	buyerId: string;

	totalAmount: number;
	shippingCost: number;
	shippingAddress: Address;

	items: OrderItem[];
	paymentId?: string;
}
```

**GET** /api/orders – Historia zakupów (moje zamówienia).

**GET** /api/orders/sales – Historia sprzedaży (co ja sprzedałem).

**GET** /api/orders/:id – Szczegóły zamówienia.

**POST** /api/orders – Utworzenie zamówienia (z koszyka).

**POST** /api/orders/:id/pay – Symulacja opłacenia.

**PATCH** /api/orders/:id/status – Zmiana statusu (np. sprzedawca klika "Wysłano").

## 3. Cart

```ts
import { Product } from './marketplace';

export interface CartItemType {
	id: string;
	quantity: number;
	product: Product;
}
```

- GET /api/cart – Pobiera zawartość koszyka.

- POST /api/cart – Dodaje produkt do koszyka. Body: { productId: string, quantity: number }.

- PATCH /api/cart/:itemId – Aktualizacja ilości. Body: { quantity: number }.

- DELETE /api/cart/:itemId – Usuwa pozycję z koszyka.

## 4. Notifications

```ts
export type NotificationType = 'system' | 'offer' | 'payment' | 'message';

export interface NotificationItem {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	link?: string;
}
```

- GET /api/notifications – Pobiera listę powiadomień.

- PATCH /api/notifications/mark-all-read – Oznacza wszystkie jako przeczytane.

- PATCH /api/notifications/:id/read – Oznacza pojedyncze jako przeczytane.

- DELETE /api/notifications/:id – Usuwa powiadomienie.

## 5. Marketplace

```ts
export interface Product {
	id: string;
	title: string;
	description?: string;
	price: number;
	image: string;

	category: string;
	condition: 'new' | 'used' | 'damaged';
	type: 'auction' | 'buy_now';

	location: string;
	stock: number;

	seller: {
		id: string;
		name: string;
		avatar?: string;
		rating?: number;
	};

	views: number;
	createdAt: string;
	endsAt?: string;
}
```

- GET /api/products – Pobiera listę produktów (obsługuje query params: ?page=, ?cat=, ?search=, ?sort=, ?minPrice, ?maxPrice, status=? (dla aukcji)).

- GET /api/products/:id – Pobiera szczegóły jednego produktu.

- POST /api/products – Dodawanie nowej oferty (wymaga zalogowania).

- PATCH /api/products/:id – Edycja oferty (tylko dla autora).

- DELETE /api/products/:id – Usunięcie/archiwizacja oferty.

## 6. Social

```ts
export interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: string;
}

export interface Chat {
	id: string;
	updatedAt: string;
	lastMessage: string;
	unreadCount: number;

	// Rozmówca
	user: {
		id: string;
		name: string;
		avatar: string;
		isOnline: boolean;
		lastSeen?: string;
	};

	// Kontekst produktu
	product: {
		id: string;
		title: string;
		price: number;
		image: string;
		status: 'buying' | 'selling' | 'archived';
	};

	// Opcjonalnie: pobierane dopiero po wejściu w szczegóły
	messages?: Message[];
}
```

- GET /api/chats – Pobiera listę konwersacji (sidebar).

- POST /api/chats – Rozpoczyna nową rozmowę. Body: { productId: string, initialMessage?: string }.

- GET /api/chats/:chatId/messages – Pobiera historię wiadomości w danym czacie.

- POST /api/chats/:chatId/messages – Wysyła wiadomość. Body: { text: string }.

## 7. Admin

```ts
export type ReportTargetType = 'product' | 'user' | 'chat';
export type ReportStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface Report {
	id: string;
	reporterId: string;
	targetType: ReportTargetType;
	targetId: string;
	reason: 'spam' | 'scam' | 'offensive' | 'other';
	description?: string;
	status: ReportStatus;
	createdAt: string;
}

export interface AdminStats {
	totalUsers: number;
	activeListings: number;
	totalRevenue: number;
	pendingReports: number;
}
```

- GET /api/admin/stats – Pobiera statystyki dashboardu.

- GET /api/admin/reports – Pobiera listę zgłoszeń.

- PATCH /api/admin/reports/:id – Zmienia status zgłoszenia (np. na 'resolved').

- GET /api/admin/users – Pobiera listę użytkowników do zarządzania (z filtrami).

- PATCH /api/admin/users/:id/status – Banowanie/odblokowywanie użytkownika.
