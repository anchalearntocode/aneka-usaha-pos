import React from 'react';

interface ProductIllustrationProps {
  name: string;
  category?: string;
  className?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  name,
  className = 'w-full h-full',
}) => {
  const lower = name.toLowerCase();

  // 1. Kertas HVS
  if (lower.includes('hvs') || lower.includes('kertas')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <rect x="22" y="18" width="36" height="44" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <rect x="26" y="14" width="36" height="44" rx="3" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
          <path d="M34 26H52M34 32H48M34 38H50M34 44H44" stroke="#64748B" strokeWidth="1.75" strokeLinecap="round" />
          <rect x="42" y="46" width="14" height="6" rx="1.5" fill="#0284C7" />
          <text x="49" y="50.5" fill="#FFF" fontSize="3.5" fontWeight="bold" textAnchor="middle">A4</text>
        </svg>
      </div>
    );
  }

  // 2. Tinta Printer
  if (lower.includes('tinta') || lower.includes('epson')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <rect x="30" y="32" width="20" height="32" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <path d="M35 22h10v10H35z" fill="#0284C7" />
          <rect x="37" y="16" width="6" height="6" rx="1.5" fill="#38BDF8" />
          <rect x="34" y="42" width="12" height="14" rx="2" fill="#FFFFFF" />
          <circle cx="40" cy="49" r="3" fill="#0F172A" />
        </svg>
      </div>
    );
  }

  // 3. Pulpen / Alat Tulis
  if (lower.includes('pulpen') || lower.includes('faster') || lower.includes('pen')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <path d="M48 20L56 28L30 54L22 46L48 20Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <path d="M22 46L30 54L20 60L22 46Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="21" cy="59" r="1.5" fill="#0F172A" />
          <path d="M44 24L52 32M49 19L57 27" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 4. Jasa Cetak / Print
  if (lower.includes('cetak') || lower.includes('print')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <rect x="20" y="34" width="40" height="26" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <path d="M28 34V20h24v14" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
          <path d="M26 48h28v18H26z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="52" cy="40" r="1.5" fill="#10B981" />
          <path d="M30 54h14M30 58h20" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 5. Buku Tulis / Notebook
  if (lower.includes('buku') || lower.includes('sinar')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <rect x="22" y="16" width="36" height="48" rx="3" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <path d="M28 16v48" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
          <rect x="34" y="24" width="18" height="12" rx="2" fill="#FFFFFF" />
          <path d="M37 28h12M37 32h8" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 6. Map / Snelhefter
  if (lower.includes('map') || lower.includes('snelhefter')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <path d="M20 24a3 3 0 013-3h14l5 5h18a3 3 0 013 3v28a3 3 0 01-3 3H23a3 3 0 01-3-3V24z" fill="#059669" stroke="#047857" strokeWidth="2" />
          <path d="M20 34h40v24a2 2 0 01-2 2H22a2 2 0 01-2-2V34z" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // 7. Spidol / Marker
  if (lower.includes('spidol') || lower.includes('snowman')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <rect x="34" y="26" width="12" height="38" rx="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <path d="M34 26l3-10h6l3 10H34z" fill="#0F172A" />
          <path d="M37 16l3-4 3 4H37z" fill="#EF4444" />
          <rect x="36" y="38" width="8" height="14" fill="#0F172A" />
        </svg>
      </div>
    );
  }

  // 8. Lakban / Tape
  if (lower.includes('lakban') || lower.includes('tape')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <ellipse cx="40" cy="40" rx="22" ry="16" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="40" cy="40" rx="11" ry="8" fill="#F8FAFC" stroke="#D97706" strokeWidth="2" />
          <ellipse cx="40" cy="40" rx="6" ry="4" fill="#92400E" />
        </svg>
      </div>
    );
  }

  // 9. Penggaris
  if (lower.includes('penggaris') || lower.includes('besi') || lower.includes('ruler')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <rect x="18" y="34" width="44" height="12" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
          <path d="M24 34v5M28 34v3M32 34v5M36 34v3M40 34v5M44 34v3M48 34v5M52 34v3M56 34v5" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 10. Fotokopi
  if (lower.includes('fotokopi') || lower.includes('copy')) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
        <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
          <rect x="22" y="30" width="36" height="34" rx="3" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <rect x="28" y="20" width="24" height="10" rx="2" fill="#94A3B8" />
          <path d="M30 42h20M30 48h14" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="48" cy="56" r="2" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // Fallback General Stationery
  return (
    <div className={`flex items-center justify-center bg-slate-100 dark:bg-slate-800 ${className}`}>
      <svg viewBox="0 0 80 80" className="w-16 h-16" fill="none">
        <rect x="24" y="24" width="32" height="32" rx="4" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
        <path d="M32 34h16M32 40h10M32 46h14" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
