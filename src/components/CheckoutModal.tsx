import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  FileClock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { CartItem, PaymentMethod } from '../types/index.ts';
import { formatRupiah } from '../utils/formatters.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  subtotal: number;
  discountAmount: number;
  customerName: string;
  notes: string;
  cashierName: string;
  onCompleteCheckout: (data: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  subtotal,
  discountAmount,
  customerName,
  notes,
  cashierName,
  onCompleteCheckout,
}) => {
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TUNAI');
  const [cashInput, setCashInput] = useState<string>(grandTotal.toString());
  const [selectedBank, setSelectedBank] = useState<string>('BCA');

  if (!isOpen) return null;

  const numericCash = Number(cashInput) || 0;
  const change = Math.max(0, numericCash - grandTotal);
  const isCashInsufficient = paymentMethod === 'TUNAI' && numericCash < grandTotal;

  // Preset quick cash buttons
  const quickCashOptions = [
    { label: 'Uang Pas', value: grandTotal },
    { label: '10.000', value: 10000 },
    { label: '20.000', value: 20000 },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
  ].filter((opt) => opt.value >= grandTotal || opt.label === 'Uang Pas');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCashInsufficient) return;

    let finalAmountPaid = grandTotal;
    let finalChange = 0;

    if (paymentMethod === 'TUNAI') {
      finalAmountPaid = numericCash;
      finalChange = change;
    } else if (paymentMethod === 'HUTANG') {
      finalAmountPaid = 0;
      finalChange = 0;
    }

    onCompleteCheckout({
      paymentMethod,
      amountPaid: finalAmountPaid,
      change: finalChange,
    });
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
          <div>
            <h3 className="font-bold text-lg text-white">Pembayaran Transaksi</h3>
            <p className="text-xs text-blue-200">
              Kasir: {cashierName} {customerName ? `· Pelanggan: ${customerName}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Total Tagihan Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
              Total Tagihan
            </span>
            <div className="text-3xl font-extrabold text-[#0d47a1] tabular-nums mt-1">
              {formatRupiah(grandTotal)}
            </div>
            {discountAmount > 0 && (
              <p className="text-xs text-emerald-600 mt-1 font-medium">
                (Hemat {formatRupiah(discountAmount)})
              </p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'TUNAI' as PaymentMethod, label: 'Tunai', icon: Banknote },
                { id: 'QRIS' as PaymentMethod, label: 'QRIS', icon: QrCode },
                { id: 'TRANSFER' as PaymentMethod, label: 'Transfer', icon: CreditCard },
                { id: 'HUTANG' as PaymentMethod, label: 'Kasbon', icon: FileClock },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.id);
                      if (m.id === 'TUNAI') setCashInput(grandTotal.toString());
                    }}
                    className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                      isSelected
                        ? 'border-[#0d47a1] bg-blue-50/80 text-[#0d47a1] shadow-2xs ring-1 ring-[#0d47a1]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#0d47a1]' : 'text-slate-500'}`} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Method Form */}
          {paymentMethod === 'TUNAI' && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Uang Tunai Diterima (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-500 text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    min={0}
                    step={500}
                    autoFocus
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d47a1] tabular-nums"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {quickCashOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashInput(opt.value.toString())}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors tabular-nums"
                  >
                    {opt.label === 'Uang Pas' ? 'Uang Pas' : formatRupiah(opt.value)}
                  </button>
                ))}
              </div>

              {/* Change / Kembalian Calculation */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isCashInsufficient
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCashInsufficient ? (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider block">
                      {isCashInsufficient ? 'Uang Kurang' : 'Kembalian'}
                    </span>
                    <span className="text-sm font-medium">
                      {isCashInsufficient
                        ? 'Nominal tunai belum mencukupi'
                        : 'Kembalian diserahkan ke pelanggan'}
                    </span>
                  </div>
                </div>
                <div className="text-xl font-black tabular-nums">
                  {isCashInsufficient
                    ? formatRupiah(grandTotal - numericCash)
                    : formatRupiah(change)}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'QRIS' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center text-center space-y-3">
              <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-sm">
                {/* Authentic QRIS Mock */}
                <div className="w-40 h-40 bg-slate-900 p-2 rounded-lg flex flex-col items-center justify-center relative">
                  <div className="bg-white w-full h-full p-2 flex flex-col items-center justify-center">
                    <QrCode className="w-28 h-28 text-slate-900" />
                    <span className="text-[9px] font-black tracking-widest text-red-600 mt-1 uppercase">
                      QRIS INDONESIA
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Scan QRIS dari Semua Dompet Digital</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  BCA Mobile, GoPay, OVO, ShopeePay, DANA, Livin&apos; by Mandiri
                </p>
              </div>
            </div>
          )}

          {paymentMethod === 'TRANSFER' && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Pilih Rekening Bank</label>
              <div className="grid grid-cols-3 gap-2">
                {['BCA', 'Mandiri', 'BRI'].map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      selectedBank === bank
                        ? 'border-blue-600 bg-white text-blue-600 shadow-2xs ring-1 ring-blue-600'
                        : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-bold">{selectedBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Rekening:</span>
                  <span className="font-mono font-bold">142-8899-231</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Atas Nama:</span>
                  <span className="font-semibold">GRIYO MART POS</span>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'HUTANG' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <FileClock className="w-4 h-4" />
                <span>Transaksi Kasbon / Hutang Pelanggan</span>
              </div>
              <p className="leading-relaxed">
                Transaksi ini akan dicatat ke buku piutang. Stok barang akan tetap berkurang secara real-time.
              </p>
              <div className="pt-2">
                <span className="font-semibold text-slate-700">Nama Peminjam / Pelanggan:</span>{' '}
                <span className="font-bold text-slate-900">{customerName || 'Pelanggan Umum'}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCashInsufficient}
              className="flex-1 py-3 px-4 bg-[#0d47a1] hover:bg-blue-800 active:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Selesaikan Transaksi ({formatRupiah(grandTotal)})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
