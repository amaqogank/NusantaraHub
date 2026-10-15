import React, { useState } from 'react';
import { useApp } from '../../context';
import { 
  ShoppingBag, 
  ChevronDown, 
  User, 
  BookOpen, 
  LogOut, 
  LogIn, 
  SlidersHorizontal,
  MapPin,
  Navigation,
  Wallet
} from 'lucide-react';
import { Role } from '../../types';
import { formatRupiah } from '../../utils/formatters';


export const Header: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    logout, 
    loginAs,
    cartCount, 
    setIsCartOpen, 
    activeTab, 
    setActiveTab,
    setIsArchitectureModalOpen,
    userLocation,
    setIsLocationModalOpen,
    setIsPartnerModalOpen,
    setPartnerUpgradeType,
    isWalletModalOpen,
    setIsWalletModalOpen 
  } = useApp();


  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Zone 1: Single text element wordmark + Quick Location */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('marketplace')}
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>NusantaraHub</span>
          </button>

          {/* Quick Location Badge */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition-colors"
            title="Klik untuk mengubah kota / deteksi GPS"
          >
            {userLocation.isGpsDetected ? (
              <Navigation className="w-3.5 h-3.5 text-emerald-600 shrink-0 animate-pulse" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
            <span className="font-semibold truncate max-w-[100px] sm:max-w-[150px]">{userLocation.city}</span>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-1 py-0.2 rounded hidden xs:inline">
              {userLocation.isGpsDetected ? 'GPS' : 'Pilih'}
            </span>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'marketplace' 
                ? 'text-emerald-700 font-semibold' 
                : 'hover:text-slate-900'
            }`}
          >
            Marketplace
          </button>
          
          <button
            onClick={() => setActiveTab('courier')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'courier' 
                ? 'text-emerald-700 font-semibold' 
                : 'hover:text-slate-900'
            }`}
          >
            Kurir On-Demand
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'orders' 
                ? 'text-emerald-700 font-semibold' 
                : 'hover:text-slate-900'
            }`}
          >
            Riwayat Pesanan
          </button>

          <button
            onClick={() => setActiveTab('merchant_panel')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'merchant_panel' 
                ? 'text-emerald-700 font-semibold' 
                : 'hover:text-slate-900'
            }`}
          >
            Panel Mitra
          </button>

          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Juknis & Dok</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
            <span className="hidden lg:inline text-xs font-semibold text-slate-700">
              Keranjang
            </span>
          </button>

          {/* User & Role Switcher Popover */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-xs font-medium text-slate-800"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="max-w-[100px] truncate hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={() => loginAs('pembeli')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </button>
            )}

            {isRoleDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsRoleDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-3 space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <p className="text-xs font-semibold text-slate-900">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Peran Aktif:</span>
                      <span className="font-semibold text-emerald-700 uppercase">{currentUser?.role}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Simulasi Ganti Peran (RBAC)
                    </p>
                    <div className="space-y-1">
                      {(['pembeli', 'penjual', 'kurir', 'admin'] as Role[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between ${
                            currentUser?.role === r 
                              ? 'bg-emerald-50 text-emerald-800 font-semibold' 
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="capitalize">{r}</span>
                          {currentUser?.role === r && <span className="text-[10px] text-emerald-600">Aktif</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Aktivasi Kemitraan:
                    </p>
                    <button
                      onClick={() => {
                        setPartnerUpgradeType('penjual');
                        setIsPartnerModalOpen(true);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left p-1.5 rounded text-xs text-emerald-800 hover:bg-emerald-50 font-medium flex items-center justify-between transition-colors"
                    >
                      <span>Buka Toko (Pedagang)</span>
                      <span className="text-[10px] text-emerald-600">Daftar</span>
                    </button>
                    <button
                      onClick={() => {
                        setPartnerUpgradeType('kurir');
                        setIsPartnerModalOpen(true);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left p-1.5 rounded text-xs text-blue-800 hover:bg-blue-50 font-medium flex items-center justify-between transition-colors"
                    >
                      <span>Gabung Mitra Kurir</span>
                      <span className="text-[10px] text-blue-600">Daftar</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                    <button
                      onClick={() => {
                        logout();
                        setIsRoleDropdownOpen(false);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout (Uji 401)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
