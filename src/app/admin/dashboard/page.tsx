'use client';

import { useEffect, useState } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Eye,
  Users,
  FolderOpen,
  TrendingUp,
  Clock,
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
    soldBy?: { name: string };
  }>;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtext,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US').format(price) + ' MMK';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}! Here&apos;s what&apos;s happening with your store.
          </p>
        </div>

        {user?.role === 'admin' ? (
          isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : data ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Products"
                  value={data.overview.totalProducts}
                  icon={Package}
                  color="bg-blue-500"
                  subtext={`${data.overview.availableProducts} available`}
                />
                <StatCard
                  title="Products Sold"
                  value={data.overview.soldProducts}
                  icon={ShoppingBag}
                  color="bg-green-500"
                />
                <StatCard
                  title="Total Sales"
                  value={formatPrice(data.overview.totalSalesValue)}
                  icon={DollarSign}
                  color="bg-amber-500"
                />
                <StatCard
                  title="Today's Views"
                  value={data.today.pageViews}
                  icon={Eye}
                  color="bg-purple-500"
                  subtext={`${data.today.uniqueVisitors} unique visitors`}
                />
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  title="Categories"
                  value={data.overview.totalCategories}
                  icon={FolderOpen}
                  color="bg-indigo-500"
                />
                <StatCard
                  title="Team Members"
                  value={data.overview.totalUsers}
                  icon={Users}
                  color="bg-pink-500"
                />
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Viewed Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <h2 className="font-semibold text-gray-900">Most Viewed Products</h2>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {data.mostViewedProducts.length === 0 ? (
                      <p className="px-6 py-8 text-center text-gray-500">No products yet</p>
                    ) : (
                      data.mostViewedProducts.map((product) => (
                        <div key={product._id} className="px-6 py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{product.name.en}</p>
                            <p className="text-sm text-gray-500">{product.productId}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{product.viewCount} views</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                product.status === 'available'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {product.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Sales */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <h2 className="font-semibold text-gray-900">Recent Sales</h2>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {data.recentSales.length === 0 ? (
                      <p className="px-6 py-8 text-center text-gray-500">No sales yet</p>
                    ) : (
                      data.recentSales.map((sale) => (
                        <div key={sale._id} className="px-6 py-3 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{sale.name.en}</p>
                            <p className="text-sm text-gray-500">
                              {sale.productId} • {sale.soldBy?.name || 'Unknown'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-amber-600">{formatPrice(sale.price)}</p>
                            <p className="text-xs text-gray-500">{formatDate(sale.soldAt)}</p>
                          </div>
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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Moderator Dashboard</h2>
              <p className="text-gray-500 mb-6">
                As a moderator, you can manage products and categories.
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="/admin/products"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  Manage Products
                </a>
                <a
                  href="/admin/categories"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  Manage Categories
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
