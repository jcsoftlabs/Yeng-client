'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, DollarSign, Clock, MapPin, Copy, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { api } from '@/lib/api';
import { statusColors, getStatusLabel } from '@/lib/status-config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface DashboardStats {
    totalParcels: number;
    inTransit: number;
    delivered: number;
    pendingPayment: number;
}

interface RecentParcel {
    id: string;
    trackingNumber: string;
    description: string;
    status: string;
    createdAt: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, customer, setCustomer, _hasHydrated } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        totalParcels: 0,
        inTransit: 0,
        delivered: 0,
        pendingPayment: 0,
    });
    const [recentParcels, setRecentParcels] = useState<RecentParcel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for hydration before checking auth
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        loadDashboardData();
    }, [isAuthenticated, _hasHydrated]);

    const loadDashboardData = async () => {
        try {
            const [parcels, profileData] = await Promise.all([
                api.getParcels(),
                api.getProfile()
            ]);

            // Update customer data in store with fresh data (including fullUSAAddress)
            if (profileData) {
                setCustomer(profileData);
            }

            // Calculate stats
            const stats = {
                totalParcels: parcels.length,
                inTransit: parcels.filter((p: any) => p.status === 'IN_TRANSIT').length,
                delivered: parcels.filter((p: any) => p.status === 'DELIVERED').length,
                pendingPayment: parcels.filter((p: any) => p.paymentStatus === 'PENDING').length,
            };

            setStats(stats);
            setRecentParcels(parcels.slice(0, 5));
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyAddress = () => {
        if (!customer) return;
        const fullAddress = customer.fullUSAAddress || `${customer.customAddress}\n7829 NW 72nd Ave\nMiami, FL 33166\nUSA`;
        navigator.clipboard.writeText(fullAddress);
        alert('Adresse copiée!');
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yeng-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-24 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-yeng-navy mb-2">
                            Bienvenue, {customer?.firstName}!
                        </h1>
                        <p className="text-gray-600">Voici un aperçu de vos expéditions</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yeng-red">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-600">Total Colis</p>
                                <Package className="w-5 h-5 text-yeng-red" />
                            </div>
                            <p className="text-3xl font-bold text-yeng-navy">{stats.totalParcels}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-600">En Transit</p>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-3xl font-bold text-yeng-navy">{stats.inTransit}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-600">Livrés</p>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <p className="text-3xl font-bold text-yeng-navy">{stats.delivered}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yeng-orange">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-600">Paiements en attente</p>
                                <DollarSign className="w-5 h-5 text-yeng-orange" />
                            </div>
                            <p className="text-3xl font-bold text-yeng-navy">{stats.pendingPayment}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Parcels */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-yeng-navy">Colis récents</h2>
                                    <Link
                                        href="/parcels"
                                        className="text-sm font-medium text-yeng-red hover:underline flex items-center space-x-1"
                                    >
                                        <span>Voir tout</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {recentParcels.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Aucun colis pour le moment</p>
                                        <p className="text-sm text-gray-500">
                                            Utilisez votre adresse USA pour commencer à expédier!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {recentParcels.map((parcel) => (
                                            <Link
                                                key={parcel.id}
                                                href={`/parcels/${parcel.id}`}
                                                className="block p-4 border border-gray-200 rounded-lg hover:border-yeng-red hover:shadow-md transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-semibold text-yeng-navy">{parcel.trackingNumber}</p>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[parcel.status]}`}>
                                                        {parcel.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-1">{parcel.description}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(parcel.createdAt).toLocaleDateString('fr-FR')}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* USA Address Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-yeng-red to-yeng-orange rounded-xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold">Votre adresse USA</h3>
                                    <MapPin className="w-6 h-6" />
                                </div>

                                {customer?.fullUSAAddress ? (
                                    <p className="whitespace-pre-line font-medium text-lg leading-relaxed">
                                        {customer.fullUSAAddress}
                                        {!customer.fullUSAAddress.includes('USA') && '\nUSA'}
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold mb-2">{customer?.customAddress}</p>
                                        <p className="text-sm opacity-90">7829 NW 72nd Ave</p>
                                        <p className="text-sm opacity-90">Miami, FL 33166</p>
                                        <p className="text-sm opacity-90">USA</p>
                                    </>
                                )}

                                <button
                                    onClick={copyAddress}
                                    className="w-full py-2 px-4 bg-white text-yeng-red font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                                >
                                    <Copy className="w-4 h-4" />
                                    <span>Copier l'adresse</span>
                                </button>

                                <p className="mt-4 text-sm opacity-90">
                                    Utilisez cette adresse pour tous vos achats en ligne aux États-Unis!
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-yeng-navy mb-4">Actions rapides</h3>
                                <div className="space-y-3">
                                    <Link
                                        href="/track"
                                        className="block w-full py-2 px-4 text-center border-2 border-yeng-navy text-yeng-navy font-semibold rounded-lg hover:bg-yeng-navy hover:text-white transition-all"
                                    >
                                        Suivre un colis
                                    </Link>
                                    <Link
                                        href="/parcels"
                                        className="block w-full py-2 px-4 text-center gradient-red-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                                    >
                                        Mes colis
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
