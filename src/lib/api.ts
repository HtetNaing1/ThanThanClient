import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/users', data),
  update: (id: string, data: { email?: string; password?: string; name?: string; role?: string }) =>
    api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data: { name: { en: string; my: string }; image?: string }) =>
    api.post('/categories', data),
  update: (id: string, data: { name?: { en: string; my: string }; image?: string }) =>
    api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Products API
export const productsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; status?: string; search?: string }) =>
    api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (data: {
    name: { en: string; my: string };
    description: { en: string; my: string };
    price: number;
    category: string;
    images: string[];
    material: string;
    weight: string;
    featured?: boolean;
  }) => api.post('/products', data),
  update: (id: string, data: Partial<{
    name: { en: string; my: string };
    description: { en: string; my: string };
    price: number;
    category: string;
    images: string[];
    material: string;
    weight: string;
    featured: boolean;
  }>) => api.put(`/products/${id}`, data),
  markAsSold: (id: string) => api.patch(`/products/${id}/sold`),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Upload API
export const uploadApi = {
  single: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  multiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (publicId: string) => api.delete('/upload', { data: { publicId } }),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSales: (period?: number) => api.get('/analytics/sales', { params: { period } }),
  getTraffic: (period?: number) => api.get('/analytics/traffic', { params: { period } }),
  trackPageView: (visitorId?: string) => api.post('/analytics/pageview', { visitorId }),
};

// Action Logs API
export const actionLogsApi = {
  getAll: (params?: {
    userId?: string;
    action?: string;
    targetType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => api.get('/action-logs', { params }),
};
