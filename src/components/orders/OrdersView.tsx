import React from 'react';
import { useApp } from '../../context';
import { formatRupiah } from '../../utils/formatters';
import { SixStateWrapper } from '../common/SixStateWrapper';
import { 
  Package, 
  Truck, 
  MapPin, 
  Star, 
  ExternalLink, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { 
    orders, 
    bookings, 
    forcedGlobalState, 
    currentUser, 
    setActiveTrackingBooking, 
    setActiveTab, 
    setReviewTargetOrder 
  } = useApp();

  const effectiveState = forcedGlobalState || (orders.length === 0 ? 'empty' : 'default');

  const handleTrackOrder = (trackingNumber?: string) => {
    const matched = bookings.find((b) => b.trackingNumber === trackingNumber) || bookings[0];
    if (matched) {
      setActiveTrackingBooking(matched);
      setActiveTab('orders'); // will show the live tracking tab
    }
  };

  return (
    <section className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-emerald-700">
          <Package className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Riwayat Pesanan & Pengantaran
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Status Pembelian & Kurir Real-Time
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Pantau status pemrosesan toko dan lacak posisi kurir instan Anda di peta.
        </p>
      </div>

      <SixStateWrapper
        state={effectiveState}
        loadingSkeletonType="table"
        emptyTitle="Belum Ada Riwayat Transaksi"
        emptyDescription="Anda belum melakukan pemesanan produk di marketplace."
        emptyActionLabel="Jelajahi Produk Sekarang"
        onEmptyAction={() => setActiveTab('marketplace')}
        currentRole={currentUser?.role}
      >
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500">{order.createdAt}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="font-semibold text-slate-900 line-clamp-1">{item.product.title}</h4>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} barang × {formatRupiah(item.product.price)}
                          {item.selectedVariant && ` · ${item.selectedVariant}`}
                        </p>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-slate-900 tabular-nums">
                      {formatRupiah(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping & Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Layanan: <strong>{order.courierService}</strong></span>
                    {order.courierTrackingNumber && (
                      <span className="font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                        {order.courierTrackingNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Total Biaya: <strong className="text-slate-900 font-mono tabular-nums">{formatRupiah(order.totalAmount)}</strong> (termasuk ongkir {formatRupiah(order.shippingCost)})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {order.courierTrackingNumber && (
                    <button
                      onClick={() => handleTrackOrder(order.courierTrackingNumber)}
                      className="py-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Lacak Posisi Kurir</span>
                    </button>
                  )}

                  <button
                    onClick={() => setReviewTargetOrder(order)}
                    className="py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    <span>Beri Ulasan</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SixStateWrapper>

    </section>
  );
};
