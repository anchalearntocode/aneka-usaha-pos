import React, { useMemo, useState } from 'react';
import { Product, SaleRecord } from '../types';
import { formatRupiah } from '../utils/format';
import { ProductImage } from './ProductImage';
import {
  IconRupiahLedger,
  IconVolumeCount,
  IconCashNotes,
  IconQrisBadge,
  IconInventoryBox,
  IconAlertBell,
  IconTrending,
} from './Icons';

interface OwnerDashboardProps {
  products: Product[];
  sales: SaleRecord[];
  onNavigateToInventory: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  products,
  sales,
  onNavigateToInventory,
}) => {
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // 1. KPI Calculations
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = sales.length;
    const avgBasketSize = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

    // Stock valuation: sum of (price * stock) excluding service items with infinite stock (min_stock = 0)
    const stockValuation = products
      .filter((p) => p.min_stock > 0)
      .reduce((sum, p) => sum + p.price * p.stock, 0);

    const totalStockUnits = products
      .filter((p) => p.min_stock > 0)
      .reduce((sum, p) => sum + p.stock, 0);

    const lowStockItems = products.filter(
      (p) => p.min_stock > 0 && p.stock <= p.min_stock
    );

    const cashSales = sales.filter((s) => s.paymentMethod === 'Tunai');
    const qrisSales = sales.filter((s) => s.paymentMethod === 'QRIS');

    const cashRevenue = cashSales.reduce((sum, s) => sum + s.total, 0);
    const qrisRevenue = qrisSales.reduce((sum, s) => sum + s.total, 0);

    const cashPercent = totalRevenue > 0 ? Math.round((cashRevenue / totalRevenue) * 100) : 0;
    const qrisPercent = totalRevenue > 0 ? 100 - cashPercent : 0;

    return {
      totalRevenue,
      totalTransactions,
      avgBasketSize,
      stockValuation,
      totalStockUnits,
      lowStockItems,
      cashRevenue,
      cashCount: cashSales.length,
      cashPercent,
      qrisRevenue,
      qrisCount: qrisSales.length,
      qrisPercent,
    };
  }, [products, sales]);

  // 2. Sales by Category
  const categoryStats = useMemo(() => {
    const categoryMap: Record<string, { revenue: number; qty: number }> = {
      'Kertas & Buku': { revenue: 0, qty: 0 },
      'Alat Tulis': { revenue: 0, qty: 0 },
      'Tinta & Percetakan': { revenue: 0, qty: 0 },
      'Jasa': { revenue: 0, qty: 0 },
    };

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const cat = item.category || 'Alat Tulis';
        if (!categoryMap[cat]) {
          categoryMap[cat] = { revenue: 0, qty: 0 };
        }
        categoryMap[cat].revenue += item.price * item.qty;
        categoryMap[cat].qty += item.qty;
      });
    });

    const totalRevenue = stats.totalRevenue || 1; // prevent division by zero
    const colors: Record<string, { bg: string; fill: string; dot: string }> = {
      'Kertas & Buku': { bg: 'bg-[#1E3156]', fill: '#1E3156', dot: 'bg-[#1E3156]' },
      'Alat Tulis': { bg: 'bg-[#496995]', fill: '#496995', dot: 'bg-[#496995]' },
      'Tinta & Percetakan': { bg: 'bg-[#7590b5]', fill: '#7590b5', dot: 'bg-[#7590b5]' },
      'Jasa': { bg: 'bg-[#FDD6CD]', fill: '#FDD6CD', dot: 'bg-[#FDD6CD]' },
    };

    return Object.entries(categoryMap).map(([category, data]) => {
      const percentage = Math.round((data.revenue / totalRevenue) * 100);
      return {
        category,
        revenue: data.revenue,
        qty: data.qty,
        percentage,
        color: colors[category] || { bg: 'bg-slate-500', fill: '#64748b', dot: 'bg-slate-500' },
      };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [sales, stats.totalRevenue]);

  // 3. Top Selling Products
  const topProducts = useMemo(() => {
    const map = new Map<string, { id: string; name: string; category: string; image: string; totalQty: number; totalRevenue: number }>();

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const existing = map.get(item.id);
        if (existing) {
          existing.totalQty += item.qty;
          existing.totalRevenue += item.price * item.qty;
        } else {
          map.set(item.id, {
            id: item.id,
            name: item.name,
            category: item.category,
            image: item.image,
            totalQty: item.qty,
            totalRevenue: item.price * item.qty,
          });
        }
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }, [sales]);

  // 4. Hourly Sales Distribution (08:00 to 20:00)
  const hourlyData = useMemo(() => {
    const hours = ['08.00', '10.00', '12.00', '14.00', '16.00', '18.00', '20.00'];
    const buckets = [0, 0, 0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    sales.forEach((sale) => {
      const d = new Date(sale.timestamp);
      const hour = d.getHours();
      let index = 0;
      if (hour < 9) index = 0;
      else if (hour < 11) index = 1;
      else if (hour < 13) index = 2;
      else if (hour < 15) index = 3;
      else if (hour < 17) index = 4;
      else if (hour < 19) index = 5;
      else index = 6;

      buckets[index] += sale.total;
      counts[index] += 1;
    });

    const maxVal = Math.max(...buckets, 100000);

    return hours.map((hour, idx) => ({
      hour,
      revenue: buckets[idx],
      count: counts[idx],
      heightPct: Math.max(10, Math.round((buckets[idx] / maxVal) * 100)),
    }));
  }, [sales]);

  // Copy procurement list to clipboard for Makassar suppliers
  const handleCopyRestockList = () => {
    if (stats.lowStockItems.length === 0) return;
    const itemsList = stats.lowStockItems
      .map((item, idx) => `${idx + 1}. ${item.name} (Sisa: ${item.stock}, Batas Min: ${item.min_stock})`)
      .join('\n');
    const text = `*DAFTAR RESTOK TOKO ANEKA USAHA (MAKASSAR)*\nTanggal: ${new Date().toLocaleDateString('id-ID')}\n\n${itemsList}\n\nMohon dicek stok dan total tagihannya. Terima kasih.`;
    navigator.clipboard.writeText(text);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-150">
      {/* 1. Header Hero Banner for Owner */}
      <div className="bg-gradient-to-r from-[#1E3156] via-[#243B66] to-[#1E3156] dark:from-[#0c1424] dark:via-[#132039] dark:to-[#1E3156] text-white p-6 sm:p-7 rounded-2xl border border-[#496995]/50 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B0CBE6]/20 text-[#B0CBE6] border border-[#B0CBE6]/40">
                Akses Pemilik (Owner)
              </span>
              <span className="text-xs text-[#A5B5D2] font-mono">
                {new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date())}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Pusat Kendali & Pemantauan Usaha
            </h1>
            <p className="text-xs sm:text-sm text-[#B0CBE6] max-w-2xl leading-relaxed">
              Pantau arus omzet ritel harian, valuasi persediaan toko di Pappa Takalar, dan kesiapan pesanan kulakan Makassar secara langsung.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onNavigateToInventory}
              className="min-h-[44px] px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white border border-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs transition flex items-center space-x-2"
            >
              <IconInventoryBox className="w-4 h-4 text-[#B0CBE6]" />
              <span>Kelola Stok & Harga</span>
            </button>
            {stats.lowStockItems.length > 0 && (
              <button
                type="button"
                onClick={handleCopyRestockList}
                className="min-h-[44px] px-4 py-2 bg-[#FDD6CD] hover:bg-[#fcd0c5] active:bg-[#fbc4b7] text-[#6E2215] rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>{copiedAlert ? 'Format WA Tersalin!' : 'Salin Order Makassar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Primary Metric Cards (5 KPI Cards) */}
      <section aria-label="Ringkasan Kinerja Utama" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Omzet */}
        <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider block">
              Total Omzet Penjualan
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#1E3156] dark:text-white mt-1">
              {formatRupiah(stats.totalRevenue)}
            </p>
            <div className="flex items-center space-x-1.5 mt-1 text-[#496995] dark:text-[#B0CBE6] text-[11px] font-semibold">
              <IconTrending className="w-3.5 h-3.5" />
              <span>{stats.totalTransactions} transaksi tercatat</span>
            </div>
          </div>
          <IconRupiahLedger className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Card 2: Valuasi Aset Stok */}
        <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider block">
              Valuasi Aset Stok Toko
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#1E3156] dark:text-white mt-1">
              {formatRupiah(stats.stockValuation)}
            </p>
            <span className="text-[11px] text-[#496995] dark:text-[#A5B5D2] font-medium block mt-1">
              {stats.totalStockUnits} unit barang fisik di etalase
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#B0CBE6]/25 dark:bg-[#496995]/20 flex items-center justify-center text-[#1E3156] dark:text-[#B0CBE6] flex-shrink-0">
            <IconInventoryBox className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Rata-rata Nilai Transaksi */}
        <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider block">
              Rata-rata per Nota (Basket)
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#1E3156] dark:text-white mt-1">
              {formatRupiah(stats.avgBasketSize)}
            </p>
            <span className="text-[11px] text-[#496995] dark:text-[#A5B5D2] font-medium block mt-1">
              Dari {stats.totalTransactions} belanja pelanggan
            </span>
          </div>
          <IconVolumeCount className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Card 4: Status Restok Makassar */}
        <div
          className={`p-4 rounded-xl border shadow-xs flex items-center justify-between transition cursor-pointer ${
            stats.lowStockItems.length > 0
              ? 'bg-[#FDD6CD]/35 dark:bg-[#FDD6CD]/10 border-[#FDD6CD] dark:border-[#FDD6CD]/40 hover:border-[#fcd0c5]'
              : 'bg-white/95 dark:bg-[#132039]/95 border-[#A5B5D2]/30 dark:border-[#2b3f5c]'
          }`}
          onClick={onNavigateToInventory}
        >
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider block">
              Peringatan Restok Stok
            </span>
            <p className="text-xl sm:text-2xl font-black text-[#6E2215] dark:text-[#FDD6CD] mt-1">
              {stats.lowStockItems.length} Barang
            </p>
            <span className="text-[11px] text-[#7A271A] dark:text-[#FDD6CD]/80 font-medium block mt-1">
              {stats.lowStockItems.length > 0 ? 'Perlu pesanan Makassar' : 'Semua stok dalam batas aman'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FDD6CD]/50 dark:bg-[#FDD6CD]/20 flex items-center justify-center text-[#6E2215] dark:text-[#FDD6CD] flex-shrink-0">
            <IconAlertBell className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* 3. Visual Charts Grid (Tren Omzet & Komposisi Metode) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Grafik Tren Jam Sibuk Toko */}
        <div className="lg:col-span-7 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs p-5 rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1E3156] dark:text-white">
                Grafik Tren Omzet per Rentang Waktu
              </h2>
              <p className="text-xs text-[#496995] dark:text-[#A5B5D2] mt-0.5">
                Pemetaan arus transaksi kasir sepanjang jam operasional toko
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#1E3156] dark:text-[#B0CBE6] bg-[#B0CBE6]/25 dark:bg-[#1E3156]/50 px-2.5 py-1 rounded-md border border-[#B0CBE6]/40 dark:border-[#496995]/40">
              Hari Ini
            </span>
          </div>

          {/* SVG Column Chart */}
          <div className="pt-4">
            <div className="h-48 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2 border-b border-[#A5B5D2]/25 dark:border-[#2b3f5c]">
              {hourlyData.map((item, idx) => {
                const isHovered = hoveredBarIndex === idx;
                return (
                  <div
                    key={item.hour}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-[#1E3156] dark:bg-white text-white dark:text-[#1E3156] text-[11px] font-bold py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                        <div className="text-center">{formatRupiah(item.revenue)}</div>
                        <div className="text-[10px] opacity-80 text-center font-normal">{item.count} transaksi</div>
                      </div>
                    )}

                    {/* Value label above bar */}
                    {item.revenue > 0 && (
                      <span className="text-[10px] font-mono text-[#496995] dark:text-[#A5B5D2] mb-1 opacity-80 group-hover:opacity-100 group-hover:text-[#1E3156] dark:group-hover:text-[#B0CBE6] transition-opacity">
                        {item.revenue >= 1000 ? `${Math.round(item.revenue / 1000)}k` : item.revenue}
                      </span>
                    )}

                    {/* Bar Column */}
                    <div
                      className={`w-full max-w-[42px] rounded-t-md transition-all duration-300 ${
                        item.revenue > 0
                          ? isHovered
                            ? 'bg-[#1E3156] dark:bg-[#B0CBE6]'
                            : 'bg-[#496995] dark:bg-[#496995]/80 group-hover:bg-[#1E3156] dark:group-hover:bg-[#B0CBE6]'
                          : 'bg-slate-100 dark:bg-[#1E3156]/40'
                      }`}
                      style={{ height: `${item.heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between gap-2 sm:gap-4 px-2 pt-2 text-[11px] font-mono text-[#496995] dark:text-[#A5B5D2]">
              {hourlyData.map((item) => (
                <div key={item.hour} className="flex-1 text-center truncate">
                  {item.hour}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Rasio Pembayaran Tunai vs QRIS */}
        <div className="lg:col-span-5 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs p-5 rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#1E3156] dark:text-white">
              Rasio Metode Pembayaran
            </h2>
            <p className="text-xs text-[#496995] dark:text-[#A5B5D2] mt-0.5">
              Perbandingan penerimaan kas tunai dengan pembayaran QRIS digital
            </p>
          </div>

          {/* Visual Dual Progress Bar */}
          <div className="space-y-4 my-auto">
            <div className="h-4 w-full bg-slate-100 dark:bg-[#1E3156]/60 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-[#1E3156] transition-all duration-500"
                style={{ width: `${stats.cashPercent}%` }}
                title={`Tunai: ${stats.cashPercent}%`}
              />
              <div
                className="bg-[#496995] transition-all duration-500"
                style={{ width: `${stats.qrisPercent}%` }}
                title={`QRIS: ${stats.qrisPercent}%`}
              />
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#B0CBE6]/20 border border-[#B0CBE6]/40 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E3156]" />
                    <span className="text-xs font-bold text-[#1E3156] dark:text-[#B0CBE6]">
                      Tunai ({stats.cashPercent}%)
                    </span>
                  </div>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                    {formatRupiah(stats.cashRevenue)}
                  </p>
                  <span className="text-[10px] text-[#496995] dark:text-[#A5B5D2] block mt-0.5">
                    {stats.cashCount} transaksi tunai di laci
                  </span>
                </div>
                <IconCashNotes className="w-6 h-6 flex-shrink-0 mt-0.5 opacity-90" />
              </div>

              <div className="p-3 rounded-lg bg-[#496995]/15 border border-[#496995]/30 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#496995]" />
                    <span className="text-xs font-bold text-[#496995] dark:text-[#A5B5D2]">
                      QRIS ({stats.qrisPercent}%)
                    </span>
                  </div>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-1.5">
                    {formatRupiah(stats.qrisRevenue)}
                  </p>
                  <span className="text-[10px] text-[#496995] dark:text-[#A5B5D2] block mt-0.5">
                    {stats.qrisCount} transaksi transfer
                  </span>
                </div>
                <IconQrisBadge className="w-6 h-6 flex-shrink-0 mt-0.5 opacity-90" />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#496995] dark:text-[#A5B5D2] bg-slate-50 dark:bg-[#1E3156]/40 p-2.5 rounded-lg border border-[#A5B5D2]/30 dark:border-[#2b3f5c]">
            Penghitungan riil berdasarkan data transaksi kasir yang tersimpan di sistem toko.
          </div>
        </div>
      </div>

      {/* 4. Category Breakdown & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Distribusi Omzet per Kategori */}
        <div className="lg:col-span-6 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs p-5 rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#1E3156] dark:text-white">
              Distribusi Omzet per Kategori
            </h2>
            <p className="text-xs text-[#496995] dark:text-[#A5B5D2] mt-0.5">
              Kontribusi penjualan berdasarkan 4 kelompok barang toko
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {categoryStats.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color.bg}`} />
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#496995] dark:text-[#A5B5D2]">({item.qty} item)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#1E3156] dark:text-[#B0CBE6]">
                      {formatRupiah(item.revenue)}
                    </span>
                    <span className="text-xs font-bold text-[#496995] dark:text-[#A5B5D2] min-w-[36px] text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-100 dark:bg-[#1E3156]/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(item.percentage, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Produk Terlaris (Top Selling Items) */}
        <div className="lg:col-span-6 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs p-5 rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#1E3156] dark:text-white">
                5 Produk Terlaris (Top Performers)
              </h2>
              <p className="text-xs text-[#496995] dark:text-[#A5B5D2] mt-0.5">
                Barang dengan kontribusi pendapatan tertinggi
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2]">Berdasarkan Omzet</span>
          </div>

          {topProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#496995] dark:text-[#A5B5D2]">
              Belum ada penjualan tercatat untuk menentukan produk terlaris.
            </div>
          ) : (
            <div className="divide-y divide-[#A5B5D2]/20 dark:divide-[#2b3f5c]">
              {topProducts.map((prod, index) => (
                <div key={prod.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-[#496995] dark:text-[#A5B5D2] w-4 text-center">
                      #{index + 1}
                    </span>
                    <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#A5B5D2]/30 dark:border-[#2b3f5c] bg-slate-100 dark:bg-[#1E3156]/50 flex-shrink-0">
                      <ProductImage
                        src={prod.image}
                        name={prod.name}
                        category={prod.category as any}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-[#496995] dark:text-[#A5B5D2] block truncate">
                        {prod.category} &bull; {prod.totalQty} terjual
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold font-mono text-[#1E3156] dark:text-[#B0CBE6] block">
                      {formatRupiah(prod.totalRevenue)}
                    </span>
                    <span className="text-[10px] text-[#496995] dark:text-[#A5B5D2]">Total Omzet</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. Makassar Restock Alert Box */}
      {stats.lowStockItems.length > 0 && (
        <section
          aria-labelledby="restock-center-heading"
          className="p-5 bg-[#FDD6CD]/30 dark:bg-[#FDD6CD]/10 border border-[#FDD6CD] dark:border-[#FDD6CD]/30 rounded-xl space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-[#FDD6CD]/70 dark:bg-[#FDD6CD]/20 text-[#6E2215] dark:text-[#FDD6CD] flex-shrink-0">
                <IconAlertBell className="w-5 h-5" />
              </div>
              <div>
                <h2 id="restock-center-heading" className="text-sm font-bold text-[#6E2215] dark:text-[#FDD6CD]">
                  Daftar Kritis: {stats.lowStockItems.length} Barang Perlu Kulakan dari Makassar Segera
                </h2>
                <p className="text-xs text-[#7A271A] dark:text-[#FDD6CD]/80 mt-0.5">
                  Barang berikut telah mencapai atau di bawah batas minimum dan berisiko habis jika tidak segera dipesan:
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyRestockList}
              className="min-h-[44px] px-3.5 py-2 bg-[#FDD6CD] hover:bg-[#fcd0c5] active:bg-[#fbc4b7] text-[#6E2215] rounded-lg text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5 self-start sm:self-auto border border-[#FDD6CD]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{copiedAlert ? 'Format Pesanan Tersalin!' : 'Salin Format Pesanan WA'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {stats.lowStockItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white/90 dark:bg-[#1E3156] rounded-lg border border-[#FDD6CD]/60 shadow-xs flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#A5B5D2]/30 dark:border-[#2b3f5c] bg-slate-100 dark:bg-[#132039] flex-shrink-0">
                  <ProductImage
                    src={item.image}
                    name={item.name}
                    category={item.category}
                    className="w-full h-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-2 text-[11px] mt-0.5">
                    <span className="font-bold text-[#6E2215] dark:text-[#FDD6CD]">
                      Sisa: {item.stock}
                    </span>
                    <span className="text-[#A5B5D2]">&bull;</span>
                    <span className="text-[#496995] dark:text-[#A5B5D2]">
                      Min: {item.min_stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
