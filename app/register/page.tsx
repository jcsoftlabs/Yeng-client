'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, MapPin, Phone, AlertCircle, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [generatedAddress, setGeneratedAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        haitiAddress: '',
        haitiCity: '',
        haitiDepartment: '',
    });

    const generateCustomAddress = () => {
        const code = `${formData.firstName.substring(0, 2)}${formData.lastName.substring(0, 2)}${Math.floor(Math.random() * 1000)}`.toUpperCase();
        return code;
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
                setError('Veuillez remplir tous les champs');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setError('Les mots de passe ne correspondent pas');
                return;
            }
            if (formData.password.length < 6) {
                setError('Le mot de passe doit contenir au moins 6 caractères');
                return;
            }
            const customAddress = generateCustomAddress();
            setGeneratedAddress(customAddress);
            setError('');
            setStep(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.haitiAddress || !formData.haitiCity || !formData.haitiDepartment) {
            setError('Veuillez remplir votre adresse en Haiti');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // Create account
            await api.register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                customAddress: generatedAddress,
                haitiAddress: formData.haitiAddress,
                haitiCity: formData.haitiCity,
                haitiDepartment: formData.haitiDepartment,
            });

            // Auto-login after registration
            await api.login(formData.email, formData.password);

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la création du compte');
            setLoading(false);
        }
    };


    const copyAddress = () => {
        const fullAddress = `${generatedAddress}\n7829 NW 72nd Ave\nMiami, FL 33166\nUSA`;
        navigator.clipboard.writeText(fullAddress);
        alert('Adresse copiée!');
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-navy-blue p-4 py-12">
            <div className="w-full max-w-2xl">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <img src="/logo.png" alt="Yeng Shipping" className="h-16 w-auto mx-auto mb-4 brightness-0 invert" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
                    <p className="text-white/80">Obtenez votre adresse USA personnalisée</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-yeng-orange' : 'bg-white/30'} text-white font-semibold`}>
                            1
                        </div>
                        <div className={`w-16 h-1 ${step >= 2 ? 'bg-yeng-orange' : 'bg-white/30'}`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-yeng-orange' : 'bg-white/30'} text-white font-semibold`}>
                            2
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-yeng-navy mb-4">Informations personnelles</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                    placeholder="+509 XXXX XXXX"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleNext}
                                className="w-full py-3 px-4 gradient-red-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                            >
                                Continuer
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-2xl font-bold text-yeng-navy mb-4">Adresse en Haiti</h2>

                            {/* Generated USA Address */}
                            <div className="p-6 bg-gradient-to-r from-yeng-red/10 to-yeng-orange/10 rounded-lg border-2 border-yeng-orange">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Votre adresse USA personnalisée:</p>
                                        <p className="text-2xl font-bold text-yeng-navy">{generatedAddress}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={copyAddress}
                                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                    >
                                        <Copy className="w-5 h-5 text-yeng-orange" />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>7829 NW 72nd Ave</p>
                                    <p>Miami, FL 33166</p>
                                    <p>USA</p>
                                </div>
                                <div className="mt-3 flex items-start space-x-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-700">
                                        Utilisez cette adresse pour tous vos envois vers Haiti!
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.haitiAddress}
                                    onChange={(e) => setFormData({ ...formData, haitiAddress: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                    placeholder="Rue, numéro, quartier..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.haitiCity}
                                        onChange={(e) => setFormData({ ...formData, haitiCity: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                        placeholder="Port-au-Prince, Cap-Haïtien..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.haitiDepartment}
                                        onChange={(e) => setFormData({ ...formData, haitiDepartment: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none"
                                        placeholder="Ouest, Nord..."
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Retour
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-4 gradient-red-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Création...' : 'Créer mon compte'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Déjà un compte?{' '}
                            <Link href="/login" className="text-yeng-red font-semibold hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-white hover:underline">
                        ← Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
