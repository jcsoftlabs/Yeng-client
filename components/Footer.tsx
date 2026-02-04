'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-yeng-navy text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <img src="/logo.png" alt="Yeng Shipping" className="h-12 w-auto mb-4 brightness-0 invert" />
                        <p className="text-gray-300 mb-4">
                            Service d'expédition rapide et fiable entre Haiti et les États-Unis.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-yeng-orange transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-yeng-orange transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-300 hover:text-yeng-orange transition-colors">Accueil</Link></li>
                            <li><Link href="/track" className="text-gray-300 hover:text-yeng-orange transition-colors">Tracking</Link></li>
                            <li><Link href="/#services" className="text-gray-300 hover:text-yeng-orange transition-colors">Services</Link></li>
                            <li><Link href="/#pricing" className="text-gray-300 hover:text-yeng-orange transition-colors">Tarifs</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-2">
                                <MapPin className="w-5 h-5 text-yeng-orange flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300 text-sm">7829 NW 72nd Ave<br />Miami, FL 33166</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Phone className="w-5 h-5 text-yeng-orange" />
                                <a href="tel:+5093641990" className="text-gray-300 hover:text-yeng-orange transition-colors">
                                    +509 3641 1990
                                </a>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="w-5 h-5 text-yeng-orange" />
                                <a href="mailto:contact@yengshipping.com" className="text-gray-300 hover:text-yeng-orange transition-colors">
                                    contact@yengshipping.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
                    <p>© 2026 Yeng Shipping. Tous droits réservés. site web par Christopher JEROME</p>
                </div>
            </div>
        </footer>
    );
}
