'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ShoppingBag, Package, ChevronLeft, ChevronRight, Sparkles, Check, Shield, Truck } from 'lucide-react';
import { productsApi } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { toast } from '@/components/ui/Toast';
import ProductCard from '@/components/public/ProductCard';

interface Product {
  _id: string;
  productId: string;
  name: { en: string; my: string };
  description: { en: string; my: string };
  price: number;
  images: string[];
  status: 'available' | 'sold';
  featured: boolean;
  category?: { _id: string; name: { en: string; my: string }; slug: string };
}

interface ProductDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [locale, setLocale] = useState<'en' | 'my'>('en');
  const [productId, setProductId] = useState<string>('');
  const t = useTranslations('product');
  const tc = useTranslations('common');
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    params.then((p) => {
      setLocale(p.locale as 'en' | 'my');
      setProductId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await productsApi.getOne(productId);
        if (response.data.success) {
          setProduct(response.data.data);

          // Fetch related products from same category
          if (response.data.data.category?._id) {
            const relatedResponse = await productsApi.getAll({
              category: response.data.data.category._id,
              limit: 4,
              status: 'available',
            });
            if (relatedResponse.data.success) {
              setRelatedProducts(
                relatedResponse.data.data.filter((p: Product) => p._id !== productId)
              );
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const handleAddToCart = () => {
    if (!product || product.status === 'sold') return;

    addItem({
      _id: product._id,
      productId: product.productId,
      name: product.name,
      price: product.price,
      images: product.images,
    });
    toast.success(locale === 'en' ? 'Added to cart!' : 'စျေးခြင်းထဲထည့်ပြီးပါပြီ!');
  };

  const features = [
    { icon: Shield, label: 'Authentic Guarantee' },
    { icon: Truck, label: 'Free Delivery' },
    { icon: Check, label: 'Quality Certified' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold-200 rounded-full animate-spin border-t-gold-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-gold-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('notFound')}</h2>
          <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 text-white font-semibold rounded-xl hover:bg-gold-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gold-600 transition-colors">
            {tc('home')}
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/products" className="text-gray-500 hover:text-gold-600 transition-colors">
            {tc('products')}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name[locale]}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl overflow-hidden relative group">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name[locale]}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Package className="w-24 h-24 text-gray-200" />
                </div>
              )}

              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30">
                    <Sparkles className="w-3 h-3" />
                    {tc('featured')}
                  </span>
                )}
                {product.status === 'sold' && (
                  <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-gray-900/90 text-white backdrop-blur-sm">
                    {tc('sold')}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-2 ring-gold-500 ring-offset-2'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name[locale]} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <div className="space-y-6">
              {/* Category & ID */}
              <div className="flex items-center gap-3">
                {product.category && (
                  <Link
                    href={`/products?category=${product.category._id}`}
                    className="text-sm font-medium uppercase tracking-wider text-gold-600 hover:text-gold-700 transition-colors"
                  >
                    {product.category.name[locale]}
                  </Link>
                )}
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-400">{product.productId}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {product.name[locale]}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-lg text-gray-400">{tc('currency')}</span>
              </div>

              {/* Description */}
              {product.description[locale] && (
                <div className="pt-4 border-t border-gray-100">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                    {t('description')}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description[locale]}
                  </p>
                </div>
              )}

              {/* Add to Cart */}
              <div className="pt-6 space-y-4">
                {product.status === 'available' ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {t('addToCart')}
                  </button>
                ) : (
                  <div className="w-full px-8 py-4 bg-gray-100 text-gray-500 font-semibold rounded-xl text-center">
                    {tc('sold')}
                  </div>
                )}

                <p className="text-sm text-gray-500 text-center">{t('messengerNote')}</p>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <feature.icon className="w-5 h-5 text-gold-600" />
                    </div>
                    <span className="text-xs text-gray-600">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('relatedProducts')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
