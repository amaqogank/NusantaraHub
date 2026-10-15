import React, { useState } from 'react';
import { useApp } from '../../context';
import { FLEET_OPTIONS, PRESET_LOCATIONS } from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';
import { calculateDistance, calculateTariff } from '../../app';
import { validateCourierBookingForm } from '../../utils/validation';
import { SixStateWrapper } from '../common/SixStateWrapper';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Info,
  PackageCheck
} from 'lucide-react';
import { FleetType, Coordinates } from '../../types';
import { GoogleMapView } from '../common/GoogleMapView';

export const CourierBookingView: React.FC = () => {
  const { 
    currentUser, 
    createBooking, 
    forcedGlobalState, 
    setActiveTab, 
    showToast,
    userLocation 
  } = useApp();

  // Sender details
  const [senderName, setSenderName] = useState(currentUser?.name || 'Rian Pratama');
  const [senderPhone, setSenderPhone] = useState(currentUser?.phone || '081289123456');
  const [senderAddress, setSenderAddress] = useState(userLocation.label || 'SCBD Sudirman Lot 8, Jakarta Selatan');
  const [senderCoords, setSenderCoords] = useState<Coordinates>({
    label: userLocation.label,
    lat: userLocation.lat,
    lng: userLocation.lng,
  });

  // Recipient details
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientCoords, setRecipientCoords] = useState<Coordinates>(PRESET_LOCATIONS[3]);

  // Parcel details
  const [selectedFleet, setSelectedFleet] = useState<FleetType>('motor_instant');
  const [itemDescription, setItemDescription] = useState('');
  const [weightKg, setWeightKg] = useState<number>(2.0);
  const [isFragile, setIsFragile] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(true);
  const [deliveryNote, setDeliveryNote] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentFleetOption = FLEET_OPTIONS.find((f) => f.id === selectedFleet) || FLEET_OPTIONS[0];

  // Calculate distance
  const distanceKm = calculateDistance(
    senderCoords.lat,
    senderCoords.lng,
    recipientCoords.lat,
    recipientCoords.lng
  );

  // Dynamic tariff
  const baseTariff = calculateTariff(distanceKm, selectedFleet);
  const fragileFee = isFragile ? 3000 : 0;
  const insuranceFee = hasInsurance ? 2000 : 0;
  const totalCost = baseTariff + fragileFee + insuranceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCourierBookingForm({
      senderName,
      senderPhone,
      senderAddress,
      recipientName,
      recipientPhone,
      recipientAddress,
      itemDescription,
      weightKg,
      maxWeightKg: currentFleetOption.maxWeightKg,
      hasPinpointSender: !!senderCoords,
      hasPinpointRecipient: !!recipientCoords,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast('Mohon lengkapi formulir pengiriman kurir.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const trackingNumber = `KURIR-JKT-${Math.floor(10000 + Math.random() * 90000)}`;

      createBooking({
        id: `book-${Date.now()}`,
        trackingNumber,
        senderName,
        senderPhone,
        senderAddress,
        senderCoordinates: senderCoords,
        recipientName,
        recipientPhone,
        recipientAddress,
        recipientCoordinates: recipientCoords,
        fleetType: selectedFleet,
        itemDescription,
        weightKg,
        isFragile,
        hasInsurance,
        deliveryNote,
        distanceKm,
        baseCost: baseTariff,
        serviceCost: fragileFee + insuranceFee,
        totalCost,
        paymentMethod: 'saldo_nusantara',
        status: 'mencari_kurir',
        createdAt: 'Hari ini, Baru saja',
        estimatedArrival: '35 menit lagi',
      });

      setActiveTab('orders');
    }, 700);
  };

  const effectiveState = forcedGlobalState || 'default';

  return (
    <section className="space-y-6">
      
      {/* View Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-700">
          <Truck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Model B: Logistik Kurir On-Demand
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Pesan Kurir On-Demand & Kirim Barang Instan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Kirim paket, dokumen, atau barang dagangan kapan saja dengan kurir motor, van, atau mobil box. Dilengkapi pinpoint GPS dan pelacakan live status.
        </p>
      </div>

      <SixStateWrapper
        state={effectiveState}
        loadingSkeletonType="form"
        errorTitle="Gagal Menghubungkan Layanan Dispatcher Kurir"
        errorMessage="Endpoint kalkulasi tarif kurir /api/v1/courier/estimate tidak merespons."
        forbiddenRoleNeeded="Pembeli, Penjual, atau Admin"
        currentRole={currentUser?.role}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Sender, Recipient & Interactive GPS Pinpoint Map (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Sender Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">A</div>
                <span>Lokasi Penjemputan (Pengirim)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nama Pengirim *</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                  />
                  {errors.senderName && <p className="text-[11px] text-rose-600 mt-0.5">{errors.senderName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nomor HP Pengirim *</label>
                  <input
                    type="text"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                  />
                  {errors.senderPhone && <p className="text-[11px] text-rose-600 mt-0.5">{errors.senderPhone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alamat Lengkap Jemput *</label>
                <textarea
                  rows={2}
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  placeholder="Gedung, lantai, patokan jalan..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                />
                {errors.senderAddress && <p className="text-[11px] text-rose-600 mt-0.5">{errors.senderAddress}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-500">Preset / GPS Koordinat Jemput:</label>
                  <button
                    type="button"
                    onClick={() => {
                      setSenderCoords({
                        label: userLocation.label,
                        lat: userLocation.lat,
                        lng: userLocation.lng,
                      });
                      setSenderAddress(userLocation.label);
                      showToast(`Koordinat jemput diset ke GPS/Lokasi Anda (${userLocation.city})`);
                    }}
                    className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 underline"
                  >
                    <Navigation className="w-3 h-3 text-emerald-600" />
                    <span>Gunakan Lokasi GPS Saya</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSenderCoords({
                        label: userLocation.label,
                        lat: userLocation.lat,
                        lng: userLocation.lng,
                      });
                      setSenderAddress(userLocation.label);
                    }}
                    className={`px-2.5 py-1 text-[11px] rounded border transition-colors flex items-center gap-1 ${
                      senderCoords.lat === userLocation.lat && senderCoords.lng === userLocation.lng
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                        : 'bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <Navigation className="w-3 h-3 text-emerald-600" />
                    <span>GPS HP ({userLocation.city})</span>
                  </button>
                  {PRESET_LOCATIONS.slice(0, 3).map((loc, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSenderCoords(loc)}
                      className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                        senderCoords.label === loc.label
                          ? 'bg-blue-50 text-blue-800 border-blue-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {loc.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">B</div>
                <span>Lokasi Tujuan Antar (Penerima)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nama Penerima *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nama orang yang menerima"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                  />
                  {errors.recipientName && <p className="text-[11px] text-rose-600 mt-0.5">{errors.recipientName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nomor HP Penerima *</label>
                  <input
                    type="text"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                  />
                  {errors.recipientPhone && <p className="text-[11px] text-rose-600 mt-0.5">{errors.recipientPhone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alamat Lengkap Pengantaran *</label>
                <textarea
                  rows={2}
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan lingkungan..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                />
                {errors.recipientAddress && <p className="text-[11px] text-rose-600 mt-0.5">{errors.recipientAddress}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Preset Koordinat Antar:</label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_LOCATIONS.slice(2, 6).map((loc, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setRecipientCoords(loc)}
                      className={`px-2.5 py-1 text-[11px] rounded border transition-colors ${
                        recipientCoords.label === loc.label
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {loc.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Real Interactive Google Map Rute Visualizer */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-700" />
                  <span>Rute Pengantaran di Peta Google</span>
                </span>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded">
                  {distanceKm} KM · Estimasi {Math.round(distanceKm * currentFleetOption.estMinutesPerKm)} Menit
                </span>
              </div>

              <GoogleMapView
                center={{ lat: recipientCoords.lat, lng: recipientCoords.lng }}
                zoom={12}
                height="240px"
                originPin={{
                  lat: senderCoords.lat,
                  lng: senderCoords.lng,
                  label: senderCoords.label,
                  badge: 'Jemput (A)',
                }}
                destinationPin={{
                  lat: recipientCoords.lat,
                  lng: recipientCoords.lng,
                  label: recipientCoords.label,
                  badge: 'Antar (B)',
                }}
                showRoute={true}
                interactive={true}
                onPinpointChange={(coords) => {
                  setRecipientCoords({
                    label: `Titik Peta (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
                    lat: coords.lat,
                    lng: coords.lng,
                  });
                }}
              />

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-blue-600 font-bold block">TITIK A (JEMPUT):</span>
                  <span className="truncate block font-medium text-slate-800">{senderCoords.label}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-emerald-700 font-bold block">TITIK B (ANTAR):</span>
                  <span className="truncate block font-medium text-slate-800">{recipientCoords.label}</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Fleet Choice, Package Detail & Tariff Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Fleet Types */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pilih Jenis Armada
              </h3>

              <div className="space-y-2">
                {FLEET_OPTIONS.map((fleet) => {
                  const isSelected = selectedFleet === fleet.id;
                  const fare = calculateTariff(distanceKm, fleet.id);
                  return (
                    <button
                      type="button"
                      key={fleet.id}
                      onClick={() => setSelectedFleet(fleet.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{fleet.name}</div>
                        <div className="text-[10px] text-slate-500">{fleet.capacityDescription}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-emerald-800 tabular-nums">
                          {formatRupiah(fare)}
                        </div>
                        <div className="text-[10px] text-slate-400">Tarif GPS</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parcel Details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Rincian Barang yang Dikirim
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi Paket *</label>
                <input
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="misal: Dokumen Kontrak, Kue Basah, Baju"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                />
                {errors.itemDescription && <p className="text-[11px] text-rose-600 mt-0.5">{errors.itemDescription}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Perkiraan Berat (kg) *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    max={currentFleetOption.maxWeightKg}
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                  />
                  {errors.weightKg && <p className="text-[11px] text-rose-600 mt-0.5">{errors.weightKg}</p>}
                </div>
                <div className="flex flex-col justify-end text-[11px] text-slate-500 pb-2">
                  <span>Maks armada: {currentFleetOption.maxWeightKg} kg</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFragile}
                    onChange={(e) => setIsFragile(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Barang Pecah Belah / Fragile (+Rp 3.000)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasInsurance}
                    onChange={(e) => setHasInsurance(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Perlindungan Asuransi Pengiriman (+Rp 2.000)</span>
                </label>
              </div>
            </div>

            {/* Total Fare & Dispatch Button */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tarif Dasar ({distanceKm} km):</span>
                  <span className="font-mono tabular-nums">{formatRupiah(baseTariff)}</span>
                </div>
                {isFragile && (
                  <div className="flex justify-between text-slate-600">
                    <span>Proteksi Barang Rentan:</span>
                    <span className="font-mono tabular-nums">{formatRupiah(fragileFee)}</span>
                  </div>
                )}
                {hasInsurance && (
                  <div className="flex justify-between text-slate-600">
                    <span>Premi Asuransi Barang:</span>
                    <span className="font-mono tabular-nums">{formatRupiah(insuranceFee)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Ongkos Kirim:</span>
                  <span className="text-lg font-extrabold text-emerald-700 font-mono tabular-nums">
                    {formatRupiah(totalCost)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Mencari Kurir Terdekat...' : 'Konfirmasi & Panggil Kurir Sekarang'}</span>
              </button>
            </div>

          </div>

        </form>
      </SixStateWrapper>

    </section>
  );
};
