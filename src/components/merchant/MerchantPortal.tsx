import React from 'react';
import { useApp } from '../../context';
import { formatRupiah } from '../../utils/formatters';
import { SixStateWrapper } from '../common/SixStateWrapper';
import { 
  Store, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const MerchantPortal: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    forcedGlobalState, 
    updateBookingStatus, 
    showToast 
  } = useApp();

  // RBAC check: Requires 'penjual' or 'admin'
  const isAuthorized = currentUser?.role === 'penjual' || currentUser?.role === 'admin';

  let effectiveState = forcedGlobalState || (!isAuthorized ? 'forbidden' : 'default');

  const handlePackAndCallCourier = (orderId: string) => {
    showToast(`Paket ${orderId} siap! Menghubungi kurir motor terdekat di radius SCBD...`);
  };

  return (
    <section className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-700">
          <Store className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Portal Mitra Penjual (Merchant Hub)
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Manajemen Pesanan Masuk & Dispatch Kurir Toko
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Kemas produk pesanan pembeli dan panggil kurir on-demand langsung dari konsol operasional toko Anda.
        </p>
      </div>

      <SixStateWrapper
        state={effectiveState}
        forbiddenRoleNeeded="Mitra Penjual (Merchant) atau Super Admin"
        currentRole={currentUser?.role}
      >
        <div className="space-y-6">
          
          {/* Merchant Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Pendapatan Hari Ini</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {formatRupiah(14250000)}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-1">+18% dari minggu lalu</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Pesanan Menunggu Dikemas</span>
              <span className="text-lg font-bold text-amber-600 font-mono tabular-nums">
                2 Pesanan
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Siap panggil kurir</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Rating Kepuasan Toko</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                4.9 / 5.0
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Berdasarkan 526 ulasan</span>
            </div>
          </div>

          {/* Incoming Orders List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daftar Pesanan Siap Kirim
              </h3>
              <span className="text-xs text-slate-500">{orders.length} pesanan aktif</span>
            </div>

            <div className="divide-y divide-slate-100">
              {orders.map((order) => (
                <div key={order.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-slate-900">{order.orderNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800">
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Pembeli: <strong className="text-slate-900">{order.shippingAddress.recipientName}</strong> ({order.shippingAddress.phone})
                    </div>
                    
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.shippingAddress.street}, {order.shippingAddress.city}</span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium">
                      Barang: {order.items.map((it) => `${it.product.title} (${it.quantity}x)`).join(', ')}
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block">Total Transaksi:</span>
                      <span className="text-sm font-bold font-mono text-slate-900">{formatRupiah(order.totalAmount)}</span>
                    </div>

                    <button
                      onClick={() => handlePackAndCallCourier(order.orderNumber)}
                      className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Kemas & Panggil Kurir Terdekat</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </SixStateWrapper>

    </section>
  );
};
