'use client';

import { SubmitEvent, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import Button from '@/app/components/Button';
import FormField from '@/app/components/FormField';
import VendorProductRow from '@/app/components/VendorProductRow';
import { GLASS_STYLES, INPUT_STYLES, LABEL_STYLES } from '@/app/constants';
import type { VendorProduct } from '@/app/types';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Toys'];

const MOCK_PRODUCTS: VendorProduct[] = [
  {
    id: '1',
    title: 'Sequoia Inspiring Musico.',
    category: 'Electronics',
    price: '$199.00',
    stock: 24,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
    description: 'Clear sounds — making your dream music come true with premium wireless headphones.',
  },
  {
    id: '2',
    title: 'Smart VR Headset Pro',
    category: 'Electronics',
    price: '$599.00',
    stock: 6,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1592477942940-01fbeb590d7e?w=300&auto=format&fit=crop&q=80',
    description: 'Immersive virtual reality headset with 4K per-eye resolution and spatial audio.',
  },
  {
    id: '3',
    title: 'Minimalist Leather Tote',
    category: 'Fashion',
    price: '$89.00',
    stock: 0,
    status: 'draft',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80',
    description: 'Hand-stitched full-grain leather tote with a soft cotton lining.',
  },
];

const emptyForm = {
  title: '',
  category: CATEGORIES[0],
  price: '',
  stock: '',
  status: 'active' as VendorProduct['status'],
  imageUrl: '',
  description: '',
};

export default function VendorProductsPage() {
  const [products, setProducts] = useState<VendorProduct[]>(MOCK_PRODUCTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const isEditing = editingId !== null;

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (product: VendorProduct) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      category: product.category,
      price: product.price,
      stock: String(product.stock),
      status: product.status,
      imageUrl: product.imageUrl,
      description: product.description,
    });
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    if (editingId === id) handleNew();
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: Omit<VendorProduct, 'id'> = {
      title: form.title,
      category: form.category,
      price: form.price,
      stock: Number(form.stock) || 0,
      status: form.status,
      imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
      description: form.description,
    };

    if (isEditing && editingId) {
      setProducts((prev) => prev.map((product) => (product.id === editingId ? { ...product, ...payload } : product)));
    } else {
      setProducts((prev) => [...prev, { id: `${prev.length + 1}-${prev.length}`, ...payload }]);
    }

    handleNew();
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
          {products.length === 0 ? (
            <div className={`p-8 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
              No products yet. Create your first one to start selling.
            </div>
          ) : (
            products.map((product) => (
              <VendorProductRow
                key={product.id}
                product={product}
                isActive={product.id === editingId}
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
                required
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                placeholder="$199.00"
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
                {(['active', 'draft'] as const).map((status) => (
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
                    {status === 'active' ? 'Active' : 'Draft'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {isEditing && (
                <Button type="button" variant="secondary" width="full" onClick={handleNew}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="primary" width="full">
                {isEditing ? 'Save Changes' : 'Create Product'}
              </Button>
            </div>
          </form>
        </aside>

      </div>
    </div>
  );
}
