'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Eye,
  Users,
  FolderOpen,
  TrendingUp,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { analyticsApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface DashboardData {
  overview: {
    totalProducts: number;
    availableProducts: number;
    soldProducts: number;
    totalCategories: number;
    totalUsers: number;
    totalSalesValue: number;
  };
  today: {
    pageViews: number;
    uniqueVisitors: number;
  };
  mostViewedProducts: Array<{
    _id: string;
    productId: string;
    name: { en: string; my: string };
    viewCount: number;
    price: number;
    status: string;
  }>;
  recentSales: Array<{
    _id: string;
    productId: string;
    name: { en: string; my: string };
    price: number;
    soldAt: string;
  }>;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US').format(price) + ' MMK';
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsApi.getDashboard();
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>

        {user?.role === 'admin' ? (
          isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
            </div>
          ) : data ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{data.overview.totalProducts}</p>
                      <p className="text-xs text-gray-500">Total Products</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingBag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{data.overview.availableProducts}</p>
                      <p className="text-xs text-gray-500">Available</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{data.overview.soldProducts}</p>
                      <p className="text-xs text-gray-500">Sold</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FolderOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{data.overview.totalCategories}</p>
                      <p className="text-xs text-gray-500">Categories</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <Users className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{data.overview.totalUsers}</p>
                      <p className="text-xs text-gray-500">Users</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatPrice(data.overview.totalSalesValue)}</p>
                      <p className="text-xs text-gray-500">Total Sales</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Traffic</h2>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Eye className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{data.today.pageViews}</p>
                      <p className="text-sm text-gray-500">{data.today.uniqueVisitors} unique visitors</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/admin/products"
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors text-center"
                    >
                      <Package className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                      <span className="text-sm text-gray-700">Products</span>
                    </Link>
                    <Link
                      href="/admin/categories"
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors text-center"
                    >
                      <FolderOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                      <span className="text-sm text-gray-700">Categories</span>
                    </Link>
                    <Link
                      href="/admin/users"
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors text-center"
                    >
                      <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                      <span className="text-sm text-gray-700">Users</span>
                    </Link>
                    <Link
                      href="/admin/analytics"
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gold-50 transition-colors text-center"
                    >
                      <TrendingUp className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                      <span className="text-sm text-gray-700">Analytics</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Viewed */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Most Viewed Products</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {data.mostViewedProducts.length === 0 ? (
                      <p className="px-6 py-8 text-center text-gray-500">No products yet</p>
                    ) : (
                      data.mostViewedProducts.slice(0, 5).map((product) => (
                        <div key={product._id} className="px-6 py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{product.name.en}</p>
                            <p className="text-sm text-gray-500">{product.productId}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{product.viewCount}</p>
                            <p className="text-xs text-gray-500">views</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Recent Sales</h2>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {data.recentSales.length === 0 ? (
                      <p className="px-6 py-8 text-center text-gray-500">No sales yet</p>
                    ) : (
                      data.recentSales.slice(0, 5).map((sale) => (
                        <div key={sale._id} className="px-6 py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{sale.name.en}</p>
                            <p className="text-sm text-gray-500">{sale.productId}</p>
                          </div>
                          <p className="font-semibold text-green-600">{formatPrice(sale.price)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Failed to load dashboard data</p>
            </div>
          )
        ) : (
          /* Moderator Dashboard */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/admin/products"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-gold-300 transition-colors"
            >
              <Package className="w-10 h-10 text-gold-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Manage Products</h3>
              <p className="text-sm text-gray-500 mt-1">Add, edit, and manage products</p>
            </Link>

            <Link
              href="/admin/categories"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-gold-300 transition-colors"
            >
              <FolderOpen className="w-10 h-10 text-gold-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Manage Categories</h3>
              <p className="text-sm text-gray-500 mt-1">Organize products into categories</p>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
