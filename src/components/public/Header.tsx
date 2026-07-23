'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
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
    const handleScroll = () => setScrolled(window.scrollY > 16);
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

  const isActive = (href: string) =>
    pathname === `/${locale}${href}` || pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/90 backdrop-blur-md border-b border-gold-500/25 shadow-[0_10px_30px_-24px_rgba(31,27,20,0.6)]'
          : 'bg-ivory/70 backdrop-blur-sm border-b border-gold-500/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo + wordmark */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <Image
              src="/logo-icon.png"
              alt="Than Than Jewellery"
              width={112}
              height={112}
              className="w-11 h-11 sm:w-14 sm:h-14 object-contain shrink-0 transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="leading-none min-w-0">
              <span className="font-display text-lg sm:text-2xl font-semibold text-forest-800 tracking-wide block truncate">
                Than Than
              </span>
              <span className="eyebrow block mt-0.5 sm:mt-1 text-[0.5rem] sm:text-[0.6rem]">
                Gems &amp; Fine Jewellery
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm tracking-[0.14em] uppercase transition-colors duration-300 ${
                  isActive(link.href)
                    ? 'text-forest-800'
                    : 'text-ink-muted hover:text-forest-800'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-gold-500 transition-all duration-500 ${
                    isActive(link.href) ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                aria-label="Change language"
                className={`flex items-center gap-1.5 px-3 py-2 text-xs tracking-[0.12em] uppercase transition-colors duration-300 ${
                  langMenuOpen ? 'text-forest-800' : 'text-ink-muted hover:text-forest-800'
                }`}
              >
                <span>{locale.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} />
                  <div className="absolute right-0 mt-3 w-44 bg-ivory-card border border-gold-500/25 shadow-[0_20px_50px_-30px_rgba(31,27,20,0.6)] overflow-hidden z-20">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          switchLocale(loc);
                          setLangMenuOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors duration-200 ${
                          locale === loc
                            ? 'bg-gold-100/60 text-forest-800'
                            : 'text-ink-muted hover:bg-gold-100/40 hover:text-forest-800'
                        }`}
                      >
                        {localeNames[loc]}
                        <span className="tag-id text-gold-600">{loc.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              aria-label={t('cart')}
              className="relative p-2.5 text-ink-muted hover:text-forest-800 transition-colors duration-300 group"
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {itemCount > 0 && (
                <span
                  key={itemCount}
                  className="cart-bump absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-gold-500 text-[10px] font-semibold text-forest-900 rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2.5 text-ink-muted hover:text-forest-800 transition-colors duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            mobileMenuOpen ? 'max-h-64 pb-6' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col pt-2 border-t border-gold-500/20">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-1 py-3.5 text-sm uppercase tracking-[0.14em] border-b border-gold-500/10 transition-colors duration-200 ${
                  isActive(link.href) ? 'text-forest-800' : 'text-ink-muted hover:text-forest-800'
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
