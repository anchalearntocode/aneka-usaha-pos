import React, { useState, useMemo } from 'react';
import { SaleRecord } from '../types';
import { formatRupiah, formatDateTime } from '../utils/format';
import { ReceiptModal } from './ReceiptModal';
import {
  IconRupiahLedger,
  IconVolumeCount,
  IconCashNotes,
  IconQrisBadge,
} from './Icons';

interface HistoryViewProps {
  sales: SaleRecord[];
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ sales, onClearHistory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState<'all' | 'Tunai' | 'QRIS'>('all');
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);

  // KPI Calculations
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = sales.length;

    const cashSales = sales.filter((s) => s.paymentMethod === 'Tunai');
    const qrisSales = sales.filter((s) => s.paymentMethod === 'QRIS');

    const cashRevenue = cashSales.reduce((sum, s) => sum + s.total, 0);
    const qrisRevenue = qrisSales.reduce((sum, s) => sum + s.total, 0);

    return {
      totalRevenue,
      totalTransactions,
      cashRevenue,
      cashCount: cashSales.length,
      qrisRevenue,
      qrisCount: qrisSales.length,
    };
  }, [sales]);

  // Filtered transactions
  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const matchMethod = filterMethod === 'all' || sale.paymentMethod === filterMethod;
      const term = searchTerm.toLowerCase().trim();

      const matchId = sale.id.toLowerCase().includes(term);
      const matchItems = sale.items.some((item) =>
        item.name.toLowerCase().includes(term)
      );

      return matchMethod && (matchId || matchItems);
    });
  }, [sales, filterMethod, searchTerm]);

  const handleConfirmClear = () => {
    if (sales.length === 0) return;
    if (
      window.confirm(
        'Kosongkan semua riwayat transaksi? Data riwayat penjualan akan dibersihkan menjadi kosong.'
      )
    ) {
      onClearHistory();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 transition-colors duration-150">
      {/* KPI Summary Cards */}
      <section aria-label="Ringkasan Penjualan Kasir" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Omzet */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Omzet Penjualan
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {formatRupiah(stats.totalRevenue)}
            </p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              {stats.totalTransactions} transaksi tercatat
            </span>
          </div>
          <IconRupiahLedger className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Total Transaksi */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Volume Transaksi
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {stats.totalTransactions} Nota
            </p>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Status 100% Selesai
            </span>
          </div>
          <IconVolumeCount className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Pembayaran Tunai */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tunai (Cash)
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {formatRupiah(stats.cashRevenue)}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {stats.cashCount} transaksi tunai
            </span>
          </div>
          <IconCashNotes className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Pembayaran QRIS */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              QRIS Digital
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {formatRupiah(stats.qrisRevenue)}
            </p>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {stats.qrisCount} transaksi QRIS
            </span>
          </div>
          <IconQrisBadge className="w-10 h-10 flex-shrink-0" />
        </div>
      </section>

      {/* Filter, Search, and Action Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID transaksi (cth: TRX-948201) atau nama barang..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Method Filter Buttons and Clear History Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterMethod('all')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md transition ${
                filterMethod === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua ({sales.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('Tunai')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md transition ${
                filterMethod === 'Tunai'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              Tunai ({stats.cashCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('QRIS')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md transition ${
                filterMethod === 'QRIS'
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              QRIS ({stats.qrisCount})
            </button>
          </div>

          {/* Clean / Clear History Button */}
          {sales.length > 0 && (
            <button
              type="button"
              onClick={handleConfirmClear}
              className="min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs transition flex items-center space-x-1.5"
              title="Bersihkan semua data transaksi riwayat"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Bersihkan Riwayat</span>
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Riwayat transaksi kosong</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
              Belum ada transaksi tercatat. Selesaikan transaksi di menu Kasir untuk merekam penjualan baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">ID Transaksi</th>
                  <th scope="col" className="px-6 py-3.5">Waktu</th>
                  <th scope="col" className="px-6 py-3.5">Metode</th>
                  <th scope="col" className="px-6 py-3.5">Kasir</th>
                  <th scope="col" className="px-6 py-3.5">Ringkasan Barang</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Total</th>
                  <th scope="col" className="px-6 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredSales.map((sale) => {
                  const itemCount = sale.items.reduce((acc, it) => acc + it.qty, 0);

                  return (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <span className="text-sky-600 dark:text-sky-400 hover:underline">{sale.id}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDateTime(sale.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sale.paymentMethod === 'Tunai' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Tunai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            QRIS
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {sale.cashierName || 'Kasir'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{itemCount} item: </span>
                        {sale.items.map((i) => `${i.name} (${i.qty})`).join(', ')}
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatRupiah(sale.total)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSale(sale);
                          }}
                          className="min-h-[44px] px-3.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center space-x-1.5 transition"
                          title="Buka struk pembayaran"
                        >
                          <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>Struk</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Detail Struk */}
      <ReceiptModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </div>
  );
};
