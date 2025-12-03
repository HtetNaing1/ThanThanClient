import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, Sparkles, Star, Shield, Truck } from 'lucide-react';
import ProductCard from '@/components/public/ProductCard';
import { Locale } from '@/i18n/config';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/products/featured`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getNewArrivals() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/products?limit=8&sort=createdAt&order=desc&status=available`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/categories`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ]);

  const features = [
    { icon: Shield, label: 'Authentic' },
    { icon: Star, label: 'Premium Quality' },
    { icon: Truck, label: 'Free Delivery' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-amber-50 via-white to-gold-50">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-200/30 via-transparent to-transparent" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span className="text-sm font-medium text-gold-700">Premium Collection 2024</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                {t('heroTitle').split(' ').slice(0, -1).join(' ')}{' '}
                <span className="relative">
                  <span className="bg-gradient-to-r from-gold-500 via-gold-600 to-gold-700 bg-clip-text text-transparent">
                    {t('heroTitle').split(' ').slice(-1)}
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 2 150 2 198 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                        <stop stopColor="#E6D94D"/>
                        <stop offset="1" stopColor="#BF991A"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-full hover:from-gold-600 hover:to-gold-700 transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-105"
                >
                  {t('shopNow')}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-gray-50 transition-all duration-300"
                >
                  {tc('about')}
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-600">
                    <feature.icon className="w-4 h-4 text-gold-600" />
                    <span className="text-sm">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square">
                {/* Decorative ring */}
                <div className="absolute inset-0 rounded-full border border-gold-400/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-gold-300/20 animate-[spin_25s_linear_infinite_reverse]" />

                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src="/logo-full.png"
                      alt="Than Than Jewellery"
                      width={600}
                      height={600}
                      className="w-100 h-100 object-contain drop-shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-3xl -z-10" />
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute top-10 right-10 w-4 h-4 bg-gold-500 rounded-full animate-bounce" />
                <div className="absolute bottom-20 left-10 w-3 h-3 bg-gold-400 rounded-full animate-bounce delay-150" />
                <div className="absolute top-1/2 right-0 w-2 h-2 bg-gold-300 rounded-full animate-ping" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold-500 to-transparent" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-24 bg-gray-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-100/50 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">
                Curated Selection
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {t('featuredProducts')}
              </h2>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-gray-900 font-medium hover:text-gold-600 transition-colors"
            >
              {tc('viewAll')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product: {
                _id: string;
                productId: string;
                name: { en: string; my: string };
                price: number;
                images: string[];
                status: 'available' | 'sold';
                featured: boolean;
                category?: { name: { en: string; my: string } };
              }) => (
                <ProductCard key={product._id} product={product} locale={locale as 'en' | 'my'} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{tc('noProducts')}</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">
                  Just Arrived
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  {t('newArrivals')}
                </h2>
              </div>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-gray-900 font-medium hover:text-gold-600 transition-colors"
              >
                {tc('viewAll')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.slice(0, 8).map((product: {
                _id: string;
                productId: string;
                name: { en: string; my: string };
                price: number;
                images: string[];
                status: 'available' | 'sold';
                featured: boolean;
                category?: { name: { en: string; my: string } };
              }) => (
                <ProductCard key={product._id} product={product} locale={locale as 'en' | 'my'} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">
                Explore
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                {t('browseCategories')}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category: {
                _id: string;
                name: { en: string; my: string };
                slug: string;
                image: string;
              }) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name[locale as 'en' | 'my']}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600" />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {category.name[locale as 'en' | 'my']}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-white/70 group-hover:text-gold-400 transition-colors">
                      Explore
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 border-2 border-gold-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      <section className="py-24 bg-gradient-to-br from-gold-50 via-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-white border border-gold-200 p-8 md:p-16 overflow-hidden shadow-xl shadow-gold-100/50">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-300/20 rounded-full blur-3xl" />

            <div className="relative max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center">
                <Image
                  src="/logo-icon.png"
                  alt="Than Than Jewellery"
                  width={200}
                  height={200}
                  className="w-40 h-40 object-contain drop-shadow-lg"
                />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('aboutTitle')}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {t('aboutDescription')}
              </p>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 text-gold-700 font-medium border border-gold-400 rounded-full hover:bg-gold-50 transition-all duration-300"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
