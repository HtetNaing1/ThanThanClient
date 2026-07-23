'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Trash2, Plus, Minus, Gem, MessageCircle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export default function CartPage({ params }: CartPageProps) {
  const [locale, setLocale] = useState<'en' | 'my'>('en');
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const router = useRouter();

  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  // Return to wherever the shopper came from, falling back to the collection.
  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/${locale}/products`);
    }
  };

  const backLabel = locale === 'en' ? 'Back' : 'နောက်သို့';

  useEffect(() => {
    params.then((p) => setLocale(p.locale as 'en' | 'my'));
  }, [params]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  const generateMessengerMessage = () => {
    if (items.length === 0) return '';

    let message = locale === 'en'
      ? '🛍️ Hello! I would like to order the following items:\n\n'
      : '🛍️ မင်္ဂလာပါ! အောက်ပါပစ္စည်းများကို မှာယူလိုပါတယ်:\n\n';

    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name[locale]}\n`;
      message += `   ${locale === 'en' ? 'ID' : 'အိုင်ဒီ'}: ${item.product.productId}\n`;
      message += `   ${locale === 'en' ? 'Qty' : 'အရေအတွက်'}: ${item.quantity}\n`;
      message += `   ${locale === 'en' ? 'Price' : 'ဈေးနှုန်း'}: ${formatPrice(item.product.price)} ${tc('currency')}\n`;
      message += `   ${locale === 'en' ? 'Subtotal' : 'စုစုပေါင်း'}: ${formatPrice(item.product.price * item.quantity)} ${tc('currency')}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `${locale === 'en' ? 'Total' : 'စုစုပေါင်းတန်ဖိုး'}: ${formatPrice(getTotal())} ${tc('currency')}\n\n`;
    message += locale === 'en'
      ? '📦 Please let me know the shipping details and payment options. Thank you!'
      : '📦 ပို့ဆောင်ရေးအချက်အလက်နှင့် ငွေပေးချေမှုနည်းလမ်းများကို ပြောပြပေးပါ။ ကျေးဇူးတင်ပါတယ်!';

    return encodeURIComponent(message);
  };

  const handleMessengerCheckout = () => {
    const message = generateMessengerMessage();
    // Replace with your actual Facebook page ID or username
    const facebookPageId = 'thanthanjewellery';
    const messengerUrl = `https://m.me/${facebookPageId}?text=${message}`;
    window.open(messengerUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="text-center">
          <Gem className="w-14 h-14 text-gold-300 mx-auto mb-6" strokeWidth={1} />
          <h1 className="font-display text-3xl text-forest-900 mb-2">{t('emptyCart')}</h1>
          <p className="text-ink-muted mb-8">
            {locale === 'en' ? 'Discover a piece worth keeping.' : 'ကြိုက်နှစ်သက်ဖွယ် ပစ္စည်းများ ရှာဖွေပါ။'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/products" className="btn-gold">
              {t('continueShopping')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={goBack} className="btn-outline group">
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {backLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header — emerald band */}
      <div className="relative overflow-hidden bg-forest-800 text-champagne-soft">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(196,154,61,0.14),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <span className="eyebrow eyebrow-light">{locale === 'en' ? 'Your Selection' : 'သင်ရွေးချယ်ထားသော'}</span>
          <h1 className="font-display font-light text-4xl md:text-5xl text-white mt-3">{t('title')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={goBack}
          className="group inline-flex items-center gap-2 mb-6 text-sm uppercase tracking-[0.12em] text-ink-muted hover:text-gold-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          {backLabel}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-ink-muted text-sm">
                <span className="font-medium text-forest-900">{items.length}</span> {locale === 'en' ? 'pieces reserved' : 'ခု'}
              </p>
              <button
                onClick={clearCart}
                className="text-xs uppercase tracking-[0.12em] text-ink-muted hover:text-red-600 transition-colors"
              >
                {t('clearCart')}
              </button>
            </div>

            {items.map((item) => (
              <div key={item.product._id} className="lux-card p-4 sm:p-5">
                <div className="flex gap-4 sm:gap-5">
                  {/* Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden bg-[#f4efe4] border border-gold-500/15">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name[locale]}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gem className="w-8 h-8 text-gold-300" strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product._id}`}
                      className="font-display text-xl text-forest-900 hover:text-gold-700 transition-colors"
                    >
                      {item.product.name[locale]}
                    </Link>
                    <p className="tag-id text-gold-600/80 mt-1">{item.product.productId}</p>
                    <p className="text-forest-900 font-medium text-lg mt-2">
                      {formatPrice(item.product.price)} <span className="tag-id text-ink-muted">{tc('currency')}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-1.5 sm:p-2 text-ink-muted hover:text-red-600 transition-all"
                      aria-label={tc('removeFromCart')}
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </button>

                    <div className="flex items-center border border-gold-500/25">
                      <button
                        onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                        className="p-2 text-forest-800 hover:bg-gold-100/50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 sm:w-9 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-2 text-forest-800 hover:bg-gold-100/50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold-500/15">
                  <span className="eyebrow text-[0.6rem]">{t('subtotal')}</span>
                  <span className="font-medium text-forest-900">
                    {formatPrice(item.product.price * item.quantity)} {tc('currency')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-ivory-card border border-gold-500/20 p-6 sticky top-24">
              <h2 className="font-display text-2xl text-forest-900 mb-1">
                {t('orderSummary')}
              </h2>
              <div className="rule-gold mb-6" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-ink-muted text-sm">
                  <span>{t('subtotal')}</span>
                  <span className="font-medium text-forest-900">{formatPrice(getTotal())} {tc('currency')}</span>
                </div>
                <div className="flex justify-between text-ink-muted text-sm">
                  <span>{t('shipping')}</span>
                  <span className="text-gold-700 font-medium">{t('calculated')}</span>
                </div>
                <div className="border-t border-gold-500/15 pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="eyebrow">{t('total')}</span>
                    <div className="text-right">
                      <span className="font-display text-3xl text-forest-900">{formatPrice(getTotal())}</span>
                      <span className="tag-id text-ink-muted ml-1.5">{tc('currency')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messenger Checkout */}
              <button
                onClick={handleMessengerCheckout}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0084FF] text-white font-semibold hover:bg-[#0073E6] transition-all mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                {t('checkoutViaMessenger')}
              </button>

              <p className="text-xs text-ink-muted text-center mb-6 leading-relaxed">
                {t('messengerNote')}
              </p>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-gold-500/15">
                <ShieldCheck className="w-4 h-4 text-forest-500" strokeWidth={1.5} />
                <span className="text-xs text-ink-muted">
                  {locale === 'en' ? 'Private & secure ordering' : 'လုံခြုံစိတ်ချရသော မှာယူမှု'}
                </span>
              </div>

              <div className="mt-6">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 text-sm uppercase tracking-[0.12em] text-gold-700 hover:text-gold-900 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  {t('continueShopping')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
