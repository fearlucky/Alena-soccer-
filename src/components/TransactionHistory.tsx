import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  Printer,
  Ban,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
} from 'lucide-react';
import { Transaction } from '../types/index.ts';
import { formatRupiah, formatTanggalJam } from '../utils/formatters.ts';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onOpenReceipt: (tx: Transaction) => void;
  onVoidTransaction: (txId: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onOpenReceipt,
  onVoidTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LUNAS' | 'HUTANG' | 'DIBATALKAN'>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.customerName && tx.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tx.items.some((i) => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchSearch) return false;

      if (statusFilter !== 'ALL' && tx.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [transactions, searchQuery, statusFilter]);

  return (
    <div className="p-3 sm:p-5 max-w-6xl mx-auto space-y-4">
      {/* Header & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-700" />
              <span>Riwayat Transaksi & Nota</span>
            </h2>
            <p className="text-xs text-slate-500">
              Daftar seluruh nota penjualan, kasbon, dan status pembayaran
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari no. nota / nama pelanggan..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Status:</span>
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'LUNAS', label: 'Lunas' },
            { id: 'HUTANG', label: 'Kasbon / Hutang' },
            { id: 'DIBATALKAN', label: 'Dibatalkan (Void)' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                statusFilter === st.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada riwayat transaksi</p>
            <p className="text-xs text-slate-400 mt-1">Belum ada transaksi dengan kriteria ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3.5">No Nota</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Pelanggan & Kasir</th>
                  <th className="py-3 px-3">Item Ringkas</th>
                  <th className="py-3 px-3 text-right">Total Transaksi</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tx) => {
                  const isVoided = tx.status === 'DIBATALKAN';
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isVoided ? 'bg-red-50/30 opacity-70' : ''
                      }`}
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-800">
                        {tx.id}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatTanggalJam(tx.timestamp)}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">
                          {tx.customerName || 'Pelanggan Umum'}
                        </div>
                        <div className="text-[10.5px] text-slate-400">{tx.cashierName}</div>
                      </td>
                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-600">
                        {tx.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900 tabular-nums">
                        {formatRupiah(tx.grandTotal)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                            tx.status === 'LUNAS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tx.status === 'HUTANG'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800 line-through'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenReceipt(tx)}
                            title="Cetak Ulang Struk"
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Struk</span>
                          </button>
                          {!isVoided && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Batalkan transaksi ${tx.id}? Stok barang akan dikembalikan secara otomatis!`
                                  )
                                ) {
                                  onVoidTransaction(tx.id);
                                }
                              }}
                              title="Batalkan Transaksi & Kembalikan Stok"
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
