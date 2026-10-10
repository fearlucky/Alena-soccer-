import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  loadProducts,
  saveProducts,
  loadTransactions,
  saveTransactions,
  loadStockLogs,
  saveStockLogs,
  loadSettings,
  saveSettings,
  resetAllData,
} from './utils/storage.ts';
import { Product, CartItem, Transaction, StockLog, StoreSettings, StockMovementType, PaymentMethod } from './types/index.ts';
import { generateInvoiceNumber } from './utils/formatters.ts';
import { playBeepSound, playCashRegisterSound } from './utils/sound.ts';
import { Header } from './components/Header.tsx';
import { Sidebar, ActiveTab } from './components/Sidebar.tsx';
import { NewTransaction } from './components/NewTransaction.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { InventoryManagement } from './components/InventoryManagement.tsx';
import { ProductFormModal } from './components/ProductFormModal.tsx';
import { StockAdjustmentModal } from './components/StockAdjustmentModal.tsx';
import { ReportsDashboard } from './components/ReportsDashboard.tsx';
import { TransactionHistory } from './components/TransactionHistory.tsx';
import { StockLogsView } from './components/StockLogsView.tsx';
import { ShiftSummaryView } from './components/ShiftSummaryView.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';

export default function App() {
  // Master state with local storage backing
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [stockLogs, setStockLogs] = useState<StockLog[]>(() => loadStockLogs());
  const [settings, setSettings] = useState<StoreSettings>(() => loadSettings());

  // Navigation & View state
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>(settings.viewMode || 'responsive');

  // Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Product modal state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Stock adjustment modal state
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  // Active cashier transaction state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Sync to localStorage on state changes
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveStockLogs(stockLogs);
  }, [stockLogs]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Calculations for sidebar & header
  const todaySales = useMemo(() => {
    const today = new Date().toDateString();
    return transactions
      .filter((t) => t.status !== 'DIBATALKAN' && new Date(t.timestamp).toDateString() === today)
      .reduce((sum, t) => sum + t.grandTotal, 0);
  }, [transactions]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  }, [products]);

  // Cart operations
  const handleAddToCart = useCallback((product: Product) => {
    if (product.stock <= 0) return;

    if (settings.enableSound) {
      playBeepSound();
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast(`Stok ${product.name} hanya tersisa ${product.stock} ${product.unit}`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.product.sellPrice,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            subtotal: product.sellPrice,
          },
        ];
      }
    });
  }, [settings.enableSound, showToast]);

  const handleRemoveOneFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
              subtotal: (item.quantity - 1) * item.product.sellPrice,
            }
          : item
      );
    });
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, newQty: number) => {
    setCart((prev) => {
      if (newQty <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      const prod = products.find((p) => p.id === productId);
      if (prod && newQty > prod.stock) {
        showToast(`Maksimal stok tersedia: ${prod.stock} ${prod.unit}`);
        newQty = prod.stock;
      }
      return prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.product.sellPrice,
            }
          : item
      );
    });
  }, [products, showToast]);

  const handleRemoveItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
    setCustomerName('');
    setTransactionNotes('');
    setDiscountAmount(0);
  }, []);

  // Checkout completion
  const handleCompleteCheckout = useCallback((data: {
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
  }) => {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const grandTotal = Math.max(0, subtotal - discountAmount);
    const totalCost = cart.reduce(
      (sum, item) => sum + item.product.buyPrice * item.quantity,
      0
    );
    const profit = grandTotal - totalCost;

    const newTxId = generateInvoiceNumber(transactions.length + 1);
    const nowIso = new Date().toISOString();

    const newTransaction: Transaction = {
      id: newTxId,
      timestamp: nowIso,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: c.product.name,
        quantity: c.quantity,
        buyPrice: c.product.buyPrice,
        sellPrice: c.product.sellPrice,
        subtotal: c.subtotal,
      })),
      subtotal,
      discountAmount,
      taxAmount: 0,
      grandTotal,
      totalCost,
      profit,
      paymentMethod: data.paymentMethod,
      amountPaid: data.amountPaid,
      change: data.change,
      customerName: customerName.trim() || undefined,
      cashierName: settings.activeCashier,
      notes: transactionNotes.trim() || undefined,
      status: data.paymentMethod === 'HUTANG' ? 'HUTANG' : 'LUNAS',
    };

    // 1. Decrement product stocks
    const newStockLogs: StockLog[] = [];
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((ci) => ci.product.id === prod.id);
      if (cartItem) {
        const newStock = Math.max(0, prod.stock - cartItem.quantity);
        newStockLogs.push({
          id: `log-${Date.now()}-${prod.id}`,
          productId: prod.id,
          productName: prod.name,
          type: 'OUT_SALE',
          quantityChange: -cartItem.quantity,
          stockBefore: prod.stock,
          stockAfter: newStock,
          timestamp: nowIso,
          note: `Penjualan nota ${newTxId}`,
          referenceId: newTxId,
        });
        return {
          ...prod,
          stock: newStock,
          updatedAt: nowIso,
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    setStockLogs((prev) => [...newStockLogs, ...prev]);
    setTransactions((prev) => [newTransaction, ...prev]);

    // Sound & Confetti celebration
    if (settings.enableSound) {
      playCashRegisterSound();
    }
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    // Reset cashier state & open receipt modal
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    handleClearCart();
    setActiveReceiptTx(newTransaction);
    setIsReceiptOpen(true);
    showToast(`Transaksi ${newTxId} berhasil diproses! Stok terupdate otomatis.`);
  }, [
    cart,
    discountAmount,
    transactions.length,
    customerName,
    settings.activeCashier,
    settings.enableSound,
    transactionNotes,
    products,
    handleClearCart,
    showToast,
  ]);

  // Void transaction (batalkan dan kembalikan stok)
  const handleVoidTransaction = useCallback((txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.status === 'DIBATALKAN') return;

    const nowIso = new Date().toISOString();
    const restoreLogs: StockLog[] = [];

    // Restore stock for all items in the voided transaction
    const updatedProducts = products.map((prod) => {
      const txItem = tx.items.find((item) => item.productId === prod.id);
      if (txItem) {
        const restoredStock = prod.stock + txItem.quantity;
        restoreLogs.push({
          id: `restore-${Date.now()}-${prod.id}`,
          productId: prod.id,
          productName: prod.name,
          type: 'RETURN_RESTORE',
          quantityChange: txItem.quantity,
          stockBefore: prod.stock,
          stockAfter: restoredStock,
          timestamp: nowIso,
          note: `Pembatalan nota ${txId}`,
          referenceId: txId,
        });
        return {
          ...prod,
          stock: restoredStock,
          updatedAt: nowIso,
        };
      }
      return prod;
    });

    setProducts(updatedProducts);
    setStockLogs((prev) => [...restoreLogs, ...prev]);
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'DIBATALKAN' } : t))
    );

    showToast(`Nota ${txId} berhasil dibatalkan. Stok barang telah dikembalikan!`);
  }, [transactions, products, showToast]);

  // Stock Adjustment (Restok manual / barang rusak)
  const handleConfirmStockAdjustment = useCallback((
    productId: string,
    type: StockMovementType,
    quantityChange: number,
    note: string
  ) => {
    const nowIso = new Date().toISOString();
    let newLog: StockLog | null = null;

    const updated = products.map((prod) => {
      if (prod.id === productId) {
        const newStock = Math.max(0, prod.stock + quantityChange);
        newLog = {
          id: `adj-${Date.now()}-${prod.id}`,
          productId: prod.id,
          productName: prod.name,
          type,
          quantityChange,
          stockBefore: prod.stock,
          stockAfter: newStock,
          timestamp: nowIso,
          note,
        };
        return {
          ...prod,
          stock: newStock,
          updatedAt: nowIso,
        };
      }
      return prod;
    });

    setProducts(updated);
    if (newLog) {
      setStockLogs((prev) => [newLog!, ...prev]);
    }
    showToast(`Penyesuaian stok berhasil disimpan.`);
  }, [products, showToast]);

  // Product CRUD
  const handleSaveProduct = useCallback((productData: Partial<Product>) => {
    const nowIso = new Date().toISOString();
    if (productData.id) {
      // Edit
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productData.id
            ? ({ ...p, ...productData, updatedAt: nowIso } as Product)
            : p
        )
      );
      showToast(`Data barang ${productData.name} berhasil diperbarui.`);
    } else {
      // Create new
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: productData.name || 'BARANG BARU',
        category: productData.category || 'Minuman Dingin',
        buyPrice: productData.buyPrice || 0,
        sellPrice: productData.sellPrice || 0,
        stock: productData.stock || 0,
        minStock: productData.minStock || 5,
        unit: productData.unit || 'Pcs',
        sku: productData.sku || `SKU-${Date.now().toString().slice(-6)}`,
        iconType: productData.iconType || 'bottle-small',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      setProducts((prev) => [newProd, ...prev]);

      // Log initial stock
      if (newProd.stock > 0) {
        setStockLogs((prev) => [
          {
            id: `init-${Date.now()}`,
            productId: newProd.id,
            productName: newProd.name,
            type: 'IN_PURCHASE',
            quantityChange: newProd.stock,
            stockBefore: 0,
            stockAfter: newProd.stock,
            timestamp: nowIso,
            note: 'Stok awal penambahan barang',
          },
          ...prev,
        ]);
      }
      showToast(`Barang baru ${newProd.name} berhasil ditambahkan.`);
    }
  }, [showToast]);

  const handleDeleteProduct = useCallback((productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
    showToast(`Barang telah dihapus dari katalog.`);
  }, [showToast]);

  // Reset all demo data
  const handleResetData = useCallback(() => {
    resetAllData();
    setProducts(loadProducts());
    setTransactions(loadTransactions());
    setStockLogs(loadStockLogs());
    setSettings(loadSettings());
    setCart([]);
    showToast(`Data toko & barang telah dikembalikan ke data awal!`);
  }, [showToast]);

  // Real-Time Demo Simulation (simulates another cashier or online customer buying an item)
  const handleTriggerDemoSale = useCallback(() => {
    if (products.length === 0) return;
    setIsSimulating(true);

    setTimeout(() => {
      // Pick random 1-2 available products
      const available = products.filter((p) => p.stock > 0);
      if (available.length === 0) {
        showToast('Semua stok habis, silakan restok barang terlebih dahulu!');
        setIsSimulating(false);
        return;
      }

      const randomProd = available[Math.floor(Math.random() * available.length)];
      const randomQty = Math.min(randomProd.stock, Math.floor(Math.random() * 2) + 1);
      const subtotal = randomProd.sellPrice * randomQty;
      const totalCost = randomProd.buyPrice * randomQty;
      const newTxId = generateInvoiceNumber(transactions.length + 1);
      const nowIso = new Date().toISOString();

      const newTx: Transaction = {
        id: newTxId,
        timestamp: nowIso,
        items: [
          {
            productId: randomProd.id,
            productName: randomProd.name,
            quantity: randomQty,
            buyPrice: randomProd.buyPrice,
            sellPrice: randomProd.sellPrice,
            subtotal,
          },
        ],
        subtotal,
        discountAmount: 0,
        taxAmount: 0,
        grandTotal: subtotal,
        totalCost,
        profit: subtotal - totalCost,
        paymentMethod: 'QRIS',
        amountPaid: subtotal,
        change: 0,
        customerName: 'Pelanggan Live',
        cashierName: 'Kasir 02 - Cabang',
        notes: 'Transaksi Real-Time Live Sync',
        status: 'LUNAS',
      };

      // Decrement stock
      const updated = products.map((p) => {
        if (p.id === randomProd.id) {
          return {
            ...p,
            stock: Math.max(0, p.stock - randomQty),
            updatedAt: nowIso,
          };
        }
        return p;
      });

      setProducts(updated);
      setTransactions((prev) => [newTx, ...prev]);
      setStockLogs((prev) => [
        {
          id: `live-${Date.now()}`,
          productId: randomProd.id,
          productName: randomProd.name,
          type: 'OUT_SALE',
          quantityChange: -randomQty,
          stockBefore: randomProd.stock,
          stockAfter: Math.max(0, randomProd.stock - randomQty),
          timestamp: nowIso,
          note: `Penjualan Live ${newTxId}`,
          referenceId: newTxId,
        },
        ...prev,
      ]);

      if (settings.enableSound) {
        playCashRegisterSound();
      }

      showToast(`Transaksi Real-Time Masuk: ${randomProd.name} x${randomQty} (Nota ${newTxId})`);
      setIsSimulating(false);
    }, 400);
  }, [products, transactions.length, settings.enableSound, showToast]);

  const screenTitle = useMemo(() => {
    switch (activeTab) {
      case 'pos':
        return 'Transaksi Baru';
      case 'history':
        return 'Riwayat Transaksi';
      case 'reports':
        return 'Laporan Penjualan Real-Time';
      case 'inventory':
        return 'Manajemen Stok & Barang';
      case 'stocklogs':
        return 'Mutasi & Kartu Stok';
      case 'shift':
        return 'Rekap Kasir & Shift';
      case 'settings':
        return 'Pengaturan Toko';
      default:
        return 'Griyo POS';
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold py-2.5 px-4 rounded-full shadow-lg border border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200 flex items-center gap-2 max-w-[90vw] text-center">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Container (Supports Smartphone Mockup frame or Wide Screen) */}
      <div
        className={`flex-1 flex flex-col transition-all mx-auto w-full ${
          viewMode === 'mobile'
            ? 'max-w-[430px] my-0 sm:my-4 sm:rounded-3xl shadow-2xl sm:border sm:border-slate-300 overflow-hidden min-h-screen sm:min-h-[880px] bg-white'
            : 'w-full bg-slate-100'
        }`}
      >
        {/* Smartphone top status bar (simulates Android notification header when in mobile view) */}
        {viewMode === 'mobile' && (
          <div className="bg-[#0b3c85] text-white px-4 py-1 flex items-center justify-between text-[11px] font-semibold select-none border-b border-white/10">
            <span>08.56</span>
            <div className="flex items-center gap-2 text-[10px]">
              <span>4G</span>
              <span>85%</span>
            </div>
          </div>
        )}

        {/* Griyo POS Top Header */}
        <Header
          title={screenTitle}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          viewMode={viewMode}
          onToggleViewMode={() =>
            setViewMode(viewMode === 'mobile' ? 'responsive' : 'mobile')
          }
          badgeCount={lowStockCount}
        />

        {/* Content based on Active Tab */}
        <main className="flex-1 bg-white">
          {activeTab === 'pos' && (
            <NewTransaction
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              onRemoveOneFromCart={handleRemoveOneFromCart}
              onOpenCart={() => setIsCartOpen(true)}
              onQuickCheckout={() => setIsCheckoutOpen(true)}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryManagement
              products={products}
              onOpenAddProduct={() => {
                setProductToEdit(null);
                setIsProductFormOpen(true);
              }}
              onOpenEditProduct={(prod) => {
                setProductToEdit(prod);
                setIsProductFormOpen(true);
              }}
              onOpenAdjustStock={(prod) => {
                setProductToAdjust(prod);
                setIsAdjustStockOpen(true);
              }}
              onDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsDashboard
              transactions={transactions}
              settings={settings}
              onOpenReceipt={(tx) => {
                setActiveReceiptTx(tx);
                setIsReceiptOpen(true);
              }}
            />
          )}

          {activeTab === 'history' && (
            <TransactionHistory
              transactions={transactions}
              onOpenReceipt={(tx) => {
                setActiveReceiptTx(tx);
                setIsReceiptOpen(true);
              }}
              onVoidTransaction={handleVoidTransaction}
            />
          )}

          {activeTab === 'stocklogs' && (
            <StockLogsView logs={stockLogs} />
          )}

          {activeTab === 'shift' && (
            <ShiftSummaryView
              transactions={transactions}
              settings={settings}
              onUpdateSettings={setSettings}
            />
          )}

          {activeTab === 'settings' && (
            <div className="p-4 sm:p-6 max-w-lg mx-auto">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full py-3 bg-[#0d47a1] text-white rounded-xl font-bold text-sm shadow-md"
              >
                Buka Pengaturan Toko & Printer
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Navigation Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        settings={settings}
        todaySales={todaySales}
        lowStockCount={lowStockCount}
        onTriggerDemoSale={handleTriggerDemoSale}
        isSimulating={isSimulating}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        notes={transactionNotes}
        onNotesChange={setTransactionNotes}
        discountAmount={discountAmount}
        onDiscountChange={setDiscountAmount}
        onProceedToPayment={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        subtotal={cart.reduce((s, it) => s + it.subtotal, 0)}
        discountAmount={discountAmount}
        customerName={customerName}
        notes={transactionNotes}
        cashierName={settings.activeCashier}
        onCompleteCheckout={handleCompleteCheckout}
      />

      {/* Thermal Receipt Preview Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        transaction={activeReceiptTx}
        settings={settings}
        onNewTransaction={() => {
          setActiveReceiptTx(null);
          setActiveTab('pos');
        }}
      />

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSaveProduct={handleSaveProduct}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={isAdjustStockOpen}
        onClose={() => {
          setIsAdjustStockOpen(false);
          setProductToAdjust(null);
        }}
        product={productToAdjust}
        onConfirmAdjustment={handleConfirmStockAdjustment}
      />

      {/* Store Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onResetAllData={handleResetData}
      />
    </div>
  );
}
