'use client';

import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <MobileBottomNav />
        </>
    );
}
