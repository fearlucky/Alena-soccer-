export type ProductCategory = 
  | 'Semua'
  | 'Minuman Dingin'
  | 'Air Mineral'
  | 'Olahraga & Sewa'
  | 'Makanan & Snack'
  | 'Sembako & Lainnya';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  buyPrice: number; // Harga Modal (Rp)
  sellPrice: number; // Harga Jual (Rp)
  stock: number; // Stok saat ini
  minStock: number; // Ambang batas stok menipis
  unit: string; // Pcs, Botol, Galon, Kg, Jam, dll.
  sku: string; // Barcode / SKU
  imageUrl?: string;
  iconType?: string; // Type for SVG icon fallback
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  discount?: number; // per item discount in Rp
  notes?: string;
}

export type PaymentMethod = 'TUNAI' | 'QRIS' | 'TRANSFER' | 'HUTANG';

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  subtotal: number;
}

export interface Transaction {
  id: string; // Nota/Invoice number e.g. TRX-20261010-001
  timestamp: string; // ISO string
  items: TransactionItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
  totalCost: number; // Total harga modal
  profit: number; // grandTotal - totalCost
  paymentMethod: PaymentMethod;
  amountPaid: number;
  change: number; // Kembalian
  customerName?: string;
  cashierName: string;
  notes?: string;
  status: 'LUNAS' | 'HUTANG' | 'DIBATALKAN';
}

export type StockMovementType = 'IN_PURCHASE' | 'OUT_SALE' | 'ADJUSTMENT' | 'DAMAGED_EXPIRED' | 'RETURN_RESTORE';

export interface StockLog {
  id: string;
  productId: string;
  productName: string;
  type: StockMovementType;
  quantityChange: number; // e.g. +10 or -2
  stockBefore: number;
  stockAfter: number;
  timestamp: string;
  note: string;
  referenceId?: string; // e.g. TRX id
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  address: string;
  phone: string;
  receiptFooter: string;
  activeCashier: string;
  initialCash: number; // Modal kasir awal
  taxRate: number; // e.g. 0% or 11%
  enableSound: boolean;
  paperWidth: '58mm' | '80mm';
  viewMode: 'mobile' | 'responsive';
}
