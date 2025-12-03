'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Package, Sparkles } from 'lucide-react';
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

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
    toast.success(locale === 'en' ? 'Added to cart!' : 'စျေးခြင်းထဲထည့်ပြီးပါပြီ!');
  };

  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-200" />
          </div>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30">
              <Sparkles className="w-3 h-3" />
              {t('featured')}
            </span>
          )}
          {product.status === 'sold' && (
            <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-gray-900/90 text-white backdrop-blur-sm">
              {t('sold')}
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        {product.status === 'available' && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-3 bg-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gold-50 hover:scale-110 translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingBag className="w-5 h-5 text-gold-600" />
          </button>
        )}

        {/* Product ID Tag */}
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="px-2 py-1 text-[10px] font-medium rounded-md bg-white/90 backdrop-blur-sm text-gray-600">
            {product.productId}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {product.category && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-gold-600/80 mb-1.5">
            {product.category.name[locale]}
          </p>
        )}
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-3 line-clamp-2 group-hover:text-gold-600 transition-colors duration-300">
          {product.name[locale]}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm font-medium text-gray-400">
            {t('currency')}
          </span>
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Link>
  );
}
