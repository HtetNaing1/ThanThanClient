'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-forest-900 text-champagne-soft/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-11 sm:pt-16 pb-6 sm:pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 sm:gap-10 lg:gap-16 items-start">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-icon.png"
                alt="Than Than Jewellery"
                width={96}
                height={96}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
              <span>
                <span className="font-display text-xl sm:text-2xl text-white block leading-none">Than Than</span>
                <span className="eyebrow eyebrow-light block mt-1.5 text-[0.6rem]">Gems &amp; Fine Jewellery</span>
              </span>
            </Link>
            <p className="mt-4 sm:mt-6 text-sm leading-relaxed max-w-xs text-champagne-soft/55">
              {t('description')}.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="eyebrow eyebrow-light">{t('contactUs')}</h3>
            <ul className="mt-4 sm:mt-5 space-y-3 sm:space-y-4 text-[0.8rem] sm:text-sm">
              <li>
                <a href="tel:+959123456789" className="flex items-center gap-2.5 sm:gap-3 text-champagne-soft/70 hover:text-gold-300 transition-colors">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" strokeWidth={1.5} />
                  <span className="min-w-0">+95 9 123 456 789</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@thanthanjewellery.com" className="flex items-center gap-2.5 sm:gap-3 text-champagne-soft/70 hover:text-gold-300 transition-colors">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" strokeWidth={1.5} />
                  <span className="min-w-0 break-all">thanthanjewellery.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3 text-champagne-soft/70">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" strokeWidth={1.5} />
                <span className="min-w-0">Yangon, Myanmar</span>
              </li>
            </ul>
          </div>

          {/* Follow */}
          <div className="text-right">
            <h3 className="eyebrow eyebrow-light">{t('followUs')}</h3>
            <div className="flex items-center justify-end gap-3 mt-4 sm:mt-5">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center border border-gold-500/30 text-gold-300 hover:bg-gold-500 hover:text-forest-900 hover:border-gold-500 transition-all duration-300"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center border border-gold-500/30 text-gold-300 hover:bg-gold-500 hover:text-forest-900 hover:border-gold-500 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 sm:mt-14 pt-5 sm:pt-6 border-t border-gold-500/15 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-xs text-champagne-soft/50">
            &copy; {new Date().getFullYear()} Than Than Jewellery. {t('rights')}.
          </p>
          <p className="text-xs text-champagne-soft/50 tracking-wide">Handcrafted with care in Myanmar</p>
        </div>
      </div>
    </footer>
  );
}
