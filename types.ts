
export type Module = 'Dashboard' | 'Inventori' | 'Penjualan' | 'Pembelian' | 'Keuangan' | 'SDM' | 'Aset' | 'Laporan' | 'AI';

export type PaymentGateway = 'Midtrans' | 'Xendit' | 'Manual';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stocks: { [warehouse: string]: number };
  unit: string;
  price: number;
  cost: number;
  minStock: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Penjualan' | 'Pembelian';
  customerVendor: string;
  customerEmail?: string;
  total: number;
  status: 'Lunas' | 'Sebagian' | 'Belum Bayar' | 'Kadaluarsa';
  paymentLink?: string;
  paymentGateway?: PaymentGateway;
  items: Array<{ productId: string; name: string; qty: number; price: number }>;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  baseSalary: number;
  boronganRate: number;
  completedTasks: number;
  loans: number;
}

export interface FixedAsset {
  id: string;
  name: string;
  acquisitionDate: string;
  cost: number;
  usefulLife: number; // in years
  salvageValue: number;
  accumulatedDepreciation: number;
}

export interface Account {
  code: string;
  name: string;
  type: 'Harta' | 'Kewajiban' | 'Modal' | 'Pendapatan' | 'Beban';
  balance: number;
}

export interface PaymentConfig {
  activeGateway: PaymentGateway;
  midtransApiKey: string;
  xenditApiKey: string;
  isSandbox: boolean;
}
