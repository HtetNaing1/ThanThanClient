'use client';

import { useEffect, useState, useCallback } from 'react';
import { History, Shield, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { actionLogsApi, usersApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface ActionLog {
  _id: string;
  user: { _id: string; name: string; email: string; role: string };
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  details: Record<string, unknown>;
  ipAddress: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const actionLabels: Record<string, { label: string; color: string }> = {
  CREATE_PRODUCT: { label: 'Created Product', color: 'bg-green-100 text-green-700' },
  UPDATE_PRODUCT: { label: 'Updated Product', color: 'bg-blue-100 text-blue-700' },
  DELETE_PRODUCT: { label: 'Deleted Product', color: 'bg-red-100 text-red-700' },
  MARK_SOLD: { label: 'Marked Sold', color: 'bg-purple-100 text-purple-700' },
  CREATE_CATEGORY: { label: 'Created Category', color: 'bg-green-100 text-green-700' },
  UPDATE_CATEGORY: { label: 'Updated Category', color: 'bg-blue-100 text-blue-700' },
  DELETE_CATEGORY: { label: 'Deleted Category', color: 'bg-red-100 text-red-700' },
  CREATE_USER: { label: 'Created User', color: 'bg-green-100 text-green-700' },
  UPDATE_USER: { label: 'Updated User', color: 'bg-blue-100 text-blue-700' },
  DELETE_USER: { label: 'Deleted User', color: 'bg-red-100 text-red-700' },
  LOGIN: { label: 'Logged In', color: 'bg-gray-100 text-gray-700' },
  LOGOUT: { label: 'Logged Out', color: 'bg-gray-100 text-gray-700' },
};

export default function ActionLogsPage() {
  const { user: currentUser } = useAuthStore();
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filters.userId) params.userId = filters.userId;
      if (filters.action) params.action = filters.action;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await actionLogsApi.getAll(params);
      if (response.data.success) {
        setLogs(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch action logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll();
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchLogs();
    }
  }, [currentUser, fetchLogs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Only allow admin access
  if (currentUser?.role !== 'admin') {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500">Only administrators can view action history.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Action History</h1>
          <p className="text-gray-500 mt-1">Track all admin and moderator activities</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">All Actions</option>
              {Object.keys(actionLabels).map((action) => (
                <option key={action} value={action}>
                  {actionLabels[action].label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="End Date"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No action logs found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {log.user?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{log.user?.name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500 capitalize">{log.user?.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              actionLabels[log.action]?.color || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {actionLabels[log.action]?.label || log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{log.targetName}</p>
                          <p className="text-xs text-gray-500 capitalize">{log.targetType}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                          {log.ipAddress || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(log.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
