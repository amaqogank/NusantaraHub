import React from 'react';
import { useApp } from '../../context';
import { formatRupiah } from '../../utils/formatters';
import { SixStateWrapper } from '../common/SixStateWrapper';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export const CourierPortal: React.FC = () => {
  const { 
    currentUser, 
    bookings, 
    forcedGlobalState, 
    updateBookingStatus, 
    showToast 
  } = useApp();

  // RBAC check: Requires 'kurir' or 'admin'
  const isAuthorized = currentUser?.role === 'kurir' || currentUser?.role === 'admin';

  let effectiveState = forcedGlobalState || (!isAuthorized ? 'forbidden' : 'default');

  const handleAcceptJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'kurir_menuju_lokasi');
    showToast('Tugas pengantaran diterima! Rute penjemputan aktif.');
  };

  const handlePickUpParcel = (bookingId: string) => {
    updateBookingStatus(bookingId, 'dalam_pengantaran');
    showToast('Paket berhasil diambil dari toko. Mulai pengantaran ke pembeli.');
  };

  const handleCompleteDelivery = (bookingId: string) => {
    updateBookingStatus(bookingId, 'selesai');
    showToast('Pengantaran sukses! Ongkos kirim masuk ke dompet digital Anda.');
  };

  return (
    <section className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-700">
          <Truck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Portal Mitra Kurir On-Duty
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Dasbor Tugas Pengantaran & Pendapatan Driver
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Terima tawaran order baru, navigasikan rute jemput/antar barang, dan perbarui status pengiriman secara berkala.
        </p>
      </div>

      <SixStateWrapper
        state={effectiveState}
        forbiddenRoleNeeded="Mitra Kurir (Driver) atau Super Admin"
        currentRole={currentUser?.role}
      >
        <div className="space-y-6">
          
          {/* Driver Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Pendapatan Hari Ini</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                {formatRupiah(currentUser?.balanceRupiah || 680000)}
              </span>
              <span className="text-[10px] text-emerald-600 block mt-1">6 trip selesai hari ini</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Rating Pengemudi</span>
              <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                4.96 ★
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Mitra Bintang 5</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Kendaraan Terdaftar</span>
              <span className="text-sm font-bold text-slate-900 block truncate">
                {currentUser?.courierVehiclePlate || 'B 4821 KTF (Vario 160)'}
              </span>
              <span className="text-[10px] text-emerald-700 block mt-1">Status: Siap Terima Order</span>
            </div>
          </div>

          {/* Courier Task Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tugas Pengantaran On-Demand Aktif
              </h3>
              <span className="text-xs text-slate-500">{bookings.length} rute terdata</span>
            </div>

            <div className="divide-y divide-slate-100">
              {bookings.map((booking) => {
                const driverEarnings = Math.round(booking.totalCost * 0.85); // 85% untuk mitra driver
                return (
                  <div key={booking.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                    
                    {/* Route Details */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-slate-900">
                          {booking.trackingNumber}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 uppercase">
                          {booking.status}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700">
                          {booking.distanceKm} KM
                        </span>
                      </div>

                      {/* Route Waypoints */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                            A
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">Jemput: </span>
                            <span className="text-slate-600">{booking.senderAddress}</span>
                            <span className="text-slate-400 block text-[11px]">Pengirim: {booking.senderName} ({booking.senderPhone})</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                            B
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">Antar: </span>
                            <span className="text-slate-600">{booking.recipientAddress}</span>
                            <span className="text-slate-400 block text-[11px]">Penerima: {booking.recipientName} ({booking.recipientPhone})</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Isi Paket: <strong className="text-slate-800">{booking.itemDescription}</strong> ({booking.weightKg} kg)
                      </div>
                    </div>

                    {/* Earnings & Actions */}
                    <div className="flex flex-col lg:items-end gap-3 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="lg:text-right">
                        <span className="text-[11px] text-slate-500 block">Pendapatan Bersih Driver:</span>
                        <span className="text-base font-extrabold text-emerald-700 font-mono tabular-nums">
                          {formatRupiah(driverEarnings)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'mencari_kurir' && (
                          <button
                            onClick={() => handleAcceptJob(booking.id)}
                            className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Terima Pengantaran Ini</span>
                          </button>
                        )}

                        {booking.status === 'kurir_menuju_lokasi' && (
                          <button
                            onClick={() => handlePickUpParcel(booking.id)}
                            className="py-2 px-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Tiba di Toko & Ambil Paket</span>
                          </button>
                        )}

                        {booking.status === 'dalam_pengantaran' && (
                          <button
                            onClick={() => handleCompleteDelivery(booking.id)}
                            className="py-2 px-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selesaikan Pengantaran</span>
                          </button>
                        )}

                        {booking.status === 'selesai' && (
                          <span className="py-1.5 px-3 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                            ✓ Tugas Selesai
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </SixStateWrapper>

    </section>
  );
};
