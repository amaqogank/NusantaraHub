import React, { useState } from 'react';
import { useApp } from '../../context';
import { formatRupiah, formatPhoneID } from '../../utils/formatters';
import { calculateDistance, calculateTariff } from '../../app';
import { FLEET_OPTIONS, PRESET_LOCATIONS } from '../../data/mockData';
import { validateCheckoutForm } from '../../utils/validation';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  Navigation, 
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { FleetType } from '../../types';
import { GoogleMapView } from '../common/GoogleMapView';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    currentUser, 
    addOrder, 
    createBooking,
    setActiveTab,
    showToast 
  } = useApp();

  // Form states
  const [recipientName, setRecipientName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [street, setStreet] = useState(currentUser?.address || 'Jl. Senopati No. 42B, Kebayoran Baru');
  const [city, setCity] = useState(currentUser?.city || 'Jakarta Selatan');
  const [postalCode, setPostalCode] = useState('12190');
  const [deliveryNote, setDeliveryNote] = useState('');
  
  // Selected Store Coordinates (default to SCBD Jakarta store)
  const storeCoords = { lat: -6.2255, lng: 106.8099, label: 'Kriya Batik & Kopi Pusaka (SCBD)' };

  // Selected Buyer Coordinates
  const [buyerCoords, setBuyerCoords] = useState(PRESET_LOCATIONS[3]); // Tebet Eco Park / Senopati

  // Fleet selection
  const [selectedFleet, setSelectedFleet] = useState<FleetType>('motor_instant');
  const [paymentMethod, setPaymentMethod] = useState<'Saldo Nusantara' | 'QRIS Dinamis' | 'Transfer VA BCA' | 'COD'>('Saldo Nusantara');

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  // Calculate distance
  const distanceKm = calculateDistance(
    storeCoords.lat,
    storeCoords.lng,
    buyerCoords.lat,
    buyerCoords.lng
  );

  // Calculate shipping cost
  const shippingFee = calculateTariff(distanceKm, selectedFleet);
  const platformFee = 2500;
  const grandTotal = cartSubtotal + shippingFee + platformFee;

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateCheckoutForm({
      recipientName,
      phone,
      street,
      city,
      postalCode,
      paymentMethod,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast('Mohon lengkapi formulir pengiriman dengan benar.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const orderNumber = `TRX-ID-${Date.now().toString().slice(-6)}`;
      const trackingCode = `KURIR-JKT-${Math.floor(10000 + Math.random() * 90000)}`;

      // 1. Add order
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber,
        items: [...cart],
        subtotal: cartSubtotal,
        shippingCost: shippingFee,
        discount: 0,
        totalAmount: grandTotal,
        courierService: selectedFleet === 'motor_instant' ? 'Nusantara Motor Instant' : 'Nusantara Sameday',
        paymentMethod,
        shippingAddress: {
          recipientName,
          phone,
          street,
          city,
          postalCode,
        },
        status: 'dalam_pengiriman' as const,
        courierTrackingNumber: trackingCode,
        createdAt: 'Hari ini, Baru saja',
      };

      addOrder(newOrder);

      // 2. Also register matching courier tracking booking
      createBooking({
        id: `book-${Date.now()}`,
        trackingNumber: trackingCode,
        senderName: 'Dewi Handayani (Toko Pusaka)',
        senderPhone: '081399887766',
        senderAddress: 'Hub Logistik SCBD Sudirman, Jakarta Selatan',
        senderCoordinates: storeCoords,
        recipientName,
        recipientPhone: phone,
        recipientAddress: `${street}, ${city} ${postalCode}`,
        recipientCoordinates: buyerCoords,
        fleetType: selectedFleet,
        itemDescription: `Paket Belanja (${cart.length} item)`,
        weightKg: cart.reduce((acc, c) => acc + (c.product.weightGram / 1000) * c.quantity, 0),
        isFragile: true,
        hasInsurance: true,
        distanceKm,
        baseCost: 12000,
        serviceCost: shippingFee - 12000,
        totalCost: shippingFee,
        paymentMethod: 'saldo_nusantara',
        status: 'kurir_menuju_lokasi',
        driver: {
          id: 'drv-01',
          name: 'Joko Setiawan',
          phone: '081122334455',
          plateNumber: 'B 4821 KTF',
          rating: 4.96,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
        },
        createdAt: 'Baru saja',
        estimatedArrival: '30 menit lagi',
      });

      setIsCheckoutOpen(false);
      setActiveTab('orders');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Checkout & Integrasi Kurir GPS On-Demand
              </h2>
              <p className="text-xs text-slate-500">
                Kalkulasi Tarif Jarak Realtime & Escrow Pembayaran Aman
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body Split */}
        <form onSubmit={handleSubmitCheckout} className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Shipping info & GPS Pinpoint (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* 1. Recipient Identity Form */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>1. Identitas & Alamat Penerima</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nama Penerima *
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nama lengkap penerima"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                    {errors.recipientName && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.recipientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nomor WhatsApp (+62) *
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08123456789"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Alamat Jalan & Nomor Rumah *
                  </label>
                  <textarea
                    rows={2}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Nama jalan, nomor rumah, RT/RW, dan patokan lingkungan..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                  />
                  {errors.street && (
                    <p className="text-[11px] text-rose-600 mt-0.5">{errors.street}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Kota/Wilayah *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Kode Pos (5 Digit) *</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] text-rose-600 mt-0.5">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Interactive GPS Pinpoint Map Simulation */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                    <span>2. Pinpoint Peta Koordinat GPS</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Jarak: {distanceKm} km
                  </span>
                </div>

                {/* Interactive Google Map with Route and Markers */}
                <GoogleMapView
                  center={{ lat: buyerCoords.lat, lng: buyerCoords.lng }}
                  zoom={13}
                  height="210px"
                  originPin={{
                    lat: storeCoords.lat,
                    lng: storeCoords.lng,
                    label: storeCoords.label,
                    badge: 'Toko (A)',
                  }}
                  destinationPin={{
                    lat: buyerCoords.lat,
                    lng: buyerCoords.lng,
                    label: buyerCoords.label,
                    badge: 'Tujuan Antar (B)',
                  }}
                  showRoute={true}
                  interactive={true}
                  onPinpointChange={(coords) => {
                    setBuyerCoords({
                      label: `Pinpoint Peta (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
                      lat: coords.lat,
                      lng: coords.lng,
                    });
                  }}
                />

                {/* Location Presets Selector */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Ganti Pinpoint Titik Pengantaran:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_LOCATIONS.slice(0, 4).map((loc, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setBuyerCoords(loc)}
                        className={`text-left p-2 rounded-lg text-[11px] border transition-colors ${
                          buyerCoords.label === loc.label
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate block">{loc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Fleet Selection */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>3. Armada Kurir On-Demand</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FLEET_OPTIONS.map((fleet) => {
                    const isSelected = selectedFleet === fleet.id;
                    const fare = calculateTariff(distanceKm, fleet.id);
                    return (
                      <button
                        type="button"
                        key={fleet.id}
                        onClick={() => setSelectedFleet(fleet.id)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-500 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{fleet.name}</span>
                          <span className="text-xs font-mono font-bold text-slate-900 tabular-nums">
                            {formatRupiah(fare)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{fleet.capacityDescription}</p>
                        <div className="text-[10px] text-emerald-700 font-medium mt-1">
                          {fleet.tagline}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Payment Method & Financial Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Payment Methods */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                  <span>4. Metode Pembayaran</span>
                </h3>

                <div className="space-y-2">
                  {[
                    { id: 'Saldo Nusantara', desc: `Saldo: ${formatRupiah(currentUser?.balanceRupiah || 1450000)} (Instan)` },
                    { id: 'QRIS Dinamis', desc: 'GoPay, OVO, Dana, ShopeePay, BCA Mobile' },
                    { id: 'Transfer VA BCA', desc: 'Verifikasi Otomatis 24 Jam' },
                    { id: 'COD', desc: 'Bayar Tunai ke Kurir saat Paket Tiba' },
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={isSelected}
                          onChange={() => setPaymentMethod(method.id as any)}
                          className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 block">{method.id}</span>
                          <span className="text-[10px] text-slate-500">{method.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Ringkasan Belanja ({cart.length} Item)
                </h3>

                <div className="space-y-2 text-xs">
                  {cart.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-700">
                      <span className="truncate max-w-[200px]">{c.product.title} (x{c.quantity})</span>
                      <span className="font-mono tabular-nums font-medium">
                        {formatRupiah(c.product.price * c.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal Produk:</span>
                    <span className="font-mono tabular-nums">{formatRupiah(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ongkir Kurir ({distanceKm} km):</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      {formatRupiah(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Biaya Layanan & Asuransi:</span>
                    <span className="font-mono tabular-nums">{formatRupiah(platformFee)}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Total Pembayaran:</span>
                    <span className="text-lg font-extrabold text-emerald-700 font-mono tabular-nums">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Memproses Transaksi...' : 'Bayar & Panggil Kurir Sekarang'}</span>
                </button>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
