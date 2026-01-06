import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get('token')?.value;
	const userRole = request.cookies.get('userRole')?.value;

	console.log(`[Middleware] ${pathname} - token: ${token ? 'YES' : 'NO'}, role: ${userRole}`);

	if (pathname === '/') {
		if (token) {
			const redirectUrl = userRole === 'ADMIN' ? '/admin' : '/home';
			console.log(`Redirecting from / to ${redirectUrl}`);
			return NextResponse.redirect(new URL(redirectUrl, request.url));
		} else {
			console.log('Redirecting from / to /landing');
			return NextResponse.redirect(new URL('/landing', request.url));
		}
	}

	if (pathname === '/login' || pathname === '/register') {
		if (token) {
			const redirectUrl = userRole === 'ADMIN' ? '/admin' : '/home';
			console.log(`User logged in, redirecting from ${pathname} to ${redirectUrl}`);
			return NextResponse.redirect(new URL(redirectUrl, request.url));
		}
		return NextResponse.next();
	}

	const protectedPaths = ['home', '/marketplace', '/profile', '/dashboard'];

	const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

	if (isProtected && !token) {
		console.log(`User not logged in, redirecting from ${pathname} to /login`);
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(loginUrl);
	}

	// 4. Admin pages - tylko dla adminów
	if (pathname.startsWith('/admin') && (!token || userRole !== 'admin')) {
		console.log(`User not admin, redirecting from ${pathname} to /home`);
		return NextResponse.redirect(new URL('/home', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|public).*)',
	],
};
