import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  AlertTriangle,
  Download,
  Edit2,
  Trash2,
  ArrowUpDown,
  Package,
  Layers,
  TrendingUp,
  X,
} from 'lucide-react';
import { Product, ProductCategory } from '../types/index.ts';
import { formatRupiah, formatNumber } from '../utils/formatters.ts';
import { ProductIcon } from './ProductIcon.tsx';

interface InventoryManagementProps {
  products: Product[];
  onOpenAddProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
  onOpenAdjustStock: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  products,
  onOpenAddProduct,
  onOpenEditProduct,
  onOpenAdjustStock,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  // Stats
  const totalProducts = products.length;
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalAssetValue = products.reduce((sum, p) => sum + p.stock * p.buyPrice, 0);
  const totalPotentialSales = products.reduce((sum, p) => sum + p.stock * p.sellPrice, 0);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.minStock);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryFilter !== 'ALL' && p.category !== categoryFilter) {
        return false;
      }

      if (stockStatusFilter === 'LOW') {
        return p.stock > 0 && p.stock <= p.minStock;
      }

      if (stockStatusFilter === 'OUT') {
        return p.stock <= 0;
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter, stockStatusFilter]);

  const exportCSV = () => {
    const headers = [
      'ID',
      'Nama Barang',
      'Kategori',
      'SKU',
      'Harga Modal (Rp)',
      'Harga Jual (Rp)',
      'Stok',
      'Satuan',
      'Ambang Batas',
    ];
    const rows = products.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.category}"`,
      p.sku,
      p.buyPrice,
      p.sellPrice,
      p.stock,
      p.unit,
      p.minStock,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stok_barang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3 sm:p-5 max-w-6xl mx-auto space-y-4">
      {/* Top Banner & KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Jenis Barang</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(totalProducts)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {formatNumber(totalStockUnits)} unit fisik
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Nilai Aset Modal</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(totalAssetValue)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Potensi omzet: {formatRupiah(totalPotentialSales)}
          </p>
        </div>

        <button
          onClick={() => setStockStatusFilter(stockStatusFilter === 'LOW' ? 'ALL' : 'LOW')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            stockStatusFilter === 'LOW'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-amber-700">Stok Menipis</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {lowStockProducts.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Di bawah ambang minimum</p>
        </button>

        <button
          onClick={() => setStockStatusFilter(stockStatusFilter === 'OUT' ? 'ALL' : 'OUT')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            stockStatusFilter === 'OUT'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-400'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold text-red-700">Stok Habis (0)</span>
            <span className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1 tabular-nums">
            {outOfStockProducts.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Perlu segera diisi ulang</p>
        </button>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama barang, kategori, atau barcode SKU..."
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

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
              title="Unduh format spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={onOpenAddProduct}
              className="py-2 px-3.5 bg-[#0d47a1] hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors shrink-0 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Barang</span>
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs pt-1 border-t border-slate-100">
          <span className="text-slate-400 shrink-0 text-[11px] font-medium mr-1">Kategori:</span>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'Air Mineral', label: 'Air Mineral' },
            { id: 'Minuman Dingin', label: 'Minuman Dingin' },
            { id: 'Olahraga & Sewa', label: 'Olahraga & Sewa' },
            { id: 'Makanan & Snack', label: 'Makanan & Snack' },
            { id: 'Sembako & Lainnya', label: 'Sembako' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product List / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada produk ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan pencarian atau filter Anda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Barang</th>
                  <th className="py-3 px-3 hidden sm:table-cell">Kategori / SKU</th>
                  <th className="py-3 px-3 text-right">Harga Modal</th>
                  <th className="py-3 px-3 text-right">Harga Jual</th>
                  <th className="py-3 px-3 text-center">Stok</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLow = p.stock > 0 && p.stock <= p.minStock;
                  const profitUnit = p.sellPrice - p.buyPrice;
                  const marginPct = p.sellPrice > 0 ? Math.round((profitUnit / p.sellPrice) * 100) : 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Name & Icon */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <ProductIcon
                            type={p.iconType}
                            name={p.name}
                            className="w-9 h-9 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 truncate uppercase text-xs sm:text-sm">
                              {p.name}
                            </h4>
                            <span className="sm:hidden text-[10px] text-slate-500 font-mono">
                              {p.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & SKU */}
                      <td className="py-2.5 px-3 hidden sm:table-cell">
                        <div className="text-slate-800 font-medium">{p.category}</div>
                        <div className="text-[10.5px] text-slate-400 font-mono">{p.sku}</div>
                      </td>

                      {/* Modal */}
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">
                        {formatRupiah(p.buyPrice)}
                      </td>

                      {/* Jual */}
                      <td className="py-2.5 px-3 text-right tabular-nums font-bold text-slate-900">
                        <div>{formatRupiah(p.sellPrice)}</div>
                        <div className="text-[10px] text-emerald-600 font-normal">
                          +{marginPct}% ({formatRupiah(profitUnit)})
                        </div>
                      </td>

                      {/* Stok Badge */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-black text-xs sm:text-sm tabular-nums px-2 py-0.5 rounded-md ${
                              isOutOfStock
                                ? 'bg-red-100 text-red-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {p.stock} {p.unit}
                          </span>
                          {isLow && (
                            <span className="text-[9.5px] text-amber-600 font-semibold mt-0.5">
                              Min {p.minStock}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenAdjustStock(p)}
                            title="Sesuaikan Stok / Restok"
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-[11px] transition-colors"
                          >
                            Restok
                          </button>
                          <button
                            onClick={() => onOpenEditProduct(p)}
                            title="Edit Barang"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus ${p.name}?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            title="Hapus Barang"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
