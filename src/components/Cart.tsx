import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/format';

interface CartProps {
  items: CartItem[];
  onUpdateQty: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (method: 'Tunai' | 'QRIS', cashTendered?: number, change?: number) => void;
}

export const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isQrisModalOpen, setIsQrisModalOpen] = useState(false);
  const [cashInput, setCashInput] = useState<string>('');

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.qty, 0);

  const tenderedNumber = parseFloat(cashInput) || 0;
  const changeAmount = tenderedNumber - totalAmount;
  const isCashSufficient = tenderedNumber >= totalAmount;

  const handleOpenCashModal = () => {
    setCashInput(totalAmount.toString());
    setIsCashModalOpen(true);
  };

  const handleConfirmCashCheckout = () => {
    if (!isCashSufficient) return;
    onCheckout('Tunai', tenderedNumber, changeAmount);
    setIsCashModalOpen(false);
    setCashInput('');
  };

  const handleConfirmQrisCheckout = () => {
    onCheckout('QRIS');
    setIsQrisModalOpen(false);
  };

  return (
    <aside
      className="bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs rounded-xl border border-[#A5B5D2]/35 dark:border-[#2b3f5c] shadow-xs flex flex-col h-full overflow-hidden transition-colors duration-150"
      aria-label="Keranjang Kasir"
    >
      {/* Header Cart */}
      <div className="p-4 border-b border-[#A5B5D2]/30 dark:border-[#2b3f5c] bg-[#B0CBE6]/15 dark:bg-[#1E3156]/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-[#1E3156] dark:text-[#B0CBE6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-sm font-bold text-[#1E3156] dark:text-white">
            Keranjang ({totalItemsCount})
          </h2>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-[#7A271A] dark:text-[#FDD6CD] hover:text-[#541c15] dark:hover:text-white font-medium px-2 py-1 rounded hover:bg-[#FDD6CD]/30 dark:hover:bg-[#FDD6CD]/10 transition"
          >
            Kosongkan
          </button>
        )}
      </div>

      {/* Item List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {items.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            <svg className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Keranjang Masih Kosong</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Klik barang pada katalog untuk memasukkan pesanan kasir.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isMaxStock = item.qty >= item.stock;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <div className="flex-1 pr-2 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 mt-0.5">
                    <span>{formatRupiah(item.price)}</span>
                    <span>&times;</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.qty}</span>
                    <span>=</span>
                    <span className="font-extrabold text-[#7A271A] dark:text-[#FDD6CD]">
                      {formatRupiah(item.price * item.qty)}
                    </span>
                  </div>
                  {isMaxStock && item.stock < 9999 && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 block mt-0.5">
                      Maksimal stok tercapai ({item.stock})
                    </span>
                  )}
                </div>

                {/* Qty Controls */}
                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.id, item.qty - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs shadow-xs transition"
                    aria-label={`Kurangi ${item.name}`}
                  >
                    -
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                    {item.qty}
                  </span>
                  <button
                    type="button"
                    disabled={isMaxStock}
                    onClick={() => onUpdateQty(item.id, item.qty + 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md border text-xs font-bold shadow-xs transition ${
                      isMaxStock
                        ? 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                        : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    aria-label={`Tambah ${item.name}`}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="w-7 h-7 ml-1 flex items-center justify-center rounded-md text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
                    title={`Hapus ${item.name}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary & Action Buttons */}
      <div className="p-4 bg-slate-50/70 dark:bg-[#1E3156]/30 border-t border-[#A5B5D2]/30 dark:border-[#2b3f5c] space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#496995] dark:text-[#A5B5D2]">
            <span>Jumlah Item</span>
            <span>{totalItemsCount} item</span>
          </div>
          <div className="flex justify-between items-baseline pt-1 border-t border-[#A5B5D2]/25 dark:border-[#2b3f5c]">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total Tagihan</span>
            <span className="text-xl font-black text-[#1E3156] dark:text-[#B0CBE6]">
              {formatRupiah(totalAmount)}
            </span>
          </div>
        </div>

        {/* Large Checkout Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            disabled={items.length === 0}
            onClick={handleOpenCashModal}
            className={`min-h-[44px] py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition ${
              items.length === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-[#1E3156] hover:bg-[#2b3f5c] active:bg-[#14213d] text-white active:scale-95'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Bayar Tunai</span>
          </button>

          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setIsQrisModalOpen(true)}
            className={`min-h-[44px] py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition ${
              items.length === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-[#496995] hover:bg-[#3a5477] active:bg-[#2b3f5c] text-white active:scale-95'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span>Bayar QRIS</span>
          </button>
        </div>
      </div>

      {/* Modal Checkout Tunai */}
      {isCashModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-tunai-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsCashModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 id="modal-tunai-title" className="text-base font-bold text-slate-900 dark:text-white">
                Pembayaran Tunai (Cash)
              </h3>
              <button
                type="button"
                onClick={() => setIsCashModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Tutup dialog"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-0.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Yang Harus Dibayar</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{formatRupiah(totalAmount)}</p>
            </div>

            <div>
              <label htmlFor="cash-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Uang Diterima dari Pelanggan (Rp)
              </label>
              <input
                id="cash-input"
                type="number"
                min={totalAmount}
                value={cashInput}
                onChange={(e) => setCashInput(e.target.value)}
                autoFocus
                className="w-full text-lg font-bold p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Quick cash denomination buttons */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nominal Cepat:</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setCashInput(totalAmount.toString())}
                  className="min-h-[38px] py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  Uang Pas
                </button>
                <button
                  type="button"
                  onClick={() => setCashInput('50000')}
                  className="min-h-[38px] py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  50.000
                </button>
                <button
                  type="button"
                  onClick={() => setCashInput('100000')}
                  className="min-h-[38px] py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  100.000
                </button>
                <button
                  type="button"
                  onClick={() => setCashInput('200000')}
                  className="min-h-[38px] py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition"
                >
                  200.000
                </button>
              </div>
            </div>

            {/* Change calculation */}
            <div className={`p-3.5 rounded-xl border ${isCashSufficient ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'}`}>
              <div className="flex justify-between items-center">
                <span className={`text-xs font-semibold ${isCashSufficient ? 'text-emerald-800 dark:text-emerald-300' : 'text-red-800 dark:text-red-300'}`}>
                  {isCashSufficient ? 'Kembalian:' : 'Uang Kurang:'}
                </span>
                <span className={`text-xl font-black ${isCashSufficient ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                  {formatRupiah(Math.abs(changeAmount))}
                </span>
              </div>
            </div>

            <div className="pt-2 flex space-x-2.5">
              <button
                type="button"
                onClick={() => setIsCashModalOpen(false)}
                className="min-h-[44px] w-1/2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={!isCashSufficient}
                onClick={handleConfirmCashCheckout}
                className={`min-h-[44px] w-1/2 rounded-lg text-xs font-bold text-white transition ${
                  isCashSufficient
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                    : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed'
                }`}
              >
                Selesaikan Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QRIS */}
      {isQrisModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-qris-title"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsQrisModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 id="modal-qris-title" className="text-base font-bold text-slate-900 dark:text-white">
                Pembayaran QRIS
              </h3>
              <button
                type="button"
                onClick={() => setIsQrisModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Tutup dialog"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Tagihan</span>
              <p className="text-2xl font-black text-[#1E3156] dark:text-[#FDD6CD]">{formatRupiah(totalAmount)}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">Merchant: Toko Aneka Usaha</p>
            </div>

            {/* QR Pattern */}
            <div className="flex justify-center my-3">
              <div className="p-3 bg-white rounded-xl shadow-inner inline-block border border-slate-200">
                <svg className="w-40 h-40 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="25" height="25" rx="3" />
                  <rect x="9" y="9" width="17" height="17" fill="white" />
                  <rect x="13" y="13" width="9" height="9" />

                  <rect x="70" y="5" width="25" height="25" rx="3" />
                  <rect x="74" y="9" width="17" height="17" fill="white" />
                  <rect x="78" y="13" width="9" height="9" />

                  <rect x="5" y="70" width="25" height="25" rx="3" />
                  <rect x="9" y="74" width="17" height="17" fill="white" />
                  <rect x="13" y="78" width="9" height="9" />

                  <rect x="35" y="10" width="6" height="6" />
                  <rect x="45" y="15" width="8" height="6" />
                  <rect x="55" y="10" width="6" height="8" />
                  <rect x="35" y="25" width="12" height="6" />
                  <rect x="10" y="38" width="14" height="6" />
                  <rect x="30" y="38" width="6" height="8" />
                  <rect x="40" y="42" width="20" height="6" />
                  <rect x="65" y="38" width="10" height="6" />
                  <rect x="80" y="42" width="10" height="8" />
                  <rect x="10" y="52" width="8" height="10" />
                  <rect x="25" y="55" width="14" height="6" />
                  <rect x="45" y="55" width="10" height="12" />
                  <rect x="60" y="52" width="12" height="6" />
                  <rect x="78" y="55" width="12" height="8" />
                  <rect x="35" y="70" width="8" height="10" />
                  <rect x="50" y="75" width="12" height="6" />
                  <rect x="68" y="70" width="8" height="14" />
                  <rect x="82" y="78" width="8" height="8" />
                  <rect x="40" y="85" width="18" height="6" />
                </svg>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Arahkan aplikasi pembayaran pelanggan ke kode QRIS di atas.
            </p>

            <div className="pt-2 flex space-x-2.5">
              <button
                type="button"
                onClick={() => setIsQrisModalOpen(false)}
                className="min-h-[44px] w-1/2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmQrisCheckout}
                className="min-h-[44px] w-1/2 rounded-lg bg-[#496995] hover:bg-[#3a5477] text-xs font-bold text-white shadow-xs transition"
              >
                Konfirmasi Lunas
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
