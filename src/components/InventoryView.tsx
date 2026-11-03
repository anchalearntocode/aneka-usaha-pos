import React, { useState } from 'react';
import { Product } from '../types';
import { formatRupiah } from '../utils/format';
import { ProductImage } from './ProductImage';
import { IconAlertBell } from './Icons';

interface InventoryViewProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onUpdateStock,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'restock' | 'safe'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Add Product
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<Product['category']>('Alat Tulis');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductMinStock, setNewProductMinStock] = useState('');
  const [newProductImage, setNewProductImage] = useState('');
  const [copiedAlert, setCopiedAlert] = useState(false);

  // Form states for Edit Product
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<Product['category']>('Alat Tulis');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editMinStock, setEditMinStock] = useState('');
  const [editImage, setEditImage] = useState('');

  // Items needing restocking (min_stock > 0 and stock <= min_stock)
  const lowStockItems = products.filter(
    (p) => p.min_stock > 0 && p.stock <= p.min_stock
  );

  const filteredProducts = products.filter((p) => {
    const isRestock = p.min_stock > 0 && p.stock <= p.min_stock;
    if (filterStatus === 'restock') return isRestock;
    if (filterStatus === 'safe') return !isRestock;
    return true;
  });

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.price.toString());
    setEditStock(product.stock.toString());
    setEditMinStock(product.min_stock.toString());
    setEditImage(product.image || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editName.trim()) return;

    onEditProduct({
      ...editingProduct,
      name: editName.trim(),
      category: editCategory,
      price: Math.max(0, parseInt(editPrice, 10) || 0),
      stock: Math.max(0, parseInt(editStock, 10) || 0),
      min_stock: Math.max(0, parseInt(editMinStock, 10) || 0),
      image: editImage.trim() || editingProduct.image,
    });

    setEditingProduct(null);
  };

  const handleDeleteCurrent = () => {
    if (!editingProduct) return;
    if (
      window.confirm(
        `Hapus "${editingProduct.name}" dari katalog dan inventaris toko? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      onDeleteProduct(editingProduct.id);
      setEditingProduct(null);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    onAddProduct({
      name: newProductName.trim(),
      category: newProductCategory,
      price: Math.max(0, parseInt(newProductPrice, 10) || 0),
      stock: Math.max(0, parseInt(newProductStock, 10) || 0),
      min_stock: Math.max(0, parseInt(newProductMinStock, 10) || 0),
      image: newProductImage.trim(),
    });

    setNewProductName('');
    setNewProductPrice('');
    setNewProductStock('');
    setNewProductMinStock('');
    setNewProductImage('');
    setIsAddModalOpen(false);
  };

  const handleCopyRestockList = () => {
    const text = lowStockItems
      .map((item) => `- ${item.name} (Sisa: ${item.stock}, Batas Min: ${item.min_stock})`)
      .join('\n');
    navigator.clipboard.writeText(`Daftar Restok Toko Aneka Usaha (Pesanan Makassar):\n${text}`);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-150">
      {/* Refined Low Stock Alert Card */}
      {lowStockItems.length > 0 && (
        <section
          aria-labelledby="alert-heading"
          className="p-4 rounded-xl bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200/90 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex-shrink-0">
              <IconAlertBell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="alert-heading" className="text-sm font-bold text-rose-950 dark:text-rose-100">
                  Perlu Restok: {lowStockItems.length} Barang Mencapai Batas Minimum
                </h2>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-rose-200/80 dark:bg-rose-900/70 text-rose-800 dark:text-rose-200">
                  Prioritas Makassar
                </span>
              </div>
              <p className="text-xs text-rose-800/80 dark:text-rose-200/70 mt-1">
                Persediaan barang berikut menipis dan perlu dicatat untuk pesanan kulakan Makassar:
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {lowStockItems.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <strong>{item.name}</strong>
                    <span className="text-slate-400 dark:text-slate-500">&bull; Sisa {item.stock}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyRestockList}
            className="min-h-[44px] px-3.5 py-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-rose-100/50 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-200 border border-rose-200 dark:border-rose-900/80 text-xs font-semibold whitespace-nowrap shadow-xs transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>{copiedAlert ? 'Tersalin!' : 'Salin Daftar Pesanan'}</span>
          </button>
        </section>
      )}

      {/* Control Bar: Filters & Add Product */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status:</span>
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-md transition ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('restock')}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-md transition ${
                filterStatus === 'restock'
                  ? 'bg-rose-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              Harus Restok ({lowStockItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('safe')}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-md transition ${
                filterStatus === 'safe'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Stok Aman ({products.length - lowStockItems.length})
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="min-h-[44px] px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Barang Baru</span>
        </button>
      </div>

      {/* 3.3 <InventoryTable /> */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">Produk</th>
                <th scope="col" className="px-6 py-3.5">Kategori</th>
                <th scope="col" className="px-6 py-3.5">Harga Jual</th>
                <th scope="col" className="px-6 py-3.5 text-center">Sisa Stok</th>
                <th scope="col" className="px-6 py-3.5 text-center">Batas Min</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5 text-right">Aksi & Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProducts.map((product) => {
                const isRestock = product.min_stock > 0 && product.stock <= product.min_stock;
                const isService = product.min_stock === 0;

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      isRestock
                        ? 'bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/70 dark:hover:bg-rose-950/30'
                        : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          <ProductImage
                            src={product.image}
                            name={product.name}
                            category={product.category}
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                            {product.name}
                          </span>
                          {product.barcode && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block">
                              {product.barcode}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-6 py-3.5 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-6 py-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isRestock
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {isService ? 'Layanan Jasa' : product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {isService ? 'Tak Terbatas' : product.min_stock}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      {isRestock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Perlu Restok
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Aman
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Quick stock stepper if physical */}
                        {!isService && (
                          <>
                            <button
                              type="button"
                              onClick={() => onUpdateStock(product.id, product.stock + 5)}
                              className="min-h-[36px] px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg shadow-xs transition"
                              title="Tambah 5 unit"
                            >
                              +5
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStock(product.id, product.stock + 10)}
                              className="min-h-[36px] px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg shadow-xs transition"
                              title="Tambah 10 unit"
                            >
                              +10
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStock(product.id, product.stock + 50)}
                              className="min-h-[36px] px-2 py-1 bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-800 dark:text-sky-300 text-xs font-bold rounded-lg shadow-xs transition"
                              title="Tambah 50 unit"
                            >
                              +50
                            </button>
                          </>
                        )}

                        {/* Edit Product Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="min-h-[36px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1"
                          title={`Edit ${product.name}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edit Produk */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-edit-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditingProduct(null);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-page-transition">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 id="modal-edit-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Edit Informasi Produk
                </h3>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  ID: {editingProduct.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Tutup dialog edit"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label htmlFor="edit-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Barang *
                </label>
                <input
                  id="edit-name"
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  id="edit-category"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Product['category'])}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Alat Tulis">Alat Tulis</option>
                  <option value="Kertas & Buku">Kertas & Buku</option>
                  <option value="Tinta & Percetakan">Tinta & Percetakan</option>
                  <option value="Jasa">Jasa</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-image" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL / Path Foto Produk
                </label>
                <input
                  id="edit-image"
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="Contoh: /products/pulpen.png atau URL..."
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="edit-price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Harga Jual (Rp) *
                  </label>
                  <input
                    id="edit-price"
                    type="number"
                    min="0"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="edit-stock" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sisa Stok *
                  </label>
                  <input
                    id="edit-stock"
                    type="number"
                    min="0"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="edit-min" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Batas Min Restok
                  </label>
                  <input
                    id="edit-min"
                    type="number"
                    min="0"
                    value={editMinStock}
                    onChange={(e) => setEditMinStock(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleDeleteCurrent}
                  className="min-h-[44px] px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                >
                  Hapus Barang
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Barang Baru */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-add-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsAddModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-page-transition">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 id="modal-add-title" className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Barang Baru ke Inventaris
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Tutup dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label htmlFor="prod-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Barang *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  placeholder="Contoh: Lakban Bening 2 Inch"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="prod-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  id="prod-category"
                  value={newProductCategory}
                  onChange={(e) => setNewProductCategory(e.target.value as Product['category'])}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Alat Tulis">Alat Tulis</option>
                  <option value="Kertas & Buku">Kertas & Buku</option>
                  <option value="Tinta & Percetakan">Tinta & Percetakan</option>
                  <option value="Jasa">Jasa</option>
                </select>
              </div>

              <div>
                <label htmlFor="prod-image" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  URL Foto Produk (Opsional)
                </label>
                <input
                  id="prod-image"
                  type="url"
                  placeholder="https://... (Bisa dikosongkan untuk ilustrasi otomatis)"
                  value={newProductImage}
                  onChange={(e) => setNewProductImage(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="prod-price" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Harga (Rp) *
                  </label>
                  <input
                    id="prod-price"
                    type="number"
                    min="0"
                    required
                    placeholder="15000"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="prod-stock" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stok Awal *
                  </label>
                  <input
                    id="prod-stock"
                    type="number"
                    min="0"
                    required
                    placeholder="10"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="prod-min" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Batas Min
                  </label>
                  <input
                    id="prod-min"
                    type="number"
                    min="0"
                    placeholder="5"
                    value={newProductMinStock}
                    onChange={(e) => setNewProductMinStock(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="min-h-[44px] w-1/2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] w-1/2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
