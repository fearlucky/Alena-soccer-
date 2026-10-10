import React, { useRef } from 'react';
import {
  Printer,
  Share2,
  CheckCircle,
  Copy,
  RotateCcw,
  X,
  FileCheck,
} from 'lucide-react';
import { Transaction, StoreSettings } from '../types/index.ts';
import { formatRupiah, formatTanggalJam } from '../utils/formatters.ts';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  settings: StoreSettings;
  onNewTransaction: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  settings,
  onNewTransaction,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const getReceiptPlainText = () => {
    const divider = '--------------------------------';
    const lines = [
      settings.storeName,
      settings.address,
      `Telp: ${settings.phone}`,
      divider,
      `No: ${transaction.id}`,
      `Tgl: ${formatTanggalJam(transaction.timestamp)}`,
      `Kasir: ${transaction.cashierName}`,
      transaction.customerName ? `Pelanggan: ${transaction.customerName}` : '',
      divider,
      ...transaction.items.map(
        (it) =>
          `${it.productName}\n  ${it.quantity} x ${formatRupiah(it.sellPrice)} = ${formatRupiah(it.subtotal)}`
      ),
      divider,
      `Subtotal: ${formatRupiah(transaction.subtotal)}`,
      transaction.discountAmount > 0
        ? `Diskon: -${formatRupiah(transaction.discountAmount)}`
        : '',
      `TOTAL: ${formatRupiah(transaction.grandTotal)}`,
      `Bayar (${transaction.paymentMethod}): ${formatRupiah(transaction.amountPaid)}`,
      `Kembali: ${formatRupiah(transaction.change)}`,
      divider,
      settings.receiptFooter,
    ].filter(Boolean);

    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getReceiptPlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getReceiptPlainText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[95vh]">
        {/* Top Success Banner */}
        <div className="bg-emerald-600 text-white p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-200" />
            <span className="font-bold text-sm">Transaksi Berhasil!</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Receipt Paper Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex justify-center">
          <div
            ref={receiptRef}
            className="w-full bg-white p-5 rounded-md shadow-xs border border-slate-300 font-mono text-[11px] leading-tight text-slate-800 printable-receipt"
            style={{ maxWidth: settings.paperWidth === '80mm' ? '320px' : '260px' }}
          >
            {/* Header Toko */}
            <div className="text-center pb-2 border-b border-dashed border-slate-400">
              <h3 className="font-black text-sm uppercase tracking-wider text-slate-900">
                {settings.storeName}
              </h3>
              <p className="text-[10px] text-slate-600 mt-0.5">{settings.address}</p>
              <p className="text-[10px] text-slate-600">Telp: {settings.phone}</p>
            </div>

            {/* Meta Nota */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal:</span>
                <span>{formatTanggalJam(transaction.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
              {transaction.customerName && (
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold">{transaction.customerName}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-2">
              {transaction.items.map((it, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold uppercase text-[10.5px] truncate">
                    {it.productName}
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {it.quantity} x {formatRupiah(it.sellPrice)}
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatRupiah(it.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Diskon</span>
                  <span className="tabular-nums">-{formatRupiah(transaction.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-200 text-slate-900">
                <span>TOTAL</span>
                <span className="tabular-nums">{formatRupiah(transaction.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-[10.5px] pt-1">
                <span>Metode:</span>
                <span className="font-bold">{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[10.5px]">
                <span>Bayar:</span>
                <span className="tabular-nums">{formatRupiah(transaction.amountPaid)}</span>
              </div>
              <div className="flex justify-between text-[10.5px]">
                <span>Kembali:</span>
                <span className="font-bold tabular-nums">{formatRupiah(transaction.change)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-3 text-[10px] text-slate-600 whitespace-pre-line">
              {settings.receiptFooter}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-2">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={handlePrint}
              className="py-2 px-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={handleCopy}
              className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onNewTransaction();
            }}
            className="w-full py-2.5 bg-[#0d47a1] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Transaksi Baru Selanjutnya</span>
          </button>
        </div>
      </div>
    </div>
  );
};
