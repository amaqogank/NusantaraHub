import React from 'react';
import { useApp } from '../../context';
import { ShoppingBag, Truck, Package, Store, User, BookOpen } from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    cartCount, 
    setIsCartOpen, 
    setIsAuthModalOpen,
    currentUser 
  } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        
        {/* Marketplace */}
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center py-1.5 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'marketplace' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4 mb-0.5" />
          <span>Belanja</span>
        </button>

        {/* Kurir On-Demand */}
        <button
          onClick={() => setActiveTab('courier')}
          className={`flex flex-col items-center py-1.5 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'courier' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Truck className="w-4 h-4 mb-0.5" />
          <span>Kirim Kurir</span>
        </button>

        {/* Riwayat / Live Tracking */}
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center py-1.5 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'orders' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Package className="w-4 h-4 mb-0.5" />
          <span>Pesanan</span>
        </button>

        {/* Panel Mitra */}
        <button
          onClick={() => setActiveTab('merchant_panel')}
          className={`flex flex-col items-center py-1.5 px-2 text-[10px] font-medium transition-colors ${
            activeTab === 'merchant_panel' || activeTab === 'driver_panel' ? 'text-emerald-700 font-bold' : 'text-slate-500'
          }`}
        >
          <Store className="w-4 h-4 mb-0.5" />
          <span>Panel Mitra</span>
        </button>

        {/* Akun */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex flex-col items-center py-1.5 px-2 text-[10px] font-medium text-slate-500 transition-colors"
        >
          <User className="w-4 h-4 mb-0.5" />
          <span className="truncate max-w-[48px]">{currentUser ? currentUser.role : 'Masuk'}</span>
        </button>

      </div>
    </nav>
  );
};
