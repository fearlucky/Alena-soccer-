import { Product, Transaction, StockLog, StoreSettings } from '../types/index.ts';

const PRODUCTS_KEY = 'griyo_pos_products_v1';
const TRANSACTIONS_KEY = 'griyo_pos_transactions_v1';
const STOCK_LOGS_KEY = 'griyo_pos_stock_logs_v1';
const SETTINGS_KEY = 'griyo_pos_settings_v1';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'BOLA',
    category: 'Olahraga & Sewa',
    buyPrice: 3500,
    sellPrice: 5000,
    stock: 24,
    minStock: 5,
    unit: 'Pcs',
    sku: 'SKU-BOL-001',
    iconType: 'soccer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-02',
    name: 'CLUB BESAR',
    category: 'Air Mineral',
    buyPrice: 4200,
    sellPrice: 6000,
    stock: 45,
    minStock: 10,
    unit: 'Botol 1500ml',
    sku: 'SKU-CLB-1500',
    iconType: 'bottle-large',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-03',
    name: 'CLUB KECIL',
    category: 'Air Mineral',
    buyPrice: 1800,
    sellPrice: 3000,
    stock: 60,
    minStock: 12,
    unit: 'Botol 600ml',
    sku: 'SKU-CLB-600',
    iconType: 'bottle-small',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-04',
    name: 'FLORIDINA',
    category: 'Minuman Dingin',
    buyPrice: 3500,
    sellPrice: 5000,
    stock: 36,
    minStock: 8,
    unit: 'Botol 350ml',
    sku: 'SKU-FLR-350',
    iconType: 'juice',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-05',
    name: 'GALON ISI ULANG',
    category: 'Air Mineral',
    buyPrice: 6000,
    sellPrice: 10000,
    stock: 18,
    minStock: 4,
    unit: 'Galon 19L',
    sku: 'SKU-GLN-019',
    iconType: 'gallon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-06',
    name: 'GOLDA',
    category: 'Minuman Dingin',
    buyPrice: 2800,
    sellPrice: 4000,
    stock: 40,
    minStock: 10,
    unit: 'Botol 200ml',
    sku: 'SKU-GLD-200',
    iconType: 'coffee',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-07',
    name: 'ISO PLUS',
    category: 'Minuman Dingin',
    buyPrice: 3600,
    sellPrice: 5000,
    stock: 28,
    minStock: 6,
    unit: 'Botol 350ml',
    sku: 'SKU-ISO-350',
    iconType: 'energy',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-08',
    name: 'JAVANA',
    category: 'Minuman Dingin',
    buyPrice: 2700,
    sellPrice: 4000,
    stock: 32,
    minStock: 6,
    unit: 'Botol 350ml',
    sku: 'SKU-JVN-350',
    iconType: 'tea',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-09',
    name: 'MILKU',
    category: 'Minuman Dingin',
    buyPrice: 2900,
    sellPrice: 4000,
    stock: 25,
    minStock: 5,
    unit: 'Botol 200ml',
    sku: 'SKU-MLK-200',
    iconType: 'milk',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    name: 'POCARI 500ml',
    category: 'Minuman Dingin',
    buyPrice: 6200,
    sellPrice: 8000,
    stock: 20,
    minStock: 6,
    unit: 'Botol 500ml',
    sku: 'SKU-PCR-500',
    iconType: 'isotonic',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    name: 'POCARI 900ml',
    category: 'Minuman Dingin',
    buyPrice: 9500,
    sellPrice: 12000,
    stock: 15,
    minStock: 4,
    unit: 'Botol 900ml',
    sku: 'SKU-PCR-900',
    iconType: 'isotonic-large',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-12',
    name: 'SEWA LAPANGAN FUTSAL',
    category: 'Olahraga & Sewa',
    buyPrice: 20000,
    sellPrice: 80000,
    stock: 10,
    minStock: 2,
    unit: 'Jam',
    sku: 'SKU-SEW-FUTSAL',
    iconType: 'stadium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-13',
    name: 'SEWA SEPEDA',
    category: 'Olahraga & Sewa',
    buyPrice: 5000,
    sellPrice: 25000,
    stock: 6,
    minStock: 2,
    unit: 'Jam',
    sku: 'SKU-SEW-SEPEDA',
    iconType: 'bike',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-14',
    name: 'INDOMIE GORENG',
    category: 'Makanan & Snack',
    buyPrice: 2800,
    sellPrice: 3500,
    stock: 80,
    minStock: 15,
    unit: 'Bungkus',
    sku: 'SKU-IND-GRG',
    iconType: 'noodle',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-15',
    name: 'MINYAK GORENG 1L',
    category: 'Sembako & Lainnya',
    buyPrice: 14500,
    sellPrice: 17500,
    stock: 3,
    minStock: 5,
    unit: 'Pouch',
    sku: 'SKU-MYK-1L',
    iconType: 'oil',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-16',
    name: 'TELUR AYAM 1 KG',
    category: 'Sembako & Lainnya',
    buyPrice: 24000,
    sellPrice: 28000,
    stock: 12,
    minStock: 5,
    unit: 'Kg',
    sku: 'SKU-TLR-1KG',
    iconType: 'egg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'GRIYO MART & POS',
  tagline: 'Solusi Kasir & Manajemen Stok Terpadu',
  address: 'Jl. Pemuda No. 42, Surabaya, Jawa Timur',
  phone: '0812-3456-7890',
  receiptFooter: 'Terima kasih atas kunjungan Anda!\nBarang yang sudah dibeli tidak dapat ditukar.',
  activeCashier: 'Kasir 01 - Lucky',
  initialCash: 250000, // Modal awal kasir Rp 250.000
  taxRate: 0,
  enableSound: true,
  paperWidth: '58mm',
  viewMode: 'responsive',
};

// Seed realistic transactions for today to show realistic real-time reports
export function generateSeedTransactions(): Transaction[] {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return [
    {
      id: `TRX-${todayStr.replace(/-/g, '')}-0001`,
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      items: [
        { productId: 'prod-01', productName: 'BOLA', quantity: 1, buyPrice: 3500, sellPrice: 5000, subtotal: 5000 },
        { productId: 'prod-10', productName: 'POCARI 500ml', quantity: 2, buyPrice: 6200, sellPrice: 8000, subtotal: 16000 },
      ],
      subtotal: 21000,
      discountAmount: 0,
      taxAmount: 0,
      grandTotal: 21000,
      totalCost: 15900,
      profit: 5100,
      paymentMethod: 'TUNAI',
      amountPaid: 50000,
      change: 29000,
      customerName: 'Mas Danu',
      cashierName: 'Kasir 01 - Lucky',
      notes: 'Pembelian langsung',
      status: 'LUNAS',
    },
    {
      id: `TRX-${todayStr.replace(/-/g, '')}-0002`,
      timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
      items: [
        { productId: 'prod-05', productName: 'GALON ISI ULANG', quantity: 2, buyPrice: 6000, sellPrice: 10000, subtotal: 20000 },
        { productId: 'prod-02', productName: 'CLUB BESAR', quantity: 1, buyPrice: 4200, sellPrice: 6000, subtotal: 6000 },
      ],
      subtotal: 26000,
      discountAmount: 0,
      taxAmount: 0,
      grandTotal: 26000,
      totalCost: 16200,
      profit: 9800,
      paymentMethod: 'QRIS',
      amountPaid: 26000,
      change: 0,
      customerName: 'Ibu Rini',
      cashierName: 'Kasir 01 - Lucky',
      notes: 'Scan QRIS BCA',
      status: 'LUNAS',
    },
    {
      id: `TRX-${todayStr.replace(/-/g, '')}-0003`,
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      items: [
        { productId: 'prod-06', productName: 'GOLDA', quantity: 3, buyPrice: 2800, sellPrice: 4000, subtotal: 12000 },
        { productId: 'prod-08', productName: 'JAVANA', quantity: 2, buyPrice: 2700, sellPrice: 4000, subtotal: 8000 },
        { productId: 'prod-14', productName: 'INDOMIE GORENG', quantity: 5, buyPrice: 2800, sellPrice: 3500, subtotal: 17500 },
      ],
      subtotal: 37500,
      discountAmount: 2500,
      taxAmount: 0,
      grandTotal: 35000,
      totalCost: 27800,
      profit: 7200,
      paymentMethod: 'TUNAI',
      amountPaid: 50000,
      change: 15000,
      customerName: 'Pak Hendra',
      cashierName: 'Kasir 01 - Lucky',
      notes: 'Diskon langganan',
      status: 'LUNAS',
    },
  ];
}

export function generateSeedStockLogs(): StockLog[] {
  return [
    {
      id: 'log-01',
      productId: 'prod-01',
      productName: 'BOLA',
      type: 'IN_PURCHASE',
      quantityChange: 25,
      stockBefore: 0,
      stockAfter: 25,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      note: 'Kulakan awal supplier sports',
    },
    {
      id: 'log-02',
      productId: 'prod-05',
      productName: 'GALON ISI ULANG',
      type: 'IN_PURCHASE',
      quantityChange: 20,
      stockBefore: 0,
      stockAfter: 20,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      note: 'Pengisian depo air',
    },
    {
      id: 'log-03',
      productId: 'prod-15',
      productName: 'MINYAK GORENG 1L',
      type: 'ADJUSTMENT',
      quantityChange: -1,
      stockBefore: 4,
      stockAfter: 3,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      note: 'Kemasan bocor saat display',
    },
  ];
}

// Local Storage helpers
export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products', e);
  }
}

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY);
    if (!raw) {
      const seed = generateSeedTransactions();
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error('Failed to save transactions', e);
  }
}

export function loadStockLogs(): StockLog[] {
  try {
    const raw = localStorage.getItem(STOCK_LOGS_KEY);
    if (!raw) {
      const seed = generateSeedStockLogs();
      localStorage.setItem(STOCK_LOGS_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStockLogs(logs: StockLog[]): void {
  try {
    localStorage.setItem(STOCK_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save stock logs', e);
  }
}

export function loadSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: StoreSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function resetAllData(): void {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(generateSeedTransactions()));
  localStorage.setItem(STOCK_LOGS_KEY, JSON.stringify(generateSeedStockLogs()));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
}
