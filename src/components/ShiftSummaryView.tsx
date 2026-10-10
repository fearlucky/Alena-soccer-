import React, { useState } from 'react';
import { DollarSign, Printer, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Transaction, StoreSettings } from '../types/index.ts';
import { formatRupiah, formatTanggalJam } from '../utils/formatters.ts';

interface ShiftSummaryViewProps {
  transactions: Transaction[];
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const ShiftSummaryView: React.FC<ShiftSummaryViewProps> = ({
  transactions,
  settings,
  onUpdateSettings,
}) => {
  const [actualCashCount, setActualCashCount] = useState<string>('');
  const [isShiftClosed, setIsShiftClosed] = useState(false);

  // Filter transactions for today
  const todayTransactions = transactions.filter((tx) => {
    if (tx.status === 'DIBATALKAN') return false;
    const txDate = new Date(tx.timestamp).toDateString();
    const todayDate = new Date().toDateString();
    return txDate === todayDate;
  });

  const cashSales = todayTransactions
    .filter((tx) => tx.paymentMethod === 'TUNAI')
    .reduce((sum, tx) => sum + tx.grandTotal, 0);

  const nonCashSales = todayTransactions
    .filter((tx) => tx.paymentMethod === 'QRIS' || tx.paymentMethod === 'TRANSFER')
    .reduce((sum, tx) => sum + tx.grandTotal, 0);

  const creditSales = todayTransactions
    .filter((tx) => tx.paymentMethod === 'HUTANG')
    .reduce((sum, tx) => sum + tx.grandTotal, 0);

  const totalOmzet = cashSales + nonCashSales + creditSales;
  const expectedCashInDrawer = settings.initialCash + cashSales;

  const countDifference = actualCashCount
    ? Number(actualCashCount) - expectedCashInDrawer
    : 0;

  const handlePrintShift = () => {
    window.print();
  };

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-4">
      {/* Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-700" />
            <span>Rekap Kasir & Laci Kas (Shift Harian)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Penghitungan saldo fisik laci kas dan total penerimaan kasir hari ini
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintShift}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Rekap Kasir</span>
          </button>
        </div>
      </div>

      {/* Shift Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Modal Kasir Awal</span>
          <p className="text-xl font-bold text-slate-800 mt-1 tabular-nums">
            {formatRupiah(settings.initialCash)}
          </p>
          <span className="text-[11px] text-slate-400">Kas kecil uang pecahan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Penerimaan Kas Tunai</span>
          <p className="text-xl font-bold text-emerald-700 mt-1 tabular-nums">
            +{formatRupiah(cashSales)}
          </p>
          <span className="text-[11px] text-slate-400">Total pembayaran tunai</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Target Saldo Fisik Laci</span>
          <p className="text-xl font-extrabold text-[#0d47a1] mt-1 tabular-nums">
            {formatRupiah(expectedCashInDrawer)}
          </p>
          <span className="text-[11px] text-slate-400">Modal awal + Kas tunai</span>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
          Rincian Transaksi Shift Hari Ini ({todayTransactions.length} Transaksi)
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1 text-slate-600">
            <span>Kas Masuk Tunai (Cash):</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatRupiah(cashSales)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600">
            <span>Non-Tunai (QRIS & Transfer Bank):</span>
            <span className="font-bold text-blue-700 tabular-nums">{formatRupiah(nonCashSales)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600">
            <span>Hutang / Kasbon Pelanggan:</span>
            <span className="font-bold text-amber-700 tabular-nums">{formatRupiah(creditSales)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-slate-200 text-sm font-black text-slate-900">
            <span>Total Omzet Penjualan Hari Ini:</span>
            <span className="text-[#0d47a1] tabular-nums">{formatRupiah(totalOmzet)}</span>
          </div>
        </div>

        {/* Cash Counting Form */}
        <div className="mt-6 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-xl space-y-3">
          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Hitung Uang Fisik di Laci Kas (End of Shift Reconciliation)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jumlah Uang Fisik Dihitung (Rp)
              </label>
              <input
                type="number"
                value={actualCashCount}
                onChange={(e) => setActualCashCount(e.target.value)}
                placeholder="Masukkan nominal uang di laci..."
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 tabular-nums"
              />
            </div>
            {actualCashCount && (
              <div
                className={`p-2.5 rounded-lg border text-xs font-bold flex items-center justify-between ${
                  countDifference === 0
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : countDifference > 0
                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}
              >
                <span>Selisih:</span>
                <span className="tabular-nums">
                  {countDifference === 0
                    ? 'UANG COCOK (PAS)'
                    : countDifference > 0
                    ? `LEBIH +${formatRupiah(countDifference)}`
                    : `KURANG ${formatRupiah(countDifference)}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
