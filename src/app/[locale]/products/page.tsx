'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, SlidersHorizontal, Package, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import ProductCard from '@/components/public/ProductCard';
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
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    params.then((p) => setLocale(p.locale as 'en' | 'my'));
  }, [params]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productsApi.getAll({
        page: pagination.page,
        limit: 12,
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        status: 'available',
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
  }, [pagination.page, searchTerm, categoryFilter]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-50 via-white to-gold-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-200/30 via-transparent to-transparent" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-gold-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold-600" />
            <span className="text-sm font-medium text-gold-600 uppercase tracking-wider">Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{t('title')}</h1>
          <p className="text-gray-600 text-lg max-w-xl">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={tc('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className={`flex flex-col lg:flex-row gap-3 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="appearance-none px-4 py-3 pr-10 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-gray-700 font-medium cursor-pointer min-w-[160px]"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name[locale]}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="appearance-none px-4 py-3 pr-10 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 text-gray-700 font-medium cursor-pointer min-w-[180px]"
              >
                <option value="createdAt-desc">{t('sortNewest')}</option>
                <option value="price-asc">{t('sortPriceLow')}</option>
                <option value="price-desc">{t('sortPriceHigh')}</option>
              </select>
            </div>
          </div>

          {/* Active Filters & Results */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gold-50 text-gold-700 rounded-lg text-sm font-medium">
                  {selectedCategory.name[locale]}
                  <button
                    onClick={() => setCategoryFilter('')}
                    className="hover:bg-gold-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  &quot;{searchTerm}&quot;
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{pagination.total}</span> {t('showingResults', { count: pagination.total }).replace(String(pagination.total), '').replace('Showing', '').trim()}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gold-200 rounded-full animate-spin border-t-gold-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gold-600" />
              </div>
            </div>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">{tc('noProducts')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
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
                          className={`w-10 h-10 rounded-xl font-medium transition-all ${
                            pagination.page === page
                              ? 'bg-gold-600 text-white shadow-lg shadow-gold-500/25'
                              : 'text-gray-600 hover:bg-gray-100'
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
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700"
                >
                  Next
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
