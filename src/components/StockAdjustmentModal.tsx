import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, AlertOctagon, RotateCcw } from 'lucide-react';
import { Product, StockMovementType } from '../types/index.ts';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirmAdjustment: (
    productId: string,
    type: StockMovementType,
    quantityChange: number,
    note: string
  ) => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirmAdjustment,
}) => {
  const [adjustmentType, setAdjustmentType] = useState<StockMovementType>('IN_PURCHASE');
  const [quantity, setQuantity] = useState<number>(10);
  const [note, setNote] = useState<string>('Kulakan stok baru');

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    let finalChange = quantity;
    if (adjustmentType === 'DAMAGED_EXPIRED') {
      finalChange = -quantity;
    } else if (adjustmentType === 'ADJUSTMENT') {
      // Manual adjustment
      finalChange = quantity; // or user entered delta
    }

    onConfirmAdjustment(product.id, adjustmentType, finalChange, note);
    onClose();
  };

  const calculatedNewStock =
    adjustmentType === 'DAMAGED_EXPIRED'
      ? Math.max(0, product.stock - quantity)
      : product.stock + quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        <div className="bg-[#0d47a1] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg">Penyesuaian Stok Barang</h3>
            <p className="text-xs text-blue-200 uppercase tracking-wider">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Current Stock Banner */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 block">Stok Saat Ini:</span>
              <span className="font-bold text-base text-slate-800 tabular-nums">
                {product.stock} {product.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Estimasi Stok Akhir:</span>
              <span
                className={`font-black text-base tabular-nums ${
                  calculatedNewStock < product.stock ? 'text-amber-600' : 'text-emerald-700'
                }`}
              >
                {calculatedNewStock} {product.unit}
              </span>
            </div>
          </div>

          {/* Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Jenis Mutasi Stok
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('IN_PURCHASE');
                  setNote('Restok barang masuk / kulakan');
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all ${
                  adjustmentType === 'IN_PURCHASE'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Restok Masuk (+)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('DAMAGED_EXPIRED');
                  setNote('Barang rusak / kadaluarsa');
                }}
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-bold transition-all ${
                  adjustmentType === 'DAMAGED_EXPIRED'
                    ? 'border-red-600 bg-red-50 text-red-800 ring-1 ring-red-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                <span>Barang Rusak (-)</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Jumlah Unit ({product.unit})
            </label>
            <input
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              min={1}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d47a1]"
            />
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan / Alasan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Kulakan pasar / pecah di rak"
              required
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 bg-[#0d47a1] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Simpan Penyesuaian
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
