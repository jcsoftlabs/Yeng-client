'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Clock, MapPin, DollarSign, FileText, ArrowLeft, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ParcelDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [parcel, setParcel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadParcelDetails();
    }, [params.id]);

    const loadParcelDetails = async () => {
        try {
            const data = await api.getParcel(params.id as string);
            setParcel(data);
        } catch (err: any) {
            setError('Impossible de charger les détails du colis');
            console.error(err);
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

    const statusColors: Record<string, string> = {
        'PENDING': 'text-yellow-600 bg-yellow-50 border-yellow-200',
        'IN_TRANSIT': 'text-blue-600 bg-blue-50 border-blue-200',
        'DELIVERED': 'text-green-600 bg-green-50 border-green-200',
        'CANCELLED': 'text-red-600 bg-red-50 border-red-200',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-yeng-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!parcel) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Colis non trouvé</h2>
                    <Link href="/parcels" className="text-yeng-red hover:underline">
                        Retour à la liste
                    </Link>
                </div>
            </div>
        );
    }

    const StatusIcon = statusIcons[parcel.status] || Package;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-24 pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href="/parcels"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-yeng-red transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à mes colis
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info & Timeline */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${statusColors[parcel.status]}`}>
                                            <StatusIcon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-yeng-navy mb-1">{parcel.trackingNumber}</h1>
                                            <p className="text-gray-600 text-lg mb-2">{parcel.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[parcel.status]}`}>
                                                    {parcel.status}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                    {parcel.weight} lbs
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-yeng-navy mb-6 flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Historique de suivi
                                </h2>
                                <div className="space-y-8 pl-4">
                                    {parcel.trackingEvents?.map((event: any, index: number) => (
                                        <div key={event.id} className="relative pl-8">
                                            {index < parcel.trackingEvents.length - 1 && (
                                                <div className="absolute left-[3px] top-8 bottom-[-32px] w-0.5 bg-gray-200"></div>
                                            )}
                                            <div className="absolute left-[-4px] top-1.5 w-3.5 h-3.5 rounded-full bg-yeng-orange border-2 border-white ring-2 ring-orange-100"></div>

                                            <div>
                                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                                                    <p className="font-semibold text-gray-900">{event.status}</p>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(event.createdAt).toLocaleDateString('fr-FR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-2">{event.description}</p>
                                                {event.location && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {event.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Financials & Actions */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Cost Breakdown */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-yeng-navy mb-4 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    Détails financiers
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frais d'expédition</span>
                                        <span>${parcel.shippingFee?.toFixed(2)}</span>
                                    </div>
                                    {parcel.declaredValue > 0 && (
                                        <div className="flex justify-between text-gray-600">
                                            <span>Assurance (2%)</span>
                                            <span>${(parcel.declaredValue * 0.02).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600">
                                        <span>Taxes</span>
                                        <span>${parcel.taxAmount?.toFixed(2)}</span>
                                    </div>
                                    {parcel.discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Réduction</span>
                                            <span>-${parcel.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-lg text-yeng-navy">
                                        <span>Total</span>
                                        <span>${parcel.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Invoice Download */}
                                {parcel.invoice && (
                                    <button
                                        onClick={() => api.downloadInvoicePDF(parcel.invoice.id, parcel.invoice.inodeNumber)}
                                        className="w-full mt-6 py-3 px-4 border-2 border-yeng-navy text-yeng-navy font-semibold rounded-lg hover:bg-yeng-navy hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Télécharger la facture
                                    </button>
                                )}
                            </div>

                            {/* Help Card */}
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-2">Besoin d'aide ?</h3>
                                <p className="text-sm text-blue-800 mb-4">
                                    Si vous avez des questions concernant ce colis, n'hésitez pas à nous contacter.
                                </p>
                                <a
                                    href="mailto:support@yengshipping.com"
                                    className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                                >
                                    Contacter le support
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
