'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Trash2, Plus, Minus, ShoppingBag, Package, MessageCircle, ArrowRight, Sparkles, Shield } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export default function CartPage({ params }: CartPageProps) {
  const [locale, setLocale] = useState<'en' | 'my'>('en');
  const t = useTranslations('cart');
  const tc = useTranslations('common');

  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('emptyCart')}</h1>
          <p className="text-gray-500 mb-8">Start shopping to add items to your cart</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white font-semibold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all shadow-lg shadow-gold-500/25"
          >
            {t('continueShopping')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-gold-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-200/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-gold-600" />
            <span className="text-sm font-medium text-gold-600 uppercase tracking-wider">Your Selection</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t('title')}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{items.length}</span> items in cart
              </p>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
              >
                {t('clearCart')}
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md"
              >
                <div className="flex gap-5">
                  {/* Image */}
                  <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name[locale]}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-200" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product._id}`}
                      className="font-semibold text-gray-900 hover:text-gold-600 transition-colors text-lg"
                    >
                      {item.product.name[locale]}
                    </Link>
                    <p className="text-sm text-gray-400 mt-0.5">{item.product.productId}</p>
                    <p className="text-gold-600 font-bold text-lg mt-2">
                      {formatPrice(item.product.price)} <span className="text-sm font-normal text-gray-400">{tc('currency')}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)} {tc('currency')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {t('orderSummary')}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('subtotal')}</span>
                  <span className="font-medium text-gray-900">{formatPrice(getTotal())} {tc('currency')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('shipping')}</span>
                  <span className="text-gold-600 font-medium">{t('calculated')}</span>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">{t('total')}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(getTotal())}</span>
                      <span className="text-gray-400 ml-1">{tc('currency')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messenger Checkout */}
              <button
                onClick={handleMessengerCheckout}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#0084FF] text-white font-semibold rounded-xl hover:bg-[#0073E6] transition-all shadow-lg shadow-blue-500/25 mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                {t('checkoutViaMessenger')}
              </button>

              <p className="text-xs text-gray-500 text-center mb-6">
                {t('messengerNote')}
              </p>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-500">Secure & Safe Checkout</span>
              </div>

              <div className="mt-6">
                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 text-gold-600 hover:text-gold-700 font-medium transition-colors"
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
