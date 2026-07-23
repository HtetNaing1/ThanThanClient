'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Gem } from 'lucide-react';
import ProductCard from '@/components/public/ProductCard';
import SearchField from '@/components/ui/SearchField';
import Dropdown from '@/components/ui/Dropdown';
import RadioGroup from '@/components/ui/RadioGroup';
import Checkbox from '@/components/ui/Checkbox';
import { productsApi, categoriesApi } from '@/lib/api';

interface Product {
  _id: string;
  productId: string;
  name: { en: string; my: string };
  price: number;
  images: string[];
  status: 'available' | 'sold';
  featured: boolean;
  category?: { _id: string; name: { en: string; my: string }; slug: string };
}

interface Category {
  _id: string;
  name: { en: string; my: string };
  slug: string;
}

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export default function ProductsPage({ params }: ProductsPageProps) {
  const [locale, setLocale] = useState<'en' | 'my'>('en');
  const t = useTranslations('products');
  const tc = useTranslations('common');
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [inStock, setInStock] = useState(true);
  const [sold, setSold] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    params.then((p) => setLocale(p.locale as 'en' | 'my'));
  }, [params]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      // Availability checkboxes map to the API's status param.
      const status = inStock === sold ? 'all' : inStock ? 'available' : 'sold';
      const response = await productsApi.getAll({
        page: pagination.page,
        limit: 12,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        status,
      });
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, searchTerm, categoryFilter, inStock, sold]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price') {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    }
    return 0; // Default sorting is handled by API
  });

  const selectedCategory = categories.find(cat => cat._id === categoryFilter);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Header — emerald band */}
      <div className="relative overflow-hidden bg-forest-800 text-champagne-soft">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_20%,rgba(196,154,61,0.14),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="eyebrow eyebrow-light">{locale === 'en' ? 'The Collection' : 'စုစည်းမှု'}</span>
          <h1 className="font-display font-light text-4xl md:text-5xl text-white mt-4">{t('title')}</h1>
          <p className="text-champagne-soft/70 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
          <div className="gem-divider mt-7"><span className="gem" /></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-ivory-card border border-gold-500/20 p-4 sm:p-5 mb-10">
          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchField
              value={searchTerm}
              onChange={(v) => {
                setSearchTerm(v);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              placeholder={tc('searchPlaceholder')}
              className="flex-1"
            />
            <Dropdown
              value={`${sortBy}-${sortOrder}`}
              onChange={(v) => {
                const [sort, order] = v.split('-');
                setSortBy(sort);
                setSortOrder(order);
              }}
              ariaLabel={t('sortBy')}
              className="sm:w-56"
              options={[
                { value: 'createdAt-desc', label: t('sortNewest') },
                { value: 'price-asc', label: t('sortPriceLow') },
                { value: 'price-desc', label: t('sortPriceHigh') },
              ]}
            />
            {/* Refine toggle (mobile) */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 bg-ivory border border-gold-500/20 text-forest-800 uppercase text-xs tracking-[0.14em] hover:border-gold-500/50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {locale === 'en' ? 'Refine' : 'စစ်ထုတ်ရန်'}
            </button>
          </div>

          {/* Category + availability */}
          <div className={`${showFilters ? 'grid' : 'hidden'} sm:grid grid-cols-1 md:grid-cols-[1fr_auto] gap-x-10 gap-y-6 mt-5 pt-5 border-t border-gold-500/15`}>
            <div>
              <span className="eyebrow text-[0.6rem]">{t('filterByCategory')}</span>
              <RadioGroup
                name="category"
                value={categoryFilter}
                onChange={(v) => {
                  setCategoryFilter(v);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                options={[
                  { value: '', label: t('allCategories') },
                  ...categories.map((cat) => ({ value: cat._id, label: cat.name[locale] })),
                ]}
                className="mt-3 flex flex-wrap gap-x-6 gap-y-3"
              />
            </div>

            <div className="md:text-right">
              <span className="eyebrow text-[0.6rem]">{locale === 'en' ? 'Availability' : 'ရရှိနိုင်မှု'}</span>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
                <Checkbox
                  id="in-stock"
                  checked={inStock}
                  onChange={(c) => {
                    setInStock(c);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  label={locale === 'en' ? 'In stock' : 'လက်ကျန်ရှိ'}
                />
                <Checkbox
                  id="sold"
                  checked={sold}
                  onChange={(c) => {
                    setSold(c);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  label={tc('sold')}
                />
              </div>
            </div>
          </div>

          {/* Result count */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gold-500/15">
            <p className="text-sm text-ink-muted">
              <span className="font-medium text-forest-900">{pagination.total}</span> {locale === 'en' ? 'pieces' : 'ခု'}
            </p>
            {selectedCategory && (
              <span className="tag-id text-gold-700">{selectedCategory.name[locale]}</span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border border-gold-300 border-t-gold-600 rounded-full animate-spin" />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="lux-card p-16 text-center">
            <Gem className="w-12 h-12 text-gold-300 mx-auto mb-5" strokeWidth={1} />
            <h3 className="font-display text-2xl text-forest-900 mb-2">
              {locale === 'en' ? 'Nothing here yet' : 'ပစ္စည်းမတွေ့ပါ'}
            </h3>
            <p className="text-ink-muted">{tc('noProducts')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} locale={locale} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="flex items-center gap-2 px-5 py-3 bg-ivory-card border border-gold-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gold-500/60 transition-all text-sm uppercase tracking-[0.12em] text-forest-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {locale === 'en' ? 'Prev' : 'ရှေ့'}
                </button>

                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (pagination.totalPages <= 5) return true;
                      if (page === 1 || page === pagination.totalPages) return true;
                      if (Math.abs(page - pagination.page) <= 1) return true;
                      return false;
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setPagination((prev) => ({ ...prev, page }))}
                          className={`w-10 h-10 font-medium transition-all ${
                            pagination.page === page
                              ? 'bg-forest-800 text-champagne'
                              : 'text-ink-muted hover:text-forest-800 hover:bg-gold-100/50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="flex items-center gap-2 px-5 py-3 bg-ivory-card border border-gold-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:border-gold-500/60 transition-all text-sm uppercase tracking-[0.12em] text-forest-800"
                >
                  {locale === 'en' ? 'Next' : 'နောက်'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
