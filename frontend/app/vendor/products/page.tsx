'use client';

import { SubmitEvent, useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import Button from '@/app/components/Button';
import FormField from '@/app/components/FormField';
import VendorProductRow from '@/app/components/VendorProductRow';
import { useRequireVendor } from '@/app/hooks/useRequireVendor';
import {
  ApiError,
  createVendorProduct,
  deleteVendorProduct,
  listVendorProducts,
  updateVendorProduct,
} from '@/app/lib/api';
import { ERROR_BANNER_STYLES, GLASS_STYLES, INPUT_STYLES, LABEL_STYLES } from '@/app/constants';
import type { VendorProduct } from '@/app/types';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Toys'];

const emptyForm = {
  title: '',
  category: CATEGORIES[0],
  price: '',
  stock: '',
  status: 'ACTIVE' as VendorProduct['status'],
  imageUrl: '',
  description: '',
};

export default function VendorProductsPage() {
  const isCheckingAuth = useRequireVendor();

  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isEditing = editingId !== null;

  useEffect(() => {
    if (isCheckingAuth) return;

    let cancelled = false;

    listVendorProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof ApiError ? err.message : 'Could not load your products. Please try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isCheckingAuth]);

  if (isCheckingAuth) return null;

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleEdit = (product: VendorProduct) => {
    setEditingId(product.id);
    setFormError(null);
    setForm({
      title: product.title,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
      imageUrl: product.imageUrl ?? '',
      description: product.description ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteVendorProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      if (editingId === id) handleNew();
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Could not delete this product. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const payload = {
      title: form.title,
      category: form.category,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      status: form.status,
      imageUrl: form.imageUrl,
      description: form.description,
    };

    try {
      if (isEditing && editingId) {
        const updated = await updateVendorProduct(editingId, payload);
        setProducts((prev) => prev.map((product) => (product.id === editingId ? updated : product)));
      } else {
        const created = await createVendorProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }
      handleNew();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save this product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Manage Products</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            {products.length} {products.length === 1 ? 'product' : 'products'} in your store
          </p>
        </div>
        <Button variant="primary" onClick={handleNew}>
          <PlusIcon className="h-4 w-4" />
          <span>New Product</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-8 flex flex-col gap-4">
          {loadError && <div className={ERROR_BANNER_STYLES}>{loadError}</div>}

          {isLoading ? (
            <div className={`p-8 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
              Loading your products...
            </div>
          ) : products.length === 0 ? (
            <div className={`p-8 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
              No products yet. Create your first one to start selling.
            </div>
          ) : (
            products.map((product) => (
              <VendorProductRow
                key={product.id}
                product={product}
                isActive={product.id === editingId}
                isDeleting={product.id === deletingId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        <aside className="lg:col-span-4 sticky top-28">
          <form onSubmit={handleSubmit} className={`p-6 space-y-4 ${GLASS_STYLES.container}`}>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-neutral-800 tracking-tight">
                {isEditing ? 'Edit Product' : 'Add Product'}
              </h2>
              <p className="text-xs text-neutral-400 font-medium">
                {isEditing ? 'Update the details below and save your changes.' : 'Fill in the details to list a new product.'}
              </p>
            </div>

            {formError && <div className={ERROR_BANNER_STYLES}>{formError}</div>}

            <FormField
              id="title"
              label="Product Name"
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Sequoia Inspiring Musico."
            />

            <div className="space-y-1.5">
              <label htmlFor="category" className={LABEL_STYLES}>Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className={INPUT_STYLES}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                id="price"
                label="Price"
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="199.00"
              />
              <FormField
                id="stock"
                label="Stock"
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                placeholder="24"
              />
            </div>

            <FormField
              id="imageUrl"
              label="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="https://..."
            />

            <div className="space-y-1.5">
              <label htmlFor="description" className={LABEL_STYLES}>Description</label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your product..."
                className={`${INPUT_STYLES} resize-none`}
              />
            </div>

            <div className="space-y-1.5">
              <span className={LABEL_STYLES}>Status</span>
              <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/40 p-1 backdrop-blur-sm">
                {(['ACTIVE', 'DRAFT'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, status }))}
                    aria-pressed={form.status === status}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      form.status === status
                        ? 'bg-neutral-950 text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    {status === 'ACTIVE' ? 'Active' : 'Draft'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {isEditing && (
                <Button type="button" variant="secondary" width="full" onClick={handleNew} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" width="full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </aside>

      </div>
    </div>
  );
}
