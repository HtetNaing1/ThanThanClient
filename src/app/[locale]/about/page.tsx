import { getTranslations } from 'next-intl/server';
import { Award, ShieldCheck, Gem, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/ui/SectionHeading';
import LuxButton from '@/components/ui/LuxButton';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const loc = locale as 'en' | 'my';
  const t = await getTranslations('about');

  const features = [
    { icon: Award, titleKey: 'quality', descKey: 'qualityDesc' },
    { icon: ShieldCheck, titleKey: 'authenticity', descKey: 'authenticityDesc' },
    { icon: Gem, titleKey: 'craftsmanship', descKey: 'craftsmanshipDesc' },
  ];

  const stats = [
    { value: '10+', label: loc === 'en' ? 'Years of craft' : 'အတွေ့အကြုံနှစ်' },
    { value: '5,000+', label: loc === 'en' ? 'Cherished clients' : 'ဖောက်သည်များ' },
    { value: '2,000+', label: loc === 'en' ? 'Pieces homed' : 'ရောင်းချပြီး' },
    { value: '100%', label: loc === 'en' ? 'Authentic' : 'အစစ်အမှန်' },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero — emerald */}
      <section className="relative bg-forest-800 text-champagne-soft">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_25%,rgba(196,154,61,0.16),transparent_55%)]" />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 text-center">
          <span className="eyebrow eyebrow-light block animate-rise" style={{ animationDelay: '80ms' }}>
            {t('subtitle')}
          </span>
          <h1
            className="font-display font-light text-[2.75rem] sm:text-6xl lg:text-7xl text-white leading-[1.05] mt-5 animate-rise"
            style={{ animationDelay: '180ms' }}
          >
            {t('title')}
          </h1>
          <div className="gem-divider mt-8 animate-rise" style={{ animationDelay: '300ms' }}>
            <span className="gem" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <Reveal className="bg-ivory-card border border-gold-500/25 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 shadow-[0_30px_60px_-40px_rgba(31,27,20,0.5)]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-light text-gold-700">{stat.value}</div>
                <div className="eyebrow text-[0.58rem] mt-2">{stat.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <span className="eyebrow">{loc === 'en' ? 'Our Journey' : 'ခရီးစဉ်'}</span>
              <h2 className="font-display font-light text-[2rem] sm:text-4xl md:text-5xl text-forest-900 mt-4 mb-7 sm:mb-8 leading-tight">
                {t('storyTitle')}
              </h2>
              <div className="space-y-6 text-ink-muted leading-relaxed">
                <p>{t('storyPara1')}</p>
                <p>{t('storyPara2')}</p>
                <p>{t('storyPara3')}</p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="aspect-square bg-forest-800 overflow-hidden relative flex items-center justify-center">
                <div className="ring-frame absolute inset-[10%]" />
                <div className="relative w-[55%] aspect-square">
                  <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-full" />
                  <Image
                    src="/logo-icon.png"
                    alt="Than Than Jewellery"
                    fill
                    className="object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="py-14 sm:py-20 bg-champagne-soft/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow={loc === 'en' ? 'Our Promise' : 'ကတိ'}
            title={t('whyChooseUs')}
            className="mb-10 sm:mb-12"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Reveal key={feature.titleKey} delay={i * 110}>
                <div className="lux-card p-8 sm:p-9 text-center h-full">
                  <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center border border-gold-500/40 rounded-full">
                    <feature.icon className="w-6 h-6 text-gold-600" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-2xl text-forest-900 mb-3">{t(feature.titleKey)}</h3>
                  <p className="text-ink-muted leading-relaxed text-sm">{t(feature.descKey)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact — emerald */}
      <section className="relative py-14 sm:py-20 bg-forest-800 text-champagne-soft overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,154,61,0.12),transparent_60%)]" />
        <Reveal className="relative max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-light text-[2rem] sm:text-4xl md:text-5xl text-white mb-5 leading-tight">
            {t('contactTitle')}
          </h2>
          <p className="text-champagne-soft/70 text-base sm:text-lg max-w-xl mx-auto mb-9 sm:mb-10">
            {t('contactDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <LuxButton href="https://m.me/thanthanjewellery" target="_blank" rel="noopener noreferrer" variant="gold" className="group">
              {t('messageUs')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </LuxButton>
            <LuxButton href="tel:+959123456789" variant="outlineLight">
              {t('callUs')}
            </LuxButton>
          </div>
        </Reveal>
      </section>

      {/* Browse CTA */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <p className="text-ink-muted mb-4">
            {loc === 'en' ? 'Ready to find your piece?' : 'သင့်ပစ္စည်း ရှာဖွေရန် အသင့်ဖြစ်ပြီလား?'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-gold-700 hover:text-gold-900 transition-colors group"
          >
            {loc === 'en' ? 'Browse the Collection' : 'စုစည်းမှုကို ကြည့်ရန်'}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
