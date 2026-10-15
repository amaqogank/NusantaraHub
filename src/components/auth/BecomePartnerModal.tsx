import React, { useState } from 'react';
import { useApp } from '../../context';
import { X, Store, Truck, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const BecomePartnerModal: React.FC = () => {
  const { 
    isPartnerModalOpen, 
    setIsPartnerModalOpen, 
    partnerUpgradeType, 
    setPartnerUpgradeType, 
    upgradeUserRole, 
    currentUser,
    userLocation,
    showToast 
  } = useApp();

  // Merchant form state
  const [storeName, setStoreName] = useState(
    currentUser?.name ? `Toko ${currentUser.name.split(' ')[0]}` : 'Toko Kriya Nusantara'
  );
  const [storeCategory, setStoreCategory] = useState('kopi-kuliner');
  const [storeCity, setStoreCity] = useState(userLocation.city || 'Jakarta Selatan');
  const [storeAddress, setStoreAddress] = useState(
    currentUser?.address || 'Sentra Niaga Pasar Baru, Blok A2'
  );

  // Courier form state
  const [vehiclePlate, setVehiclePlate] = useState('B 4821 KTF');
  const [vehicleType, setVehicleType] = useState<'motor' | 'van' | 'box'>('motor');
  const [courierCity, setCourierCity] = useState(userLocation.city || 'Jakarta Selatan');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isPartnerModalOpen) return null;

  const handleSubmitMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!storeName.trim() || storeName.trim().length < 3) {
      newErrors.storeName = 'Nama toko minimal 3 karakter.';
    }
    if (!storeAddress.trim() || storeAddress.trim().length < 8) {
      newErrors.storeAddress = 'Alamat toko wajib diisi lengkap (min. 8 karakter).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Mohon lengkapi formulir pendaftaran toko.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      upgradeUserRole({
        role: 'penjual',
        storeName: storeName.trim(),
        city: storeCity,
      });
    }, 600);
  };

  const handleSubmitCourier = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!vehiclePlate.trim() || vehiclePlate.trim().length < 4) {
      newErrors.vehiclePlate = 'Nomor plat kendaraan tidak valid (contoh: B 1234 XYZ).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Mohon lengkapi formulir mitra kurir.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const vehicleDesc = `${vehiclePlate.trim()} (${vehicleType === 'motor' ? 'Motor' : vehicleType === 'van' ? 'Mobil MPV' : 'Mobil Box'})`;
      upgradeUserRole({
        role: 'kurir',
        vehiclePlate: vehicleDesc,
        city: courierCity,
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pilih Jadi Mitra Pedagang atau Kurir
              </h2>
              <p className="text-[11px] text-slate-500">
                Aktivasi peran operasional untuk akun: {currentUser?.name || 'Pengguna'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPartnerModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2">
          <button
            onClick={() => {
              setPartnerUpgradeType('penjual');
              setErrors({});
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              partnerUpgradeType === 'penjual'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Buka Toko (Pedagang)</span>
          </button>
          
          <button
            onClick={() => {
              setPartnerUpgradeType('kurir');
              setErrors({});
            }}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              partnerUpgradeType === 'kurir'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Gabung Mitra Kurir (Driver)</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: PEDAGANG */}
          {partnerUpgradeType === 'penjual' && (
            <form onSubmit={handleSubmitMerchant} className="space-y-3">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950">
                <span className="font-bold block mb-0.5">Keuntungan Menjadi Mitra Penjual:</span>
                <span className="text-[11px] text-emerald-800 leading-relaxed block">
                  Produk Anda akan langsung tampil di katalog terdekat bagi pembeli di kota Anda, dengan pemanggilan kurir otomatis saat pesanan siap dikirim.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nama Toko / Usaha *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="contoh: Kriya Batik Ayu, Kopi Nusantara"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                />
                {errors.storeName && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{errors.storeName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Kategori Utama
                  </label>
                  <select
                    value={storeCategory}
                    onChange={(e) => setStoreCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-emerald-600"
                  >
                    <option value="kopi-kuliner">Kopi & Kuliner</option>
                    <option value="batik-kriya">Batik & Kerajinan</option>
                    <option value="herbal-agri">Herbal & Pertanian</option>
                    <option value="gadget-aksesoris">Gadget & Elektronik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Kota Asal Toko
                  </label>
                  <select
                    value={storeCity}
                    onChange={(e) => setStoreCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-emerald-600"
                  >
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Jakarta Timur">Jakarta Timur</option>
                    <option value="Tangerang Selatan">Tangerang Selatan</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surakarta (Solo)">Surakarta (Solo)</option>
                    <option value="Surabaya">Surabaya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Alamat Lengkap Toko / Lokasi Pengambilan Paket *
                </label>
                <textarea
                  rows={2}
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  placeholder="Alamat jalan, nomor kios/toko, patokan..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                />
                {errors.storeAddress && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{errors.storeAddress}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengaktifkan Akun Penjual...' : 'Aktivasi Toko & Buka Konsol Mitra Penjual'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: KURIR */}
          {partnerUpgradeType === 'kurir' && (
            <form onSubmit={handleSubmitCourier} className="space-y-3">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950">
                <span className="font-bold block mb-0.5">Keuntungan Menjadi Mitra Kurir:</span>
                <span className="text-[11px] text-blue-800 leading-relaxed block">
                  Dapatkan notifikasi tugas penjemputan instan di kota Anda dengan pembagian ongkos kirim transparan 85% langsung ke saldo akun.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Nomor Plat Kendaraan *
                </label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="contoh: B 4821 KTF"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600"
                />
                {errors.vehiclePlate && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{errors.vehiclePlate}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Jenis Kendaraan Armada
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-emerald-600"
                  >
                    <option value="motor">Sepeda Motor (Instant & Sameday)</option>
                    <option value="van">Mobil MPV / Van</option>
                    <option value="box">Mobil Box / Engkel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Kota Wilayah Operasional
                  </label>
                  <select
                    value={courierCity}
                    onChange={(e) => setCourierCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-emerald-600"
                  >
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Jakarta Timur">Jakarta Timur</option>
                    <option value="Tangerang Selatan">Tangerang Selatan</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surakarta (Solo)">Surakarta (Solo)</option>
                    <option value="Surabaya">Surabaya</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Mengaktifkan Lisensi Driver...' : 'Aktivasi Lisensi & Buka Dasbor Mitra Kurir'}</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
