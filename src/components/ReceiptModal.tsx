import React from 'react';
import { createPortal } from 'react-dom';
import { SaleRecord } from '../types';
import { formatRupiah, formatDateTime } from '../utils/format';
import { Logo } from './Logo';

interface ReceiptModalProps {
  sale: SaleRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-slate-900">
        {/* Receipt Header with Official Store Logo */}
        <div className="text-center pb-3 border-b border-dashed border-slate-300">
          <Logo variant="receipt" className="mb-2" />
          <div className="text-[10px] text-slate-500 font-mono mt-2.5 pt-2 border-t border-dotted border-slate-200 space-y-0.5">
            <p>Waktu: {formatDateTime(sale.timestamp)}</p>
            <p>No. Transaksi: {sale.id}</p>
            <p>Kasir: {sale.cashierName || 'Kasir Toko'}</p>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-2 max-h-56 overflow-y-auto text-xs py-1">
          {sale.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1 pr-2">
                <span className="font-semibold text-slate-800 block truncate">
                  {item.name}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {item.qty} &times; {formatRupiah(item.price)}
                </span>
              </div>
              <span className="font-bold text-slate-800">
                {formatRupiah(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals & Payments */}
        <div className="pt-2 border-t border-dashed border-slate-300 space-y-1.5 text-xs">
          <div className="flex justify-between font-bold text-slate-900 text-sm">
            <span>Total Tagihan</span>
            <span>{formatRupiah(sale.total)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Metode Bayar</span>
            <span className="font-bold text-[#496995]">{sale.paymentMethod}</span>
          </div>
          {sale.paymentMethod === 'Tunai' && typeof sale.cashTendered === 'number' && (
            <>
              <div className="flex justify-between text-slate-600">
                <span>Tunai Diterima</span>
                <span>{formatRupiah(sale.cashTendered)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Kembalian</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(sale.change || 0)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center pt-1 border-t border-dotted border-slate-200">
          <p className="text-[10px] text-slate-600 font-medium">
            Terima kasih telah berbelanja di Toko Aneka Usaha!
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5">
            Pappa, Takalar &bull; Barang dapat ditukar jika cacat cetak.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex space-x-2">
          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[44px] w-1/2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center space-x-1.5 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Nota</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] w-1/2 rounded-lg bg-[#1E3156] hover:bg-[#2b3f5c] text-white text-xs font-bold shadow-xs transition"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
