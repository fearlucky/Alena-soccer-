import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  X,
  Bike,
  Activity,
  Lamp,
  Layers,
  Barcode,
  AlertTriangle,
} from 'lucide-react';
import { Product, CartItem, ProductCategory } from '../types/index.ts';
import { formatRupiah } from '../utils/formatters.ts';
import { ProductIcon } from './ProductIcon.tsx';

interface NewTransactionProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveOneFromCart: (productId: string) => void;
  onOpenCart: () => void;
  onQuickCheckout: () => void;
}

export const NewTransaction: React.FC<NewTransactionProps> = ({
  products,
  cart,
  onAddToCart,
  onRemoveOneFromCart,
  onOpenCart,
  onQuickCheckout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cart item map for quick lookup of active quantities
  const cartQuantityMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cart) {
      map.set(item.product.id, item.quantity);
    }
    return map;
  }, [cart]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalCartAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cart]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter matching Griyo Pos tab icons
      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'SPORTS') {
        return p.category === 'Olahraga & Sewa' || p.iconType === 'soccer' || p.iconType === 'stadium';
      }
      if (selectedCategory === 'BIKE') {
        return p.iconType === 'bike' || p.category === 'Olahraga & Sewa';
      }
      if (selectedCategory === 'BEVERAGE') {
        return (
          p.category === 'Minuman Dingin' ||
          p.category === 'Air Mineral' ||
          p.category === 'Makanan & Snack' ||
          p.category === 'Sembako & Lainnya'
        );
      }

      return p.category === selectedCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
      setSearchQuery('');
    } else {
      setIsSearchOpen(true);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] pb-24 bg-white select-none">
      {/* 
        Griyo Pos Top Icon Tab Bar:
        Matching screenshot: 4 dark blue buttons side by side in the subheader.
      */}
      <div className="bg-[#0b3c85] p-1.5 px-2 flex items-center gap-1.5 shadow-xs">
        {/* Tab 1: Sport / Activity Icon */}
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'SPORTS' ? 'ALL' : 'SPORTS')}
          aria-label="Kategori Olahraga & Sewa"
          className={`flex-1 py-2 rounded-sm flex items-center justify-center transition-all ${
            selectedCategory === 'SPORTS'
              ? 'bg-[#1565c0] text-white ring-1 ring-white/30 shadow-xs'
              : 'text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20'
          }`}
        >
          <Activity className="w-5 h-5" />
        </button>

        {/* Tab 2: Cycling / Bicycle Icon */}
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'BIKE' ? 'ALL' : 'BIKE')}
          aria-label="Kategori Rental & Sepeda"
          className={`flex-1 py-2 rounded-sm flex items-center justify-center transition-all ${
            selectedCategory === 'BIKE'
              ? 'bg-[#1565c0] text-white ring-1 ring-white/30 shadow-xs'
              : 'text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20'
          }`}
        >
          <Bike className="w-5 h-5" />
        </button>

        {/* Tab 3: Lamp / Retail & Snacks Icon */}
        <button
          onClick={() => setSelectedCategory(selectedCategory === 'BEVERAGE' ? 'ALL' : 'BEVERAGE')}
          aria-label="Kategori Minuman & Retail"
          className={`flex-1 py-2 rounded-sm flex items-center justify-center transition-all ${
            selectedCategory === 'BEVERAGE'
              ? 'bg-[#1565c0] text-white ring-1 ring-white/30 shadow-xs'
              : 'text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20'
          }`}
        >
          <Lamp className="w-5 h-5" />
        </button>

        {/* Tab 4: Search Icon */}
        <button
          onClick={handleToggleSearch}
          aria-label="Cari Produk"
          className={`flex-1 py-2 rounded-sm flex items-center justify-center transition-all ${
            isSearchOpen || searchQuery
              ? 'bg-[#1565c0] text-white ring-1 ring-white/30 shadow-xs'
              : 'text-white/80 hover:text-white hover:bg-white/10 active:bg-white/20'
          }`}
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Expandable Search & Barcode Bar */}
      {isSearchOpen && (
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 animate-in slide-in-from-top-2 duration-150">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama barang, kategori, atau barcode SKU..."
              className="w-full pl-9 pr-9 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 shadow-2xs"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      {/* Category Pills Strip (for quick filter) */}
      <div className="bg-slate-50 border-b border-slate-200 px-2 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        {[
          { id: 'ALL', label: 'Semua Produk' },
          { id: 'Air Mineral', label: 'Air Mineral' },
          { id: 'Minuman Dingin', label: 'Minuman Dingin' },
          { id: 'Olahraga & Sewa', label: 'Olahraga & Sewa' },
          { id: 'Makanan & Snack', label: 'Snack & Makanan' },
          { id: 'Sembako & Lainnya', label: 'Sembako' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#0d47a1] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products List matching Griyo Pos exact item row structure */}
      <div className="flex-1 divide-y divide-slate-200">
        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Barcode className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Tidak ada barang ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau ubah filter kategori
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const inCartQty = cartQuantityMap.get(product.id) || 0;
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= product.minStock;

            return (
              <div
                key={product.id}
                className={`flex items-center justify-between transition-colors ${
                  isOutOfStock ? 'opacity-50 bg-slate-50' : 'hover:bg-slate-50/80 active:bg-slate-100'
                }`}
              >
                {/* Left & Middle: Product click adds to cart */}
                <button
                  type="button"
                  onClick={() => !isOutOfStock && onAddToCart(product)}
                  disabled={isOutOfStock}
                  className="flex items-center gap-3.5 flex-1 p-3 pl-3.5 text-left cursor-pointer focus:outline-none"
                >
                  {/* Left: Product Icon / Thumbnail */}
                  <div className="shrink-0">
                    <ProductIcon
                      type={product.iconType}
                      name={product.name}
                      className="w-11 h-11 sm:w-12 sm:h-12"
                    />
                  </div>

                  {/* Middle: Name (Uppercase) + Price in Rupiah */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[14px] sm:text-[15px] text-slate-900 tracking-tight leading-snug truncate uppercase">
                        {product.name}
                      </h3>
                      {inCartQty > 0 && (
                        <span className="bg-blue-600 text-white font-bold text-[11px] px-1.5 py-0.2 rounded-md shrink-0">
                          x{inCartQty}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 mt-0.5">
                      <span className="text-[13px] sm:text-[14px] text-slate-800 font-semibold tabular-nums">
                        {formatRupiah(product.sellPrice)}
                      </span>
                      {isOutOfStock ? (
                        <span className="text-[11px] text-red-600 font-medium">
                          Stok Habis
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[11px] text-amber-600 font-medium flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          Sisa {product.stock}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Stok: {product.stock} {product.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* 
                  Right Column: Distinct Grey + Button
                  Matches Griyo Pos screenshot exact layout!
                */}
                <div className="w-16 sm:w-20 self-stretch flex items-center justify-center bg-slate-100/70 border-l border-slate-200">
                  {inCartQty > 0 ? (
                    <div className="flex flex-col items-center justify-center gap-1 py-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        disabled={isOutOfStock || inCartQty >= product.stock}
                        aria-label={`Tambah ${product.name}`}
                        className="w-9 h-7 bg-white hover:bg-blue-50 active:bg-blue-100 text-blue-700 font-bold rounded border border-slate-300 flex items-center justify-center shadow-2xs transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveOneFromCart(product.id);
                        }}
                        aria-label={`Kurang ${product.name}`}
                        className="w-9 h-6 bg-white hover:bg-red-50 active:bg-red-100 text-slate-600 hover:text-red-600 rounded border border-slate-200 flex items-center justify-center transition-colors text-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => !isOutOfStock && onAddToCart(product)}
                      disabled={isOutOfStock}
                      aria-label={`Tambah ${product.name}`}
                      className="w-full h-full flex items-center justify-center text-slate-600 hover:text-blue-700 active:bg-slate-200 transition-colors"
                    >
                      <Plus className="w-6 h-6 stroke-[2.2]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 
        Bottom Floating Checkout / Cart Bar:
        Pops up whenever 1 or more items are in active order.
      */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 max-w-lg mx-auto sm:max-w-2xl lg:max-w-4xl p-2.5 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl transition-all">
          <div className="flex items-center justify-between gap-3 bg-[#0d47a1] text-white px-4 py-2.5 rounded-xl shadow-md">
            {/* Left: Cart items count & subtotal */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-3 text-left focus:outline-none"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-white" />
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 font-bold text-[11px] px-1.5 py-0.2 rounded-full ring-2 ring-[#0d47a1]">
                  {totalCartItems}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-blue-200 uppercase font-medium tracking-wider">
                  Total Transaksi
                </p>
                <p className="text-base sm:text-lg font-bold text-white tabular-nums leading-tight">
                  {formatRupiah(totalCartAmount)}
                </p>
              </div>
            </button>

            {/* Right: Bayar / Checkout button */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCart}
                className="px-3 py-2 text-xs font-semibold bg-white/15 hover:bg-white/25 active:bg-white/30 text-white rounded-lg transition-colors"
              >
                Rincian
              </button>
              <button
                onClick={onQuickCheckout}
                className="px-4 py-2 text-sm font-bold bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-900 rounded-lg shadow-sm transition-all active:scale-98"
              >
                Bayar &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
