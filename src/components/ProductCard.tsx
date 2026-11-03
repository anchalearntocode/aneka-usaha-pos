import React from 'react';
import { Product } from '../types';
import { formatRupiah } from '../utils/format';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cartQty: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  cartQty,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.min_stock > 0 && product.stock <= product.min_stock && !isOutOfStock;
  const remainingInStock = product.stock - cartQty;
  const isCartFull = remainingInStock <= 0;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl bg-white/95 dark:bg-[#132039]/95 backdrop-blur-xs border transition-all duration-150 overflow-hidden select-none ${
        isOutOfStock
          ? 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 cursor-not-allowed'
          : 'border-[#A5B5D2]/35 dark:border-[#2b3f5c] hover:border-[#496995] dark:hover:border-[#B0CBE6] hover:shadow-md cursor-pointer'
      }`}
      onClick={() => {
        if (!isOutOfStock && !isCartFull) {
          onAddToCart(product);
        }
      }}
      role="button"
      tabIndex={isOutOfStock || isCartFull ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isOutOfStock && !isCartFull) {
          e.preventDefault();
          onAddToCart(product);
        }
      }}
      aria-disabled={isOutOfStock || isCartFull}
      aria-label={`${product.name}, harga ${formatRupiah(product.price)}, sisa stok ${product.stock}`}
    >
      {/* Product Image Area: Clean, Unobstructed, and Free of Clutter */}
      <div className="relative w-full h-36 sm:h-40 bg-slate-100/80 dark:bg-[#101b30] overflow-hidden border-b border-[#A5B5D2]/25 dark:border-[#2b3f5c] flex items-center justify-center">
        <ProductImage
          src={product.image}
          name={product.name}
          category={product.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Out of stock overlay wash */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 shadow-sm">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details: Modern Typographic Meta & Hierarchy */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category & Stock Status */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#496995] dark:text-[#A5B5D2]">
              {product.category}
            </span>

            {product.category === 'Jasa' ? (
              <span className="text-[10px] font-semibold text-[#496995] dark:text-[#A5B5D2]">
                Layanan
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDD6CD] text-[#7A271A] border border-[#FDD6CD] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A271A] animate-pulse" />
                Sisa {product.stock} (Minim)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-[#A5B5D2]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {product.stock} unit
              </span>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#496995] dark:group-hover:text-[#B0CBE6] transition-colors">
            {product.name}
          </h3>
          {product.barcode && (
            <span className="text-[10px] text-[#496995] dark:text-[#A5B5D2] font-mono block mt-0.5">
              Kode: {product.barcode}
            </span>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#2b3f5c] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Harga</span>
            <span className="text-sm font-extrabold text-[#1E3156] dark:text-[#B0CBE6]">
              {formatRupiah(product.price)}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock || isCartFull}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`min-h-[44px] px-3.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition ${
              isOutOfStock || isCartFull
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                : 'bg-[#B0CBE6]/25 dark:bg-[#496995]/30 text-[#1E3156] dark:text-[#B0CBE6] hover:bg-[#496995] dark:hover:bg-[#496995] hover:text-white dark:hover:text-white border border-[#B0CBE6]/60 dark:border-[#496995]/50 shadow-xs active:scale-95'
            }`}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <span>+ Tambah</span>
            {cartQty > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1E3156] dark:bg-[#B0CBE6] text-white dark:text-[#1E3156] text-[11px] font-black flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
