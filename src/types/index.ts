/**
 * NusantaraHub: Definisi Tipe Data & Kontrak API Terpadu
 * Standardized sesuai SOP & Juknis Vibe Coding Terpadu
 */

export type Role = 'pembeli' | 'penjual' | 'kurir' | 'admin';

export type UIState = 'default' | 'loading' | 'empty' | 'error' | 'unauthorized' | 'forbidden';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  balanceRupiah: number;
  city: string;
  address?: string;
  isKtpVerified: boolean;
  storeName?: string;
  courierVehiclePlate?: string;
}

export type ProductCategory = 
  | 'semua'
  | 'kopi-kuliner' 
  | 'batik-kriya' 
  | 'gadget-aksesoris' 
  | 'herbal-agri';

export interface UserLocation {
  label: string;
  city: string;
  province?: string;
  lat: number;
  lng: number;
  isGpsDetected?: boolean;
  accuracyMeters?: number;
  notes?: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  originCity: string;
  merchantName: string;
  isMerchantOfficial: boolean;
  image: string;
  description: string;
  stock: number;
  weightGram: number;
  storeCoords?: { lat: number; lng: number };
  variants?: string[];
  dimensionsCm?: { length: number; width: number; height: number };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type FleetType = 'motor_instant' | 'sameday_express' | 'mobil_mpv' | 'mobil_box';

export interface FleetOption {
  id: FleetType;
  name: string;
  tagline: string;
  capacityDescription: string;
  maxWeightKg: number;
  baseFare: number;
  perKmFare: number;
  estMinutesPerKm: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
  label: string;
}

export interface CourierBooking {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCoordinates: Coordinates;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCoordinates: Coordinates;
  fleetType: FleetType;
  itemDescription: string;
  weightKg: number;
  isFragile: boolean;
  hasInsurance: boolean;
  deliveryNote?: string;
  distanceKm: number;
  baseCost: number;
  serviceCost: number;
  totalCost: number;
  paymentMethod: 'saldo_nusantara' | 'qris' | 'cod';
  status: 'mencari_kurir' | 'kurir_menuju_lokasi' | 'barang_diambil' | 'dalam_pengantaran' | 'selesai';
  driver?: {
    id: string;
    name: string;
    phone: string;
    plateNumber: string;
    rating: number;
    avatar: string;
  };
  createdAt: string;
  estimatedArrival: string;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  courierService: string;
  paymentMethod: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
  };
  status: 'menunggu_pembayaran' | 'diproses_penjual' | 'dalam_pengiriman' | 'selesai';
  courierTrackingNumber?: string;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  orderId: string;
  productTitle: string;
  userName: string;
  productRating: number;
  courierRating: number;
  comment: string;
  serviceTags: string[];
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface ApiContractDoc {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  summary: string;
  requiredRole: Role[];
  requestPayloadExample?: Record<string, unknown>;
  responseExample: Record<string, unknown>;
}

export type TransactionType = 'pemasukan' | 'pengeluaran';

export type TransactionCategory = 
  | 'topup' 
  | 'pembelian_produk' 
  | 'ongkir_kurir' 
  | 'pendapatan_penjual' 
  | 'pendapatan_kurir' 
  | 'refund' 
  | 'tarik_dana';

export interface BalanceTransaction {
  id: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  title: string;
  description: string;
  referenceId?: string;
  createdAt: string;
  status: 'berhasil' | 'pending' | 'gagal';
  paymentMethod?: string;
}

