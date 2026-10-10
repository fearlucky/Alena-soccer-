import React from 'react';
import { X, Trash2, Plus, Minus, User, FileText, Tag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types/index.ts';
import { formatRupiah } from '../utils/formatters.ts';
import { ProductIcon } from './ProductIcon.tsx';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  discountAmount: number;
  onDiscountChange: (amount: number) => void;
  onProceedToPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  customerName,
  onCustomerNameChange,
  notes,
  onNotesChange,
  discountAmount,
  onDiscountChange,
  onProceedToPayment,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-[#0d47a1] text-white px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base sm:text-lg">Keranjang Transaksi</h2>
            <span className="text-xs bg-white/20 text-white font-semibold px-2 py-0.5 rounded-full">
              {totalQty} item
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Note inputs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Nama Pelanggan (opsional / umum)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="relative flex items-center">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Catatan Transaksi (misal: Meja 02 / Bawa pulang)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-600">Keranjang masih kosong</p>
              <p className="text-xs text-slate-400 mt-1">Pilih barang dari daftar untuk mulai transaksi</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="p-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <ProductIcon
                    type={item.product.iconType}
                    name={item.product.name}
                    className="w-10 h-10 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate uppercase">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {formatRupiah(item.product.sellPrice)} / {item.product.unit}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-bold text-xs sm:text-sm text-slate-800 tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="w-7 h-7 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 rounded flex items-center justify-center transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="w-7 h-7 text-red-500 hover:bg-red-50 rounded flex items-center justify-center transition-colors ml-1"
                    title="Hapus barang"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout Section */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            {/* Discount input */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Potongan / Diskon (Rp)
              </span>
              <input
                type="number"
                value={discountAmount || ''}
                onChange={(e) => onDiscountChange(Math.max(0, Number(e.target.value)))}
                placeholder="0"
                min="0"
                className="w-24 text-right px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold tabular-nums">{formatRupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Diskon</span>
                  <span className="font-semibold tabular-nums">- {formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-1">
                <span>Total Bayar</span>
                <span className="text-blue-800 tabular-nums">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClearCart}
                className="py-2.5 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 active:bg-red-100 border border-red-200 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onClose();
                  onProceedToPayment();
                }}
                className="flex-1 py-2.5 px-4 bg-[#0d47a1] hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Proses Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
