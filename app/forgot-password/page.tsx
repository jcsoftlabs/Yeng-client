'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('success');
            setMessage('Si cet email existe, un lien de réinitialisation a été envoyé.');
        } catch (err: any) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Une erreur est survenue.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-red-orange p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <img src="/logo.png" alt="Yeng Shipping" className="h-16 w-auto mx-auto mb-4 brightness-0 invert" />
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié</h1>
                    <p className="text-white/80">Entrez votre email pour réinitialiser votre mot de passe</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {status === 'success' ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <Send className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Email envoyé !</h3>
                            <p className="text-gray-600">
                                Vérifiez votre boîte de réception (et vos spams) pour les instructions de réinitialisation.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block mt-4 text-yeng-red font-semibold hover:underline"
                            >
                                Retour à la connexion
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{message}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none transition-colors"
                                        placeholder="votre@email.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3 px-4 gradient-red-orange text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {status === 'loading' ? (
                                    <span>Envoi en cours...</span>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Envoyer le lien</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

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
