'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');

  const quickLinks = [
    { href: '/', label: tc('home') },
    { href: '/products', label: tc('products') },
    { href: '/about', label: tc('about') },
    { href: '/cart', label: tc('cart') },
  ];

  return (
    <footer className="bg-gradient-to-br from-gold-50 via-amber-50 to-white border-t border-gold-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 flex items-stretch justify-center lg:justify-start">
            <Link href="/" className="flex items-center justify-center lg:justify-start w-full">
              <Image
                src="/logo-full.png"
                alt="Than Than Gems & Jewelry"
                width={400}
                height={300}
                className="h-full max-h-56 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gold-600 transition-colors group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">{t('contactUs')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+959123456789"
                  className="flex items-center gap-3 text-gray-600 hover:text-gold-600 transition-colors"
                >
                  <div className="w-9 h-9 bg-gold-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gold-600" />
                  </div>
                  <span className="text-sm">+95 9 123 456 789</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@thanthanjewellery.com"
                  className="flex items-center gap-3 text-gray-600 hover:text-gold-600 transition-colors"
                >
                  <div className="w-9 h-9 bg-gold-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gold-600" />
                  </div>
                  <span className="text-sm">info@thanthanjewellery.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <div className="w-9 h-9 bg-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gold-600" />
                </div>
                <span className="text-sm">Yangon, Myanmar</span>
              </li>
            </ul>
            {/* Social Links */}
            <div className="flex gap-2 mt-4">
              <a
                href="#"
                className="w-9 h-9 bg-gold-100 rounded-xl flex items-center justify-center text-gold-600 hover:bg-gold-500 hover:text-white transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-gold-100 rounded-xl flex items-center justify-center text-gold-600 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Than Than Jewellery. {t('rights')}.
            </p>
            <span className="text-sm text-gray-500">Crafted with care in Myanmar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
