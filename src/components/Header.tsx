import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { User } from '../types';
import {
  IconRegister,
  IconReceiptHistory,
  IconInventoryBox,
  IconDashboard,
  IconSun,
  IconMoon,
} from './Icons';

export type ActiveTabType = 'dashboard' | 'pos' | 'history' | 'inventory';

interface HeaderProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  lowStockCount: number;
  totalSalesCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
  totalSalesCount,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onLogout,
  onResetData,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const isOwner = currentUser?.role === 'owner';

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        new Intl.DateTimeFormat('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }).format(now)
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#132039]/90 backdrop-blur-md border-b border-[#B0CBE6]/70 dark:border-[#2b3f5c] shadow-xs transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <Logo variant="full" />
          </div>

          {/* Center: Modern Segmented Navigation Pill based on Role */}
          <nav
            className="flex items-center bg-[#B0CBE6]/30 dark:bg-[#1E3156]/70 p-1 rounded-xl border border-[#A5B5D2]/40 dark:border-[#496995]/30"
            aria-label="Navigasi Tampilan"
          >
            {/* If Owner: Show Dashboard tab */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 sm:space-x-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1E3156] dark:bg-[#496995] text-white shadow-xs font-bold'
                    : 'text-[#1E3156] dark:text-[#A5B5D2] hover:bg-white/70 dark:hover:text-white'
                }`}
              >
                <IconDashboard className="w-4 h-4 text-[#B0CBE6] dark:text-[#FDD6CD]" />
                <span>Dashboard</span>
              </button>
            )}

            {/* If Cashier: Show Kasir (POS) tab. Hidden completely for Owner */}
            {!isOwner && (
              <button
                type="button"
                onClick={() => setActiveTab('pos')}
                className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 sm:space-x-2 ${
                  activeTab === 'pos'
                    ? 'bg-[#1E3156] dark:bg-[#496995] text-white shadow-xs font-bold'
                    : 'text-[#1E3156] dark:text-[#A5B5D2] hover:bg-white/70 dark:hover:text-white'
                }`}
              >
                <IconRegister className="w-4 h-4 opacity-80" />
                <span>Kasir</span>
              </button>
            )}

            {/* If Owner: Show Inventaris tab */}
            {isOwner && (
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className={`min-h-[44px] relative px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 sm:space-x-2 ${
                  activeTab === 'inventory'
                    ? 'bg-[#1E3156] dark:bg-[#496995] text-white shadow-xs font-bold'
                    : 'text-[#1E3156] dark:text-[#A5B5D2] hover:bg-white/70 dark:hover:text-white'
                }`}
              >
                <IconInventoryBox className="w-4 h-4 opacity-80" />
                <span>Inventaris</span>
                {lowStockCount > 0 && (
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#FDD6CD] ring-2 ring-white dark:ring-[#1E3156]"
                    title={`${lowStockCount} barang perlu restok`}
                  />
                )}
              </button>
            )}

            {/* Both Roles: Riwayat tab */}
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center space-x-1.5 sm:space-x-2 ${
                activeTab === 'history'
                  ? 'bg-[#1E3156] dark:bg-[#496995] text-white shadow-xs font-bold'
                  : 'text-[#1E3156] dark:text-[#A5B5D2] hover:bg-white/70 dark:hover:text-white'
              }`}
            >
              <IconReceiptHistory className="w-4 h-4 opacity-80" />
              <span>Riwayat</span>
              {totalSalesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#B0CBE6]/60 dark:bg-[#14213d] text-[#1E3156] dark:text-[#B0CBE6]">
                  {totalSalesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right: User status, Dark Mode, and Logout */}
          <div className="flex items-center space-x-2">
            {/* Clock */}
            {currentTime && (
              <span className="hidden xl:inline-block text-xs font-mono text-[#496995] dark:text-[#A5B5D2] px-1 font-semibold">
                {currentTime}
              </span>
            )}

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-[#1E3156] dark:text-[#A5B5D2] hover:text-[#1E3156] dark:hover:text-white hover:bg-[#B0CBE6]/30 dark:hover:bg-[#1E3156] transition"
              aria-label={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
              title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDarkMode ? (
                <IconSun className="w-4 h-4 text-amber-400" />
              ) : (
                <IconMoon className="w-4 h-4 text-[#1E3156]" />
              )}
            </button>

            {/* Logged-in User Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-[#B0CBE6]/25 dark:bg-[#1E3156]/90 border border-[#B0CBE6] dark:border-[#496995]/30">
                <span className={`w-2 h-2 rounded-full ${currentUser.avatarColor}`} />
                <div className="text-left leading-none">
                  <span className="text-[11px] font-bold text-[#1E3156] dark:text-white block truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] text-[#496995] dark:text-[#A5B5D2] uppercase tracking-wider font-semibold">
                    {currentUser.role === 'owner' ? 'Owner / Pemilik' : 'Kasir Ritel'}
                  </span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="min-h-[44px] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E3156] dark:text-[#A5B5D2] hover:text-[#7A271A] dark:hover:text-[#FDD6CD] hover:bg-[#FDD6CD]/40 dark:hover:bg-[#FDD6CD]/10 border border-[#B0CBE6] dark:border-[#496995]/30 transition flex items-center space-x-1"
              title="Kunci atau ganti akun kasir/owner"
            >
              <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden md:inline">Keluar</span>
            </button>

            {/* Reset Data Button */}
            <button
              type="button"
              onClick={onResetData}
              className="min-h-[44px] px-2.5 py-1.5 text-[11px] font-medium text-[#A5B5D2] hover:text-[#1E3156] dark:hover:text-white hover:bg-[#B0CBE6]/20 dark:hover:bg-[#1E3156] rounded-lg transition"
              title="Kembalikan data ke kondisi awal"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
