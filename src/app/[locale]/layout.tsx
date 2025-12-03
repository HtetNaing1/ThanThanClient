import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locale } from '@/i18n/config';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { ToastContainer } from '@/components/ui/Toast';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header locale={locale as Locale} />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer />
      </div>
    </NextIntlClientProvider>
  );
}
