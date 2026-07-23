'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, FolderOpen, Upload, X } from 'lucide-react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { categoriesApi, uploadApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface Category {
  _id: string;
  name: { en: string; my: string };
  slug: string;
  image: string;
  createdAt: string;
}

const categorySchema = z.object({
  nameEn: z.string().min(2, 'English name is required'),
  nameMy: z.string().min(2, 'Burmese name is required'),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview('');
    reset({ nameEn: '', nameMy: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setImageFile(null);
    setImagePreview(category.image || '');
    reset({ nameEn: category.name.en, nameMy: category.name.my });
    setIsModalOpen(true);
  };

  const openDeleteModal = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const onSubmit = async (data: CategoryForm) => {
    try {
      let imageUrl = editingCategory?.image || '';

      // Upload new image if selected
      if (imageFile) {
        setIsUploading(true);
        const uploadResponse = await uploadApi.single(imageFile);
        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.data.url;
        }
        setIsUploading(false);
      }

      const categoryData = {
        name: { en: data.nameEn, my: data.nameMy },
        image: imageUrl,
      };

      if (editingCategory) {
        const response = await categoriesApi.update(editingCategory._id, categoryData);
        if (response.data.success) {
          toast.success('Category updated successfully');
          fetchCategories();
          setIsModalOpen(false);
        }
      } else {
        const response = await categoriesApi.create(categoryData);
        if (response.data.success) {
          toast.success('Category created successfully');
          fetchCategories();
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
    if (!deletingCategory) return;

    try {
      const response = await categoriesApi.delete(deletingCategory._id);
      if (response.data.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
        setIsDeleteModalOpen(false);
        setDeletingCategory(null);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const canDelete = user?.role === 'admin';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 mt-1">Manage product categories</p>
          </div>
          <Button onClick={openAddModal} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No categories yet</p>
            <Button className="mt-4" onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Category
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
              >
                <div className="aspect-video bg-gray-100 relative">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name.en}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FolderOpen className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  {/* Actions Overlay - Desktop only */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors hidden sm:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gold-50 hover:text-gold-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => openDeleteModal(category)}
                        className="p-2 bg-white rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{category.name.en}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">{category.name.my}</p>
                  <p className="text-xs text-gray-400 mt-1 truncate">/{category.slug}</p>
                  {/* Mobile Action Buttons */}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 sm:hidden">
                    <button
                      onClick={() => openEditModal(category)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gold-50 text-gold-600 rounded-lg text-xs font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => openDeleteModal(category)}
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
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Image
            </label>
            {imagePreview ? (
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold-500 transition-colors">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Click to upload image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting || isUploading}>
              {isUploading ? 'Uploading...' : editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deletingCategory?.name.en}</strong>? This
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
    </AdminLayout>
  );
}
