'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { api } from '@/lib/api';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Les mots de passe ne correspondent pas.');
            return;
        }

        if (password.length < 8) {
            setStatus('error');
            setMessage('Le mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        if (!token) {
            setStatus('error');
            setMessage('Token manquant. Veuillez recliquer sur le lien reçu par email.');
            return;
        }

        setStatus('loading');
        setMessage('');

        try {
            await api.resetPassword(token, password);
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Le lien est invalide ou a expiré.');
        }
    };

    if (!token) {
        return (
            <div className="text-center text-red-600">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <p>Lien invalide ou manquant.</p>
                <Link href="/forgot-password" className="text-yeng-red underline mt-4 inline-block">
                    Demander un nouveau lien
                </Link>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Mot de passe modifié !</h3>
                    <p className="text-gray-600">
                        Votre mot de passe a été mis à jour avec succès.
                    </p>
                </div>
                <Link
                    href="/login"
                    className="block w-full py-3 px-4 gradient-red-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all text-center"
                >
                    Se connecter maintenant
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{message}</p>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none transition-colors"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none transition-colors"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 px-4 gradient-red-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                {status === 'loading' ? (
                    <span>Modification...</span>
                ) : (
                    <>
                        <checkCircle className="w-5 h-5" />
                        <span>Modifier le mot de passe</span>
                    </>
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center gradient-red-orange p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/">
                        <img src="/logo.png" alt="Yeng Shipping" className="h-16 w-auto mx-auto mb-4 brightness-0 invert" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Nouveau mot de passe</h1>
                    <p className="text-white/80">Choisissez un nouveau mot de passe sécurisé</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <Suspense fallback={<div className="text-center p-4">Chargement...</div>}>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className="mt-6 text-center border-t border-gray-100 pt-6">
                        <Link href="/login" className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Retour à la connexion</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
