import { RequireAdmin } from '@/components/auth/AuthGuard'; // Twoje zabezpieczenie

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return <div style={{ backgroundColor: '#111827', minHeight: '100vh' }}>{children}</div>;
}
