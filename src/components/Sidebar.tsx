import React from 'react';
import {
  ShoppingCart,
  History,
  TrendingUp,
  Package,
  Layers,
  Store,
  DollarSign,
  X,
  RefreshCw,
  Bell,
  Sparkles,
} from 'lucide-react';
import { StoreSettings } from '../types/index.ts';
import { formatRupiah } from '../utils/formatters.ts';

export type ActiveTab = 'pos' | 'history' | 'reports' | 'inventory' | 'stocklogs' | 'shift' | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  settings: StoreSettings;
  todaySales: number;
  lowStockCount: number;
  onTriggerDemoSale?: () => void;
  isSimulating?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  settings,
  todaySales,
  lowStockCount,
  onTriggerDemoSale,
  isSimulating,
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'pos' as ActiveTab, label: 'Transaksi Baru', icon: ShoppingCart },
    { id: 'history' as ActiveTab, label: 'Riwayat Transaksi', icon: History },
    { id: 'reports' as ActiveTab, label: 'Laporan Penjualan Real-Time', icon: TrendingUp, highlight: true },
    { id: 'inventory' as ActiveTab, label: 'Manajemen Stok & Barang', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Tipis` : undefined },
    { id: 'stocklogs' as ActiveTab, label: 'Mutasi & Kartu Stok', icon: Layers },
    { id: 'shift' as ActiveTab, label: 'Rekap Kasir & Laci Kas', icon: DollarSign },
    { id: 'settings' as ActiveTab, label: 'Pengaturan Toko & Struk', icon: Store },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 sm:w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header matching Griyo Blue */}
        <div className="bg-[#0d47a1] text-white p-5 pt-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight tracking-tight text-white">{settings.storeName}</h2>
                <p className="text-xs text-blue-200 mt-0.5">{settings.tagline}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
            <div>
              <span className="text-blue-300">Kasir: </span>
              <span className="font-semibold text-white">{settings.activeCashier}</span>
            </div>
            <div className="text-right">
              <span className="text-blue-300">Omzet: </span>
              <span className="font-bold text-white">{formatRupiah(todaySales)}</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Menu Utama
          </div>
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-blue-50 text-[#0d47a1] font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#0d47a1]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Real-time Simulator Section */}
          <div className="mt-6 px-4 py-3 mx-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Simulasi Real-Time</span>
            </div>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Coba simulasi transaksi kasir masuk secara live untuk melihat laporan penjualan real-time.
            </p>
            {onTriggerDemoSale && (
              <button
                onClick={onTriggerDemoSale}
                className="w-full py-2 px-3 text-xs font-semibold bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 text-slate-700 rounded-lg shadow-2xs flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-blue-600' : ''}`} />
                <span>+ Transaksi Kasir Simulasi</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Sistem Kasir Aktif</span>
          </div>
          <span className="text-slate-400">v2.4 Griyo POS</span>
        </div>
      </div>
    </div>
  );
};
