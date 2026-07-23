'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Plus, Gem } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/components/ui/Toast';

interface Product {
  _id: string;
  productId: string;
  name: { en: string; my: string };
  price: number;
  images: string[];
  status: 'available' | 'sold';
  featured: boolean;
  category?: { name: { en: string; my: string } };
}

interface ProductCardProps {
  product: Product;
  locale: 'en' | 'my';
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('common');
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => new Intl.NumberFormat('en-US').format(price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.status === 'sold') return;

    addItem({
      _id: product._id,
      productId: product.productId,
      name: product.name,
      price: product.price,
      images: product.images,
    });
    toast.success(locale === 'en' ? 'Added to cart' : 'စျေးခြင်းထဲထည့်ပြီးပါပြီ');
  };

  return (
    <Link href={`/products/${product._id}`} className="group relative lux-card block overflow-hidden">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-[#f4efe4]">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gold-300">
            <Gem className="w-12 h-12" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="tag-id px-2.5 py-1 bg-forest-800/90 text-champagne backdrop-blur-sm">
              {t('featured')}
            </span>
          )}
          {product.status === 'sold' && (
            <span className="tag-id px-2.5 py-1 bg-ink/85 text-white backdrop-blur-sm">
              {t('sold')}
            </span>
          )}
        </div>

        {/* Quick add */}
        {product.status === 'available' && (
          <button
            onClick={handleAddToCart}
            aria-label={t('addToCart')}
            className="absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center bg-ivory-card text-forest-800 border border-gold-500/40 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold-500 hover:text-forest-900"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-3.5 pt-3.5 pb-4 sm:px-5 sm:pt-4 sm:pb-5">
        <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
          {product.category ? (
            <span className="eyebrow text-[0.55rem] sm:text-[0.6rem] truncate min-w-0">{product.category.name[locale]}</span>
          ) : (
            <span />
          )}
          <span className="tag-id text-gold-600/80 shrink-0">{product.productId}</span>
        </div>
        <h3 className="font-display text-base sm:text-xl leading-snug text-forest-900 line-clamp-2 min-h-[2.6rem] sm:min-h-[3.2rem] transition-colors duration-300 group-hover:text-gold-700">
          {product.name[locale]}
        </h3>
        <div className="mt-2.5 pt-2.5 sm:mt-3 sm:pt-3 border-t border-gold-500/15 flex items-baseline gap-1.5">
          <span className="text-base sm:text-lg font-medium text-forest-900">{formatPrice(product.price)}</span>
          <span className="tag-id text-ink-muted">{t('currency')}</span>
        </div>
      </div>

      {/* Gold underline reveal */}
      <span className="absolute bottom-0 left-0 right-0 h-px bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Link>
  );
}
