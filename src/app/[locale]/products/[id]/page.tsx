'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ShoppingBag, Gem, ChevronLeft, ChevronRight, BadgeCheck, ShieldCheck, Truck } from 'lucide-react';
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
    { icon: BadgeCheck, label: locale === 'en' ? 'Certified authentic' : 'အစစ်အမှန်' },
    { icon: Truck, label: locale === 'en' ? 'Insured delivery' : 'အာမခံ ပို့ဆောင်' },
    { icon: ShieldCheck, label: locale === 'en' ? 'Lifetime care' : 'တစ်သက်တာ ဝန်ဆောင်မှု' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-12 h-12 border border-gold-300 border-t-gold-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="lux-card p-12 text-center max-w-md">
          <Gem className="w-12 h-12 text-gold-300 mx-auto mb-5" strokeWidth={1} />
          <h2 className="font-display text-2xl text-forest-900 mb-2">{t('notFound')}</h2>
          <p className="text-ink-muted mb-7">The piece you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="btn-gold">
            <ArrowLeft className="w-4 h-4" />
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Breadcrumb */}
      <div className="border-b border-gold-500/15">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs uppercase tracking-[0.1em]">
          <Link href="/" className="text-ink-muted hover:text-gold-700 transition-colors">
            {tc('home')}
          </Link>
          <span className="text-gold-500/50">/</span>
          <Link href="/products" className="text-ink-muted hover:text-gold-700 transition-colors">
            {tc('products')}
          </Link>
          <span className="text-gold-500/50">/</span>
          <span className="text-forest-800 truncate max-w-[200px] normal-case tracking-normal">{product.name[locale]}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-[#f4efe4] overflow-hidden relative group border border-gold-500/20">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name[locale]}
                  fill
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Gem className="w-20 h-20 text-gold-300" strokeWidth={1} />
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-ivory-card/90 backdrop-blur-sm text-forest-800 border border-gold-500/30 hover:bg-ivory-card transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center bg-ivory-card/90 backdrop-blur-sm text-forest-800 border border-gold-500/30 hover:bg-ivory-card transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="tag-id px-3 py-1.5 bg-forest-800/90 text-champagne backdrop-blur-sm">
                    {tc('featured')}
                  </span>
                )}
                {product.status === 'sold' && (
                  <span className="tag-id px-3 py-1.5 bg-ink/85 text-white backdrop-blur-sm">
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
                    className={`relative w-20 h-20 flex-shrink-0 overflow-hidden transition-all duration-200 border ${
                      selectedImage === index
                        ? 'border-gold-500'
                        : 'border-gold-500/20 opacity-60 hover:opacity-100'
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
                    className="eyebrow hover:text-gold-700 transition-colors"
                  >
                    {product.category.name[locale]}
                  </Link>
                )}
                <span className="w-1 h-1 bg-gold-500/50 rounded-full" />
                <span className="tag-id text-ink-muted">{product.productId}</span>
              </div>

              {/* Title */}
              <h1 className="font-display font-light text-4xl md:text-5xl text-forest-900 leading-tight">
                {product.name[locale]}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium text-forest-900">
                  {formatPrice(product.price)}
                </span>
                <span className="tag-id text-ink-muted">{tc('currency')}</span>
              </div>

              {/* Description */}
              {product.description[locale] && (
                <div className="pt-6 border-t border-gold-500/15">
                  <h2 className="eyebrow mb-3">{t('description')}</h2>
                  <p className="text-ink-muted leading-relaxed">
                    {product.description[locale]}
                  </p>
                </div>
              )}

              {/* Add to Cart */}
              <div className="pt-6 space-y-4">
                {product.status === 'available' ? (
                  <button onClick={handleAddToCart} className="btn-gold w-full">
                    <ShoppingBag className="w-5 h-5" />
                    {t('addToCart')}
                  </button>
                ) : (
                  <div className="w-full px-8 py-4 border border-gold-500/20 text-ink-muted uppercase tracking-[0.12em] text-sm text-center">
                    {tc('sold')}
                  </div>
                )}

                <p className="text-sm text-ink-muted text-center">{t('messengerNote')}</p>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold-500/15">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <feature.icon className="w-5 h-5 text-gold-600 mx-auto mb-2" strokeWidth={1.5} />
                    <span className="text-xs text-ink-muted">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-champagne-soft/40 py-20 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-light text-3xl md:text-4xl text-forest-900 text-center mb-3">
              {t('relatedProducts')}
            </h2>
            <div className="gem-divider mb-12"><span className="gem" /></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
