import React, { useState } from 'react';
import { X, Store, Volume2, VolumeX, Printer, RotateCcw, Save, Smartphone, Monitor } from 'lucide-react';
import { StoreSettings } from '../types/index.ts';
import { formatRupiah } from '../utils/formatters.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAllData,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0d47a1] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Store className="w-5 h-5 text-white" />
            <h3 className="font-bold text-base sm:text-lg">Pengaturan Toko & Kasir</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Store Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
              Profil Toko
            </h4>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Toko</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Slogan / Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. Telp / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kasir Aktif</label>
                <input
                  type="text"
                  value={formData.activeCashier}
                  onChange={(e) => setFormData({ ...formData, activeCashier: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alamat Toko</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pesan Kaki Struk (Receipt Footer)
              </label>
              <textarea
                rows={2}
                value={formData.receiptFooter}
                onChange={(e) => setFormData({ ...formData, receiptFooter: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Printer & Hardware */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
              Printer & Efek Suara
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lebar Kertas Thermal
                </label>
                <select
                  value={formData.paperWidth}
                  onChange={(e) =>
                    setFormData({ ...formData, paperWidth: e.target.value as '58mm' | '80mm' })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="58mm">58mm (Ukuran Standar Mini POS)</option>
                  <option value="80mm">80mm (Ukuran Lebar Thermal POS)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Modal Awal Kasir (Rp)
                </label>
                <input
                  type="number"
                  value={formData.initialCash}
                  onChange={(e) =>
                    setFormData({ ...formData, initialCash: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 tabular-nums focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2.5">
                {formData.enableSound ? (
                  <Volume2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <div>
                  <span className="font-bold text-slate-900 block">Efek Suara Kasir</span>
                  <span className="text-[11px] text-slate-500">
                    Bunyi beep saat klik barang & chaching saat bayar
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enableSound}
                onChange={(e) => setFormData({ ...formData, enableSound: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Reset System Data */}
          <div className="pt-2">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-red-900 block">Reset Data ke Demo Awal</span>
                <span className="text-[11px] text-red-700">
                  Kembalikan barang screenshot (BOLA, CLUB, POCARI, dll.)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Yakin ingin mereset data produk & transaksi ke data contoh awal?')) {
                    onResetAllData();
                    onClose();
                  }
                }}
                className="py-1.5 px-3 bg-white border border-red-300 text-red-700 font-bold rounded-lg text-xs hover:bg-red-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 bg-[#0d47a1] hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
