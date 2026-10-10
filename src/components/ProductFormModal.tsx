import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Percent } from 'lucide-react';
import { Product, ProductCategory } from '../types/index.ts';
import { formatRupiah } from '../utils/formatters.ts';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  onSaveProduct: (productData: Partial<Product>) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Air Mineral',
  'Minuman Dingin',
  'Olahraga & Sewa',
  'Makanan & Snack',
  'Sembako & Lainnya',
];

const UNITS = ['Pcs', 'Botol', 'Galon', 'Bungkus', 'Kg', 'Pouch', 'Dus', 'Jam'];

const ICON_TYPES = [
  { id: 'bottle-small', label: 'Botol Kecil' },
  { id: 'bottle-large', label: 'Botol Besar' },
  { id: 'gallon', label: 'Galon 19L' },
  { id: 'soccer', label: 'Bola' },
  { id: 'juice', label: 'Jus / Floridina' },
  { id: 'coffee', label: 'Kopi / Golda' },
  { id: 'isotonic', label: 'Pocari / Isotonik' },
  { id: 'tea', label: 'Teh / Javana' },
  { id: 'milk', label: 'Susu / Milku' },
  { id: 'stadium', label: 'Sewa Lapangan' },
  { id: 'bike', label: 'Sewa Sepeda' },
  { id: 'noodle', label: 'Mie / Makanan' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaveProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Minuman Dingin');
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [minStock, setMinStock] = useState<number>(5);
  const [unit, setUnit] = useState<string>('Pcs');
  const [sku, setSku] = useState<string>('');
  const [iconType, setIconType] = useState<string>('bottle-small');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setBuyPrice(productToEdit.buyPrice);
      setSellPrice(productToEdit.sellPrice);
      setStock(productToEdit.stock);
      setMinStock(productToEdit.minStock);
      setUnit(productToEdit.unit);
      setSku(productToEdit.sku);
      setIconType(productToEdit.iconType || 'bottle-small');
    } else {
      // Default new product values
      setName('');
      setCategory('Minuman Dingin');
      setBuyPrice(3000);
      setSellPrice(4500);
      setStock(20);
      setMinStock(5);
      setUnit('Pcs');
      setSku(`SKU-${Date.now().toString().slice(-6)}`);
      setIconType('bottle-small');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const profitPerUnit = Math.max(0, sellPrice - buyPrice);
  const profitMarginPercent =
    sellPrice > 0 ? Math.round((profitPerUnit / sellPrice) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProduct({
      ...(productToEdit ? { id: productToEdit.id } : {}),
      name: name.toUpperCase().trim(),
      category,
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
      stock: Number(stock),
      minStock: Number(minStock),
      unit,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-6)}`,
      iconType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0d47a1] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base sm:text-lg">
              {productToEdit ? 'Edit Data Barang' : 'Tambah Barang Baru'}
            </h3>
            <p className="text-xs text-blue-200">
              Master katalog barang & ketentuan harga jual
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Nama Barang */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nama Barang *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: POCARI SWEAT 500ML"
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#0d47a1]"
            />
          </div>

          {/* Kategori & Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Satuan Barang
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Barcode / SKU */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Barcode / SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU-XXX-001"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
            />
          </div>

          {/* Harga Modal & Harga Jual */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harga Modal / Beli (Rp)
              </label>
              <input
                type="number"
                value={buyPrice || ''}
                onChange={(e) => setBuyPrice(Math.max(0, Number(e.target.value)))}
                min={0}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harga Jual Kasir (Rp)
              </label>
              <input
                type="number"
                value={sellPrice || ''}
                onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value)))}
                min={0}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-blue-800 tabular-nums focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
              />
            </div>
          </div>

          {/* Profit Preview Banner */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-blue-700 block font-semibold">Estimasi Laba per Unit:</span>
              <span className="font-bold text-sm text-[#0d47a1] tabular-nums">
                {formatRupiah(profitPerUnit)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-blue-700 block font-semibold">Margin Keuntungan:</span>
              <span className="font-bold text-sm text-emerald-700 tabular-nums">
                {profitMarginPercent}%
              </span>
            </div>
          </div>

          {/* Stok Awal & Stok Minimum */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {productToEdit ? 'Stok Saat Ini' : 'Stok Awal'} ({unit})
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
                min={0}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ambang Batas Menipis (Alert)
              </label>
              <input
                type="number"
                value={minStock}
                onChange={(e) => setMinStock(Math.max(0, Number(e.target.value)))}
                min={0}
                required
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-1 focus:ring-[#0d47a1]"
              />
            </div>
          </div>

          {/* Icon Style Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Ikon Tampilan
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-1 border border-slate-200 rounded-xl">
              {ICON_TYPES.map((ic) => (
                <button
                  key={ic.id}
                  type="button"
                  onClick={() => setIconType(ic.id)}
                  className={`p-1.5 rounded-lg border text-[11px] font-medium transition-all text-center truncate ${
                    iconType === ic.id
                      ? 'border-[#0d47a1] bg-blue-50 text-[#0d47a1] font-bold ring-1 ring-[#0d47a1]'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
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
              {productToEdit ? 'Simpan Perubahan' : 'Tambahkan Barang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
