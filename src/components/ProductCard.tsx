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
      className={`group relative flex flex-col justify-between rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 overflow-hidden select-none ${
        isOutOfStock
          ? 'opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 cursor-not-allowed'
          : 'border-slate-200/80 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 hover:shadow-md cursor-pointer'
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
      {/* Product Image Area with Zero Broken Image Risk */}
      <div className="relative w-full h-36 bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-slate-100 dark:border-slate-800">
        <ProductImage
          src={product.image}
          name={product.name}
          category={product.category}
          className="w-full h-full"
        />

        {/* Stock Badge Overlay */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/90 text-white shadow-xs">
              Stok Habis
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              Minim ({product.stock})
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-xs border border-slate-200/60 dark:border-slate-700/60">
              Stok: {product.stock}
            </span>
          )}
        </div>

        {/* Category Pill Overlay */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 dark:bg-slate-950/80 text-white">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          {product.barcode && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
              Kode: {product.barcode}
            </span>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Harga</span>
            <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">
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
                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 hover:bg-sky-600 dark:hover:bg-sky-600 hover:text-white dark:hover:text-white border border-sky-200/80 dark:border-sky-800/80 shadow-xs active:scale-95'
            }`}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <span>+ Tambah</span>
            {cartQty > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[11px] font-black flex items-center justify-center">
                {cartQty}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
