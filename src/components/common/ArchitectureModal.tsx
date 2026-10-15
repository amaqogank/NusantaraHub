import React, { useState } from 'react';
import { useApp } from '../../context';
import { X, Layers, ShieldCheck, Code, FileText, CheckCircle2 } from 'lucide-react';
import { API_CONTRACTS_SPEC } from '../../data/mockData';

export const ArchitectureModal: React.FC = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'state' | 'six_states' | 'rbac' | 'api'>('state');

  if (!isArchitectureModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Dokumentasi Teknis & Juknis Arsitektur Terpadu
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar Operasional Prosedur (SOP) & Arsitektur Frontend Vibe Coding
            </p>
          </div>
          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Tutup Dokumentasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 gap-2 bg-white overflow-x-auto">
          {[
            { id: 'state', label: 'Arsitektur State', icon: Layers },
            { id: 'six_states', label: '6 Status UI Komponen', icon: CheckCircle2 },
            { id: 'rbac', label: 'Matriks Akun & RBAC', icon: ShieldCheck },
            { id: 'api', label: 'Kontrak API Endpoint', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          
          {/* TAB 1: ARSITEKTUR STATE */}
          {activeTab === 'state' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h3 className="font-semibold text-slate-900 mb-2">1. Prinsip Desain State Management</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Arsitektur mengimplementasikan pendekatan <strong>Hybrid Unidirectional Reactive State</strong> dengan 3 lapisan:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-emerald-800 block mb-1">A. Global Session & Cart</span>
                    <p className="text-slate-600">
                      React Context (`AppContext`) mengelola sesi autentikasi, profil aktif, saldo dompet Rupiah, keranjang multi-item, dan state override inspector.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-emerald-800 block mb-1">B. Isolated Form State</span>
                    <p className="text-slate-600">
                      Formulir checkout dan kalkulator kurir diisolasi dengan validasi lokal per-field, mencegah re-render yang tidak perlu pada parent view.
                    </p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-emerald-800 block mb-1">C. 6-State Wrapper Machine</span>
                    <p className="text-slate-600">
                      Setiap container data diproteksi oleh abstraksi `SixStateWrapper` untuk memastikan tidak ada unhandled edge cases dalam rendering UI.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4">
                <h4 className="font-semibold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                  Alur Sinkronisasi Model A (Marketplace) dan Model B (Kurir Logistik)
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</div>
                    <p>Pembeli melakukan checkout produk di Marketplace Model A.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</div>
                    <p>Sistem secara otomatis mengenerate order logistik terpadu di Model B dengan kode pelacakan unik (misal: `KURIR-JKT-88219`).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</div>
                    <p>Kurir mitra menerima penugasan, dan pembeli dapat memantau pergerakan realtime via pinpoint GPS visualizer.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 6 STATUS UI KOMPONEN */}
          {activeTab === 'six_states' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Sesuai klausul 2 SOP, setiap modul data wajib memiliki implementasi eksplisit terhadap 6 status antarmuka:
              </p>

              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-bold text-slate-900">1. Default / Success</span>
                  <div className="sm:col-span-3 text-slate-600">
                    Menampilkan data katalog, rincian ongkir, dan riwayat pesanan dengan angka tabular Rupiah dan metadata tanpa pill badge yang berlebihan.
                  </div>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50/50">
                  <span className="font-bold text-slate-900">2. Loading State</span>
                  <div className="sm:col-span-3 text-slate-600">
                    Menampilkan skeleton animation terstruktur sesuai tipe modul (grid kartu, tabel pesanan, atau form kalkulator) tanpa layout shift.
                  </div>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-bold text-slate-900">3. Empty State</span>
                  <div className="sm:col-span-3 text-slate-600">
                    Menampilkan ilustrasi ikon rapi, pesan informatif ramah pengguna, dan tombol aksi Call-to-Action (CTA) untuk kembali menjelajah.
                  </div>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50/50">
                  <span className="font-bold text-slate-900">4. Error State (500)</span>
                  <div className="sm:col-span-3 text-slate-600">
                    Menampilkan kode kesalahan teknis, keterangan gangguan gateway API, serta tombol <em>Coba Muat Ulang (Retry)</em> yang memicu re-fetch.
                  </div>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <span className="font-bold text-slate-900">5. Unauthorized (401)</span>
                  <div className="sm:col-span-3 text-slate-600">
                    Terpicu saat token/sesi pengguna kedaluwarsa atau belum login, menyediakan tombol login cepat akun terpadu.
                  </div>
                </div>

                <div className="p-3 grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50/50">
                  <span className="font-bold text-slate-900">6. Forbidden (403)</span>
                  <div className="sm:col-span-3 text-slate-600">
                    Terpicu saat peran aktif (misal Pembeli) mencoba mengakses area terproteksi seperti Konsol Penjual atau Dasbor Mitra Kurir.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MATRIKS RBAC */}
          {activeTab === 'rbac' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                Matriks Hak Akses Peran Akun Terpadu (Role-Based Access Control)
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Fitur / Modul</th>
                      <th className="p-3 text-center">Pembeli</th>
                      <th className="p-3 text-center">Penjual</th>
                      <th className="p-3 text-center">Mitra Kurir</th>
                      <th className="p-3 text-center">Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="p-3 font-medium">Katalog Marketplace & Checkout</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                      <td className="p-3 text-center text-slate-400">Hanya Lihat</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Booking Kurir On-Demand</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                      <td className="p-3 text-center text-slate-400">✗ (403)</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Panel Mitra Penjual (Stok & Omset)</td>
                      <td className="p-3 text-center text-rose-500 font-bold">✗ (403)</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                      <td className="p-3 text-center text-rose-500 font-bold">✗ (403)</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Panel Driver Kurir (Ambil Order)</td>
                      <td className="p-3 text-center text-rose-500 font-bold">✗ (403)</td>
                      <td className="p-3 text-center text-rose-500 font-bold">✗ (403)</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">✓ Penuh</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: KONTRAK API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Struktur JSON Mock Data dibuat identik dengan kontrak RESTful API v1 untuk kemudahan migrasi ke backend riil:
              </p>

              <div className="space-y-3">
                {API_CONTRACTS_SPEC.map((contract, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {contract.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {contract.endpoint}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{contract.summary}</p>
                    <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto">
                      <pre>{JSON.stringify(contract.responseExample, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={() => setIsArchitectureModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            Tutup Dokumentasi
          </button>
        </div>

      </div>
    </div>
  );
};
