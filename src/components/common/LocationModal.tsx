import React, { useState, useMemo } from 'react';
import { useApp } from '../../context';
import { UserLocation } from '../../types';
import { 
  INDONESIA_PROVINCES, 
  INDONESIA_CITIES, 
  IndonesianCity, 
  IndonesianProvince 
} from '../../data/indonesiaRegions';
import { GoogleMapView } from './GoogleMapView';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Truck, 
  RotateCw, 
  ShieldCheck,
  Compass,
  Search,
  AlertTriangle,
  Smartphone,
  Info,
  ChevronRight,
  Globe,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';

export const LocationModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    userLocation, 
    setUserLocation, 
    detectGpsLocation, 
    isDetectingGps,
    gpsError,
    clearGpsError,
    showToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedIsland, setSelectedIsland] = useState<string>('Semua');
  const [selectedProvince, setSelectedProvince] = useState<string>('Semua');
  const [showGpsTroubleshoot, setShowGpsTroubleshoot] = useState(false);
  const [activeTab, setActiveTab] = useState<'daftar_kota' | 'gps_hp'>('daftar_kota');

  const islandGroups = [
    'Semua',
    'Jawa',
    'Sumatera',
    'Bali & Nusa Tenggara',
    'Kalimantan',
    'Sulawesi',
    'Maluku & Papua',
  ];

  // Filter provinces based on selected island
  const availableProvinces = useMemo(() => {
    if (selectedIsland === 'Semua') {
      return INDONESIA_PROVINCES;
    }
    return INDONESIA_PROVINCES.filter((p) => p.islandGroup === selectedIsland);
  }, [selectedIsland]);

  // Filter cities based on island, province, and search keyword
  const filteredCities = useMemo(() => {
    return INDONESIA_CITIES.filter((city) => {
      const matchIsland = selectedIsland === 'Semua' || city.islandGroup === selectedIsland;
      const matchProvince = selectedProvince === 'Semua' || city.province === selectedProvince;
      
      const searchLower = search.toLowerCase().trim();
      const matchSearch = !searchLower || 
        city.name.toLowerCase().includes(searchLower) ||
        city.province.toLowerCase().includes(searchLower) ||
        city.islandGroup.toLowerCase().includes(searchLower) ||
        (city.notes && city.notes.toLowerCase().includes(searchLower));

      return matchIsland && matchProvince && matchSearch;
    });
  }, [selectedIsland, selectedProvince, search]);

  if (!isLocationModalOpen) return null;

  const handleSelectCity = (cityItem: IndonesianCity) => {
    setUserLocation({
      label: `${cityItem.name}, ${cityItem.province}`,
      city: cityItem.name,
      province: cityItem.province,
      lat: cityItem.lat,
      lng: cityItem.lng,
      isGpsDetected: false,
      notes: cityItem.notes,
    });
    setIsLocationModalOpen(false);
    showToast(`Wilayah diubah ke: ${cityItem.name} (${cityItem.province}). Jarak toko & ketersediaan kurir diperbarui!`);
  };

  const handleIslandChange = (island: string) => {
    setSelectedIsland(island);
    setSelectedProvince('Semua');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Lokasi & Wilayah Operasional Nusantara
              </h2>
              <p className="text-[11px] text-slate-500">
                Pilih dari 38 Provinsi & Kota se-Indonesia atau gunakan GPS presisi HP Anda
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Tutup modal lokasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 pb-0 border-b border-slate-200 flex items-center gap-4 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('daftar_kota')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'daftar_kota'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>38 Provinsi & Kota Indonesia ({INDONESIA_CITIES.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('gps_hp')}
            className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'gps_hp'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Pendeteksian GPS HP</span>
            {userLocation.isGpsDetected && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          
          {/* TAB 1: DAFTAR KOTA & 38 PROVINSI */}
          {activeTab === 'daftar_kota' && (
            <div className="space-y-4">
              
              {/* Quick GPS Bar */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-950 text-xs">Lokasi Anda Saat Ini:</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                        {userLocation.isGpsDetected ? 'GPS HP AKTIF' : 'WILAYAH TERPILIH'}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-800 truncate max-w-sm">
                      {userLocation.city} {userLocation.province ? `(${userLocation.province})` : ''} · {userLocation.label}
                    </p>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await detectGpsLocation();
                  }}
                  disabled={isDetectingGps}
                  className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 shrink-0"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                  <span>{isDetectingGps ? 'Mendeteksi GPS...' : 'Gunakan GPS HP'}</span>
                </button>
              </div>

              {/* Search & Island / Province Filter */}
              <div className="space-y-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari nama Kota, Kabupaten, atau Provinsi (contoh: Solo, Bandung, Medan, Bali, Gayo)..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600 bg-white"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 font-semibold"
                    >
                      Hapus
                    </button>
                  )}
                </div>

                {/* Island Group Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 uppercase tracking-wide">
                    Kepulauan:
                  </span>
                  {islandGroups.map((island) => (
                    <button
                      key={island}
                      onClick={() => handleIslandChange(island)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors shrink-0 ${
                        selectedIsland === island
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {island}
                    </button>
                  ))}
                </div>

                {/* Province Dropdown Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-slate-200">
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <span className="text-[11px] text-slate-500 font-medium shrink-0">
                      Pilih Provinsi ({availableProvinces.length} Tersedia):
                    </span>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="flex-1 sm:flex-none px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:outline-emerald-600 font-semibold"
                    >
                      <option value="Semua">Semua Provinsi di {selectedIsland}</option>
                      {availableProvinces.map((prov) => (
                        <option key={prov.name} value={prov.name}>
                          {prov.name} ({prov.capitalCity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Menampilkan <strong>{filteredCities.length}</strong> Kota/Kabupaten
                  </span>
                </div>
              </div>

              {/* Cities Grid / List */}
              <div className="space-y-2">
                {filteredCities.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                    <Compass className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="font-semibold text-slate-700">Tidak ada kota yang sesuai pencarian</p>
                    <p className="text-[11px] text-slate-500">
                      Coba ganti kata kunci pencarian atau reset filter provinsi.
                    </p>
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedIsland('Semua');
                        setSelectedProvince('Semua');
                      }}
                      className="mt-2 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 transition-colors"
                    >
                      Tampilkan Semua Wilayah
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {filteredCities.map((item) => {
                      const isCurrentActive = 
                        !userLocation.isGpsDetected && 
                        userLocation.city.toLowerCase() === item.name.toLowerCase();

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectCity(item)}
                          className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between hover:shadow-sm ${
                            isCurrentActive
                              ? 'bg-emerald-50/90 border-emerald-600 ring-1 ring-emerald-500'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 w-full">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-xs">{item.name}</span>
                                {isCurrentActive && (
                                  <span className="text-[9px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                                    AKTIF
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-emerald-800 font-semibold block">
                                {item.province} · {item.islandGroup}
                              </span>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold justify-end">
                                <Truck className="w-3 h-3" />
                                <span>{item.activeCouriers} Kurir Siaga</span>
                              </div>
                              <span className={`text-[9px] font-semibold block ${item.instantReady ? 'text-emerald-700' : 'text-slate-400'}`}>
                                {item.instantReady ? '✓ Instant < 35km' : 'Kargo / Luar Kota'}
                              </span>
                            </div>
                          </div>

                          {item.notes && (
                            <p className="text-[10px] text-slate-500 mt-2 line-clamp-1 border-t border-slate-100 pt-1.5">
                              {item.notes}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PANDUAN & DIAGNOSTIK GPS HP */}
          {activeTab === 'gps_hp' && (
            <div className="space-y-4">
              
              {/* Sensor Card */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-emerald-800" />
                    <div>
                      <h3 className="font-bold text-emerald-950 text-xs sm:text-sm">
                        Sensor Geolocation Hardware HP (Mobile GPS)
                      </h3>
                      <p className="text-[11px] text-emerald-800">
                        Mengaktifkan chip GPS perangkat untuk akurasi tinggi hingga meter
                      </p>
                    </div>
                  </div>
                  {userLocation.isGpsDetected ? (
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300">
                      TERHUBUNG
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                      STANDBY
                    </span>
                  )}
                </div>

                {/* GPS Status Detail */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 text-emerald-900">
                  <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Status Hardware:</span>
                    <strong className="text-xs">{userLocation.isGpsDetected ? 'Sinyal Terkunci' : 'Belum Dilacak'}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Radius Akurasi:</span>
                    <strong className="text-xs">{userLocation.accuracyMeters ? `±${userLocation.accuracyMeters} meter` : 'N/A'}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Latitude:</span>
                    <strong className="text-xs font-mono">{userLocation.lat.toFixed(4)}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-500 block">Longitude:</span>
                    <strong className="text-xs font-mono">{userLocation.lng.toFixed(4)}</strong>
                  </div>
                </div>

                {/* Action Trigger */}
                <button
                  onClick={async () => {
                    await detectGpsLocation();
                  }}
                  disabled={isDetectingGps}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <RotateCw className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                  <span>{isDetectingGps ? 'Sedang Mengunci Sinyal Satelit GPS...' : 'Lacak Lokasi GPS HP Saya Sekarang'}</span>
                </button>

                {/* Live Google Maps Preview */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tampilan Koordinat Aktif di Google Maps</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {userLocation.city}{userLocation.province ? `, ${userLocation.province}` : ''}
                    </span>
                  </div>
                  <GoogleMapView
                    center={{ lat: userLocation.lat, lng: userLocation.lng }}
                    zoom={14}
                    height="190px"
                    originPin={{
                      lat: userLocation.lat,
                      lng: userLocation.lng,
                      label: userLocation.label,
                      badge: 'Posisi Anda',
                    }}
                    showRoute={false}
                  />
                </div>
              </div>

              {/* Error & Troubleshooting Panel */}
              {gpsError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-2 text-rose-900">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs block">Diagnostik GPS:</strong>
                      <p className="text-[11px] leading-relaxed">{gpsError}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={async () => {
                        clearGpsError();
                        await detectGpsLocation();
                      }}
                      className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-semibold rounded-md hover:bg-rose-700 transition-colors"
                    >
                      Coba Ulang
                    </button>
                    <button
                      onClick={() => setShowGpsTroubleshoot(!showGpsTroubleshoot)}
                      className="text-[11px] text-rose-800 underline font-medium hover:text-rose-950"
                    >
                      {showGpsTroubleshoot ? 'Sembunyikan Panduan HP' : 'Lihat Cara Mengaktifkan Izin GPS di HP'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step-by-Step Mobile Instructions */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>Panduan Mengaktifkan GPS di Smartphone (Android & iOS)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600">
                  {/* Android Guide */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 font-semibold block text-xs">
                      📱 Pengguna Android (Chrome / Samsung Internet):
                    </strong>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                      <li>Tarik bilah notifikasi ke bawah, aktifkan ikon <strong>"Lokasi / Location"</strong>.</li>
                      <li>Di Chrome, jika muncul pop-up izin, pilih <strong>"Saat Menggunakan Situs"</strong>.</li>
                      <li>Jika pernah menolak: Klik ikon gembok di sebelah URL browser &gt; <em>Izin Situs</em> &gt; <em>Lokasi: Izinkan</em>.</li>
                    </ol>
                  </div>

                  {/* iOS / iPhone Guide */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <strong className="text-slate-900 font-semibold block text-xs">
                      🍏 Pengguna iPhone / iPad (Safari):
                    </strong>
                    <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
                      <li>Buka <strong>Pengaturan (Settings)</strong> &gt; <em>Privasi & Keamanan</em> &gt; <em>Layanan Lokasi</em>.</li>
                      <li>Pastikan Layanan Lokasi <strong>Aktif</strong>.</li>
                      <li>Pilih Safari Website &gt; Pilih <em>"Saat Menggunakan App"</em> dan aktifkan <strong>"Lokasi Tepat (Precise Location)"</strong>.</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Close and apply */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Tutup & Terapkan Lokasi Ini
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
