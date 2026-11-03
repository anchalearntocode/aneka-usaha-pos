import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { POS_USERS } from '../data/users';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [selectedUser, setSelectedUser] = useState<User>(POS_USERS[0]);
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      const next = pin + num;
      setPin(next);
      setErrorMsg('');
      if (next.length === 4) {
        verifyPin(next, selectedUser);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (enteredPin: string, user: User) => {
    if (enteredPin === user.pin) {
      onLoginSuccess(user);
    } else {
      setErrorMsg('PIN salah. Silakan coba lagi.');
      setPin('');
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumClick(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, selectedUser]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-100 dark:bg-slate-950 transition-colors duration-150">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition"
          aria-label={isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 animate-page-transition">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <Logo variant="mark" className="mb-2" />
          <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Masuk ke Aneka POS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Toko Aneka Usaha (Pappa, Takalar)
          </p>
        </div>

        {/* User Account Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block text-center">
            Pilih Pengguna Shift:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POS_USERS.map((user) => {
              const isSelected = selectedUser.id === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);
                    setPin('');
                    setErrorMsg('');
                  }}
                  className={`min-h-[44px] p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${user.avatarColor}`} />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {user.role === 'owner' ? 'Owner / Admin' : 'Kasir Ritel'}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PIN Dots Display */}
        <div className="py-2 text-center space-y-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Masukkan PIN 4 Digit:
          </span>
          <div className="flex justify-center items-center space-x-3.5">
            {[0, 1, 2, 3].map((idx) => {
              const filled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                    filled
                      ? 'bg-sky-600 dark:bg-sky-400 scale-110'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              );
            })}
          </div>
          {errorMsg && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 animate-bounce">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Touchscreen Numpad */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumClick(num)}
              className="min-h-[48px] rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-base font-bold text-slate-800 dark:text-slate-100 shadow-xs active:scale-95 transition"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="min-h-[48px] rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-500 dark:text-slate-400 transition"
          >
            Hapus
          </button>
          <button
            type="button"
            onClick={() => handleNumClick('0')}
            className="min-h-[48px] rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-base font-bold text-slate-800 dark:text-slate-100 shadow-xs active:scale-95 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="min-h-[48px] rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center transition"
            aria-label="Hapus satu angka"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H20a2 2 0 012 2v10a2 2 0 01-2 2h-9.172a2 2 0 01-1.414-.586L3 12z" />
            </svg>
          </button>
        </div>

        {/* Demo PIN hints */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
            Petunjuk Demo:
          </span>
          <div className="flex justify-center space-x-2 mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Kasir = <strong>1234</strong>
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              Owner = <strong>9999</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
