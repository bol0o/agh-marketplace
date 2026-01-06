import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const accessToken = request.cookies.get('accessToken')?.value;
	const userRole = request.cookies.get('userRole')?.value?.toLowerCase();

	if (pathname === '/') {
		if (accessToken) {
			const target = userRole === 'admin' ? '/admin' : '/home';
			return NextResponse.redirect(new URL(target, request.url));
		} else {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}

	if ((pathname === '/login' || pathname === '/register') && accessToken) {
		const target = userRole === 'admin' ? '/admin' : '/home';
		return NextResponse.redirect(new URL(target, request.url));
	}

	const isProtectedRoute =
		pathname.startsWith('/marketplace') ||
		pathname.startsWith('/home') ||
		pathname.startsWith('/profile') ||
		pathname.startsWith('/dashboard');

	if (isProtectedRoute && !accessToken) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (pathname.startsWith('/admin')) {
		if (!accessToken) return NextResponse.redirect(new URL('/login', request.url));
		if (userRole !== 'admin') return NextResponse.redirect(new URL('/home', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
