import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Kasir / POS Terminal
export const IconRegister: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M7 8h10M7 11h6" />
    <path d="M2 19h20M6 16v3M18 16v3" />
  </svg>
);

// 2. Riwayat Transaksi / Struk Nota
export const IconReceiptHistory: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2V3z" />
    <path d="M8 7h8M8 11h8M8 15h5" />
  </svg>
);

// 3. Stok & Inventaris / Box
export const IconInventoryBox: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16V8z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

// 4. Dashboard Pemantauan Owner (Analytics chart / graph)
export const IconDashboard: React.FC<IconProps> = ({ className = 'w-4 h-4', size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);

// 5. Omzet Penjualan (Rupiah 'Rp' Ledger Mark)
export const IconRupiahLedger: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="32" height="32" rx="8" className="fill-emerald-500/15 dark:fill-emerald-400/10" />
    <path
      d="M8 8h16a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V10a2 2 0 012-2z"
      stroke="#10b981"
      strokeWidth="1.75"
    />
    <path
      d="M11 13h4a2 2 0 010 4h-4v4m0-8v8M18 17h3a2 2 0 010 4h-3v-4"
      stroke="#10b981"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 6. Volume Transaksi (Nota Count)
export const IconVolumeCount: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="32" height="32" rx="8" className="fill-sky-500/15 dark:fill-sky-400/10" />
    <path
      d="M10 8h12a2 2 0 012 2v14l-3-1.5-3 1.5-3-1.5-3 1.5-2-1V10a2 2 0 012-2z"
      stroke="#0284c7"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 13h4M14 17h4" stroke="#0284c7" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

// 7. Uang Tunai / Cash (Banknotes stack)
export const IconCashNotes: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="32" height="32" rx="8" className="fill-emerald-500/15 dark:fill-emerald-400/10" />
    <rect
      x="7"
      y="11"
      width="18"
      height="11"
      rx="2"
      stroke="#059669"
      strokeWidth="1.75"
    />
    <circle cx="16" cy="16.5" r="2.5" stroke="#059669" strokeWidth="1.5" />
    <path d="M10 14h.01M22 19h.01" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 8. QRIS Digital (Clean QR matrix)
export const IconQrisBadge: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect width="32" height="32" rx="8" className="fill-sky-500/15 dark:fill-sky-400/10" />
    <rect x="8" y="8" width="6" height="6" rx="1" stroke="#0284c7" strokeWidth="1.75" />
    <rect x="18" y="8" width="6" height="6" rx="1" stroke="#0284c7" strokeWidth="1.75" />
    <rect x="8" y="18" width="6" height="6" rx="1" stroke="#0284c7" strokeWidth="1.75" />
    <path d="M18 18h2v2h-2zM22 18h2v4h-4v-2h2zM18 22h2v2h-2z" fill="#0284c7" />
  </svg>
);

// 9. Warning Alert Bell
export const IconAlertBell: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    <circle cx="18" cy="4" r="2" fill="#ef4444" stroke="#ef4444" />
  </svg>
);

// 10. Trending Up
export const IconTrending: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M23 6l-9.5 9.5-5-5L1 18" />
    <path d="M17 6h6v6" />
  </svg>
);

// 11. Sun Mode
export const IconSun: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

// 12. Moon Mode
export const IconMoon: React.FC<IconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
