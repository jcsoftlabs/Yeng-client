'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Package, Plane, DollarSign, Clock, Shield, Zap, Search, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const [trackingNumber, setTrackingNumber] = useState('');

  const features = [
    {
      icon: Zap,
      title: 'Expédition Rapide',
      description: 'Livraison en 15-20 jours ouvrables',
      color: 'text-yeng-orange',
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Assurance complète sur tous les envois',
      color: 'text-yeng-red',
    },
    {
      icon: DollarSign,
      title: 'Prix Compétitifs',
      description: '$3/lb + 2% de la valeur déclarée',
      color: 'text-green-600',
    },
    {
      icon: Clock,
      title: 'Suivi en Temps Réel',
      description: 'Suivez votre colis à chaque étape',
      color: 'text-blue-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Inscrivez-vous',
      description: 'Créez votre compte et obtenez votre adresse USA personnalisée',
    },
    {
      number: '02',
      title: 'Expédiez',
      description: 'Envoyez vos colis à votre adresse USA Yeng Shipping',
    },
    {
      number: '03',
      title: 'Recevez',
      description: 'Récupérez vos colis en Haiti rapidement et en toute sécurité',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-red-orange opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold text-yeng-navy leading-tight mb-6">
                Expédition <span className="text-yeng-red">USA-Haiti</span> Simplifiée
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Service rapide, fiable et économique pour tous vos envois entre Haiti et les États-Unis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white gradient-red-orange rounded-full hover:shadow-xl transition-all transform hover:scale-105"
                >
                  Commencer maintenant
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-yeng-navy border-2 border-yeng-navy rounded-full hover:bg-yeng-navy hover:text-white transition-all"
                >
                  <Search className="mr-2 w-5 h-5" />
                  Suivre un colis
                </Link>
              </div>
            </div>

            <div className="relative animate-slide-up">
              <div className="relative">
                <div className="absolute -inset-4 gradient-red-orange opacity-20 blur-3xl rounded-full"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 gradient-red-orange rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tracking rapide</p>
                      <p className="text-lg font-semibold text-yeng-navy">Où est mon colis?</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Entrez votre numéro de suivi"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yeng-red focus:outline-none transition-colors"
                    />
                    <Link
                      href={`/track${trackingNumber ? `?tracking=${trackingNumber}` : ''}`}
                      className="block w-full px-6 py-3 text-center font-semibold text-white gradient-red-orange rounded-lg hover:shadow-lg transition-all"
                    >
                      Suivre
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-yeng-navy mb-4">Pourquoi choisir Yeng Shipping?</h2>
            <p className="text-xl text-gray-600">Des services conçus pour votre tranquillité d'esprit</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-semibold text-yeng-navy mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-yeng-navy mb-4">Comment ça marche?</h2>
            <p className="text-xl text-gray-600">Trois étapes simples pour expédier vos colis</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 gradient-red-orange rounded-full text-white text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-semibold text-yeng-navy mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-yeng-red to-yeng-orange -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-yeng-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tarification Simple et Transparente</h2>
            <p className="text-xl text-gray-300">Pas de frais cachés, juste des prix honnêtes</p>
          </div>
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Frais d'expédition</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-yeng-orange" />
                    <span>$3.00 par livre</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-yeng-orange" />
                    <span>+ 2% de la valeur déclarée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-yeng-orange" />
                    <span>+ 10% de taxes</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Exemple</h3>
                <div className="bg-white/10 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Colis de 10 lbs</span>
                    <span>$30.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valeur: $500 (2%)</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (10%)</span>
                    <span>$4.00</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 flex justify-between font-bold text-xl">
                    <span>Total</span>
                    <span className="text-yeng-orange">$44.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-red-orange text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Prêt à commencer?</h2>
          <p className="text-xl mb-8 opacity-90">
            Inscrivez-vous maintenant et obtenez votre adresse USA personnalisée en quelques minutes!
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-yeng-red rounded-full hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
