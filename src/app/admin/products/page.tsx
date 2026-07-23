'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Upload,
  X,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { productsApi, categoriesApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface Product {
  _id: string;
  productId: string;
  name: { en: string; my: string };
  description: { en: string; my: string };
  price: number;
  category: { _id: string; name: { en: string; my: string }; slug: string };
  images: string[];
  material: string;
  weight: string;
  status: 'available' | 'sold';
  featured: boolean;
  viewCount: number;
  createdAt: string;
}

interface Category {
  _id: string;
  name: { en: string; my: string };
  slug: string;
}

const productSchema = z.object({
  nameEn: z.string().min(2, 'English name is required'),
  nameMy: z.string().min(2, 'Burmese name is required'),
  descriptionEn: z.string().min(10, 'English description is required'),
  descriptionMy: z.string().min(10, 'Burmese description is required'),
  price: z.string().min(1, 'Price is required'),
  category: z.string().min(1, 'Category is required'),
  material: z.string().min(1, 'Material is required'),
  weight: z.string().min(1, 'Weight is required'),
  featured: z.boolean().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSoldModalOpen, setIsSoldModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [sellingProduct, setSellingProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const fetchProducts = useCallback(async () => {
    try {
      const params: Record<string, string | number> = {
        page: pagination.page,
        limit: 12,
      };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter) params.category = categoryFilter;

      const response = await productsApi.getAll(params);
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
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, searchTerm, statusFilter, categoryFilter]);

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

  const openAddModal = () => {
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
    reset({
      nameEn: '',
      nameMy: '',
      descriptionEn: '',
      descriptionMy: '',
      price: '',
      category: '',
      material: '',
      weight: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setImageFiles([]);
    setImagePreviews(product.images || []);
    reset({
      nameEn: product.name.en,
      nameMy: product.name.my,
      descriptionEn: product.description.en,
      descriptionMy: product.description.my,
      price: product.price.toString(),
      category: product.category._id,
      material: product.material,
      weight: product.weight,
      featured: product.featured,
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagePreviews.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    // Check if it's a new file or existing image
    const existingImagesCount = editingProduct?.images.length || 0;
    if (index < existingImagesCount && editingProduct) {
      // It's an existing image
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // It's a new file
      const fileIndex = index - existingImagesCount;
      setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: ProductForm) => {
    try {
      let imageUrls = editingProduct?.images.filter((img) =>
        imagePreviews.includes(img)
      ) || [];

      // Upload new images
      if (imageFiles.length > 0) {
        setIsUploading(true);
        const uploadResponse = await uploadApi.multiple(imageFiles);
        if (uploadResponse.data.success) {
          const newUrls = uploadResponse.data.data.map((img: { url: string }) => img.url);
          imageUrls = [...imageUrls, ...newUrls];
        }
        setIsUploading(false);
      }

      const productData = {
        name: { en: data.nameEn, my: data.nameMy },
        description: { en: data.descriptionEn, my: data.descriptionMy },
        price: parseFloat(data.price),
        category: data.category,
        images: imageUrls,
        material: data.material,
        weight: data.weight,
        featured: data.featured || false,
      };

      if (editingProduct) {
        const response = await productsApi.update(editingProduct._id, productData);
        if (response.data.success) {
          toast.success('Product updated successfully');
          fetchProducts();
          setIsModalOpen(false);
        }
      } else {
        const response = await productsApi.create(productData);
        if (response.data.success) {
          toast.success('Product created successfully');
          fetchProducts();
          setIsModalOpen(false);
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Operation failed');
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      const response = await productsApi.delete(deletingProduct._id);
      if (response.data.success) {
        toast.success('Product deleted successfully');
        fetchProducts();
        setIsDeleteModalOpen(false);
        setDeletingProduct(null);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleMarkSold = async () => {
    if (!sellingProduct) return;

    try {
      const response = await productsApi.markAsSold(sellingProduct._id);
      if (response.data.success) {
        toast.success('Product marked as sold');
        fetchProducts();
        setIsSoldModalOpen(false);
        setSellingProduct(null);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to mark as sold');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' MMK';
  };

  const canDelete = user?.role === 'admin';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-500 mt-1">Manage your jewellery products</p>
          </div>
          <Button onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name.en}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
            <Button className="mt-4" onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Product
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name.en}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    {product.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gold-100 text-gold-700">
                          Featured
                        </span>
                      </div>
                    )}
                    {/* Actions Overlay - Desktop only */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors hidden sm:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gold-50 hover:text-gold-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {product.status === 'available' && (
                        <button
                          onClick={() => {
                            setSellingProduct(product);
                            setIsSoldModalOpen(true);
                          }}
                          className="p-2 bg-white rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            setDeletingProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 bg-white rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-xs text-gray-400 mb-1">{product.productId}</p>
                    <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{product.name.en}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{product.name.my}</p>
                    <p className="text-gold-600 font-semibold mt-2 text-sm sm:text-base">{formatPrice(product.price)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400 truncate">{product.category?.name?.en}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{product.viewCount} views</span>
                    </div>
                    {/* Mobile Action Buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 sm:hidden">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold-50 text-gold-600 rounded-lg text-xs font-medium"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      {product.status === 'available' && (
                        <button
                          onClick={() => {
                            setSellingProduct(product);
                            setIsSoldModalOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-medium"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Sold
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            setDeletingProduct(product);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500 order-first sm:order-none">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className="w-full sm:w-auto"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="nameEn"
              label="English Name"
              placeholder="Enter English name"
              error={errors.nameEn?.message}
              {...register('nameEn')}
            />
            <Input
              id="nameMy"
              label="Burmese Name (မြန်မာ)"
              placeholder="မြန်မာအမည်ထည့်ပါ"
              error={errors.nameMy?.message}
              {...register('nameMy')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              English Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
              rows={3}
              placeholder="Enter English description"
              {...register('descriptionEn')}
            />
            {errors.descriptionEn && (
              <p className="text-sm text-red-600 mt-1">{errors.descriptionEn.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Burmese Description (မြန်မာ)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
              rows={3}
              placeholder="မြန်မာဖော်ပြချက်ထည့်ပါ"
              {...register('descriptionMy')}
            />
            {errors.descriptionMy && (
              <p className="text-sm text-red-600 mt-1">{errors.descriptionMy.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="price"
              type="number"
              label="Price (MMK)"
              placeholder="Enter price"
              error={errors.price?.message}
              {...register('price')}
            />
            <Select
              id="category"
              label="Category"
              options={[
                { value: '', label: 'Select category' },
                ...categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name.en,
                })),
              ]}
              error={errors.category?.message}
              {...register('category')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="material"
              label="Material"
              placeholder="e.g., 24K Gold"
              error={errors.material?.message}
              {...register('material')}
            />
            <Input
              id="weight"
              label="Weight"
              placeholder="e.g., 5.2g"
              error={errors.weight?.message}
              {...register('weight')}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500"
              {...register('featured')}
            />
            <label htmlFor="featured" className="text-sm text-gray-700">
              Featured product (show on homepage)
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images (max 5)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-0.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {imagePreviews.length < 5 && (
                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold-500 transition-colors">
                  <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting || isUploading}>
              {isUploading ? 'Uploading...' : editingProduct ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deletingProduct?.name.en}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Mark as Sold Modal */}
      <Modal
        isOpen={isSoldModalOpen}
        onClose={() => setIsSoldModalOpen(false)}
        title="Mark as Sold"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Mark <strong>{sellingProduct?.name.en}</strong> ({sellingProduct?.productId}) as sold?
          </p>
          <p className="text-sm text-gold-600">
            Price: {sellingProduct ? formatPrice(sellingProduct.price) : ''}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsSoldModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkSold}>
              <Check className="w-4 h-4 mr-2" />
              Mark as Sold
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
