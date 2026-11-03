import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark' | 'receipt';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'full', className = '' }) => {
  if (variant === 'mark') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="/logo-aneka-usaha.png"
          alt="Logo Toko Aneka Usaha"
          width="36"
          height="36"
          className="w-9 h-9 rounded-full object-contain bg-white shadow-xs p-0.5 border border-slate-200/80 dark:border-slate-700/80"
        />
      </div>
    );
  }

  if (variant === 'receipt') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src="/logo-aneka-usaha.png"
          alt="Logo Toko Aneka Usaha"
          width="56"
          height="56"
          className="w-14 h-14 rounded-full object-contain mx-auto mb-1.5 p-0.5 bg-white border border-slate-200 shadow-xs"
        />
        <span className="font-extrabold tracking-tight text-base text-slate-900 block leading-tight">
          TOKO ANEKA USAHA
        </span>
        <span className="text-[11px] font-semibold text-slate-600 block mt-0.5">
          Pappa, Takalar
        </span>
        <span className="text-[10px] text-slate-500 font-medium">
          ATK, Percetakan Digital & Fotokopi
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <div className="flex-shrink-0">
        <img
          src="/logo-aneka-usaha.png"
          alt="Logo Toko Aneka Usaha Pappa - Takalar"
          width="40"
          height="40"
          className="w-10 h-10 rounded-full object-contain bg-white shadow-xs p-0.5 border border-slate-200/80 dark:border-slate-700/80"
        />
      </div>
      <div className="leading-tight">
        <div className="flex items-center space-x-1.5">
          <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
            Toko Aneka Usaha
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 uppercase tracking-wide">
            POS
          </span>
        </div>
        <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Pappa, Takalar &bull; Ritel & Cetak
        </span>
      </div>
    </div>
  );
};
