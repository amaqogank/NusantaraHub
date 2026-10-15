import React, { useEffect, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { AppProvider, useApp } from './context';
import { Header } from './components/common/Header';
import { MobileNavigation } from './components/common/MobileNavigation';
import { StateSimulatorBar } from './components/common/StateSimulatorBar';
import { ArchitectureModal } from './components/common/ArchitectureModal';
import { LocationModal } from './components/common/LocationModal';
import { AuthModal } from './components/auth/AuthModal';
import { BecomePartnerModal } from './components/auth/BecomePartnerModal';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAw9n9R4g8okR29952eyajEIjsUvFuPjFU';

import { ProductCatalog } from './components/marketplace/ProductCatalog';
import { ProductDetailModal } from './components/marketplace/ProductDetailModal';
import { CartModal } from './components/marketplace/CartModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CourierBookingView } from './components/courier/CourierBookingView';
import { LiveTrackingView } from './components/courier/LiveTrackingView';
import { OrdersView } from './components/orders/OrdersView';
import { MerchantPortal } from './components/merchant/MerchantPortal';
import { CourierPortal } from './components/courier/CourierPortal';
import { ReviewModal } from './components/reviews/ReviewModal';

import { 
  Store, 
  Truck, 
  Package, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Check, 
  Info,
  Layers
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    toastMessage, 
    setIsArchitectureModalOpen,
    currentUser 
  } = useApp();

  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Hash SPA Navigation Synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'catalog' || hash === '') {
        setActiveTab('marketplace');
      } else if (hash === 'courier' || hash === 'courier/tasks') {
        if (hash === 'courier/tasks') {
          setActiveTab('driver_panel');
        } else {
          setActiveTab('courier');
        }
      } else if (hash.startsWith('orders') || hash.includes('tracking')) {
        setActiveTab('orders');
      } else if (hash === 'merchant' || hash === 'merchant/orders') {
        setActiveTab('merchant_panel');
      } else if (hash === 'architecture') {
        setIsArchitectureModalOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    if (window.location.hash) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveTab, setIsArchitectureModalOpen]);

  // Sync tab change back to hash
  useEffect(() => {
    let targetHash = 'catalog';
    if (activeTab === 'marketplace') targetHash = 'catalog';
    if (activeTab === 'courier') targetHash = 'courier';
    if (activeTab === 'orders') targetHash = 'orders';
    if (activeTab === 'merchant_panel') targetHash = 'merchant/orders';
    if (activeTab === 'driver_panel') targetHash = 'courier/tasks';
    
    if (window.location.hash.replace('#', '') !== targetHash) {
      window.location.hash = targetHash;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-12">
      
      {/* Google Maps Quota Limit In-App Warning Banner */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Header />

      {/* Sub-Header Tabs for Merchant/Driver Portals */}
      {(activeTab === 'merchant_panel' || activeTab === 'driver_panel') && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 text-xs font-semibold py-2">
            <span className="text-slate-400">Pilih Portal Mitra:</span>
            <button
              onClick={() => setActiveTab('merchant_panel')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'merchant_panel'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Portal Mitra Penjual</span>
            </button>
            <button
              onClick={() => setActiveTab('driver_panel')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'driver_panel'
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Portal Mitra Kurir</span>
            </button>
          </div>
        </div>
      )}

      {/* Orders Sub-Header for Orders vs Live Tracking */}
      {activeTab === 'orders' && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-semibold py-2">
            <span className="text-slate-400 mr-2">Tampilan Pesanan:</span>
            <a
              href="#orders/list"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
            >
              Riwayat Pembelian & Pelacakan Live Kurir
            </a>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'marketplace' && <ProductCatalog />}
        {activeTab === 'courier' && <CourierBookingView />}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <LiveTrackingView />
            <OrdersView />
          </div>
        )}
        {activeTab === 'merchant_panel' && <MerchantPortal />}
        {activeTab === 'driver_panel' && <CourierPortal />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">NusantaraHub</span>
            <span>—</span>
            <span>Platform Terpadu Marketplace & Kurir On-Demand Indonesia</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>SOP & Juknis Arsitektur</span>
            </button>
            <span>© 2026 NusantaraHub</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <ProductDetailModal />
      <CartModal />
      <CheckoutModal />
      <ReviewModal />
      <AuthModal />
      <ArchitectureModal />
      <LocationModal />
      <BecomePartnerModal />

      {/* Developer 6-State Inspector Bar */}
      <StateSimulatorBar />

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Global Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs py-2.5 px-4 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <APIProvider 
      apiKey={GOOGLE_MAPS_API_KEY} 
      language="id" 
      region="ID" 
      libraries={['marker', 'routes']}
    >
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </APIProvider>
  );
}
