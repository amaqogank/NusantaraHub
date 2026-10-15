import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  UserProfile, 
  Role, 
  Product, 
  CartItem, 
  MarketplaceOrder, 
  CourierBooking, 
  ReviewItem, 
  UIState,
  UserLocation,
  BalanceTransaction,
  TransactionType,
  TransactionCategory
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_BOOKINGS, 
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS
} from '../data/mockData';
import { findNearestIndonesianCity } from '../data/indonesiaRegions';


interface AppContextType {
  // Auth & RBAC
  currentUser: UserProfile | null;
  switchRole: (role: Role) => void;
  logout: () => void;
  loginAs: (role: Role) => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, qty?: number, variant?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Marketplace Orders
  orders: MarketplaceOrder[];
  addOrder: (order: MarketplaceOrder) => void;

  // Courier Bookings
  bookings: CourierBooking[];
  createBooking: (booking: CourierBooking) => void;
  updateBookingStatus: (id: string, status: CourierBooking['status']) => void;
  activeTrackingBooking: CourierBooking | null;
  setActiveTrackingBooking: (b: CourierBooking | null) => void;

  // Reviews
  reviews: ReviewItem[];
  addReview: (review: ReviewItem) => void;
  reviewTargetOrder: MarketplaceOrder | null;
  setReviewTargetOrder: (order: MarketplaceOrder | null) => void;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isArchitectureModalOpen: boolean;
  setIsArchitectureModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isPartnerModalOpen: boolean;
  setIsPartnerModalOpen: (open: boolean) => void;
  partnerUpgradeType: 'penjual' | 'kurir';
  setPartnerUpgradeType: (type: 'penjual' | 'kurir') => void;
  upgradeUserRole: (data: { role: 'penjual' | 'kurir'; storeName?: string; vehiclePlate?: string; city?: string }) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;

  // Saldo & Mutasi Transaksi Terpadu
  transactions: BalanceTransaction[];
  userTransactions: BalanceTransaction[];
  recordTransaction: (params: {
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    title: string;
    description: string;
    referenceId?: string;
    paymentMethod?: string;
    status?: 'berhasil' | 'pending' | 'gagal';
  }) => BalanceTransaction | null;
  topUpBalance: (amount: number, method?: string) => boolean;
  withdrawBalance: (amount: number, destination?: string) => boolean;

  // Location & Geolocation
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  detectGpsLocation: () => Promise<void>;
  isDetectingGps: boolean;
  gpsError: string | null;
  clearGpsError: () => void;

  // JWT Token & Session State
  jwtSession: { accessToken: string; refreshToken: string; expiresAt: number } | null;
  refreshJwtToken: () => void;
  registerUser: (userData: { name: string; email: string; phone: string; role: Role }) => void;

  // Active View / Tab
  activeTab: 'marketplace' | 'courier' | 'orders' | 'merchant_panel' | 'driver_panel';
  setActiveTab: (tab: 'marketplace' | 'courier' | 'orders' | 'merchant_panel' | 'driver_panel') => void;

  // Developer 6-State Inspector
  forcedGlobalState: UIState | null;
  setForcedGlobalState: (state: UIState | null) => void;
  resetGlobalState: () => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<Record<string, UserProfile>>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(MOCK_USERS.pembeli);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>(INITIAL_TRANSACTIONS);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>([
    {
      product: MOCK_PRODUCTS[0],
      quantity: 1,
      selectedVariant: 'Biji Utuh (Whole Bean)',
    },
  ]);

  const [orders, setOrders] = useState<MarketplaceOrder[]>(INITIAL_ORDERS);
  const [bookings, setBookings] = useState<CourierBooking[]>(INITIAL_BOOKINGS);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  const [activeTab, setActiveTab] = useState<'marketplace' | 'courier' | 'orders' | 'merchant_panel' | 'driver_panel'>('marketplace');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerUpgradeType, setPartnerUpgradeType] = useState<'penjual' | 'kurir'>('penjual');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  
  const [userLocation, setUserLocation] = useState<UserLocation>({
    label: 'Kebayoran Baru, Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    lat: -6.2378,
    lng: 106.8532,
    isGpsDetected: false,
    notes: 'SCBD, Senopati, Tebet',
  });

  const clearGpsError = () => setGpsError(null);

  const detectGpsLocation = async () => {
    setIsDetectingGps(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      const err = 'Sensor Geolocation/GPS tidak didukung oleh browser pada perangkat ini.';
      setGpsError(err);
      showToast(err);
      setIsDetectingGps(false);
      return;
    }

    // Opsi presisi tinggi khusus GPS sensor HP / smartphone
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true, // Wajib TRUE agar HP mengaktifkan chip GPS hardware bukan hanya IP/Cell Tower
      timeout: 15000,           // Batas 15 detik untuk lock sinyal GPS
      maximumAge: 0,            // Jangan gunakan cache posisi lama, ambil koordinat real-time terbaru
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy || 15;

        // Cocokkan secara otomatis dengan database wilayah dan kota di Indonesia
        const nearestMatch = findNearestIndonesianCity(lat, lng);
        const nearestCityName = nearestMatch.city.name;
        const nearestProvince = nearestMatch.city.province;
        const accuracyText = `±${Math.round(accuracy)}m`;

        const newLoc: UserLocation = {
          label: `GPS HP (${accuracyText}) · ${nearestCityName}`,
          city: nearestCityName,
          province: nearestProvince,
          lat,
          lng,
          isGpsDetected: true,
          accuracyMeters: Math.round(accuracy),
          notes: nearestMatch.city.notes,
        };

        setUserLocation(newLoc);
        setIsDetectingGps(false);
        setGpsError(null);
        showToast(`GPS HP Akurat Terdeteksi (${accuracyText})! Wilayah: ${nearestCityName}, ${nearestProvince}. Toko terdekat disesuaikan.`);
      },
      (error) => {
        setIsDetectingGps(false);
        let errorMsg = 'Gagal mendeteksi sinyal GPS pada HP.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Izin GPS ditolak oleh browser/HP. Harap izinkan akses lokasi di Pengaturan HP / browser Anda.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Sinyal satelit GPS tidak terdeteksi. Pastikan GPS/Lokasi HP sudah dihidupkan dalam mode Akurasi Tinggi.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Waktu pencarian sinyal GPS habis (Timeout). Pastikan Anda berada di area terbuka dan coba kembali.';
            break;
          default:
            errorMsg = `Kesalahan GPS (${error.message || 'Kode tidak dikenal'}). Tetap menggunakan lokasi wilayah yang dipilih.`;
            break;
        }

        setGpsError(errorMsg);
        showToast(errorMsg);
      },
      geoOptions
    );
  };
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<CourierBooking | null>(INITIAL_BOOKINGS[0]);
  const [reviewTargetOrder, setReviewTargetOrder] = useState<MarketplaceOrder | null>(null);

  // JWT Mock Session
  const [jwtSession, setJwtSession] = useState<{ accessToken: string; refreshToken: string; expiresAt: number } | null>({
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3ItYnV5LTAwMSIsInJvbGUiOiJwZW1iZWxpIiwiaWF0IjoxNzg5MDAwMCwiZXhwIjoxNzg5MzYwMH0.SignatureNusantaraSecure2026',
    refreshToken: 'ref_9821a8bf92c431ef8923a',
    expiresAt: Date.now() + 3600 * 1000,
  });

  const refreshJwtToken = () => {
    const newExpires = Date.now() + 3600 * 1000;
    const newAccess = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIke2N1cnJlbnRVc2VyP2lkIDogJ2d1ZXN0J30iLCJyb2xlIjoiJHtjdXJyZW50VXNlciA/IGN1cnJlbnRVc2VyLnJvbGUgOiAnZ3Vlc3QnfSIsImlhdCI6JHtEYXRlLm5vdygpfX0.SignatureRefreshed_${Date.now().toString(36)}`;
    setJwtSession({
      accessToken: newAccess,
      refreshToken: `ref_${Math.random().toString(36).slice(2)}`,
      expiresAt: newExpires,
    });
    showToast('Token JWT Akses berhasil diperbarui (Refresh Token Flow 200 OK)');
  };

  const registerUser = (userData: { name: string; email: string; phone: string; role: Role }) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now().toString(36)}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      balanceRupiah: 500000, // bonus pendaftaran
      city: 'Jakarta',
      isKtpVerified: true,
      storeName: userData.role === 'penjual' ? `${userData.name} Store` : undefined,
      courierVehiclePlate: userData.role === 'kurir' ? 'B 1234 XYZ' : undefined,
    };
    setCurrentUser(newUser);
    refreshJwtToken();
    setIsAuthModalOpen(false);
    showToast(`Registrasi akun terpadu berhasil! Selamat datang, ${newUser.name}`);
  };

  const upgradeUserRole = (data: { role: 'penjual' | 'kurir'; storeName?: string; vehiclePlate?: string; city?: string }) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      role: data.role,
      storeName: data.role === 'penjual' ? (data.storeName || `${currentUser.name} Store`) : currentUser.storeName,
      courierVehiclePlate: data.role === 'kurir' ? (data.vehiclePlate || 'B 1234 KTF (Honda Vario)') : currentUser.courierVehiclePlate,
      city: data.city || currentUser.city,
    };
    setCurrentUser(updatedUser);
    setIsPartnerModalOpen(false);
    if (data.role === 'penjual') {
      setActiveTab('merchant_panel');
      showToast(`Selamat! Akun Anda kini aktif sebagai Mitra Penjual (${updatedUser.storeName}).`);
    } else {
      setActiveTab('driver_panel');
      showToast(`Selamat! Akun Anda kini aktif sebagai Mitra Kurir On-Demand (${updatedUser.courierVehiclePlate}).`);
    }
  };

  // 6-State override testing mechanism
  const [forcedGlobalState, setForcedGlobalState] = useState<UIState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const userTransactions = useMemo(() => {
    if (!currentUser) return [];
    return transactions.filter((t) => t.userId === currentUser.id);
  }, [transactions, currentUser]);

  const switchRole = (role: Role) => {
    const targetUser = users[role] || MOCK_USERS[role];
    setCurrentUser(targetUser);
    showToast(`Beralih peran ke: ${role.toUpperCase()} (${targetUser.name})`);
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Sesi telah diakhiri (Unauthorized 401).');
  };

  const loginAs = (role: Role) => {
    const targetUser = users[role] || MOCK_USERS[role];
    setCurrentUser(targetUser);
    showToast(`Berhasil login sebagai ${targetUser.name} (${role.toUpperCase()})`);
  };

  const recordTransaction = (params: {
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    title: string;
    description: string;
    referenceId?: string;
    paymentMethod?: string;
    status?: 'berhasil' | 'pending' | 'gagal';
  }): BalanceTransaction | null => {
    if (!currentUser) return null;
    const currentBalance = currentUser.balanceRupiah;
    const isIncome = params.type === 'pemasukan';
    const newBalance = isIncome
      ? currentBalance + params.amount
      : Math.max(0, currentBalance - params.amount);

    const newTx: BalanceTransaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      type: params.type,
      category: params.category,
      amount: params.amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      title: params.title,
      description: params.description,
      referenceId: params.referenceId || `TX-${Date.now().toString().slice(-6)}`,
      createdAt: 'Hari ini, Baru saja',
      status: params.status || 'berhasil',
      paymentMethod: params.paymentMethod || 'Saldo Nusantara',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setCurrentUser((prev) => (prev ? { ...prev, balanceRupiah: newBalance } : null));
    setUsers((prev) => ({
      ...prev,
      [currentUser.role]: {
        ...(prev[currentUser.role] || currentUser),
        balanceRupiah: newBalance,
      },
    }));

    return newTx;
  };

  const topUpBalance = (amount: number, method: string = 'BCA Virtual Account'): boolean => {
    if (!currentUser || amount <= 0) return false;
    const currentBalance = currentUser.balanceRupiah;
    const newBalance = currentBalance + amount;

    const newTx: BalanceTransaction = {
      id: `tx-top-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      userId: currentUser.id,
      type: 'pemasukan',
      category: 'topup',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      title: `Top-Up Saldo via ${method}`,
      description: `Pengisian saldo instan Dompet Nusantara`,
      referenceId: `TOPUP-${Date.now().toString().slice(-6)}`,
      createdAt: 'Hari ini, Baru saja',
      status: 'berhasil',
      paymentMethod: method,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setCurrentUser((prev) => (prev ? { ...prev, balanceRupiah: newBalance } : null));
    setUsers((prev) => ({
      ...prev,
      [currentUser.role]: {
        ...(prev[currentUser.role] || currentUser),
        balanceRupiah: newBalance,
      },
    }));

    showToast(`Top-up saldo Rp ${amount.toLocaleString('id-ID')} berhasil!`);
    return true;
  };

  const withdrawBalance = (amount: number, destination: string = 'Rekening Bank Terdaftar'): boolean => {
    if (!currentUser || amount <= 0) return false;
    if (currentUser.balanceRupiah < amount) {
      showToast('Gagal: Saldo Anda tidak mencukupi untuk penarikan.');
      return false;
    }
    const currentBalance = currentUser.balanceRupiah;
    const newBalance = currentBalance - amount;

    const newTx: BalanceTransaction = {
      id: `tx-wd-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      userId: currentUser.id,
      type: 'pengeluaran',
      category: 'tarik_dana',
      amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      title: `Tarik Dana ke ${destination}`,
      description: `Penarikan saldo dari Dompet Nusantara ke rekening bank`,
      referenceId: `WD-${Date.now().toString().slice(-6)}`,
      createdAt: 'Hari ini, Baru saja',
      status: 'berhasil',
      paymentMethod: destination,
    };

    setTransactions((prev) => [newTx, ...prev]);
    setCurrentUser((prev) => (prev ? { ...prev, balanceRupiah: newBalance } : null));
    setUsers((prev) => ({
      ...prev,
      [currentUser.role]: {
        ...(prev[currentUser.role] || currentUser),
        balanceRupiah: newBalance,
      },
    }));

    showToast(`Penarikan dana Rp ${amount.toLocaleString('id-ID')} berhasil diproses!`);
    return true;
  };

  const addToCart = (product: Product, qty: number = 1, variant?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.selectedVariant === variant);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selectedVariant === variant
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty, selectedVariant: variant || product.variants?.[0] }];
    });
    showToast(`${product.title} (${qty}x) ditambahkan ke keranjang`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item dihapus dari keranjang');
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  }, [cart]);

  const addOrder = (order: MarketplaceOrder) => {
    setOrders((prev) => [order, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);

    // Otomatis kurangi saldo & catat mutasi jika metode pembayaran adalah Saldo Nusantara
    if (order.paymentMethod === 'Saldo Nusantara' && currentUser) {
      const deduction = order.totalAmount;
      const currentBalance = currentUser.balanceRupiah;
      const newBalance = Math.max(0, currentBalance - deduction);

      const newTx: BalanceTransaction = {
        id: `tx-ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: currentUser.id,
        type: 'pengeluaran',
        category: 'pembelian_produk',
        amount: deduction,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        title: `Pembayaran Pesanan ${order.orderNumber}`,
        description: `Belanja ${order.items.length} produk di marketplace (${order.courierService})`,
        referenceId: order.orderNumber,
        createdAt: 'Hari ini, Baru saja',
        status: 'berhasil',
        paymentMethod: 'Saldo Nusantara',
      };

      setTransactions((prev) => [newTx, ...prev]);
      setCurrentUser((prev) => (prev ? { ...prev, balanceRupiah: newBalance } : null));
      setUsers((prev) => ({
        ...prev,
        [currentUser.role]: {
          ...(prev[currentUser.role] || currentUser),
          balanceRupiah: newBalance,
        },
      }));
    }

    showToast(`Pesanan ${order.orderNumber} berhasil dibuat!`);
  };

  const createBooking = (booking: CourierBooking) => {
    setBookings((prev) => [booking, ...prev]);
    setActiveTrackingBooking(booking);

    // Otomatis kurangi saldo & catat mutasi jika bayar via Saldo Nusantara
    if (booking.paymentMethod === 'saldo_nusantara' && currentUser) {
      const deduction = booking.totalCost;
      const currentBalance = currentUser.balanceRupiah;
      const newBalance = Math.max(0, currentBalance - deduction);

      const newTx: BalanceTransaction = {
        id: `tx-bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: currentUser.id,
        type: 'pengeluaran',
        category: 'ongkir_kurir',
        amount: deduction,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        title: `Ongkir Kurir ${booking.trackingNumber}`,
        description: `Pengantaran barang dari ${booking.senderName} ke ${booking.recipientName} (${booking.distanceKm} km)`,
        referenceId: booking.trackingNumber,
        createdAt: 'Hari ini, Baru saja',
        status: 'berhasil',
        paymentMethod: 'Saldo Nusantara',
      };

      setTransactions((prev) => [newTx, ...prev]);
      setCurrentUser((prev) => (prev ? { ...prev, balanceRupiah: newBalance } : null));
      setUsers((prev) => ({
        ...prev,
        [currentUser.role]: {
          ...(prev[currentUser.role] || currentUser),
          balanceRupiah: newBalance,
        },
      }));
    }

    showToast(`Pengiriman ${booking.trackingNumber} berhasil dijadwalkan!`);
  };


  const updateBookingStatus = (id: string, status: CourierBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    if (activeTrackingBooking?.id === id) {
      setActiveTrackingBooking((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const addReview = (review: ReviewItem) => {
    setReviews((prev) => [review, ...prev]);
    setReviewTargetOrder(null);
    showToast('Ulasan dan rating berhasil dikirim ke server!');
  };

  const resetGlobalState = () => {
    setForcedGlobalState(null);
    showToast('Status UI dikembalikan ke kondisi Realtime (Default).');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        logout,
        loginAs,
        products,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        orders,
        addOrder,
        bookings,
        createBooking,
        updateBookingStatus,
        activeTrackingBooking,
        setActiveTrackingBooking,
        reviews,
        addReview,
        reviewTargetOrder,
        setReviewTargetOrder,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isArchitectureModalOpen,
        setIsArchitectureModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isPartnerModalOpen,
        setIsPartnerModalOpen,
        partnerUpgradeType,
        setPartnerUpgradeType,
        upgradeUserRole,
        isWalletModalOpen,
        setIsWalletModalOpen,
        transactions,
        userTransactions,
        recordTransaction,
        topUpBalance,
        withdrawBalance,
        userLocation,
        setUserLocation,
        detectGpsLocation,
        isDetectingGps,
        gpsError,
        clearGpsError,
        jwtSession,
        refreshJwtToken,
        registerUser,
        activeTab,
        setActiveTab,
        forcedGlobalState,
        setForcedGlobalState,
        resetGlobalState,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
