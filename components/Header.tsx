'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Package, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import MobileBottomNav from './MobileBottomNav';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isAuthenticated, customer, logout } = useAuth();

    const navigation = [
        { name: 'Accueil', href: '/' },
        { name: 'Tracking', href: '/track' },
        { name: 'Services', href: '/#services' },
        { name: 'Tarifs', href: '/#pricing' },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3">
                            <img src="/logo.png" alt="Yeng Shipping" className="h-10 w-auto" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-yeng-navy hover:text-yeng-red transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center space-x-2 text-sm font-medium text-yeng-navy hover:text-yeng-red transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{customer?.firstName}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-yeng-red transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Déconnexion</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm font-medium text-yeng-navy hover:text-yeng-red transition-colors"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-6 py-2 text-sm font-semibold text-white gradient-red-orange rounded-full hover:shadow-lg transition-all"
                                    >
                                        S'inscrire
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile: Show nothing (bottom nav handles navigation) */}
                        <div className="md:hidden">
                            {/* Empty space - navigation is handled by bottom bar */}
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
        </>
    );
}
