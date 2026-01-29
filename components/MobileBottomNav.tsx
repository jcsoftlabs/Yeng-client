'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Search, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    // Navigation items for authenticated users
    const authenticatedNavigation = [
        {
            name: 'Accueil',
            href: '/',
            icon: Home,
        },
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            name: 'Mes Colis',
            href: '/parcels',
            icon: Package,
        },
        {
            name: 'Tracking',
            href: '/track',
            icon: Search,
        },
        {
            name: 'Profil',
            href: '/profile',
            icon: User,
        },
    ];

    // Navigation items for non-authenticated users
    const publicNavigation = [
        {
            name: 'Accueil',
            href: '/',
            icon: Home,
        },
        {
            name: 'Services',
            href: '/#services',
            icon: Package,
        },
        {
            name: 'Tracking',
            href: '/track',
            icon: Search,
        },
        {
            name: 'Connexion',
            href: '/login',
            icon: User,
        },
    ];

    const navigation = isAuthenticated ? authenticatedNavigation : publicNavigation;

    // Check if current path is active
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Spacer to prevent content from being hidden behind bottom nav */}
            <div className="h-20 md:hidden" />

            {/* Bottom Navigation Bar - Only visible on mobile */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
                <div className="grid grid-cols-5 h-16">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex flex-col items-center justify-center space-y-1
                                    transition-all duration-200 relative
                                    ${active
                                        ? 'text-yeng-red'
                                        : 'text-gray-500 hover:text-yeng-navy'
                                    }
                                `}
                            >
                                {/* Active indicator */}
                                {active && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-yeng-red to-yeng-orange rounded-b-full" />
                                )}

                                {/* Icon with scale animation */}
                                <div className={`
                                    transition-transform duration-200
                                    ${active ? 'scale-110' : 'scale-100'}
                                `}>
                                    <Icon className={`
                                        w-6 h-6
                                        ${active ? 'stroke-[2.5]' : 'stroke-2'}
                                    `} />
                                </div>

                                {/* Label */}
                                <span className={`
                                    text-xs font-medium
                                    ${active ? 'font-semibold' : 'font-normal'}
                                `}>
                                    {item.name}
                                </span>

                                {/* Active background glow */}
                                {active && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-50/50 to-transparent rounded-t-xl -z-10" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
