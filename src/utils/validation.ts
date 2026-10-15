/**
 * Aturan Validasi Sisi Klien (Client-Side Validation Engine)
 * Sesuai klausul 4 SOP: Setiap formulir wajib memiliki validasi sebelum pengiriman.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Regex nomor telepon Indonesia: 08xx atau +628xx atau 628xx minimal 10 digit, maks 14 digit
export const INDONESIAN_PHONE_REGEX = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;

export function validateCheckoutForm(data: {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.recipientName.trim()) {
    errors.recipientName = 'Nama penerima wajib diisi.';
  } else if (data.recipientName.trim().length < 3) {
    errors.recipientName = 'Nama penerima minimal 3 karakter.';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Nomor telepon penerima wajib diisi.';
  } else if (!INDONESIAN_PHONE_REGEX.test(data.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Format nomor HP tidak valid (contoh: 08123456789 atau +62812...)';
  }

  if (!data.street.trim()) {
    errors.street = 'Alamat pengiriman jalan dan nomor rumah wajib diisi.';
  } else if (data.street.trim().length < 10) {
    errors.street = 'Alamat terlalu singkat. Mohon sertakan nama jalan, RT/RW, dan patokan (min. 10 karakter).';
  }

  if (!data.city.trim()) {
    errors.city = 'Kota/Kabupaten wajib diisi.';
  }

  if (!data.postalCode.trim()) {
    errors.postalCode = 'Kode pos wajib diisi.';
  } else if (!/^[0-9]{5}$/.test(data.postalCode.trim())) {
    errors.postalCode = 'Kode pos harus terdiri dari 5 digit angka.';
  }

  if (!data.paymentMethod) {
    errors.paymentMethod = 'Silakan pilih metode pembayaran.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCourierBookingForm(data: {
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  itemDescription: string;
  weightKg: number;
  maxWeightKg: number;
  hasPinpointSender: boolean;
  hasPinpointRecipient: boolean;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.senderName.trim()) {
    errors.senderName = 'Nama pengirim wajib diisi.';
  }

  if (!data.senderPhone.trim()) {
    errors.senderPhone = 'Nomor HP pengirim wajib diisi.';
  } else if (!INDONESIAN_PHONE_REGEX.test(data.senderPhone.replace(/[\s-]/g, ''))) {
    errors.senderPhone = 'Nomor HP pengirim harus berformat Indonesia valid.';
  }

  if (!data.senderAddress.trim()) {
    errors.senderAddress = 'Alamat detail penjemputan wajib diisi.';
  }

  if (!data.hasPinpointSender) {
    errors.senderPinpoint = 'Wajib memilih koordinat titik jemput pada peta.';
  }

  if (!data.recipientName.trim()) {
    errors.recipientName = 'Nama penerima paket wajib diisi.';
  }

  if (!data.recipientPhone.trim()) {
    errors.recipientPhone = 'Nomor HP penerima wajib diisi.';
  } else if (!INDONESIAN_PHONE_REGEX.test(data.recipientPhone.replace(/[\s-]/g, ''))) {
    errors.recipientPhone = 'Nomor HP penerima harus berformat Indonesia valid.';
  }

  if (!data.recipientAddress.trim()) {
    errors.recipientAddress = 'Alamat detail tujuan antar wajib diisi.';
  }

  if (!data.hasPinpointRecipient) {
    errors.recipientPinpoint = 'Wajib memilih koordinat titik antar pada peta.';
  }

  if (!data.itemDescription.trim()) {
    errors.itemDescription = 'Deskripsi jenis barang paket wajib diisi (misal: Makanan, Dokumen, Kain).';
  }

  if (isNaN(data.weightKg) || data.weightKg <= 0) {
    errors.weightKg = 'Berat barang harus lebih besar dari 0 kg.';
  } else if (data.weightKg > data.maxWeightKg) {
    errors.weightKg = `Berat barang (${data.weightKg} kg) melebihi batas armada terpilih (maks. ${data.maxWeightKg} kg).`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateReviewForm(data: {
  productRating: number;
  courierRating: number;
  comment: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (data.productRating < 1 || data.productRating > 5) {
    errors.productRating = 'Berikan penilaian bintang untuk produk (1 s/d 5).';
  }

  if (data.courierRating < 1 || data.courierRating > 5) {
    errors.courierRating = 'Berikan penilaian bintang untuk layanan kurir (1 s/d 5).';
  }

  if (!data.comment.trim()) {
    errors.comment = 'Ulasan teks wajib diisi.';
  } else if (data.comment.trim().length < 10) {
    errors.comment = `Ulasan terlalu pendek (${data.comment.trim().length}/10 karakter minimum).`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
