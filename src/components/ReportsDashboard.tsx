import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Award,
  Calendar,
  Download,
  Printer,
  Sparkles,
  ArrowUpRight,
  PieChart,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Transaction, StoreSettings } from '../types/index.ts';
import { formatRupiah, formatNumber, formatTanggalJam } from '../utils/formatters.ts';

interface ReportsDashboardProps {
  transactions: Transaction[];
  settings: StoreSettings;
  onOpenReceipt: (tx: Transaction) => void;
}

export type PeriodFilter = 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH' | 'ALL';

export const ReportsDashboard: React.FC<ReportsDashboardProps> = ({
  transactions,
  settings,
  onOpenReceipt,
}) => {
  const [period, setPeriod] = useState<PeriodFilter>('TODAY');

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfYesterday = startOfToday - 86400000;
    const startOfWeek = startOfToday - 86400000 * 7;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return transactions.filter((tx) => {
      // Exclude voided transactions from revenue
      if (tx.status === 'DIBATALKAN') return false;

      const txTime = new Date(tx.timestamp).getTime();

      switch (period) {
        case 'TODAY':
          return txTime >= startOfToday;
        case 'YESTERDAY':
          return txTime >= startOfYesterday && txTime < startOfToday;
        case 'WEEK':
          return txTime >= startOfWeek;
        case 'MONTH':
          return txTime >= startOfMonth;
        case 'ALL':
        default:
          return true;
      }
    });
  }, [transactions, period]);

  // Aggregate Metrics
  const totalRevenue = useMemo(
    () => filteredTransactions.reduce((sum, tx) => sum + tx.grandTotal, 0),
    [filteredTransactions]
  );

  const totalCost = useMemo(
    () => filteredTransactions.reduce((sum, tx) => sum + tx.totalCost, 0),
    [filteredTransactions]
  );

  const grossProfit = useMemo(() => totalRevenue - totalCost, [totalRevenue, totalCost]);

  const totalTransactionsCount = filteredTransactions.length;

  const totalItemsSold = useMemo(
    () =>
      filteredTransactions.reduce(
        (sum, tx) => sum + tx.items.reduce((s, it) => s + it.quantity, 0),
        0
      ),
    [filteredTransactions]
  );

  const averageBasketSize =
    totalTransactionsCount > 0 ? Math.round(totalRevenue / totalTransactionsCount) : 0;

  const profitMarginPercent =
    totalRevenue > 0 ? Math.round((grossProfit / totalRevenue) * 100) : 0;

  // Payment Breakdown
  const paymentMethodBreakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {
      TUNAI: { count: 0, total: 0 },
      QRIS: { count: 0, total: 0 },
      TRANSFER: { count: 0, total: 0 },
      HUTANG: { count: 0, total: 0 },
    };

    for (const tx of filteredTransactions) {
      if (!map[tx.paymentMethod]) {
        map[tx.paymentMethod] = { count: 0, total: 0 };
      }
      map[tx.paymentMethod].count += 1;
      map[tx.paymentMethod].total += tx.grandTotal;
    }
    return map;
  }, [filteredTransactions]);

  // Top Selling Products
  const topProducts = useMemo(() => {
    const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    for (const tx of filteredTransactions) {
      for (const item of tx.items) {
        const existing = itemMap.get(item.productId) || {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.subtotal;
        itemMap.set(item.productId, existing);
      }
    }

    return Array.from(itemMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredTransactions]);

  // Hourly Sales Distribution (08:00 - 22:00)
  const hourlySales = useMemo(() => {
    const hours = [8, 10, 12, 14, 16, 18, 20, 22];
    const data = hours.map((h) => ({
      hourLabel: `${String(h).padStart(2, '0')}:00`,
      total: 0,
      count: 0,
    }));

    for (const tx of filteredTransactions) {
      const txHour = new Date(tx.timestamp).getHours();
      // bucket to closest
      const idx = Math.min(
        data.length - 1,
        Math.max(0, Math.floor((txHour - 8) / 2))
      );
      data[idx].total += tx.grandTotal;
      data[idx].count += 1;
    }

    return data;
  }, [filteredTransactions]);

  const maxHourlyTotal = Math.max(1, ...hourlySales.map((h) => h.total));

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'No Nota',
      'Waktu',
      'Kasir',
      'Pelanggan',
      'Metode Bayar',
      'Item Terjual',
      'Subtotal',
      'Diskon',
      'Total Penjualan',
      'Estimasi Laba',
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      `"${formatTanggalJam(tx.timestamp)}"`,
      `"${tx.cashierName}"`,
      `"${tx.customerName || '-'}"`,
      tx.paymentMethod,
      tx.items.map((i) => `${i.productName} (x${i.quantity})`).join('; '),
      tx.subtotal,
      tx.discountAmount,
      tx.grandTotal,
      tx.profit,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_penjualan_${period.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-3 sm:p-5 max-w-6xl mx-auto space-y-4">
      {/* Real-time Status Badge & Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              Laporan Penjualan Real-Time
            </h2>
            <p className="text-[11px] text-slate-500">
              Sinkronisasi data penjualan & mutasi kasir secara otomatis
            </p>
          </div>
        </div>

        {/* Period Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto no-scrollbar">
          {[
            { id: 'TODAY' as PeriodFilter, label: 'Hari Ini' },
            { id: 'YESTERDAY' as PeriodFilter, label: 'Kemarin' },
            { id: 'WEEK' as PeriodFilter, label: '7 Hari' },
            { id: 'MONTH' as PeriodFilter, label: 'Bulan Ini' },
            { id: 'ALL' as PeriodFilter, label: 'Semua' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                period === item.id
                  ? 'bg-white text-[#0d47a1] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Omzet Penjualan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Omzet Penjualan</span>
            <DollarSign className="w-4 h-4 text-[#0d47a1]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#0d47a1] mt-1.5 tabular-nums">
            {formatRupiah(totalRevenue)}
          </p>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="font-semibold text-slate-700">{totalTransactionsCount}</span> transaksi kasir
          </div>
        </div>

        {/* Laba Kotor */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Estimasi Laba Kotor</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1.5 tabular-nums">
            {formatRupiah(grossProfit)}
          </p>
          <div className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Margin {profitMarginPercent}% dari omzet</span>
          </div>
        </div>

        {/* Produk Terjual */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Item Terjual</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 tabular-nums">
            {formatNumber(totalItemsSold)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Barang keluar kasir</p>
        </div>

        {/* Rata-Rata Nilai Transaksi */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Rata-Rata Transaksi</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5 tabular-nums">
            {formatRupiah(averageBasketSize)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Basket size per nota</p>
        </div>
      </div>

      {/* Hourly Sales Trend Bar Chart */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Distribusi Tren Omzet Penjualan
            </h3>
            <p className="text-xs text-slate-500">
              Aktivitas penjualan kasir berdasarkan rentang jam operasional
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV</span>
            </button>
            <button
              onClick={handlePrintReport}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="pt-4 pb-2">
          <div className="h-40 flex items-end gap-2 sm:gap-4 px-2">
            {hourlySales.map((h, i) => {
              const heightPercent =
                maxHourlyTotal > 0 ? Math.round((h.total / maxHourlyTotal) * 100) : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {formatRupiah(h.total)}
                  </span>
                  <div
                    style={{ height: `${Math.max(6, heightPercent)}%` }}
                    className="w-full max-w-[48px] bg-blue-600 hover:bg-blue-700 rounded-t-md transition-all shadow-2xs group-hover:bg-[#0d47a1]"
                  />
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500">
                    {h.hourLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column: Top Products & Payment Methods Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Best Sellers */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>5 Produk Terlaris</span>
            </h3>
            <span className="text-xs text-slate-400">Berdasarkan kuantitas</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Belum ada data produk terjual pada periode ini
              </p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-800'
                          : idx === 2
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate uppercase">
                        {p.name}
                      </h4>
                      <span className="text-slate-500 text-[11px]">
                        Kontribusi: {formatRupiah(p.revenue)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 text-sm tabular-nums">
                      {p.quantity} pcs
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>Metode Pembayaran</span>
            </h3>
            <span className="text-xs text-slate-400">Total Nominal</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              {
                id: 'TUNAI',
                label: 'Uang Tunai (Cash)',
                color: 'bg-emerald-500',
                data: paymentMethodBreakdown.TUNAI,
              },
              {
                id: 'QRIS',
                label: 'QRIS Digital (BCA/DANA/Gopay)',
                color: 'bg-blue-600',
                data: paymentMethodBreakdown.QRIS,
              },
              {
                id: 'TRANSFER',
                label: 'Transfer Bank (BCA/Mandiri)',
                color: 'bg-indigo-600',
                data: paymentMethodBreakdown.TRANSFER,
              },
              {
                id: 'HUTANG',
                label: 'Kasbon / Piutang Pelanggan',
                color: 'bg-amber-500',
                data: paymentMethodBreakdown.HUTANG,
              },
            ].map((m) => {
              const pct = totalRevenue > 0 ? Math.round((m.data.total / totalRevenue) * 100) : 0;
              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-sm ${m.color}`} />
                      <span className="font-semibold text-slate-800">{m.label}</span>
                      <span className="text-slate-400">({m.data.count} trx)</span>
                    </div>
                    <div className="font-bold text-slate-900 tabular-nums">
                      {formatRupiah(m.data.total)}{' '}
                      <span className="text-slate-400 font-normal">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${m.color} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shift Cash Drawer Summary */}
          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg text-xs space-y-1">
            <div className="flex justify-between text-slate-600">
              <span>Modal Kasir Awal:</span>
              <span className="font-bold tabular-nums">{formatRupiah(settings.initialCash)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Penerimaan Kas Tunai:</span>
              <span className="font-bold tabular-nums text-emerald-700">
                +{formatRupiah(paymentMethodBreakdown.TUNAI.total)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
              <span>Estimasi Uang di Laci Kas:</span>
              <span className="font-black text-[#0d47a1] tabular-nums">
                {formatRupiah(settings.initialCash + paymentMethodBreakdown.TUNAI.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Live Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Riwayat Transaksi Terkini ({filteredTransactions.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Klik nota untuk cetak ulang</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">No. Nota</th>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Pelanggan</th>
                <th className="py-2.5 px-3">Metode</th>
                <th className="py-2.5 px-3 text-right">Total Transaksi</th>
                <th className="py-2.5 px-3 text-right">Laba</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.slice(0, 8).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                    {tx.id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {formatTanggalJam(tx.timestamp)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 font-medium">
                    {tx.customerName || 'Umum'}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        tx.paymentMethod === 'TUNAI'
                          ? 'bg-emerald-50 text-emerald-800'
                          : tx.paymentMethod === 'QRIS'
                          ? 'bg-blue-50 text-blue-800'
                          : tx.paymentMethod === 'HUTANG'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-indigo-50 text-indigo-800'
                      }`}
                    >
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900 tabular-nums">
                    {formatRupiah(tx.grandTotal)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-700 tabular-nums">
                    +{formatRupiah(tx.profit)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onOpenReceipt(tx)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold transition-colors"
                    >
                      Cetak Struk
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
