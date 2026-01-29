'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Search, Filter, ArrowRight, Clock, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { statusColors, getStatusLabel } from '@/lib/status-config';

import { useRouter } from 'next/navigation';

export default function ParcelsPage() {
    const router = useRouter();
    const { isAuthenticated, _hasHydrated } = useAuth();
    const [parcels, setParcels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        // Wait for hydration before checking auth
        if (!_hasHydrated) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        loadParcels();
    }, [isAuthenticated, _hasHydrated]);

    const loadParcels = async () => {
        try {
            const data = await api.getParcels();
            setParcels(data);
        } catch (error) {
            console.error('Error loading parcels:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusIcons: Record<string, any> = {
        'PENDING': Clock,
        'IN_TRANSIT': Truck,
        'DELIVERED': CheckCircle,
        'CANCELLED': AlertCircle,
    };



    const filteredParcels = parcels.filter(parcel => {
        const matchesSearch = parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            parcel.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || parcel.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-24 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-yeng-navy mb-2">Mes Colis</h1>
                            <p className="text-gray-600">Gérez et suivez tous vos envois</p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="mt-4 md:mt-0 inline-flex items-center text-yeng-red font-medium hover:underline"
                        >
                            Retour au dashboard
                        </Link>
                    </div>

                    {/* Filters & Search */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par numéro de suivi ou description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red"
                            />
                        </div>
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
                            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red bg-white"
                            >
                                <option value="ALL">Tous les statuts</option>
                                <option value="PENDING">En attente</option>
                                <option value="IN_TRANSIT">En transit</option>
                                <option value="DELIVERED">Livré</option>
                            </select>
                        </div>
                    </div>

                    {/* Parcels List */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-yeng-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement de vos colis...</p>
                        </div>
                    ) : filteredParcels.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun colis trouvé</h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm || filterStatus !== 'ALL'
                                    ? "Aucun colis ne correspond à vos critères de recherche."
                                    : "Vous n'avez pas encore de colis enregistré."}
                            </p>
                            {(searchTerm || filterStatus !== 'ALL') && (
                                <button
                                    onClick={() => { setSearchTerm(''); setFilterStatus('ALL'); }}
                                    className="text-yeng-red font-medium hover:underline"
                                >
                                    Effacer les filtres
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {filteredParcels.map((parcel) => {
                                const StatusIcon = statusIcons[parcel.status] || Package;
                                return (
                                    <Link
                                        key={parcel.id}
                                        href={`/parcels/${parcel.id}`}
                                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:border-yeng-red hover:shadow-md transition-all group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-start space-x-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${statusColors[parcel.status]}`}>
                                                    <StatusIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="text-lg font-bold text-yeng-navy group-hover:text-yeng-red transition-colors">
                                                            {parcel.trackingNumber}
                                                        </h3>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[parcel.status]}`}>
                                                            {parcel.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mt-1">{parcel.description}</p>
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                        <span>Mis à jour le {new Date(parcel.updatedAt).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span>{parcel.weight} lbs</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between md:justify-end gap-6 min-w-[200px]">
                                                <div className="text-right">
                                                    {parcel.paymentStatus === 'PAID' ? (
                                                        <>
                                                            <p className="text-sm text-green-600 mb-1 font-semibold">✓ Payé</p>
                                                            <p className="text-xl font-bold text-gray-400 line-through">
                                                                ${parcel.totalAmount ? parcel.totalAmount.toFixed(2) : '0.00'}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-sm text-gray-500 mb-1">Total à payer</p>
                                                            <p className="text-xl font-bold text-yeng-navy">
                                                                ${parcel.totalAmount ? parcel.totalAmount.toFixed(2) : '0.00'}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-yeng-red transition-colors" />
                                            </div>

                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
