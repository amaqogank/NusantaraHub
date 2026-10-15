import React from 'react';
import { useApp } from '../../context';
import { formatRupiah, formatWeightGram } from '../../utils/formatters';
import { SixStateWrapper } from '../common/SixStateWrapper';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Store, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CartModal: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    cartSubtotal, 
    cartCount,
    setIsCheckoutOpen,
    forcedGlobalState,
    currentUser,
    setActiveTab
  } = useApp();

  if (!isCartOpen) return null;

  // Group items by store / merchant
  const groupedCart = cart.reduce((acc, item) => {
    const store = item.product.merchantName;
    if (!acc[store]) {
      acc[store] = [];
    }
    acc[store].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const effectiveState = forcedGlobalState || (cart.length === 0 ? 'empty' : 'default');

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Keranjang Belanja Terpadu
              </h2>
              <p className="text-[11px] text-slate-500">
                {cartCount} barang terpilih
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body with 6-State protection */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          <SixStateWrapper
            state={effectiveState}
            loadingSkeletonType="table"
            emptyTitle="Keranjang Belanja Masih Kosong"
            emptyDescription="Anda belum menambahkan produk pilihan ke keranjang belanja."
            emptyActionLabel="Mulai Belanja Sekarang"
            onEmptyAction={() => {
              setIsCartOpen(false);
              setActiveTab('marketplace');
            }}
            currentRole={currentUser?.role}
          >
            <div className="space-y-5">
              {Object.entries(groupedCart).map(([storeName, items]) => (
                <div key={storeName} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  
                  {/* Store Header */}
                  <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-xs font-bold text-slate-800">{storeName}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                      Penjual Terverifikasi
                    </span>
                  </div>

                  {/* Items list inside store */}
                  <div className="p-3 divide-y divide-slate-100 space-y-3">
                    {items.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />

                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          {item.selectedVariant && (
                            <p className="text-[11px] text-slate-500">
                              Varian: <span className="font-medium text-slate-700">{item.selectedVariant}</span>
                            </p>
                          )}
                          <div className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                            {formatRupiah(item.product.price)}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {/* Quantity Stepper */}
                            <div className="inline-flex items-center border border-slate-200 rounded-md bg-white">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1 text-slate-500 hover:text-slate-800"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold font-mono">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1 text-slate-500 hover:text-slate-800"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                              title="Hapus dari keranjang"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Kosongkan Keranjang</span>
                </button>
              </div>
            </div>
          </SixStateWrapper>
        </div>

        {/* Drawer Footer Summary & Checkout */}
        {cart.length > 0 && effectiveState === 'default' && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk:</span>
                <span className="font-mono tabular-nums font-semibold text-slate-900">
                  {formatRupiah(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Ongkir Kurir Terpadu:</span>
                <span>Dihitung di langkah Checkout via GPS</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Pembayaran:</span>
                <span className="text-base font-extrabold text-slate-900 font-mono tabular-nums">
                  {formatRupiah(cartSubtotal)}
                </span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Lanjut ke Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
