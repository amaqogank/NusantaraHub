import React, { useState } from 'react';
import { useApp } from '../../context';
import { Role } from '../../types';
import { 
  X, 
  Lock, 
  Key, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  RotateCw, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { INDONESIAN_PHONE_REGEX } from '../../utils/validation';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    loginAs, 
    logout, 
    jwtSession, 
    refreshJwtToken, 
    registerUser,
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'jwt'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<Role>('pembeli');
  const [regPassword, setRegPassword] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Token copied feedback
  const [copiedToken, setCopiedToken] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Email dan kata sandi wajib diisi.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Auto assign role based on email or default to pembeli
      if (loginEmail.includes('kriya') || loginEmail.includes('penjual')) {
        loginAs('penjual');
      } else if (loginEmail.includes('driver') || loginEmail.includes('kurir')) {
        loginAs('kurir');
      } else if (loginEmail.includes('admin')) {
        loginAs('admin');
      } else {
        loginAs('pembeli');
      }
      setIsAuthModalOpen(false);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!regName.trim() || regName.trim().length < 3) {
      errors.name = 'Nama lengkap minimal 3 karakter.';
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      errors.email = 'Format email tidak valid.';
    }
    if (!regPhone.trim() || !INDONESIAN_PHONE_REGEX.test(regPhone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Nomor HP tidak valid (gunakan format Indonesia 08xxx).';
    }
    if (!regPassword || regPassword.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter.';
    }

    if (Object.keys(errors).length > 0) {
      setRegErrors(errors);
      return;
    }

    setRegErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: regRole,
      });
    }, 700);
  };

  const copyJwt = () => {
    if (jwtSession?.accessToken) {
      navigator.clipboard.writeText(jwtSession.accessToken);
      setCopiedToken(true);
      showToast('JWT Access Token disalin ke clipboard');
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Otentikasi Akun Terpadu
              </h2>
              <p className="text-xs text-slate-500">
                Manajemen Sesi Aman & Role-Based Access Control (RBAC)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2">
          <button
            onClick={() => setMode('login')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              mode === 'login'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk (Login)</span>
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun Baru</span>
          </button>
          <button
            onClick={() => setMode('jwt')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              mode === 'jwt'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-600" />
            <span>Inspektor JWT & Sesi</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: LOGIN */}
          {mode === 'login' && (
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Terdaftar
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="contoh: rian.pratama@gmail.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Memverifikasi Kredensial...' : 'Masuk ke Sistem'}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Atau Masuk Cepat sebagai Peran Terpadu:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => { loginAs('pembeli'); setIsAuthModalOpen(false); }}
                    className="p-2 border border-slate-200 hover:border-emerald-300 rounded-lg text-left bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">Rian Pratama</div>
                    <div className="text-[10px] text-slate-500">Peran: Pembeli (Buyer)</div>
                  </button>
                  <button
                    onClick={() => { loginAs('penjual'); setIsAuthModalOpen(false); }}
                    className="p-2 border border-slate-200 hover:border-emerald-300 rounded-lg text-left bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">Dewi Handayani</div>
                    <div className="text-[10px] text-slate-500">Peran: Penjual (Merchant)</div>
                  </button>
                  <button
                    onClick={() => { loginAs('kurir'); setIsAuthModalOpen(false); }}
                    className="p-2 border border-slate-200 hover:border-emerald-300 rounded-lg text-left bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">Joko Setiawan</div>
                    <div className="text-[10px] text-slate-500">Peran: Mitra Kurir (Driver)</div>
                  </button>
                  <button
                    onClick={() => { loginAs('admin'); setIsAuthModalOpen(false); }}
                    className="p-2 border border-slate-200 hover:border-emerald-300 rounded-lg text-left bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">Bima Wisesa</div>
                    <div className="text-[10px] text-slate-500">Peran: Super Admin</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="contoh: Hendra Kusuma"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
                {regErrors.name && <p className="text-[11px] text-rose-600 mt-0.5">{regErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="hendra@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
                {regErrors.email && <p className="text-[11px] text-rose-600 mt-0.5">{regErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nomor Handphone (WhatsApp)
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
                {regErrors.phone && <p className="text-[11px] text-rose-600 mt-0.5">{regErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Pilih Peran Akun Utama
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as Role)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-emerald-600"
                >
                  <option value="pembeli">Pembeli (Marketplace Shopper)</option>
                  <option value="penjual">Mitra Penjual (Merchant & Toko)</option>
                  <option value="kurir">Mitra Kurir (Driver On-Demand)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-emerald-600"
                />
                {regErrors.password && <p className="text-[11px] text-rose-600 mt-0.5">{regErrors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Mendaftarkan Akun...' : 'Daftar Akun Sekarang'}
              </button>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-snug">
                💡 <strong>Kemitraan Terpadu:</strong> Pengguna dapat memilih menjadi <strong>Mitra Kurir</strong> atau <strong>Pedagang (Buka Toko)</strong> kapan saja setelah registrasi melalui tombol di menu profil atas.
              </div>
            </form>
          )}

          {/* TAB 3: JWT SESSION INSPECTOR */}
          {mode === 'jwt' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Status Sesi Pengguna:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentUser ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {currentUser ? 'AUTHENTICATED' : 'UNAUTHENTICATED (401)'}
                  </span>
                </div>
                {currentUser && (
                  <div>
                    <div className="text-slate-500">Nama: <span className="text-slate-900 font-medium">{currentUser.name}</span></div>
                    <div className="text-slate-500">Peran RBAC: <span className="text-emerald-700 font-semibold uppercase">{currentUser.role}</span></div>
                  </div>
                )}
              </div>

              {jwtSession && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Simulasi JWT Access Token:</span>
                    <button
                      onClick={copyJwt}
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToken ? 'Tersalin' : 'Salin Token'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-lg break-all leading-relaxed">
                    {jwtSession.accessToken}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500 text-[11px]">Refresh Token:</span>
                    <span className="font-mono text-[11px] text-slate-700">{jwtSession.refreshToken}</span>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={refreshJwtToken}
                      className="flex-1 py-2 px-3 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      Uji Refresh Token (200 OK)
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsAuthModalOpen(false);
                      }}
                      className="py-2 px-3 border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Akhiri Sesi (401)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
