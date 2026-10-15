import React, { useState } from 'react';
import { useApp } from '../../context';
import { formatRupiah, formatWeightGram } from '../../utils/formatters';
import { calculateDistance, calculateTariff } from '../../app';
import { 
  X, 
  Star, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Truck,
  MessageSquare,
  Check
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    currentUser, 
    reviews 
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');

  if (!selectedProduct) return null;

  const currentVariant = selectedVariant || selectedProduct.variants?.[0] || 'Standar';

  // Calculate distance from Store to Current User location
  const userLat = currentUser?.city ? -6.2378 : -6.2255;
  const userLng = 106.8532;
  const distanceKm = calculateDistance(
    -6.2255, 
    106.8099, 
    userLat, 
    userLng
  );
  const estimatedShippingCost = calculateTariff(distanceKm, 'motor_instant');

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentVariant);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">
              {selectedProduct.category}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500">ID: {selectedProduct.id}</span>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Gallery Left */}
            <div className="space-y-3">
              <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>On-Demand Ready</span>
                </div>
              </div>

              {/* Store Card */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{selectedProduct.merchantName}</span>
                    {selectedProduct.isMerchantOfficial && (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedProduct.originCity}</span>
                  </div>
                </div>
                <div className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-medium">
                  Toko Terverifikasi
                </div>
              </div>

              {/* GPS Instant Distance & Courier Tariff Estimation */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-950">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Estimasi Kurir Instan GPS</span>
                  </div>
                  <span className="text-emerald-700 font-mono">{distanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-800">
                  <span>Ongkos Kirim Motor Instant:</span>
                  <span className="font-bold font-mono">{formatRupiah(estimatedShippingCost)}</span>
                </div>
                <p className="text-[10px] text-emerald-700">
                  Estimasi tiba: 30 - 45 menit setelah konfirmasi penjemputan oleh toko.
                </p>
              </div>
            </div>

            {/* Purchase Module Right */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {selectedProduct.title}
                </h2>
                
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-slate-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold tabular-nums">{selectedProduct.rating}</span>
                    <span className="text-slate-400">({selectedProduct.reviewCount} ulasan)</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <div className="text-slate-600">
                    Berat: <span className="font-mono">{formatWeightGram(selectedProduct.weightGram)}</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-baseline gap-3">
                <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatRupiah(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-xs text-slate-400 line-through font-mono">
                    {formatRupiah(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="text-xs text-slate-600 leading-relaxed border-t border-b border-slate-100 py-3">
                {selectedProduct.description}
              </div>

              {/* Variant Selector */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Pilih Varian:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.variants.map((variant) => {
                      const isSelected = currentVariant === variant;
                      return (
                        <button
                          key={variant}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-2.5 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                            isSelected
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {variant}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Jumlah Beli:</span>
                  <span className="text-slate-400">Sisa Stok: {selectedProduct.stock} unit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold font-mono tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                      disabled={quantity >= selectedProduct.stock}
                      className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 font-mono">
                    Total: <strong className="text-slate-900">{formatRupiah(selectedProduct.price * quantity)}</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tambah ke Keranjang</span>
                </button>
              </div>
            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                <span>Ulasan Pembeli Terverifikasi</span>
              </h3>
              <span className="text-xs text-slate-500">{reviews.length} ulasan terdaftar</span>
            </div>

            <div className="space-y-2">
              {reviews.slice(0, 2).map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{rev.userName}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(rev.productRating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rev.serviceTags.map((tag, i) => (
                      <span key={i} className="text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
