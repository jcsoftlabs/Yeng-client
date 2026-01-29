'use client';

import { useState } from 'react';
import { User, MapPin, Mail, Phone, Lock, Save, Copy } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { api } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
    const { customer, setCustomer } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState('info');

    const [formData, setFormData] = useState({
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        haitiAddress: customer?.addressLine1 || '',
        haitiCity: customer?.city || '',
        haitiDepartment: customer?.addressLine2 || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const updatedCustomer = await api.updateProfile(formData);
            setCustomer(updatedCustomer);
            setMessage('Profil mis à jour avec succès');
        } catch (error) {
            setMessage('Erreur lors de la mise à jour');
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-yeng-navy mb-8">Mon Profil</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="md:col-span-1 space-y-6">
                            {/* User Card */}
                            <div className="bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
                                <div className="w-24 h-24 bg-gradient-to-br from-yeng-red to-yeng-orange rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                                    {customer?.firstName?.[0]}{customer?.lastName?.[0]}
                                </div>
                                <h2 className="text-xl font-bold text-yeng-navy">{customer?.firstName} {customer?.lastName}</h2>
                                <p className="text-gray-500 text-sm mb-4">{customer?.email}</p>
                                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                    Client
                                </div>
                            </div>

                            {/* USA Address Mini-Card */}
                            <div className="bg-gradient-to-br from-yeng-navy to-blue-900 rounded-xl shadow-sm p-6 text-white">
                                <h3 className="font-semibold mb-3 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Adresse USA
                                </h3>
                                <div className="bg-white/10 rounded-lg p-3 text-sm mb-3">
                                    {customer?.fullUSAAddress ? (
                                        <p className="whitespace-pre-line font-medium leading-relaxed">
                                            {customer.fullUSAAddress}
                                            {!customer.fullUSAAddress.includes('USA') && '\nUSA'}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="font-bold">{customer?.customAddress}</p>
                                            <p className="opacity-90">7829 NW 72nd Ave</p>
                                            <p className="opacity-90">Miami, FL 33166</p>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={copyAddress}
                                    className="w-full py-2 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Copy className="w-3 h-3" />
                                    <span>Copier</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                {/* Tabs */}
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('info')}
                                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'info'
                                            ? 'border-yeng-red text-yeng-red'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Informations
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                                            ? 'border-yeng-red text-yeng-red'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Sécurité
                                    </button>
                                </div>

                                <div className="p-8">
                                    {activeTab === 'info' ? (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {message && (
                                                <div className={`p-4 rounded-lg text-sm ${message.includes('succès') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {message}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            disabled
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-medium text-yeng-navy mb-4">Adresse en Haiti</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.haitiAddress}
                                                            onChange={(e) => setFormData({ ...formData, haitiAddress: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                                                        <input
                                                            type="text"
                                                            value={formData.haitiCity}
                                                            onChange={(e) => setFormData({ ...formData, haitiCity: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Département / Adresse 2</label>
                                                        <input
                                                            type="text"
                                                            value={formData.haitiDepartment}
                                                            onChange={(e) => setFormData({ ...formData, haitiDepartment: e.target.value })}
                                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-yeng-red"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="px-6 py-2 bg-yeng-navy text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors flex items-center disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4 mr-2" />
                                                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Lock className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                            <h3 className="text-xl font-medium text-gray-900 mb-2">Sécurité du compte</h3>
                                            <p className="text-gray-500 mb-6">Pour changer votre mot de passe, veuillez contacter le support.</p>
                                            <a
                                                href="mailto:support@yengshipping.com"
                                                className="inline-flex items-center text-yeng-red hover:underline"
                                            >
                                                Contacter le support
                                            </a>
                                        </div>
                                    )}
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
