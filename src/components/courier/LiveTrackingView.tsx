import React, { useState, useEffect } from 'react';
import { useApp } from '../../context';
import { formatRupiah, formatPhoneID } from '../../utils/formatters';
import { SixStateWrapper } from '../common/SixStateWrapper';
import { 
  Navigation, 
  MapPin, 
  Truck, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  User, 
  Star, 
  ShieldCheck,
  ChevronRight,
  RotateCw
} from 'lucide-react';
import { CourierBooking } from '../../types';
import { GoogleMapView } from '../common/GoogleMapView';

export const LiveTrackingView: React.FC = () => {
  const { 
    bookings, 
    orders, 
    activeTrackingBooking, 
    setActiveTrackingBooking, 
    updateBookingStatus, 
    setReviewTargetOrder, 
    forcedGlobalState, 
    currentUser, 
    showToast 
  } = useApp();

  const activeBooking = activeTrackingBooking || bookings[0];

  // Dynamic simulation of courier position along the route (0% to 100%)
  const [courierProgress, setCourierProgress] = useState(65);

  useEffect(() => {
    const timer = setInterval(() => {
      setCourierProgress((prev) => (prev >= 90 ? 40 : prev + 5));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { id: 'mencari_kurir', label: '1. Mencari Kurir Terdekat', desc: 'Sistem mencocokkan mitra di radius 3 km' },
    { id: 'kurir_menuju_lokasi', label: '2. Kurir Menuju Titik Jemput', desc: 'Driver menuju toko/pengirim' },
    { id: 'barang_diambil', label: '3. Barang Diambil di Toko', desc: 'Verifikasi fisik & kode QR' },
    { id: 'dalam_pengantaran', label: '4. Dalam Pengantaran', desc: 'Kurir sedang dalam perjalanan ke alamat' },
    { id: 'selesai', label: '5. Paket Selesai Diterima', desc: 'Serah terima terverifikasi OTP' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.id === activeBooking?.status);

  const handleSimulateNextStep = () => {
    if (!activeBooking) return;
    const nextIdx = Math.min(steps.length - 1, currentStepIdx + 1);
    const nextStatus = steps[nextIdx].id as CourierBooking['status'];
    updateBookingStatus(activeBooking.id, nextStatus);
    showToast(`Status diperbarui ke: ${steps[nextIdx].label}`);

    if (nextStatus === 'selesai') {
      const targetOrder = orders.find((o) => o.courierTrackingNumber === activeBooking.trackingNumber) || orders[0];
      if (targetOrder) {
        setReviewTargetOrder(targetOrder);
      }
    }
  };

  const handleConfirmReceipt = () => {
    if (!activeBooking) return;
    updateBookingStatus(activeBooking.id, 'selesai');
    const targetOrder = orders.find((o) => o.courierTrackingNumber === activeBooking.trackingNumber) || orders[0];
    if (targetOrder) {
      setReviewTargetOrder(targetOrder);
    }
    showToast('Penerimaan paket berhasil dikonfirmasi! Silakan berikan ulasan Toko & Kurir.');
  };

  const effectiveState = forcedGlobalState || (bookings.length === 0 ? 'empty' : 'default');

  return (
    <section className="space-y-6">
      
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
        <div className="flex items-center gap-2 text-emerald-700">
          <Navigation className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Pelacakan Kurir Real-Time GPS
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Status & Live Tracking Pengiriman
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Pantau pergerakan armada on-demand dan status bertahap penjemputan barang hingga ke tangan Anda.
        </p>
      </div>

      <SixStateWrapper
        state={effectiveState}
        loadingSkeletonType="table"
        emptyTitle="Belum Ada Riwayat Pengiriman Aktif"
        emptyDescription="Anda belum memiliki pesanan pengantaran kurir yang sedang berjalan saat ini."
        currentRole={currentUser?.role}
      >
        {activeBooking && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: Live Interactive Tracking Canvas Map (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Active Tracking Bar */}
              <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">NOMOR RESI PELACAKAN:</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      {activeBooking.trackingNumber}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">ESTIMASI TIBA:</span>
                    <span className="text-xs font-bold font-mono text-white">
                      {activeBooking.estimatedArrival}
                    </span>
                  </div>
                </div>

                {/* Real Live Interactive Google Map with Route & Moving Courier Marker */}
                <div className="p-2 bg-slate-950">
                  {(() => {
                    const startLat = activeBooking.senderCoordinates?.lat ?? -6.2255;
                    const startLng = activeBooking.senderCoordinates?.lng ?? 106.8099;
                    const endLat = activeBooking.recipientCoordinates?.lat ?? -6.2378;
                    const endLng = activeBooking.recipientCoordinates?.lng ?? 106.8532;
                    const cLat = startLat + (endLat - startLat) * (courierProgress / 100);
                    const cLng = startLng + (endLng - startLng) * (courierProgress / 100);

                    return (
                      <GoogleMapView
                        center={{ lat: cLat, lng: cLng }}
                        zoom={13}
                        height="320px"
                        originPin={{
                          lat: startLat,
                          lng: startLng,
                          label: activeBooking.senderName,
                          badge: 'Toko (A)',
                        }}
                        destinationPin={{
                          lat: endLat,
                          lng: endLng,
                          label: activeBooking.recipientName,
                          badge: 'Tujuan (B)',
                        }}
                        courierPin={{
                          lat: cLat,
                          lng: cLng,
                          plateNumber: activeBooking.driver?.plateNumber || 'B 4821 KTF',
                          label: activeBooking.driver?.name || 'Kurir On-Delivery',
                        }}
                        showRoute={true}
                      />
                    );
                  })()}
                </div>

                {/* Map Control Bar */}
                <div className="p-3 bg-slate-800/80 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Jarak Tempuh: <strong className="text-white font-mono">{activeBooking.distanceKm} km</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSimulateNextStep}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Simulasikan Status Maju</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Courier Driver Card */}
              {activeBooking.driver && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeBooking.driver.avatar}
                      alt={activeBooking.driver.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900">{activeBooking.driver.name}</h4>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                          Mitra Prioritas
                        </span>
                      </div>
                      <p className="text-xs font-mono font-medium text-slate-600">{activeBooking.driver.plateNumber}</p>
                      <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold pt-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{activeBooking.driver.rating}</span>
                        <span className="text-slate-400 font-normal">(1.4k pengantaran sukses)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => showToast(`Menghubungi Mitra Kurir ${activeBooking.driver?.name} via WhatsApp...`)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat Kurir</span>
                    </button>
                    <button
                      onClick={() => showToast(`Melakukan panggilan telepon suara ke ${activeBooking.driver?.phone}...`)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Telepon</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT: Step-by-Step Delivery Timeline & Final Action (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Stepper Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Alur Progres Pengiriman
                </h3>

                <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {steps.map((step, idx) => {
                    const isDone = idx < currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step.id} className="relative flex items-start gap-3 pl-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-colors ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-slate-900 text-white ring-4 ring-emerald-100'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-emerald-800' : 'text-slate-900'}`}>
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Final receipt confirm button */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {activeBooking.status === 'selesai' ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 font-semibold">
                      ✓ Pengantaran Selesai & Diterima dengan Baik
                    </div>
                  ) : (
                    <button
                      onClick={handleConfirmReceipt}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Konfirmasi Barang Telah Diterima</span>
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400 text-center">
                    Konfirmasi penerimaan akan mencairkan saldo escrow ke pihak penjual dan mitra driver.
                  </p>
                </div>
              </div>

              {/* Order Info Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Informasi Paket
                </span>
                <div className="text-slate-600">
                  Isi Barang: <strong className="text-slate-900">{activeBooking.itemDescription}</strong>
                </div>
                <div className="text-slate-600">
                  Total Biaya Pengiriman: <strong className="text-slate-900 font-mono">{formatRupiah(activeBooking.totalCost)}</strong>
                </div>
                <div className="text-slate-600">
                  Alamat Pengantaran: <p className="text-slate-700 mt-0.5">{activeBooking.recipientAddress}</p>
                </div>
              </div>

            </div>

          </div>
        )}
      </SixStateWrapper>

    </section>
  );
};
