import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, SaleRecord, User } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SALES,
  loadStoredProducts,
  saveStoredProducts,
  loadStoredSales,
  saveStoredSales,
} from './initialData';
import { POS_USERS, STORAGE_KEY_AUTH } from './data/users';
import { Header, ActiveTabType } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { Cart } from './components/Cart';
import { HistoryView } from './components/HistoryView';
import { InventoryView } from './components/InventoryView';
import { OwnerDashboard } from './components/OwnerDashboard';
import { ReceiptModal } from './components/ReceiptModal';
import { LoginScreen } from './components/LoginScreen';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(loadStoredProducts);
  const [sales, setSales] = useState<SaleRecord[]>(loadStoredSales);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [notification, setNotification] = useState<string | null>(null);
  const [lastSale, setLastSale] = useState<SaleRecord | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
      return POS_USERS[0];
    } catch {
      return POS_USERS[0];
    }
  });

  // Active Tab state dependent on initial role
  const [activeTab, setActiveTab] = useState<ActiveTabType>(() => {
    return currentUser?.role === 'owner' ? 'dashboard' : 'pos';
  });

  // Guard active tab according to role
  useEffect(() => {
    if (currentUser?.role === 'owner' && activeTab === 'pos') {
      setActiveTab('dashboard');
    } else if (
      currentUser?.role === 'cashier' &&
      (activeTab === 'dashboard' || activeTab === 'inventory')
    ) {
      setActiveTab('pos');
    }
  }, [currentUser, activeTab]);

  // Dark mode state management
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('aneka_pos_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class to root html element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('aneka_pos_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('aneka_pos_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync products to LocalStorage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  // Sync sales to LocalStorage
  useEffect(() => {
    saveStoredSales(sales);
  }, [sales]);

  // Flash notification timer
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [notification]);

  // Low stock counter for header badge
  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.min_stock > 0 && p.stock <= p.min_stock).length;
  }, [products]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered products for Kasir catalog
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      const matchCat =
        selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategory]);

  // Login handler
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'owner') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('pos');
    }
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setNotification(`Selamat datang, ${user.name}`);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.error(e);
    }
  };

  // Add to cart with strict stock checking
  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const currentQty = existing ? existing.qty : 0;

      if (currentQty >= product.stock) {
        setNotification(`Stok ${product.name} tidak mencukupi (tersedia: ${product.stock})`);
        return prevCart;
      }

      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  // Update item quantity in cart
  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (newQty > product.stock) {
      setNotification(`Jumlah melebihi stok yang ada (${product.stock})`);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty: newQty } : item))
    );
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Checkout transaction
  const handleCheckout = (
    method: 'Tunai' | 'QRIS',
    cashTendered?: number,
    change?: number
  ) => {
    if (cart.length === 0) return;

    // Deduct stock from products
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((c) => c.id === product.id);
      if (!cartItem) return product;
      const newStock = Math.max(0, product.stock - cartItem.qty);
      return { ...product, stock: newStock };
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const saleRecord: SaleRecord = {
      id: `TRX-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      items: [...cart],
      total,
      paymentMethod: method,
      cashTendered,
      change,
      cashierName: currentUser ? currentUser.name : 'Kasir',
      status: 'Selesai',
    };

    setProducts(updatedProducts);
    setSales((prev) => [saleRecord, ...prev]);
    setCart([]);
    setLastSale(saleRecord);
  };

  // Clear all transaction history
  const handleClearHistory = () => {
    setSales([]);
    saveStoredSales([]);
    setNotification('Seluruh riwayat transaksi telah dibersihkan.');
  };

  // Update stock from inventory table
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
  };

  // Edit product details
  const handleEditProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    // Also update in cart if present
    setCart((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id
          ? { ...item, ...updatedProduct, qty: Math.min(item.qty, updatedProduct.stock) }
          : item
      )
    );
    setNotification(`Informasi produk "${updatedProduct.name}" berhasil diperbarui.`);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.id !== productId));
    setNotification('Produk berhasil dihapus dari inventaris.');
  };

  // Add new product
  const handleAddProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProduct]);
    setNotification(`Berhasil menambahkan barang: ${newProduct.name}`);
  };

  // Reset data to defaults
  const handleResetData = () => {
    if (
      window.confirm(
        'Kembalikan data produk dan riwayat transaksi ke konfigurasi awal Toko Aneka Usaha?'
      )
    ) {
      setProducts(INITIAL_PRODUCTS);
      setSales(INITIAL_SALES);
      setCart([]);
      setNotification('Katalog produk dan riwayat penjualan berhasil di-reset.');
    }
  };

  // If user is locked/logged out, show Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col bg-slate-50 dark:bg-[#0c1424] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      {/* Subtle Ambient Background with reduced opacity */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-[0.06] dark:opacity-[0.14] transition-opacity duration-300"
        style={{ backgroundImage: `url('/bg-waves.jpg')` }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Modern Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lowStockCount={lowStockCount}
          totalSalesCount={sales.length}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onResetData={handleResetData}
        />

        {/* Toast Notification */}
        {notification && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-20 right-4 z-50 bg-[#1E3156] dark:bg-white text-white dark:text-[#1E3156] px-4 py-3 rounded-xl shadow-xl border border-[#496995]/50 dark:border-slate-200 text-xs font-semibold flex items-center space-x-2 animate-bounce"
          >
            <span className="w-2 h-2 rounded-full bg-[#FDD6CD]"></span>
            <span>{notification}</span>
          </div>
        )}

      {/* Main App Content with Smooth Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div key={activeTab} className="animate-page-transition">
          {/* View 0: Owner Dashboard (Dedicated to Owner) */}
          {activeTab === 'dashboard' && currentUser.role === 'owner' && (
            <OwnerDashboard
              products={products}
              sales={sales}
              onNavigateToInventory={() => setActiveTab('inventory')}
            />
          )}

          {/* View 1: POS (Kasir) - Two-column Grid (Dedicated to Cashier) */}
          {activeTab === 'pos' && currentUser.role === 'cashier' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 60%: Catalog & Search */}
              <section
                className="lg:col-span-7 space-y-4"
                aria-label="Katalog Produk Kasir"
              >
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  categories={categories}
                />

                {filteredProducts.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-12 text-center shadow-xs">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Tidak ditemukan barang dengan kata kunci "{searchTerm}"
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Coba sesuaikan kata kunci atau gunakan tombol "Semua Produk".
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('Semua');
                      }}
                      className="min-h-[44px] mt-3 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {filteredProducts.map((product) => {
                      const cartItem = cart.find((item) => item.id === product.id);
                      const cartQty = cartItem ? cartItem.qty : 0;

                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={handleAddToCart}
                          cartQty={cartQty}
                        />
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Right 40%: Sticky Fixed Cashier Cart Station */}
              <section
                className="lg:col-span-5 lg:sticky lg:top-20 lg:h-[calc(100vh-6.5rem)] self-start"
                aria-label="Stasiun Kasir & Keranjang"
              >
                <Cart
                  items={cart}
                  onUpdateQty={handleUpdateQty}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                  onCheckout={handleCheckout}
                />
              </section>
            </div>
          )}

          {/* View 2: Riwayat Transaksi (Accessible by both Owner & Cashier) */}
          {activeTab === 'history' && (
            <HistoryView sales={sales} onClearHistory={handleClearHistory} />
          )}

          {/* View 3: Stok & Inventaris (Accessible by Owner) */}
          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              onUpdateStock={handleUpdateStock}
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>
      </main>

      {/* Footer bar */}
      <footer className="bg-white/80 dark:bg-[#132039]/80 backdrop-blur-xs border-t border-[#A5B5D2]/30 dark:border-[#2b3f5c] py-3 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-150">
        <p>
          Aneka POS &bull; Toko Aneka Usaha &bull; Pappa, Takalar &bull; Mode Ritel Minimalis
        </p>
      </footer>

      {/* Global Receipt Modal */}
      <ReceiptModal sale={lastSale} onClose={() => setLastSale(null)} />
      </div>
    </div>
  );
};

export default App;
