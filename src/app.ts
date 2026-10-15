/**
 * NusantaraHub: Web Marketplace & Kurir Terpadu
 * Standardized Vanilla TS/JS Modular Architecture
 * Memenuhi SOP & Juknis Vibe Coding Terpadu
 */

// ==========================================
// 1. STRUKTUR MOCK DATA STANDAR (JSON CONTRACT)
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'merchant' | 'courier' | 'admin';
  avatar: string;
  address: string;
  coords: { lat: number; lng: number };
  balance: number;
  rating?: number;
  ratingCount?: number;
  storeName?: string;
  vehiclePlate?: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: 'kopi' | 'batik' | 'kuliner' | 'gadget' | 'herbal';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  stock: number;
  weightKg: number;
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeCoords: { lat: number; lng: number };
  instantCourierAvailable: boolean;
  variants: string[];
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedVariant: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  buyer: { id: string; name: string; phone: string; address: string; coords: { lat: number; lng: number } };
  store: { id: string; name: string; address: string; coords: { lat: number; lng: number } };
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  platformFee: number;
  total: number;
  distanceKm: number;
  courierFleet: 'motor_instant' | 'sameday_express' | 'mobil_mpv' | 'mobil_box';
  courierFleetName: string;
  paymentMethod: string;
  status: 'dikonfirmasi' | 'mencari_kurir' | 'ambil_di_toko' | 'diantar' | 'selesai';
  courier?: {
    id: string;
    name: string;
    phone: string;
    vehiclePlate: string;
    rating: number;
    avatar: string;
    currentCoords: { lat: number; lng: number };
  };
  createdAt: string;
  estimatedMinutes: number;
}

// 1.1 Mock Users (Akun Terpadu RBAC)
export const mockUsers: Record<string, User> = {
  buyer: {
    id: 'usr-buy-001',
    name: 'Rian Pratama',
    email: 'rian.pratama@gmail.com',
    phone: '081289123456',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    address: 'Jl. Senopati No. 42B, Kebayoran Baru, Jakarta Selatan',
    coords: { lat: -6.2378, lng: 106.8532 },
    balance: 1850000,
  },
  merchant: {
    id: 'usr-mer-002',
    name: 'Dewi Handayani',
    email: 'dewi.kriya@tokopusaka.id',
    phone: '081399887766',
    role: 'merchant',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    address: 'SCBD Sudirman Lot 8, Jakarta Selatan',
    coords: { lat: -6.2255, lng: 106.8099 },
    balance: 14250000,
    storeName: 'Kriya Batik & Kopi Pusaka',
    rating: 4.90,
    ratingCount: 142,
  },
  courier: {
    id: 'usr-drv-003',
    name: 'Joko Setiawan',
    email: 'joko.driver@nusantaraexpress.id',
    phone: '081122334455',
    role: 'courier',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
    address: 'Posko Mitra Tebet Barat, Jakarta Selatan',
    coords: { lat: -6.2310, lng: 106.8280 },
    balance: 680000,
    vehiclePlate: 'B 4821 KTF (Honda Vario 160)',
    rating: 4.96,
    ratingCount: 320,
  },
  admin: {
    id: 'usr-adm-004',
    name: 'Bima Wisesa',
    email: 'ops.superadmin@nusantaraterpadu.id',
    phone: '081900112233',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    address: 'Pusat Operasional Logistik Nusantara, Thamrin',
    coords: { lat: -6.1950, lng: 106.8220 },
    balance: 45000000,
  },
};

// 1.2 Mock Products dengan Koordinat GPS Toko Asal
export const mockProducts: ProductItem[] = [
  {
    id: 'prod-001',
    title: 'Kopi Arabika Gayo Single Origin 250g Dark Roast',
    category: 'kopi',
    categoryLabel: 'Kopi & Minuman',
    price: 95000,
    originalPrice: 120000,
    rating: 4.9,
    reviewCount: 384,
    image: '/src/assets/images/product_kopi_nusantara_1791817549542.jpg',
    description: 'Biji kopi pilihan dataran tinggi Gayo Aceh dengan proses full washed, aroma cokelat rempah pekat dan body tebal tanpa rasa asam berlebih.',
    stock: 48,
    weightKg: 0.25,
    storeId: 'usr-mer-002',
    storeName: 'Kriya Batik & Kopi Pusaka',
    storeAddress: 'SCBD Sudirman Lot 8, Jakarta Selatan',
    storeCoords: { lat: -6.2255, lng: 106.8099 },
    instantCourierAvailable: true,
    variants: ['Biji Utuh (Whole Bean)', 'Giling Halus (Espresso)', 'Giling Kasar (V60)'],
  },
  {
    id: 'prod-002',
    title: 'Kain Tenun Tradisional Motif Kawung Kontemporer',
    category: 'batik',
    categoryLabel: 'Batik & Kriya',
    price: 340000,
    originalPrice: 420000,
    rating: 4.8,
    reviewCount: 142,
    image: '/src/assets/images/product_batik_tenun_1791817563427.jpg',
    description: 'Kain katun mori primisima halus 100% dengan canting cap tembaga manual dan pewarna alami ramah lingkungan. Lembut dan sejuk dikenakan.',
    stock: 19,
    weightKg: 0.35,
    storeId: 'usr-mer-002',
    storeName: 'Kriya Batik & Kopi Pusaka',
    storeAddress: 'SCBD Sudirman Lot 8, Jakarta Selatan',
    storeCoords: { lat: -6.2255, lng: 106.8099 },
    instantCourierAvailable: true,
    variants: ['Navy Parang', 'Klasik Sogan', 'Indigo Modern'],
  },
  {
    id: 'prod-003',
    title: 'Sambal Cakalang Asap Suwir Manado 200g Higienis',
    category: 'kuliner',
    categoryLabel: 'Kuliner Nusantara',
    price: 48000,
    originalPrice: 58000,
    rating: 4.9,
    reviewCount: 512,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    description: 'Ikan cakalang asap dipadu cabe rawit merah segar dan bawang merah Brebes. Tanpa pengawet sintetis, siap santap.',
    stock: 75,
    weightKg: 0.22,
    storeId: 'store-003',
    storeName: 'Dapur Rempah & Roa Bunaken',
    storeAddress: 'Jl. Tebet Raya No. 18, Tebet, Jakarta Selatan',
    storeCoords: { lat: -6.2350, lng: 106.8510 },
    instantCourierAvailable: true,
    variants: ['Pedas Sedang (Level 2)', 'Super Pedas (Level 5)'],
  },
  {
    id: 'prod-004',
    title: 'Madu Hutan Sumbawa Murni Nektar Akasia 500ml',
    category: 'herbal',
    categoryLabel: 'Herbal & Organik',
    price: 135000,
    originalPrice: 165000,
    rating: 5.0,
    reviewCount: 220,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: 'Dipanen langsung dari lebah liar Apis Dorsata hutan tropis Sumbawa. Kadar air 18%, kaya enzim diastase dan antioksidan.',
    stock: 32,
    weightKg: 0.7,
    storeId: 'store-004',
    storeName: 'Mitra Tani Organik Lestari',
    storeAddress: 'Kawasan Industri Pulogadung, Jakarta Timur',
    storeCoords: { lat: -6.1824, lng: 106.9451 },
    instantCourierAvailable: true,
    variants: ['500 ml Botol Kaca', '1000 ml Jerigen Foodgrade'],
  },
  {
    id: 'prod-005',
    title: 'Powerbank Ultra-Slim 20000mAh PD 45W Fast Charge',
    category: 'gadget',
    categoryLabel: 'Gadget & Elektronik',
    price: 279000,
    originalPrice: 350000,
    rating: 4.7,
    reviewCount: 890,
    image: 'https://images.unsplash.com/photo-1609592426507-b648359b3294?auto=format&fit=crop&w=600&q=80',
    description: 'Pengisian cepat untuk smartphone & tablet. Bersertifikasi SNI dan Flight-Friendly (74Wh) dengan perlindungan suhu ganda.',
    stock: 110,
    weightKg: 0.38,
    storeId: 'store-005',
    storeName: 'Nusantara Tech & Gadget Hub',
    storeAddress: 'Grand Indonesia East Mall Lt. 3, Jakarta Pusat',
    storeCoords: { lat: -6.1951, lng: 106.8219 },
    instantCourierAvailable: true,
    variants: ['Matte Black', 'Glacier Silver'],
  },
  {
    id: 'prod-006',
    title: 'Teh Hijau Herbal Daun Kelor Celup Alami (30 Bag)',
    category: 'herbal',
    categoryLabel: 'Herbal & Organik',
    price: 42000,
    rating: 4.8,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    description: 'Kombinasi daun teh hijau lereng gunung dan ekstrak daun kelor kering steril kaya multivitamin untuk stamina harian.',
    stock: 84,
    weightKg: 0.15,
    storeId: 'usr-mer-002',
    storeName: 'Kriya Batik & Kopi Pusaka',
    storeAddress: 'SCBD Sudirman Lot 8, Jakarta Selatan',
    storeCoords: { lat: -6.2255, lng: 106.8099 },
    instantCourierAvailable: true,
    variants: ['Isi 30 Kantung'],
  },
];

// 1.3 Mock Initial Orders
export const mockOrders: OrderItem[] = [
  {
    id: 'ord-101',
    orderNumber: 'TRX-ID-20261012-101',
    buyer: {
      id: 'usr-buy-001',
      name: 'Rian Pratama',
      phone: '081289123456',
      address: 'Jl. Senopati No. 42B, Kebayoran Baru, Jakarta Selatan',
      coords: { lat: -6.2378, lng: 106.8532 },
    },
    store: {
      id: 'usr-mer-002',
      name: 'Kriya Batik & Kopi Pusaka',
      address: 'SCBD Sudirman Lot 8, Jakarta Selatan',
      coords: { lat: -6.2255, lng: 106.8099 },
    },
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        selectedVariant: 'Biji Utuh (Whole Bean)',
      },
    ],
    subtotal: 190000,
    shippingFee: 16000,
    platformFee: 2500,
    total: 208500,
    distanceKm: 4.8,
    courierFleet: 'motor_instant',
    courierFleetName: 'Kurir Motor Instant (30 Menit)',
    paymentMethod: 'Saldo Nusantara',
    status: 'diantar',
    courier: {
      id: 'usr-drv-003',
      name: 'Joko Setiawan',
      phone: '081122334455',
      vehiclePlate: 'B 4821 KTF',
      rating: 4.96,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
      currentCoords: { lat: -6.2320, lng: 106.8350 },
    },
    createdAt: '12 Okt 2026, 09:15 WIB',
    estimatedMinutes: 14,
  },
  {
    id: 'ord-102',
    orderNumber: 'TRX-ID-20261012-102',
    buyer: {
      id: 'usr-buy-001',
      name: 'Rian Pratama',
      phone: '081289123456',
      address: 'Jl. Senopati No. 42B, Kebayoran Baru, Jakarta Selatan',
      coords: { lat: -6.2378, lng: 106.8532 },
    },
    store: {
      id: 'usr-mer-002',
      name: 'Kriya Batik & Kopi Pusaka',
      address: 'SCBD Sudirman Lot 8, Jakarta Selatan',
      coords: { lat: -6.2255, lng: 106.8099 },
    },
    items: [
      {
        product: mockProducts[1],
        quantity: 1,
        selectedVariant: 'Navy Parang',
      },
    ],
    subtotal: 340000,
    shippingFee: 16000,
    platformFee: 2500,
    total: 358500,
    distanceKm: 4.8,
    courierFleet: 'motor_instant',
    courierFleetName: 'Kurir Motor Instant (30 Menit)',
    paymentMethod: 'QRIS',
    status: 'mencari_kurir',
    createdAt: '12 Okt 2026, 10:02 WIB',
    estimatedMinutes: 25,
  },
];

// ==========================================
// 2. LOGIKA UTILS & TATA MATEMATIKA
// ==========================================

export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Rumus Jarak Haversine (km)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export function calculateTariff(distanceKm: number, fleet: string): number {
  switch (fleet) {
    case 'motor_instant':
      return Math.max(10000, 10000 + Math.ceil(Math.max(0, distanceKm - 2) * 2500));
    case 'sameday_express':
      return Math.max(15000, 15000 + Math.ceil(Math.max(0, distanceKm - 3) * 1800));
    case 'mobil_mpv':
      return Math.max(40000, 40000 + Math.ceil(Math.max(0, distanceKm - 3) * 4500));
    case 'mobil_box':
      return Math.max(90000, 90000 + Math.ceil(Math.max(0, distanceKm - 5) * 6500));
    default:
      return 15000;
  }
}

// ==========================================
// 3. STATE MANAGEMENT SISTEM
// ==========================================

export type UIState = 'default' | 'loading' | 'empty' | 'error' | 'unauthorized' | 'forbidden';

export class AppState {
  mockUsers = mockUsers;
  currentUser: User | null = mockUsers.buyer;
  products: ProductItem[] = [...mockProducts];
  cart: CartItem[] = [
    {
      product: mockProducts[0],
      quantity: 1,
      selectedVariant: 'Biji Utuh (Whole Bean)',
    },
  ];
  orders: OrderItem[] = [...mockOrders];
  currentUIState: UIState = 'default';
  activeCategory: string = 'semua';
  searchQuery: string = '';

  // Listeners
  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  setUIState(state: UIState) {
    this.currentUIState = state;
    this.notify();
  }

  switchUser(role: 'buyer' | 'merchant' | 'courier' | 'admin') {
    this.currentUser = mockUsers[role];
    this.notify();
  }

  logout() {
    this.currentUser = null;
    this.notify();
  }

  addToCart(product: ProductItem, quantity: number = 1, variant?: string) {
    const selectedVariant = variant || product.variants[0] || 'Default';
    const existing = this.cart.find(
      (c) => c.product.id === product.id && c.selectedVariant === selectedVariant
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ product, quantity, selectedVariant });
    }
    this.notify();
  }

  updateCartQty(productId: string, variant: string, qty: number) {
    if (qty <= 0) {
      this.cart = this.cart.filter(
        (c) => !(c.product.id === productId && c.selectedVariant === variant)
      );
    } else {
      const item = this.cart.find(
        (c) => c.product.id === productId && c.selectedVariant === variant
      );
      if (item) item.quantity = qty;
    }
    this.notify();
  }

  clearCart() {
    this.cart = [];
    this.notify();
  }

  getCartCount(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  createOrder(orderData: Partial<OrderItem>): OrderItem {
    const newOrder: OrderItem = {
      id: `ord-${Date.now()}`,
      orderNumber: `TRX-ID-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      buyer: orderData.buyer || {
        id: this.currentUser?.id || 'guest',
        name: this.currentUser?.name || 'Tamu',
        phone: this.currentUser?.phone || '081234567890',
        address: this.currentUser?.address || 'Jakarta',
        coords: this.currentUser?.coords || { lat: -6.2378, lng: 106.8532 },
      },
      store: orderData.store || {
        id: 'usr-mer-002',
        name: 'Kriya Batik & Kopi Pusaka',
        address: 'SCBD Sudirman Lot 8, Jakarta Selatan',
        coords: { lat: -6.2255, lng: 106.8099 },
      },
      items: orderData.items || [...this.cart],
      subtotal: orderData.subtotal || this.getCartSubtotal(),
      shippingFee: orderData.shippingFee || 16000,
      platformFee: 2500,
      total: (orderData.subtotal || this.getCartSubtotal()) + (orderData.shippingFee || 16000) + 2500,
      distanceKm: orderData.distanceKm || 4.8,
      courierFleet: orderData.courierFleet || 'motor_instant',
      courierFleetName: orderData.courierFleetName || 'Kurir Motor Instant (30 Menit)',
      paymentMethod: orderData.paymentMethod || 'Saldo Nusantara',
      status: 'dikonfirmasi',
      createdAt: 'Baru saja',
      estimatedMinutes: 20,
    };

    this.orders.unshift(newOrder);
    this.clearCart();
    return newOrder;
  }

  activeReviewOrder: OrderItem | null = null;

  updateOrderStatus(orderId: string, status: OrderItem['status']) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      if (status === 'mencari_kurir' && !order.courier) {
        order.courier = {
          id: mockUsers.courier.id,
          name: mockUsers.courier.name,
          phone: mockUsers.courier.phone,
          vehiclePlate: mockUsers.courier.vehiclePlate || 'B 4821 KTF',
          rating: 4.96,
          avatar: mockUsers.courier.avatar,
          currentCoords: {
            lat: order.store.coords.lat + 0.005,
            lng: order.store.coords.lng + 0.005,
          },
        };
      }
      if (status === 'selesai') {
        this.activeReviewOrder = order;
      }
      this.notify();
    }
  }

  submitReview(reviewData: {
    orderId: string;
    merchantRating: number;
    merchantComment: string;
    courierRating: number;
    courierComment: string;
  }) {
    // 1. Update mock merchant rating
    const merchant = mockUsers.merchant;
    const currentMerchantRating = merchant.rating || 4.9;
    const currentMerchantCount = merchant.ratingCount || 100;
    const newMerchantCount = currentMerchantCount + 1;
    const newMerchantRating = Number(
      ((currentMerchantRating * currentMerchantCount + reviewData.merchantRating) / newMerchantCount).toFixed(2)
    );
    merchant.rating = newMerchantRating;
    merchant.ratingCount = newMerchantCount;

    // 2. Update mock courier rating
    const courier = mockUsers.courier;
    const currentCourierRating = courier.rating || 4.95;
    const currentCourierCount = courier.ratingCount || 100;
    const newCourierCount = currentCourierCount + 1;
    const newCourierRating = Number(
      ((currentCourierRating * currentCourierCount + reviewData.courierRating) / newCourierCount).toFixed(2)
    );
    courier.rating = newCourierRating;
    courier.ratingCount = newCourierCount;

    this.activeReviewOrder = null;
    this.notify();
  }
}

export const appState = new AppState();
