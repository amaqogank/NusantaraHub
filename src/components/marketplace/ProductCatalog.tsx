import React, { useState } from 'react';
import { useApp } from '../../context';
import { Product } from '../../types';
import { formatRupiah, formatWeightGram } from '../../utils/formatters';
import { calculateDistance } from '../../app';
import { SixStateWrapper } from '../common/SixStateWrapper';
import { 
  Search, 
  MapPin, 
  Zap, 
  Star, 
  Plus, 
  Check, 
  Sparkles,
  SlidersHorizontal,
  Compass,
  Navigation,
  Truck,
  CheckCircle2
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const { 
    products, 
    setSelectedProduct, 
    addToCart, 
    forcedGlobalState, 
    currentUser,
    userLocation,
    setIsLocationModalOpen 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [sortBy, setSortBy] = useState<'terdekat' | 'populer' | 'harga_rendah' | 'harga_tinggi'>('terdekat');
  const [distanceFilter, setDistanceFilter] = useState<'under_5km' | 'instant_only' | 'all' | 'same_city'>('all');
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  const categories = [
    { id: 'semua', label: 'Semua Produk' },
    { id: 'kopi-kuliner', label: 'Kopi & Kuliner' },
    { id: 'batik-kriya', label: 'Batik & Kriya' },
    { id: 'herbal-agri', label: 'Herbal & Organik' },
    { id: 'gadget-aksesoris', label: 'Gadget & Elektronik' },
  ];

  // Map each product with its dynamic distance to current user location
  const productsWithDistance = products.map((p) => {
    const storeLat = p.storeCoords?.lat || -6.2255;
    const storeLng = p.storeCoords?.lng || 106.8099;
    const distanceKm = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      storeLat,
      storeLng
    );
    const isInstantReady = distanceKm <= 35; // Kurir instan motor/mobil radius 35 km
    const isUnder5Km = distanceKm < 5; // Radius sangat dekat kurang dari 5 km
    return {
      ...p,
      distanceKm,
      isInstantReady,
      isUnder5Km,
    };
  });

  // Count products under 5km
  const countUnder5Km = productsWithDistance.filter((p) => p.distanceKm < 5).length;

  // Filtering
  const filteredProducts = productsWithDistance.filter((p) => {
    const matchCategory = selectedCategory === 'semua' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.merchantName.toLowerCase().includes(search.toLowerCase()) ||
                        p.originCity.toLowerCase().includes(search.toLowerCase());
    
    // Distance / Courier radius filter: strictly < 5 km when 'under_5km' is selected
    let matchDistance = true;
    if (distanceFilter === 'under_5km') {
      matchDistance = p.distanceKm < 5;
    } else if (distanceFilter === 'instant_only') {
      matchDistance = p.isInstantReady;
    } else if (distanceFilter === 'same_city') {
      matchDistance = p.originCity.toLowerCase().includes(userLocation.city.toLowerCase().split(' ')[0]);
    }

    return matchCategory && matchSearch && matchDistance;
  });

  // Sorting (Default: Toko Terdekat dari Lokasi Pengguna)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'terdekat') return a.distanceKm - b.distanceKm;
    if (sortBy === 'harga_rendah') return a.price - b.price;
    if (sortBy === 'harga_tinggi') return b.price - a.price;
    return b.rating - a.rating;
  });

  // Count nearby instant stores
  const instantStoresCount = productsWithDistance.filter((p) => p.isInstantReady).length;

  // Determine current effective UI state
  let effectiveState = forcedGlobalState || 'default';
  if (isSimulatingError && !forcedGlobalState) {
    effectiveState = 'error';
  } else if (!forcedGlobalState && sortedProducts.length === 0) {
    effectiveState = 'empty';
  }

  return (
    <section className="space-y-6">
      
      {/* Hero Visual Showcase */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 text-white min-h-[200px] sm:min-h-[230px] flex items-center">
        <img
          src="/src/assets/images/hero_logistics_market_1791817534161.jpg"
          alt="Nusantara Logistics & Marketplace"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="relative z-10 p-6 sm:p-8 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
            <Compass className="w-3.5 h-3.5" />
            <span>Pencarian Cerdas Berbasis Lokasi & Radius Kurir</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            Toko Terdekat di Wilayah Anda, Antar Cepat Hari Ini
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Sistem otomatis mendeteksi lokasi Anda dan mengarahkan penjual terdekat agar ongkir lebih hemat dan pesanan sampai dalam hitungan menit.
          </p>
        </div>
      </div>

      {/* Regional Proximity & Courier Availability Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-emerald-950">
                Lokasi Anda: {userLocation.city}{userLocation.province ? `, ${userLocation.province}` : ''}
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                {userLocation.isGpsDetected ? `GPS Akurat (±${userLocation.accuracyMeters || 15}m)` : 'Wilayah Aktif'}
              </span>
              <span className="text-[10px] text-emerald-800 font-medium">
                · {countUnder5Km} Toko &lt; 5 km · {instantStoresCount} Toko dalam Radius Instan
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Titik Pengiriman: <strong className="text-emerald-950">{userLocation.label}</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setDistanceFilter(distanceFilter === 'under_5km' ? 'all' : 'under_5km')}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-xs w-full sm:w-auto justify-center border ${
              distanceFilter === 'under_5km'
                ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-300'
                : 'bg-emerald-100/80 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{distanceFilter === 'under_5km' ? '✓ Filter Aktif: < 5 km' : `Filter Toko < 5 km (${countUnder5Km})`}</span>
          </button>

          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="py-2 px-3.5 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-xs shrink-0 w-full sm:w-auto justify-center"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ganti Kota / GPS</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kopi, batik, sambal, toko di sekitar Anda..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600 bg-slate-50/50"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Reset
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 shrink-0">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-emerald-600 font-medium"
            >
              <option value="terdekat">📍 Toko Terdekat (Jarak Terkecil)</option>
              <option value="populer">Paling Populer & Rating</option>
              <option value="harga_rendah">Harga Terendah</option>
              <option value="harga_tinggi">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Courier Distance Radius Filter & Categories */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Distance Scope Quick Tabs */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 text-[10px] hidden sm:inline">Jangkauan:</span>
            <button
              onClick={() => setDistanceFilter(distanceFilter === 'under_5km' ? 'all' : 'under_5km')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-semibold ${
                distanceFilter === 'under_5km'
                  ? 'bg-emerald-700 text-white shadow-xs ring-2 ring-emerald-400'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${distanceFilter === 'under_5km' ? 'text-white' : 'text-emerald-700'} shrink-0`} />
              <span>{distanceFilter === 'under_5km' ? '✓ Radius < 5 km' : `Radius < 5 km (${countUnder5Km})`}</span>
            </button>
            <button
              onClick={() => setDistanceFilter('instant_only')}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                distanceFilter === 'instant_only'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>&lt; 35 km</span>
            </button>
            <button
              onClick={() => setDistanceFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                distanceFilter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Semua
            </button>
          </div>

        </div>

        {/* Active < 5km Filter Notification Banner */}
        {distanceFilter === 'under_5km' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-950 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Filter Radius &lt; 5 km Aktif:</strong> Menampilkan hanya produk dari toko yang berjarak &lt; 5 km dari posisi Anda di <em>{userLocation.label}</em> ({sortedProducts.length} toko/produk ditemukan).
              </span>
            </div>
            <button
              onClick={() => setDistanceFilter('all')}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline ml-2 shrink-0 cursor-pointer"
            >
              Reset ke Semua
            </button>
          </div>
        )}
      </div>

      {/* 6-State Protected Catalog Grid */}
      <SixStateWrapper
        state={effectiveState}
        loadingSkeletonType="card_grid"
        emptyTitle={distanceFilter === 'under_5km' ? "Tidak Ada Toko dalam Radius < 5 km" : "Tidak Ada Toko / Produk yang Cocok"}
        emptyDescription={
          distanceFilter === 'under_5km'
            ? `Tidak ada toko yang berjarak kurang dari 5 km dari posisi geografis Anda di ${userLocation.city} (${userLocation.label}). Silakan ubah filter jangkauan ke radius instan atau semua wilayah.`
            : `Pencarian "${search}" tidak menemukan hasil pada kategori ini. Silakan coba kata kunci lain.`
        }
        emptyActionLabel="Tampilkan Semua Toko (Semua Radius)"
        onEmptyAction={() => {
          setSearch('');
          setSelectedCategory('semua');
          setDistanceFilter('all');
        }}
        errorTitle="Gagal Mengambil Katalog Produk"
        errorMessage="Koneksi gateway katalog terputus saat merender API /api/v1/marketplace/products."
        onRetry={() => setIsSimulatingError(false)}
        currentRole={currentUser?.role}
        forbiddenRoleNeeded="Semua Peran Terverifikasi"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Product Image */}
              <div 
                className="relative h-48 bg-slate-100 overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                
                {/* Distance Badge from User with special highlight for < 5 km */}
                <div className={`absolute top-2.5 left-2.5 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs ${
                  product.isUnder5Km
                    ? 'bg-emerald-700/95 ring-1 ring-emerald-300'
                    : 'bg-slate-900/85'
                }`}>
                  <MapPin className="w-3 h-3 text-emerald-300" />
                  <span>{product.distanceKm} km {product.isUnder5Km ? '(Radius < 5 km)' : 'dari Anda'}</span>
                </div>

                {/* Instant Courier Status Badge */}
                {product.isInstantReady ? (
                  <div className="absolute bottom-2.5 left-2.5 bg-emerald-700/90 text-white px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shadow-xs">
                    <Zap className="w-3 h-3 fill-current" />
                    <span>Kurir Instan Siap</span>
                  </div>
                ) : (
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-800/85 text-slate-200 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-xs">
                    <Truck className="w-3 h-3" />
                    <span>Kargo / Luar Kota</span>
                  </div>
                )}

                {/* Weight badge */}
                <div className="absolute bottom-2.5 right-2.5 bg-slate-900/70 text-white px-2 py-0.5 rounded text-[10px] font-mono tabular-nums">
                  {formatWeightGram(product.weightGram)}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  
                  {/* Store & Location Metadata (Unboxed) */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-800 truncate">{product.merchantName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{product.originCity}</span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {product.title}
                  </h3>

                  {/* Rating & Review */}
                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-slate-900 tabular-nums">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount} ulasan)</span>
                  </div>
                </div>

                {/* Price, Courier ETA and CTA */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
                      {formatRupiah(product.price)}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium">
                      {product.isInstantReady ? 'Estimasi tiba 30-45 mnt' : 'Estimasi tiba 2-3 hari'}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="p-2 sm:px-3 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    aria-label={`Tambah ${product.title} ke keranjang`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Keranjang</span>
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
