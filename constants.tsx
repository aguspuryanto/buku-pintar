
import { Product, Transaction, Employee, FixedAsset, Account, PaymentConfig } from './types';

export const WAREHOUSES = ['Gudang Utama', 'Gudang Cabang', 'Toko'];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Kopi Arabika 250g', sku: 'K-ARB-250', category: 'Kopi', stocks: { 'Gudang Utama': 150, 'Toko': 45 }, unit: 'Pcs', price: 85000, cost: 45000, minStock: 50 },
  { id: '2', name: 'Gula Aren Cair 1L', sku: 'G-ARN-1L', category: 'Bahan Baku', stocks: { 'Gudang Utama': 80, 'Gudang Cabang': 20 }, unit: 'Botol', price: 65000, cost: 35000, minStock: 30 },
  { id: '3', name: 'Cangkir Keramik Putih', sku: 'P-CGK-W', category: 'Peralatan', stocks: { 'Toko': 120 }, unit: 'Set', price: 125000, cost: 60000, minStock: 20 },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { 
    id: 'INV-2023-001', 
    date: '2023-11-01', 
    type: 'Penjualan', 
    customerVendor: 'Budi Santoso', 
    customerEmail: 'budi.s@example.com',
    total: 450000, 
    status: 'Lunas', 
    paymentGateway: 'Midtrans',
    items: [{ productId: '1', name: 'Kopi Arabika 250g', qty: 5, price: 90000 }] 
  },
  { 
    id: 'INV-2023-002', 
    date: '2023-11-10', 
    type: 'Penjualan', 
    customerVendor: 'Rina Wijaya', 
    customerEmail: 'rina.w@example.com',
    total: 1250000, 
    status: 'Belum Bayar', 
    items: [{ productId: '3', name: 'Cangkir Keramik Putih', qty: 10, price: 125000 }] 
  },
  { 
    id: 'PO-001', 
    date: '2023-11-05', 
    type: 'Pembelian', 
    customerVendor: 'Supplier Kopi Jabar', 
    total: 5000000, 
    status: 'Sebagian', 
    items: [] 
  },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'E001', name: 'Andi Pratama', role: 'Barista', baseSalary: 3500000, boronganRate: 0, completedTasks: 0, loans: 500000 },
  { id: 'E002', name: 'Siti Aminah', role: 'Produksi', baseSalary: 2000000, boronganRate: 5000, completedTasks: 450, loans: 0 },
];

export const INITIAL_ASSETS: FixedAsset[] = [
  { id: 'A001', name: 'Mesin Espresso Simonelli', acquisitionDate: '2023-01-15', cost: 45000000, usefulLife: 5, salvageValue: 5000000, accumulatedDepreciation: 7500000 },
  { id: 'A002', name: 'Mobil Delivery Grand Max', acquisitionDate: '2023-03-20', cost: 160000000, usefulLife: 8, salvageValue: 20000000, accumulatedDepreciation: 15000000 },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { code: '1101', name: 'Kas Kecil', type: 'Harta', balance: 5000000 },
  { code: '1102', name: 'Bank BCA', type: 'Harta', balance: 125000000 },
  { code: '1201', name: 'Piutang Usaha', type: 'Harta', balance: 15000000 },
  { code: '2101', name: 'Hutang Dagang', type: 'Kewajiban', balance: 8000000 },
  { code: '3101', name: 'Modal Pemilik', type: 'Modal', balance: 100000000 },
];

export const INITIAL_PAYMENT_CONFIG: PaymentConfig = {
  activeGateway: 'Midtrans',
  midtransApiKey: 'SB-Mid-client-xxxxxxxx',
  xenditApiKey: 'xnd_development_xxxxxxxx',
  isSandbox: true,
};
