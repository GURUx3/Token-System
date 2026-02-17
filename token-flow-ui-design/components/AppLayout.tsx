'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Ticket, LogOut, PlusCircle, Settings, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    // Checking auth client-side for prototype
    useEffect(() => {
        const session = localStorage.getItem('token_system_session');
        if (!session) {
            router.push('/login');
            return;
        }
        try {
            const parsed = JSON.parse(session);
            setUser(parsed.user);
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    if (!user) return null; // or loading spinner

    const isAdmin = user.role === 'admin';

    const userLinks = [
        { href: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/user/tickets', label: 'My Tickets', icon: Ticket },
        { href: '/user/tickets/new', label: 'New Ticket', icon: PlusCircle },
    ];

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/tickets', label: 'Ticket Queue', icon: Ticket },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    const handleLogout = () => {
        localStorage.removeItem('token_system_session');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-card flex flex-col fixed inset-y-0 z-50">
                <div className="h-16 flex items-center px-6 border-b">
                    <span className="font-bold text-lg tracking-tight">TokenSys</span>
                    <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 uppercase tracking-wider">
                        {isAdmin ? 'Admin' : 'Helpdesk'}
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-secondary text-primary"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t space-y-1">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-foreground mb-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="font-medium truncate max-w-[140px]">{user.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen">
                <header className="h-16 border-b bg-background/95 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-40">
                    <h1 className="text-sm font-medium text-muted-foreground">
                        {user.department} Department
                    </h1>
                    {/* Placeholder for top actions or search */}
                </header>

                <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-300">
                    {children}
                </div>
            </main>
        </div>
    );
}
