import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Gem, ShieldCheck, Sparkle } from 'lucide-react';
import ProductCard from '@/components/public/ProductCard';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import LuxButton from '@/components/ui/LuxButton';

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

interface ProductShape {
  _id: string;
  productId: string;
  name: { en: string; my: string };
  price: number;
  images: string[];
  status: 'available' | 'sold';
  featured: boolean;
  category?: { name: { en: string; my: string } };
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const loc = locale as 'en' | 'my';
  const t = await getTranslations('home');
  const tc = await getTranslations('common');

  const [featuredProducts, newArrivals, categories] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
  ]);

  const promises = [
    { icon: Gem, label: loc === 'en' ? 'Ethically sourced gems' : 'ကျင့်ဝတ်နှင့်အညီ ရွေးချယ်ထားသော ကျောက်မျက်' },
    { icon: ShieldCheck, label: loc === 'en' ? 'Certified authentic' : 'အစစ်အမှန် အာမခံ' },
    { icon: Sparkle, label: loc === 'en' ? 'Handcrafted in Myanmar' : 'မြန်မာ့လက်ရာ' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ============ HERO — the velvet box ============ */}
      <section className="relative bg-forest-800 text-champagne-soft">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(196,154,61,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/40 via-transparent to-forest-900/60" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
            {/* Copy — staggered entrance */}
            <div>
              {/* Title lockup — emblem sits beside the title on mobile, hidden on desktop where the ring takes over */}
              <div className="flex items-center gap-4 sm:gap-5">
                <Image
                  src="/logo-icon.png"
                  alt="Than Than Jewellery"
                  width={96}
                  height={96}
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain shrink-0 lg:hidden animate-rise"
                  style={{ animationDelay: '80ms' }}
                  priority
                />
                <div className="min-w-0">
                  <span className="eyebrow-light eyebrow block animate-rise" style={{ animationDelay: '80ms' }}>
                    {loc === 'en' ? 'Since a generation of goldsmiths' : 'ရွှေပန်းထိမ်လက်ရာ'}
                  </span>
                  <h1
                    className="font-display font-light text-[2rem] sm:text-5xl lg:text-7xl leading-[1.1] sm:leading-[1.04] mt-2 sm:mt-4 text-white animate-rise"
                    style={{ animationDelay: '180ms' }}
                  >
                    {t('heroTitle')}
                  </h1>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-7 sm:mt-8 animate-rise" style={{ animationDelay: '300ms' }}>
                <LuxButton href="/products" variant="gold" className="group">
                  {t('shopNow')}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </LuxButton>
                <LuxButton href="/about" variant="outlineLight">
                  {tc('about')}
                </LuxButton>
              </div>

              <ul
                className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-wrap gap-x-5 gap-y-3 sm:gap-x-7 mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-gold-500/20 animate-rise"
                style={{ animationDelay: '420ms' }}
              >
                {promises.map((p) => (
                  <li key={p.label} className="flex items-center gap-2.5 text-[0.8rem] sm:text-sm text-champagne-soft/70">
                    <p.icon className="w-4 h-4 text-gold-400 shrink-0" strokeWidth={1.5} />
                    {p.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Ringed monogram — desktop only, echoes the logo mark */}
            <div className="hidden lg:block relative mx-auto w-full max-w-md aspect-square ring-in" style={{ animationDelay: '260ms' }}>
              <div className="ring-frame absolute inset-0" />
              <div
                className="absolute inset-0 rounded-full border border-gold-500/15"
                style={{ animation: 'tt-spin 40s linear infinite' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[62%] aspect-square">
                  <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-full" />
                  <Image
                    src="/logo-icon.png"
                    alt="Than Than Jewellery monogram"
                    fill
                    className="object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={loc === 'en' ? 'Curated Selection' : 'ရွေးချယ်ထားသော'}
            title={t('featuredProducts')}
            className="mb-10 sm:mb-12"
          />

          {featuredProducts.length > 0 ? (
            <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredProducts.slice(0, 8).map((product: ProductShape) => (
                <ProductCard key={product._id} product={product} locale={loc} />
              ))}
            </Reveal>
          ) : (
            <div className="lux-card text-center py-20">
              <Gem className="w-12 h-12 text-gold-300 mx-auto mb-4" strokeWidth={1} />
              <p className="text-ink-muted">{tc('noProducts')}</p>
            </div>
          )}

          <div className="text-center mt-12 sm:mt-14">
            <LuxButton href="/products" variant="outline" className="group">
              {tc('viewAll')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </LuxButton>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES — emerald band ============ */}
      {categories.length > 0 && (
        <section className="py-14 sm:py-20 bg-forest-800 text-champagne-soft">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={loc === 'en' ? 'Explore the House' : 'စူးစမ်းရန်'}
              title={t('browseCategories')}
              light
              className="mb-10 sm:mb-12"
            />

            <Reveal className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category: { _id: string; name: { en: string; my: string }; slug: string; image: string }) => (
                <Link
                  key={category._id}
                  href={`/products?category=${category._id}`}
                  className="group relative aspect-[4/5] overflow-hidden"
                >
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name[loc]}
                      fill
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-forest-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/25 to-transparent" />
                  <div className="absolute inset-3 border border-gold-400/0 group-hover:border-gold-400/50 transition-colors duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <h3 className="font-display text-lg sm:text-xl text-white">{category.name[loc]}</h3>
                    <span className="inline-flex items-center gap-1 mt-1 tag-id text-gold-300">
                      {loc === 'en' ? 'View' : 'ကြည့်ရန်'}
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ NEW ARRIVALS ============ */}
      {newArrivals.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 sm:mb-12">
              <SectionHeading
                eyebrow={loc === 'en' ? 'Just Arrived' : 'အသစ်ရောက်ရှိ'}
                title={t('newArrivals')}
                align="left"
              />
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-forest-800 hover:text-gold-700 transition-colors group shrink-0 pb-1"
              >
                {tc('viewAll')}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {newArrivals.slice(0, 8).map((product: ProductShape) => (
                <ProductCard key={product._id} product={product} locale={loc} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ HOUSE STORY ============ */}
      <section className="py-14 sm:py-20 bg-champagne-soft/40">
        <Reveal className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <Image
            src="/logo-icon.png"
            alt="Than Than Jewellery"
            width={140}
            height={140}
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto mb-7 sm:mb-8"
          />
          <span className="eyebrow">{loc === 'en' ? 'The Maison' : 'ကျွန်ုပ်တို့အကြောင်း'}</span>
          <h2 className="font-display text-[2rem] sm:text-4xl md:text-5xl font-light text-forest-900 mt-4 leading-tight">
            {t('aboutTitle')}
          </h2>
          <p className="mt-6 sm:mt-7 text-base sm:text-lg text-ink-muted leading-relaxed">
            {t('aboutDescription')}
          </p>
          <div className="mt-9 sm:mt-10">
            <LuxButton href="/about" variant="outline" className="group">
              {loc === 'en' ? 'Our Story' : 'ကျွန်ုပ်တို့၏ ဇာတ်လမ်း'}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </LuxButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
