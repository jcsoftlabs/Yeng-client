'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, MapPin, Clock, CheckCircle, AlertCircle, Truck, Home } from 'lucide-react';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { statusColors, getStatusLabel } from '@/lib/status-config';

interface TrackingEvent {
    id: string;
    status: string;
    location: string;
    description: string;
    timestamp: string;
}

interface ParcelData {
    id: string;
    trackingNumber: string;
    status: string;
    description: string;
    weight: number;
    declaredValue: number;
    customer: {
        firstName: string;
        lastName: string;
    };
    trackingEvents: TrackingEvent[];
    createdAt: string;
}

const statusIcons: Record<string, any> = {
    'PENDING': Clock,
    'IN_TRANSIT_USA': Truck,
    'DEPARTED_USA': Truck,
    'IN_TRANSIT_HAITI': Truck,
    'ARRIVED_HAITI': Package,
    'READY_FOR_PICKUP': Package,
    'PICKED_UP': CheckCircle,
    'CANCELLED': AlertCircle,
};

function TrackingContent() {
    const searchParams = useSearchParams();
    const [trackingNumber, setTrackingNumber] = useState(searchParams.get('tracking') || '');
    const [parcelData, setParcelData] = useState<ParcelData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const tracking = searchParams.get('tracking');
        if (tracking) {
            setTrackingNumber(tracking);
            handleTrack(tracking);
        }
    }, [searchParams]);

    const handleTrack = async (tracking?: string) => {
        const number = tracking || trackingNumber;
        if (!number) {
            setError('Veuillez entrer un numéro de suivi');
            return;
        }

        setError('');
        setLoading(true);
        setParcelData(null);

        try {
            const data = await api.trackParcel(number);
            setParcelData(data);
        } catch (err: any) {
            setError(err.message || 'Colis non trouvé');
        } finally {
            setLoading(false);
        }
    };

    const StatusIcon = parcelData ? statusIcons[parcelData.status] || Package : Package;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Search Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 gradient-red-orange rounded-full mb-4">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-yeng-navy mb-2">Suivre votre colis</h1>
                            <p className="text-gray-600">Entrez votre numéro de suivi pour voir où se trouve votre colis</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
                                placeholder="Ex: YENG-2026-00001"
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none text-lg"
                            />
                            <button
                                onClick={() => handleTrack()}
                                disabled={loading}
                                className="px-8 py-3 gradient-red-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Recherche...' : 'Suivre'}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    {parcelData && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Status Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${statusColors[parcelData.status]}`}>
                                            <StatusIcon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-yeng-navy mb-1">
                                                {parcelData.trackingNumber}
                                            </h2>
                                            <p className="text-gray-600">{parcelData.description}</p>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[parcelData.status]}`}>
                                        {parcelData.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Poids</p>
                                        <p className="text-lg font-semibold text-yeng-navy">{parcelData.weight} lbs</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Valeur déclarée</p>
                                        <p className="text-lg font-semibold text-yeng-navy">${parcelData.declaredValue}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Destinataire</p>
                                        <p className="text-lg font-semibold text-yeng-navy">
                                            {parcelData.customer.firstName} {parcelData.customer.lastName}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline - UPS Style */}
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <h3 className="text-xl font-bold text-yeng-navy mb-8">Parcours détaillé</h3>

                                <div className="space-y-1">
                                    {parcelData.trackingEvents.map((event, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === parcelData.trackingEvents.length - 1;
                                        const eventDate = new Date(event.timestamp);

                                        return (
                                            <div key={event.id} className="relative">
                                                {/* Timeline connector */}
                                                {!isLast && (
                                                    <div className="absolute left-[15px] top-12 bottom-0 w-[2px] bg-gray-200"></div>
                                                )}

                                                {/* Event row */}
                                                <div className={`flex items-start gap-6 py-4 px-4 rounded-lg transition-colors ${isFirst ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                                                    {/* Timeline dot */}
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFirst
                                                            ? 'bg-green-500 ring-4 ring-green-100'
                                                            : 'bg-gray-300 ring-4 ring-white'
                                                            }`}>
                                                            {isFirst && <CheckCircle className="w-5 h-5 text-white" />}
                                                        </div>
                                                    </div>

                                                    {/* Event details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-1">
                                                            <div className="flex-1">
                                                                <p className={`font-semibold ${isFirst ? 'text-green-700' : 'text-gray-900'}`}>
                                                                    {event.description}
                                                                </p>
                                                                {event.location && (
                                                                    <div className="flex items-center gap-1.5 mt-1">
                                                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                                        <span className="text-sm text-gray-600">{event.location}</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Date/Time */}
                                                            <div className="text-right flex-shrink-0">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {eventDate.toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {eventDate.toLocaleTimeString('fr-FR', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Empty state */}
                                {parcelData.trackingEvents.length === 0 && (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">Aucun événement de suivi disponible</p>
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <div className="bg-gradient-to-r from-yeng-red to-yeng-orange rounded-2xl p-8 text-white text-center">
                                <h3 className="text-2xl font-bold mb-3">Besoin d'envoyer un colis?</h3>
                                <p className="mb-6 opacity-90">Créez votre compte et obtenez votre adresse USA personnalisée</p>
                                <Link
                                    href="/register"
                                    className="inline-block px-8 py-3 bg-white text-yeng-red font-semibold rounded-full hover:shadow-xl transition-all"
                                >
                                    S'inscrire maintenant
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function TrackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yeng-red mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        }>
            <TrackingContent />
        </Suspense>
    );
}
