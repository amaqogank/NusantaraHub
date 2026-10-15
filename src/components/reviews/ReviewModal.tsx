import React, { useState } from 'react';
import { useApp } from '../../context';
import { appState } from '../../app';
import { 
  X, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Store, 
  Truck,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { 
    reviewTargetOrder, 
    setReviewTargetOrder, 
    addReview, 
    currentUser, 
    showToast 
  } = useApp();

  // Merchant review states
  const [merchantRating, setMerchantRating] = useState(5);
  const [merchantComment, setMerchantComment] = useState('');

  // Courier review states
  const [courierRating, setCourierRating] = useState(5);
  const [courierComment, setCourierComment] = useState('');

  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Produk Berkualitas',
    'Pengiriman Cepat',
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!reviewTargetOrder) return null;

  const availableTags = [
    'Produk Berkualitas',
    'Kemas Rapi Bubble Wrap',
    'Pengiriman Tepat Waktu',
    'Kurir Ramah & Santun',
    'Respon Penjual Cepat',
    'Barang Sesuai Deskripsi',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!merchantComment.trim()) {
      newErrors.merchantComment = 'Komentar untuk toko/penjual wajib diisi (min. 5 karakter).';
    } else if (merchantComment.trim().length < 5) {
      newErrors.merchantComment = 'Komentar toko terlalu singkat (min. 5 karakter).';
    }

    if (!courierComment.trim()) {
      newErrors.courierComment = 'Komentar untuk kurir wajib diisi (min. 5 karakter).';
    } else if (courierComment.trim().length < 5) {
      newErrors.courierComment = 'Komentar kurir terlalu singkat (min. 5 karakter).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Mohon lengkapi komentar ulasan toko dan kurir.');
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // 1. Update appState mock user ratings
      appState.submitReview({
        orderId: reviewTargetOrder.id,
        merchantRating,
        merchantComment: merchantComment.trim(),
        courierRating,
        courierComment: courierComment.trim(),
      });

      // 2. Add to context reviews
      addReview({
        id: `rev-${Date.now()}`,
        orderId: reviewTargetOrder.id,
        productTitle: reviewTargetOrder.items[0]?.product.title || 'Produk Nusantara',
        userName: currentUser?.name || 'Rian Pratama',
        productRating: merchantRating,
        courierRating,
        comment: `[Toko]: ${merchantComment.trim()} | [Kurir]: ${courierComment.trim()}`,
        serviceTags: selectedTags,
        createdAt: 'Hari ini, Baru saja',
        verifiedPurchase: true,
      });

      const updatedMerchant = appState.mockUsers.merchant;
      const updatedCourier = appState.mockUsers.courier;

      showToast(
        `Ulasan terkirim! Rating Toko: ${updatedMerchant.rating}★ (${updatedMerchant.ratingCount} ulasan) & Kurir: ${updatedCourier.rating}★ (${updatedCourier.ratingCount} trip)`
      );

      setReviewTargetOrder(null);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Ulasan Selesai Pengantaran
              </h2>
              <p className="text-[11px] text-slate-500">
                Pesanan: {reviewTargetOrder.orderNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => setReviewTargetOrder(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-[11px]">
              Pesanan telah selesai! Berikan rating (1-5) dan komentar untuk memperbarui performa Toko & Kurir di sistem.
            </span>
          </div>

          {/* 1. SELLER / MERCHANT RATING & COMMENT */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Store className="w-4 h-4 text-emerald-700" />
                <span>1. Penilaian Mitra Toko (Merchant)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {reviewTargetOrder.items[0]?.product.merchantName || 'Kriya Batik & Kopi Pusaka'}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setMerchantRating(star)}
                    className="p-0.5 hover:scale-110 transition-transform"
                    aria-label={`Beri bintang ${star} untuk toko`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= merchantRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="font-bold text-slate-900 ml-1 tabular-nums">{merchantRating} / 5 Bintang</span>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Komentar untuk Penjual *:
              </label>
              <textarea
                rows={2}
                value={merchantComment}
                onChange={(e) => setMerchantComment(e.target.value)}
                placeholder="Bagikan ulasan tentang kualitas produk, keaslian barang, atau respon penjual..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600 bg-white"
              />
              {errors.merchantComment && (
                <p className="text-[11px] text-rose-600 mt-0.5">{errors.merchantComment}</p>
              )}
            </div>
          </div>

          {/* 2. COURIER RATING & COMMENT */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Truck className="w-4 h-4 text-blue-700" />
                <span>2. Penilaian Mitra Kurir Pengantar</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Joko Setiawan (B 4821 KTF)
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600">Rating:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setCourierRating(star)}
                    className="p-0.5 hover:scale-110 transition-transform"
                    aria-label={`Beri bintang ${star} untuk kurir`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= courierRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="font-bold text-slate-900 ml-1 tabular-nums">{courierRating} / 5 Bintang</span>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Komentar untuk Kurir *:
              </label>
              <textarea
                rows={2}
                value={courierComment}
                onChange={(e) => setCourierComment(e.target.value)}
                placeholder="Bagikan ulasan tentang kecepatan kurir, kehati-hatian membawa paket, atau keramahan..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-600 bg-white"
              />
              {errors.courierComment && (
                <p className="text-[11px] text-rose-600 mt-0.5">{errors.courierComment}</p>
              )}
            </div>
          </div>

          {/* Experience Tags */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 block">
              Pilih Tag Pengalaman:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full border text-[11px] transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan Ulasan & Memperbarui Rating...' : 'Kirim Ulasan & Perbarui Rating appState'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
