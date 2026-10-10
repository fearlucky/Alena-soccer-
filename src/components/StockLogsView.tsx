import React, { useState } from 'react';
import { Layers, ArrowUpRight, ArrowDownRight, AlertOctagon, RotateCcw, Filter, Search } from 'lucide-react';
import { StockLog } from '../types/index.ts';
import { formatTanggalJam } from '../utils/formatters.ts';

interface StockLogsViewProps {
  logs: StockLog[];
}

export const StockLogsView: React.FC<StockLogsViewProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      search.trim() === '' ||
      log.productName.toLowerCase().includes(search.toLowerCase()) ||
      log.note.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;
    if (typeFilter !== 'ALL' && log.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-3 sm:p-5 max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-700" />
              <span>Mutasi & Kartu Stok Real-Time</span>
            </h2>
            <p className="text-xs text-slate-500">
              Riwayat keluar masuk barang secara otomatis dari kasir dan restok
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama barang / alasan..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-xs overflow-x-auto no-scrollbar">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Tipe:</span>
          {[
            { id: 'ALL', label: 'Semua Mutasi' },
            { id: 'OUT_SALE', label: 'Penjualan Kasir' },
            { id: 'IN_PURCHASE', label: 'Restok Masuk' },
            { id: 'DAMAGED_EXPIRED', label: 'Barang Rusak' },
            { id: 'RETURN_RESTORE', label: 'Retur / Batal' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTypeFilter(btn.id)}
              className={`whitespace-nowrap px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                typeFilter === btn.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Belum ada riwayat mutasi</p>
            <p className="text-xs text-slate-400 mt-1">Mutasi akan tercatat otomatis saat ada transaksi atau restok</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3.5">Waktu</th>
                  <th className="py-3 px-3">Nama Barang</th>
                  <th className="py-3 px-3">Jenis Mutasi</th>
                  <th className="py-3 px-3 text-center">Perubahan</th>
                  <th className="py-3 px-3 text-right">Stok Sebelum &rarr; Sesudah</th>
                  <th className="py-3 px-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  const isPositive = log.quantityChange > 0;
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3.5 text-slate-500 font-mono text-[11px]">
                        {formatTanggalJam(log.timestamp)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 uppercase">
                        {log.productName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${
                            log.type === 'IN_PURCHASE'
                              ? 'bg-emerald-50 text-emerald-800'
                              : log.type === 'OUT_SALE'
                              ? 'bg-blue-50 text-blue-800'
                              : log.type === 'RETURN_RESTORE'
                              ? 'bg-purple-50 text-purple-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          {log.type === 'IN_PURCHASE'
                            ? 'Restok Masuk'
                            : log.type === 'OUT_SALE'
                            ? 'Penjualan'
                            : log.type === 'RETURN_RESTORE'
                            ? 'Retur / Batal'
                            : 'Penyesuaian / Rusak'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold tabular-nums">
                        <span
                          className={isPositive ? 'text-emerald-700' : 'text-red-600'}
                        >
                          {isPositive ? `+${log.quantityChange}` : log.quantityChange}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-600 font-medium">
                        {log.stockBefore} &rarr;{' '}
                        <strong className="text-slate-900">{log.stockAfter}</strong>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {log.note}
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
