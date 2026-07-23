'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  Shield,
  TrendingUp,
  Eye,
  ShoppingBag,
  DollarSign,
  Calendar,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { analyticsApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface SalesData {
  period: number;
  total: { count: number; value: number };
  dailySales: Array<{ _id: string; count: number; value: number }>;
  salesByCategory: Array<{ _id: string; categoryName: string; count: number; value: number }>;
}

interface TrafficData {
  period: number;
  totals: { pageViews: number; uniqueVisitors: number };
  daily: Array<{ date: string; pageViews: number; uniqueVisitors: number }>;
}

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [salesResponse, trafficResponse] = await Promise.all([
          analyticsApi.getSales(period),
          analyticsApi.getTraffic(period),
        ]);

        if (salesResponse.data.success) {
          setSalesData(salesResponse.data.data);
        }
        if (trafficResponse.data.success) {
          setTrafficData(trafficResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, period]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' MMK';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Only allow admin access
  if (user?.role !== 'admin') {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">Only administrators can view analytics.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-500 mt-1">Sales and traffic insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Total Sales</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {salesData?.total.count || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 hidden sm:block">items sold</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-green-500 flex-shrink-0">
                    <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Revenue</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 truncate">
                      {formatPrice(salesData?.total.value || 0)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 hidden sm:block">total value</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-gold-500 flex-shrink-0">
                    <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Page Views</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {trafficData?.totals.pageViews || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 hidden sm:block">total views</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-blue-500 flex-shrink-0">
                    <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-500 font-medium">Visitors</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {trafficData?.totals.uniqueVisitors || 0}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 hidden sm:block">unique users</p>
                  </div>
                  <div className="p-2 sm:p-3 rounded-lg bg-purple-500 flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Sales by Category */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Sales by Category</h2>
                </div>
                <div className="p-4 sm:p-6">
                  {salesData?.salesByCategory.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No sales data</p>
                  ) : (
                    <div className="space-y-4">
                      {salesData?.salesByCategory.map((cat) => {
                        const maxValue = Math.max(
                          ...salesData.salesByCategory.map((c) => c.value)
                        );
                        const percentage = (cat.value / maxValue) * 100;
                        return (
                          <div key={cat._id}>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <span className="text-sm font-medium text-gray-700 truncate">
                                {cat.categoryName}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                                {cat.count} sold • {formatPrice(cat.value)}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Sales */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Daily Sales</h2>
                </div>
                <div className="p-4 sm:p-6">
                  {salesData?.dailySales.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No sales data</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {salesData?.dailySales.slice().reverse().map((day) => (
                        <div
                          key={day._id}
                          className="flex items-center justify-between py-2 border-b border-gray-50"
                        >
                          <span className="text-xs sm:text-sm text-gray-600">{formatDate(day._id)}</span>
                          <div className="text-right">
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {day.count} {day.count === 1 ? 'item' : 'items'}
                            </p>
                            <p className="text-xs text-gold-600">{formatPrice(day.value)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Traffic */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Daily Traffic</h2>
                </div>
                <div className="p-4 sm:p-6">
                  {trafficData?.daily.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No traffic data</p>
                  ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                      <div className="flex gap-1 min-w-max pb-2">
                        {trafficData?.daily.map((day) => {
                          const maxViews = Math.max(
                            ...trafficData.daily.map((d) => d.pageViews),
                            1
                          );
                          const height = (day.pageViews / maxViews) * 100;
                          return (
                            <div
                              key={day.date}
                              className="flex flex-col items-center gap-1 group"
                            >
                              <div className="relative h-24 sm:h-32 w-6 sm:w-8 bg-gray-100 rounded-t-lg overflow-hidden">
                                <div
                                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600"
                                  style={{ height: `${height}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[10px] sm:text-xs font-medium text-white drop-shadow">
                                    {day.pageViews}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] sm:text-xs text-gray-400 -rotate-45 origin-top-left translate-y-1">
                                {formatDate(day.date)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
