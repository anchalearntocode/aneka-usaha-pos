import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  return (
    <div className="space-y-3 bg-white/90 dark:bg-[#132039]/90 backdrop-blur-xs p-4 rounded-xl border border-[#A5B5D2]/30 dark:border-[#2b3f5c] shadow-xs transition-colors duration-150">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#496995] dark:text-[#A5B5D2]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama barang atau jasa (HVS, Pulpen, Tinta)..."
          className="w-full pl-9 pr-9 py-2.5 bg-slate-50/90 dark:bg-[#1E3156]/50 border border-[#A5B5D2]/40 dark:border-[#496995]/40 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-[#496995]/60 dark:placeholder-[#A5B5D2]/60 focus:bg-white dark:focus:bg-[#1E3156] focus:outline-none focus:ring-2 focus:ring-[#496995] transition"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#496995] hover:text-[#1E3156] dark:hover:text-white"
            title="Hapus pencarian"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => onSelectCategory('Semua')}
          className={`min-h-[36px] px-3.5 py-1.5 rounded-lg font-medium transition ${
            selectedCategory === 'Semua'
              ? 'bg-[#1E3156] dark:bg-[#496995] text-white font-semibold shadow-xs'
              : 'bg-[#B0CBE6]/20 dark:bg-[#1E3156]/50 text-[#496995] dark:text-[#A5B5D2] hover:bg-[#B0CBE6]/35 dark:hover:bg-[#1E3156]/80'
          }`}
        >
          Semua Produk
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-[#1E3156] dark:bg-[#496995] text-white font-semibold shadow-xs'
                : 'bg-[#B0CBE6]/20 dark:bg-[#1E3156]/50 text-[#496995] dark:text-[#A5B5D2] hover:bg-[#B0CBE6]/35 dark:hover:bg-[#1E3156]/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
