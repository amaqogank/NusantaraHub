import React, { useState, useMemo } from 'react';
import { useApp } from '../../context';
import { formatRupiah } from '../../utils/formatters';
import { TransactionType, TransactionCategory, BalanceTransaction } from '../../types';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Store, 
  Building2, 
  FileText, 
  RefreshCw, 
  ChevronRight, 
  Copy, 
  Clock, 
  Receipt 
} from 'lucide-react';

export const WalletMutationModal: React.FC = () => {
  const { 
    currentUser, 
    isWalletModalOpen, 
    setIsWalletModalOpen, 
    userTransactions, 
    topUpBalance, 
    withdrawBalance,
    showToast 
  } = useApp();

  const [activeTypeFilter, setActiveTypeFilter] = useState<'semua' | TransactionType>('semua');
  const [selectedCategory, setSelectedCategory] = useState<'semua' | TransactionCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedTxDetail, setSelectedTxDetail] = useState<BalanceTransaction | null>(null);

  // Form Top Up
  const [topUpAmount, setTopUpAmount] = useState<number>(100000);
  const [customTopUpInput, setCustomTopUpInput] = useState('');
  const [topUpMethod, setTopUpMethod] = useState('BCA Virtual Account');

  // Form Withdraw
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100000);
  const [bankTarget, setBankTarget] = useState('BCA - 01289123456 (Rian Pratama)');

  const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

  const filteredTransactions = useMemo(() => {
    return userTransactions.filter((tx) => {
      // Filter type
      if (activeTypeFilter !== 'semua' && tx.type !== activeTypeFilter) {
        return false;
      }
      // Filter category
      if (selectedCategory !== 'semua' && tx.category !== selectedCategory) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = tx.title.toLowerCase().includes(query);
        const matchDesc = tx.description.toLowerCase().includes(query);
        const matchRef = tx.referenceId?.toLowerCase().includes(query);
        const matchMethod = tx.paymentMethod?.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchRef && !matchMethod) {
          return false;
        }
      }
      return true;
    });
  }, [userTransactions, activeTypeFilter, selectedCategory, searchQuery]);

  // Summary Metrics
  const summary = useMemo(() => {
    let totalIn = 0;
    let countIn = 0;
    let totalOut = 0;
    let countOut = 0;

    userTransactions.forEach((tx) => {
      if (tx.type === 'pemasukan') {
        totalIn += tx.amount;
        countIn++;
      } else {
        totalOut += tx.amount;
        countOut++;
      }
    });

    return {
      totalIn,
      countIn,
      totalOut,
      countOut,
      netFlow: totalIn - totalOut,
    };
  }, [userTransactions]);

  if (!isWalletModalOpen) return null;

  const handleExecuteTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customTopUpInput ? parseInt(customTopUpInput, 10) : topUpAmount;
    if (isNaN(finalAmount) || finalAmount < 10000) {
      showToast('Minimal top-up saldo adalah Rp 10.000');
      return;
    }
    const success = topUpBalance(finalAmount, topUpMethod);
    if (success) {
      setIsTopUpOpen(false);
      setCustomTopUpInput('');
    }
  };

  const handleExecuteWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(withdrawAmount) || withdrawAmount < 20000) {
      showToast('Minimal penarikan dana adalah Rp 20.000');
      return;
    }
    const success = withdrawBalance(withdrawAmount, bankTarget);
    if (success) {
      setIsWithdrawOpen(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    showToast(`${label} disalin ke clipboard!`);
  };

  const getCategoryIcon = (category: TransactionCategory, type: TransactionType) => {
    switch (category) {
      case 'topup':
        return <PlusCircle className="w-5 h-5 text-emerald-600" />;
      case 'pembelian_produk':
        return <ShoppingBag className="w-5 h-5 text-rose-600" />;
      case 'ongkir_kurir':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'pendapatan_penjual':
        return <Store className="w-5 h-5 text-emerald-600" />;
      case 'pendapatan_kurir':
        return <Truck className="w-5 h-5 text-emerald-600" />;
      case 'tarik_dana':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      default:
        return type === 'pemasukan' ? (
          <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
        ) : (
          <ArrowUpRight className="w-5 h-5 text-rose-600" />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
      >
        
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="wallet-modal-title" className="text-base sm:text-lg font-bold text-slate-900">
                  Dompet Nusantara & Riwayat Mutasi Saldo
                </h2>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {currentUser?.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Pencatatan real-time pengeluaran & pemasukan dana di AppState
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Tutup Riwayat Mutasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* Top Hero Balance Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-5 sm:p-6 text-white shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              
              <div>
                <div className="flex items-center gap-2 text-emerald-200 text-xs font-medium">
                  <CreditCard className="w-4 h-4" />
                  <span>Saldo Aktif Pengguna ({currentUser?.name})</span>
                  {currentUser?.isKtpVerified && (
                    <span className="text-[10px] bg-emerald-600/80 border border-emerald-400/30 px-1.5 py-0.2 rounded text-emerald-100">
                      KTP Terverifikasi
                    </span>
                  )}
                </div>

                <div className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums">
                  {formatRupiah(currentUser?.balanceRupiah || 0)}
                </div>

                <p className="mt-1 text-xs text-emerald-100/80">
                  Dapat digunakan langsung untuk Checkout Belanja dan Ongkir Kurir Instan
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => {
                    setIsTopUpOpen(!isTopUpOpen);
                    setIsWithdrawOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all ${
                    isTopUpOpen 
                      ? 'bg-white text-emerald-800 ring-2 ring-emerald-300' 
                      : 'bg-white text-emerald-800 hover:bg-emerald-50 active:scale-98'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>+ Isi Saldo (Top-Up)</span>
                </button>

                <button
                  onClick={() => {
                    setIsWithdrawOpen(!isWithdrawOpen);
                    setIsTopUpOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    isWithdrawOpen
                      ? 'bg-emerald-950 text-white ring-2 ring-emerald-300'
                      : 'bg-emerald-900/60 hover:bg-emerald-900/80 text-white border border-emerald-500/40'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-300" />
                  <span>Tarik Saldo</span>
                </button>
              </div>

            </div>

            {/* Background Decorative Accent */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -top-8 w-44 h-44 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
          </div>

          {/* Quick Top-Up Drawer */}
          {isTopUpOpen && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  <span>Simulasi Pengisian Saldo (Instant Top-Up)</span>
                </div>
                <button 
                  onClick={() => setIsTopUpOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <form onSubmit={handleExecuteTopUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Pilih Nominal Cepat:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setTopUpAmount(amt);
                          setCustomTopUpInput('');
                        }}
                        className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-center transition-all ${
                          !customTopUpInput && topUpAmount === amt
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50'
                        }`}
                      >
                        {formatRupiah(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Atau Masukkan Nominal Kustom (Rp):
                    </label>
                    <input
                      type="number"
                      min="10000"
                      step="5000"
                      placeholder="Contoh: 150000"
                      value={customTopUpInput}
                      onChange={(e) => setCustomTopUpInput(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Metode Pembayaran:
                    </label>
                    <select
                      value={topUpMethod}
                      onChange={(e) => setTopUpMethod(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="BCA Virtual Account">BCA Virtual Account (Otomatis)</option>
                      <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
                      <option value="BRI Virtual Account">BRI Virtual Account (BRIVA)</option>
                      <option value="QRIS Nasional">QRIS Dinamis (Instan 0 detik)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Top-Up & Tambahkan ke Saldo</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quick Withdraw Drawer */}
          {isWithdrawOpen && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <ArrowUpRight className="w-4 h-4 text-amber-600" />
                  <span>Penarikan Saldo Dompet ke Rekening Bank</span>
                </div>
                <button 
                  onClick={() => setIsWithdrawOpen(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <form onSubmit={handleExecuteWithdraw} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nominal Tarik Dana (Rp):
                    </label>
                    <input
                      type="number"
                      min="20000"
                      max={currentUser?.balanceRupiah || 0}
                      step="10000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(parseInt(e.target.value, 10) || 0)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                    <span className="text-[11px] text-slate-500">
                      Maksimal penarikan: {formatRupiah(currentUser?.balanceRupiah || 0)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rekening Bank Tujuan:
                    </label>
                    <select
                      value={bankTarget}
                      onChange={(e) => setBankTarget(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="BCA - 01289123456 (Rian Pratama)">BCA - 01289123456 (Rian Pratama)</option>
                      <option value="Mandiri - 1370009812981 (Dewi Handayani)">Mandiri - 1370009812981 (Dewi Handayani)</option>
                      <option value="BRI - 034101000192500 (Joko Setiawan)">BRI - 034101000192500 (Joko Setiawan)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tarik Dana Sekarang</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Cash Flow Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Pemasukan Card */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Total Pemasukan</span>
                </div>
                <div className="text-base sm:text-lg font-extrabold text-emerald-700 font-mono tabular-nums mt-1">
                  +{formatRupiah(summary.totalIn)}
                </div>
                <span className="text-[11px] text-slate-500">
                  {summary.countIn} kali transaksi masuk
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>

            {/* Pengeluaran Card */}
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                  <span>Total Pengeluaran</span>
                </div>
                <div className="text-base sm:text-lg font-extrabold text-rose-700 font-mono tabular-nums mt-1">
                  -{formatRupiah(summary.totalOut)}
                </div>
                <span className="text-[11px] text-slate-500">
                  {summary.countOut} kali transaksi keluar
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>

            {/* Arus Kas Bersih */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Receipt className="w-3.5 h-3.5 text-slate-500" />
                  <span>Arus Kas Bersih</span>
                </div>
                <div className={`text-base sm:text-lg font-extrabold font-mono tabular-nums mt-1 ${
                  summary.netFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {summary.netFlow >= 0 ? '+' : ''}{formatRupiah(summary.netFlow)}
                </div>
                <span className="text-[11px] text-slate-500">
                  Total {userTransactions.length} rekaman di AppState
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>

          </div>

          {/* Filters & Search Toolbar */}
          <div className="space-y-3 pt-2">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Type Switcher Pills */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  onClick={() => setActiveTypeFilter('semua')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTypeFilter === 'semua'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({userTransactions.length})
                </button>
                <button
                  onClick={() => setActiveTypeFilter('pemasukan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeTypeFilter === 'pemasukan'
                      ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Pemasukan ({summary.countIn})</span>
                </button>
                <button
                  onClick={() => setActiveTypeFilter('pengeluaran')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    activeTypeFilter === 'pengeluaran'
                      ? 'bg-rose-600 text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-rose-700'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Pengeluaran ({summary.countOut})</span>
                </button>
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="semua">Semua Kategori</option>
                  <option value="topup">Isi Saldo (Top-Up)</option>
                  <option value="pembelian_produk">Pembelian Marketplace</option>
                  <option value="ongkir_kurir">Ongkos Kirim Kurir</option>
                  <option value="pendapatan_penjual">Pendapatan Mitra Toko</option>
                  <option value="pendapatan_kurir">Pendapatan Mitra Kurir</option>
                  <option value="tarik_dana">Penarikan Dana (Withdraw)</option>
                </select>
              </div>

            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari transaksi berdasarkan judul, kode pesanan (TRX-ID), resi kurir, atau metode..."
                className="w-full text-xs py-2.5 pl-9 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                >
                  Clear
                </button>
              )}
            </div>

          </div>

          {/* Transaction Mutation List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
              <span>Rincian Catatan Mutasi Saldo:</span>
              <span>Menampilkan {filteredTransactions.length} transaksi</span>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-700">Tidak Ada Transaksi Yang Cocok</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {searchQuery || selectedCategory !== 'semua' || activeTypeFilter !== 'semua'
                      ? 'Coba ubah filter atau kata kunci pencarian Anda.'
                      : 'Belum ada riwayat mutasi untuk akun ini. Lakukan top-up atau checkout untuk mencatat transaksi.'}
                  </p>
                </div>
                {(searchQuery || selectedCategory !== 'semua' || activeTypeFilter !== 'semua') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('semua');
                      setActiveTypeFilter('semua');
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Reset Semua Filter
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'pemasukan';

                  return (
                    <div
                      key={tx.id}
                      onClick={() => setSelectedTxDetail(tx)}
                      className="group p-3.5 sm:p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer shadow-2xs"
                    >
                      {/* Left: Icon & Description */}
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'
                        }`}>
                          {getCategoryIcon(tx.category, tx.type)}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                              {tx.title}
                            </h4>
                            {tx.referenceId && (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                                {tx.referenceId}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-1">
                            {tx.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {tx.createdAt}
                            </span>
                            <span>·</span>
                            <span>Metode: {tx.paymentMethod || 'Saldo Dompet'}</span>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold capitalize">
                              {tx.category.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Balance Flow */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 shrink-0">
                        <div className={`text-sm sm:text-base font-extrabold font-mono tabular-nums ${
                          isIncome ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                        </div>

                        <div className="text-[10px] text-slate-500 font-mono">
                          Saldo: {formatRupiah(tx.balanceBefore)} ➔ <strong className="text-slate-800">{formatRupiah(tx.balanceAfter)}</strong>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mutasi Saldo Tersinkronisasi Otomatis dengan AppState & Juknis Arsitektur Terpadu</span>
          </div>

          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>

      {/* Transaction Detail & E-Receipt Sub-Modal */}
      {selectedTxDetail && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Bukti Transaksi Saldo (E-Receipt)</h3>
              </div>
              <button
                onClick={() => setSelectedTxDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className={`text-2xl font-black font-mono tabular-nums ${
                selectedTxDetail.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {selectedTxDetail.type === 'pemasukan' ? '+' : '-'}{formatRupiah(selectedTxDetail.amount)}
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                <span>Transaksi {selectedTxDetail.status}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Judul Transaksi:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[200px]">{selectedTxDetail.title}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Jenis Mutasi:</span>
                <span className="font-semibold capitalize text-slate-800">
                  {selectedTxDetail.type} ({selectedTxDetail.category.replace(/_/g, ' ')})
                </span>
              </div>

              {selectedTxDetail.referenceId && (
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">ID Referensi:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-800">{selectedTxDetail.referenceId}</span>
                    <button
                      onClick={() => copyToClipboard(selectedTxDetail.referenceId!, 'ID Referensi')}
                      className="text-slate-400 hover:text-slate-600"
                      title="Salin Referensi"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Waktu Transaksi:</span>
                <span className="font-medium text-slate-700">{selectedTxDetail.createdAt}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Kanal / Metode:</span>
                <span className="font-medium text-slate-700">{selectedTxDetail.paymentMethod || 'Saldo Dompet'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Saldo Sebelum:</span>
                <span className="font-mono text-slate-700">{formatRupiah(selectedTxDetail.balanceBefore)}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500">Saldo Sesudah:</span>
                <span className="font-mono font-bold text-emerald-700">{formatRupiah(selectedTxDetail.balanceAfter)}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5">
              <strong>Keterangan:</strong> {selectedTxDetail.description}
            </div>

            <button
              onClick={() => setSelectedTxDetail(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Tutup Resi
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
