import React, { useState } from 'react';
import { useApp } from '../../context';
import { UIState } from '../../types';
import { SlidersHorizontal, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';

export const StateSimulatorBar: React.FC = () => {
  const { 
    forcedGlobalState, 
    setForcedGlobalState, 
    resetGlobalState, 
    currentUser, 
    switchRole 
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const statesList: { id: UIState | 'default'; label: string; desc: string }[] = [
    { id: 'default', label: '1. Default / Success', desc: 'Tampilan data normal' },
    { id: 'loading', label: '2. Loading State', desc: 'Indikator skeleton pemuatan' },
    { id: 'empty', label: '3. Empty State', desc: 'Tampilan data nihil/kosong' },
    { id: 'error', label: '4. Error State (500)', desc: 'Kesalahan sistem + tombol retry' },
    { id: 'unauthorized', label: '5. Unauthorized (401)', desc: 'Sesi habis / belum login' },
    { id: 'forbidden', label: '6. Forbidden (403)', desc: 'Penolakan akses peran (RBAC)' },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm w-full transition-all duration-200">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-xl border border-slate-800 p-3">
        {/* Toggle Bar Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide">
              Inspector 6 State UI (SOP SOP-VK-01)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {forcedGlobalState && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                {forcedGlobalState}
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              aria-label={isExpanded ? 'Tutup Inspector' : 'Buka Inspector'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verifikasi mandat 6 status UI untuk setiap modul secara instan:
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {statesList.map((item) => {
                const isActive = (forcedGlobalState === null && item.id === 'default') || forcedGlobalState === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'default') {
                        resetGlobalState();
                      } else {
                        setForcedGlobalState(item.id);
                      }
                    }}
                    className={`text-left p-2 rounded-lg text-xs transition-colors border ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-500 font-medium'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <div className="font-medium text-[11px] truncate">{item.label}</div>
                    <div className="text-[10px] text-slate-400 truncate opacity-80">{item.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400">
                User: <span className="font-semibold text-slate-200 uppercase">{currentUser?.role || 'Guest'}</span>
              </span>
              <button
                onClick={resetGlobalState}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Reset ke Realtime
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
