import { getTranslations } from 'next-intl/server';
import { Award, Shield, Heart, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations('about');

  const features = [
    {
      icon: Award,
      titleKey: 'quality',
      descKey: 'qualityDesc',
      gradient: 'from-gold-500 to-gold-700',
    },
    {
      icon: Shield,
      titleKey: 'authenticity',
      descKey: 'authenticityDesc',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Heart,
      titleKey: 'craftsmanship',
      descKey: 'craftsmanshipDesc',
      gradient: 'from-rose-500 to-pink-500',
    },
  ];

  const stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '5000+', label: 'Happy Customers' },
    { value: '2000+', label: 'Products Sold' },
    { value: '100%', label: 'Authentic' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-amber-50 via-white to-gold-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-200/30 via-transparent to-transparent" />
        </div>

        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-gold-600" />
              <span className="text-sm font-medium text-gold-700">Our Story</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t('title')}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/5 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                {t('storyTitle')}
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>{t('storyPara1')}</p>
                <p>{t('storyPara2')}</p>
                <p>{t('storyPara3')}</p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gold-100 to-gold-50 rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Image
                      src="/logo-full.png"
                      alt="Than Than Jewellery"
                      width={1200}
                      height={1200}
                      className="w-150 h-150 object-contain drop-shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-3xl -z-10" />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-8 right-8 w-4 h-4 bg-gold-500 rounded-full animate-bounce" />
                <div className="absolute bottom-12 left-8 w-3 h-3 bg-gold-400 rounded-full animate-bounce delay-150" />
                <div className="absolute top-1/2 right-12 w-2 h-2 bg-gold-300 rounded-full animate-ping" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-gold-600">
              Our Promise
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              {t('whyChooseUs')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gold-50 via-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-white border border-gold-200 p-12 md:p-20 overflow-hidden shadow-xl shadow-gold-100/50">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-300/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('contactTitle')}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
                {t('contactDesc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://m.me/thanthanjewellery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0084FF] text-white font-semibold rounded-xl hover:bg-[#0073E6] transition-all shadow-lg shadow-blue-500/25"
                >
                  {t('messageUs')}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="tel:+959123456789"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg shadow-gold-500/25"
                >
                  {t('callUs')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Products CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 mb-4">Ready to find your perfect piece?</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gold-600 font-semibold hover:text-gold-700 transition-colors"
          >
            Browse Our Collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
