'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, ShoppingBag, Globe, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { locales, localeNames, Locale } from '@/i18n/config';

interface HeaderProps {
  locale: Locale;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('common');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
  ];

  const switchLocale = (newLocale: Locale) => {
    const currentPath = pathname.replace(`/${locale}`, '') || '/';
    window.location.href = `/${newLocale}${currentPath}`;
  };

  const isActive = (href: string) => {
    return pathname === `/${locale}${href}` || pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-gray-100/50'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <Image
              src="/logo-icon.png"
              alt="Than Than Jewellery"
              width={128}
              height={128}
              className="w-28 h-28 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 bg-clip-text text-transparent tracking-tight">
                Than Than
              </span>
              <span className="block text-xs uppercase tracking-[0.15em] text-gold-500 font-medium -mt-0.5">
                Gems & Jewelry
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-full ${
                  isActive(link.href)
                    ? 'text-gold-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute inset-0 bg-gold-50 rounded-full -z-10" />
                )}
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full transition-all duration-300 ${
                    isActive(link.href) ? 'w-4' : 'w-0'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  langMenuOpen
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{localeNames[locale]}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl shadow-black/10 border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-1.5">
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            switchLocale(loc);
                            setLangMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                            locale === loc
                              ? 'bg-gold-50 text-gold-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                            {loc.toUpperCase()}
                          </span>
                          {localeNames[loc]}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-300 group"
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-[11px] font-semibold rounded-full flex items-center justify-center shadow-lg shadow-gold-500/30 animate-in zoom-in duration-200">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-64 pb-6' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-1 pt-2 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-gold-50 text-gold-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
