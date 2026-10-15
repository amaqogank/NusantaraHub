import React from 'react';
import { UIState } from '../../types';
import { 
  AlertTriangle, 
  Lock, 
  ShieldAlert, 
  Inbox, 
  RotateCcw, 
  LogIn
} from 'lucide-react';
import { useApp } from '../../context';

interface SixStateWrapperProps {
  state: UIState;
  children: React.ReactNode;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  errorTitle?: string;
  errorMessage?: string;
  errorCode?: string;
  forbiddenRoleNeeded?: string;
  currentRole?: string;
  loadingSkeletonType?: 'card_grid' | 'table' | 'form' | 'detail';
}

export const SixStateWrapper: React.FC<SixStateWrapperProps> = ({
  state,
  children,
  onRetry,
  emptyTitle = 'Data Belum Tersedia',
  emptyDescription = 'Tidak ada rekaman data yang cocok dengan kriteria filter saat ini.',
  emptyActionLabel,
  onEmptyAction,
  errorTitle = 'Gagal Memuat Data Sistem',
  errorMessage = 'Terjadi kendala pada gateway koneksi endpoint API. Silakan coba kembali.',
  errorCode = 'ERR_API_FETCH_500',
  forbiddenRoleNeeded = 'Penjual / Mitra Kurir',
  currentRole,
  loadingSkeletonType = 'card_grid',
}) => {
  const { loginAs } = useApp();

  // 1. LOADING STATE (Skeleton Screens)
  if (state === 'loading') {
    return (
      <div className="w-full space-y-4 py-6" role="status" aria-label="Memuat data">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="h-6 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="h-5 bg-slate-200 rounded w-28 animate-pulse" />
        </div>

        {loadingSkeletonType === 'card_grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                <div className="h-44 bg-slate-200 rounded-md animate-pulse" />
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                <div className="pt-2 flex justify-between items-center">
                  <div className="h-5 bg-slate-200 rounded w-24 animate-pulse" />
                  <div className="h-8 bg-slate-200 rounded w-20 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {loadingSkeletonType === 'table' && (
          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden divide-y divide-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="space-y-2 w-1/3">
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 animate-pulse" />
                </div>
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse" />
                <div className="h-7 bg-slate-200 rounded w-28 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {loadingSkeletonType === 'form' && (
          <div className="border border-slate-200 rounded-lg p-6 bg-white space-y-5">
            <div className="h-5 bg-slate-200 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-10 bg-slate-200 rounded w-full animate-pulse" />
            <div className="h-12 bg-slate-200 rounded w-44 animate-pulse" />
          </div>
        )}
      </div>
    );
  }

  // 2. EMPTY STATE
  if (state === 'empty') {
    return (
      <div className="w-full my-6 py-12 px-6 border border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-xs">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">{emptyTitle}</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md">{emptyDescription}</p>
        {emptyActionLabel && onEmptyAction && (
          <button
            onClick={onEmptyAction}
            className="mt-5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
          >
            {emptyActionLabel}
          </button>
        )}
      </div>
    );
  }

  // 3. ERROR STATE (With Retry Button)
  if (state === 'error') {
    return (
      <div className="w-full my-6 p-6 border border-rose-200 bg-rose-50/70 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-rose-100 border border-rose-200 rounded-lg flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-rose-900">{errorTitle}</h3>
              <span className="text-xs font-mono px-2 py-0.5 bg-rose-200/70 text-rose-800 rounded">
                {errorCode}
              </span>
            </div>
            <p className="text-sm text-rose-700 mt-1">{errorMessage}</p>
            <div className="mt-4 flex items-center gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Coba Muat Ulang (Retry)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. UNAUTHORIZED (401) STATE (Session Expired / Unauthenticated)
  if (state === 'unauthorized') {
    return (
      <div className="w-full my-6 p-8 border border-amber-200 bg-amber-50/60 rounded-xl text-center flex flex-col items-center">
        <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center text-amber-700 mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-amber-950">Autentikasi Diperlukan (HTTP 401)</h3>
        </div>
        <p className="text-sm text-amber-800 mt-1 max-w-md">
          Sesi Anda telah kedaluwarsa atau Anda belum masuk ke sistem NusantaraHub. Silakan lakukan otentikasi akun terpadu untuk melanjutkan.
        </p>
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={() => loginAs('pembeli')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            Masuk sebagai Pembeli (Rian)
          </button>
          <button
            onClick={() => loginAs('penjual')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
          >
            Masuk sebagai Penjual (Dewi)
          </button>
        </div>
      </div>
    );
  }

  // 5. FORBIDDEN (403) STATE (RBAC Insufficient Privileges)
  if (state === 'forbidden') {
    return (
      <div className="w-full my-6 p-8 border border-slate-300 bg-slate-50 rounded-xl">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">Akses Ditolak (HTTP 403 Forbidden)</h3>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                RBAC_UNAUTHORIZED
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Peran akun Anda saat ini <strong>[{currentRole || 'Pembeli'}]</strong> tidak memiliki izin untuk mengakses modul ini.
            </p>
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1">
              <div>
                <span className="text-slate-500 font-medium">Izin yang dibutuhkan: </span>
                <span className="font-semibold text-slate-900">{forbiddenRoleNeeded}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Kebijakan Privilese: </span>
                <span>Role-Based Access Control (RBAC) Tingkat Operasional v1.4</span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Coba beralih peran ke:</span>
              <button
                onClick={() => loginAs('penjual')}
                className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded"
              >
                Penjual (Merchant)
              </button>
              <button
                onClick={() => loginAs('kurir')}
                className="px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded"
              >
                Mitra Kurir (Driver)
              </button>
              <button
                onClick={() => loginAs('admin')}
                className="px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded"
              >
                Super Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. DEFAULT / SUCCESS STATE
  return <>{children}</>;
};
