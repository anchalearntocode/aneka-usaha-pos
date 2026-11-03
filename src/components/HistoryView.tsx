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
        <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider">
              Total Omzet Penjualan
            </span>
            <p className="text-xl font-black text-[#1E3156] dark:text-white mt-1">
              {formatRupiah(stats.totalRevenue)}
            </p>
            <span className="text-[11px] text-[#496995] dark:text-[#B0CBE6] font-medium">
              {stats.totalTransactions} transaksi tercatat
            </span>
          </div>
          <IconRupiahLedger className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Total Transaksi */}
        <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider">
              Volume Transaksi
            </span>
            <p className="text-xl font-black text-[#1E3156] dark:text-white mt-1">
              {stats.totalTransactions} Nota
            </p>
            <span className="text-[11px] text-[#496995] dark:text-[#A5B5D2] font-medium">
              Status 100% Selesai
            </span>
          </div>
          <IconVolumeCount className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Pembayaran Tunai */}
        <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider">
              Tunai (Cash)
            </span>
            <p className="text-xl font-black text-[#1E3156] dark:text-white mt-1">
              {formatRupiah(stats.cashRevenue)}
            </p>
            <span className="text-[11px] text-[#496995] dark:text-[#A5B5D2] font-medium">
              {stats.cashCount} transaksi tunai
            </span>
          </div>
          <IconCashNotes className="w-10 h-10 flex-shrink-0" />
        </div>

        {/* Pembayaran QRIS */}
        <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider">
              QRIS Digital
            </span>
            <p className="text-xl font-black text-[#1E3156] dark:text-white mt-1">
              {formatRupiah(stats.qrisRevenue)}
            </p>
            <span className="text-[11px] text-[#496995] dark:text-[#A5B5D2] font-medium">
              {stats.qrisCount} transaksi QRIS
            </span>
          </div>
          <IconQrisBadge className="w-10 h-10 flex-shrink-0" />
        </div>
      </section>

      {/* Filter, Search, and Action Bar */}
      <div className="p-4 bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#496995] dark:text-[#A5B5D2]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID transaksi (cth: TRX-948201) atau nama barang..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50/90 dark:bg-[#1E3156]/50 border border-[#A5B5D2]/40 dark:border-[#496995]/40 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-[#496995]/60 dark:placeholder-[#A5B5D2]/60 focus:bg-white dark:focus:bg-[#1E3156] focus:outline-none focus:ring-2 focus:ring-[#496995]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#496995] hover:text-[#1E3156] dark:hover:text-white"
              title="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        {/* Method Filter Buttons and Clear History Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg p-1 bg-[#B0CBE6]/20 dark:bg-[#1E3156]/50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterMethod('all')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md transition ${
                filterMethod === 'all'
                  ? 'bg-[#1E3156] dark:bg-[#496995] text-white shadow-xs font-bold'
                  : 'text-[#496995] dark:text-[#A5B5D2] hover:text-[#1E3156] dark:hover:text-white'
              }`}
            >
              Semua ({sales.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('Tunai')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md transition ${
                filterMethod === 'Tunai'
                  ? 'bg-[#1E3156] text-white shadow-xs font-bold'
                  : 'text-[#496995] dark:text-[#A5B5D2] hover:text-[#1E3156] dark:hover:text-white'
              }`}
            >
              Tunai ({stats.cashCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterMethod('QRIS')}
              className={`min-h-[36px] px-3 py-1.5 rounded-md transition ${
                filterMethod === 'QRIS'
                  ? 'bg-[#496995] text-white shadow-xs font-bold'
                  : 'text-[#496995] dark:text-[#A5B5D2] hover:text-[#496995] dark:hover:text-white'
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
              className="min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold text-[#7A271A] dark:text-[#FDD6CD] hover:bg-[#FDD6CD]/30 dark:hover:bg-[#FDD6CD]/10 border border-[#FDD6CD]/60 shadow-xs transition flex items-center space-x-1.5"
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
      <div className="bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 mx-auto mb-2.5 rounded-full bg-[#B0CBE6]/20 dark:bg-[#1E3156]/50 text-[#496995] dark:text-[#A5B5D2] flex items-center justify-center">
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
            <table className="min-w-full divide-y divide-[#A5B5D2]/25 dark:divide-[#2b3f5c] text-left text-sm">
              <thead className="bg-[#B0CBE6]/15 dark:bg-[#1E3156]/50 text-[#496995] dark:text-[#A5B5D2] font-semibold text-xs uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#A5B5D2]/20 dark:divide-[#2b3f5c]">
                {filteredSales.map((sale) => {
                  const itemCount = sale.items.reduce((acc, it) => acc + it.qty, 0);

                  return (
                    <tr
                      key={sale.id}
                      className="hover:bg-[#B0CBE6]/10 dark:hover:bg-[#496995]/15 transition-colors cursor-pointer"
                      onClick={() => setSelectedSale(sale)}
                    >
                      <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <span className="text-[#1E3156] dark:text-[#B0CBE6] hover:underline">{sale.id}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDateTime(sale.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sale.paymentMethod === 'Tunai' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#B0CBE6]/30 text-[#1E3156] dark:bg-[#1E3156] dark:text-[#B0CBE6]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1E3156] dark:bg-[#B0CBE6]" />
                            Tunai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#496995]/20 text-[#496995] dark:bg-[#496995]/30 dark:text-[#B0CBE6]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#496995] dark:bg-[#B0CBE6]" />
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
