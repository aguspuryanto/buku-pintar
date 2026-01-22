
import React, { useState } from 'react';
import { Module, Product, Transaction, Employee, FixedAsset, Account, PaymentConfig } from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_EMPLOYEES, 
  INITIAL_ASSETS, 
  INITIAL_ACCOUNTS,
  INITIAL_PAYMENT_CONFIG
} from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InventoryView from './components/InventoryView';
import HRView from './components/HRView';
import AIChat from './components/AIChat';
import SalesView from './components/SalesView';
import FinanceView from './components/FinanceView';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<Module>('Dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [assets, setAssets] = useState<FixedAsset[]>(INITIAL_ASSETS);
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(INITIAL_PAYMENT_CONFIG);

  const businessData = {
    products,
    transactions,
    employees,
    assets,
    accounts,
    paymentConfig
  };

  const handleUpdateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } as Transaction : t));
  };

  const handleUpdatePaymentConfig = (updates: Partial<PaymentConfig>) => {
    setPaymentConfig(prev => ({ ...prev, ...updates }));
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'Dashboard':
        return <Dashboard products={products} transactions={transactions} />;
      case 'Inventori':
        return <InventoryView products={products} />;
      case 'Penjualan':
        return (
          <SalesView 
            transactions={transactions} 
            paymentConfig={paymentConfig}
            onUpdateTransaction={handleUpdateTransaction}
          />
        );
      case 'SDM':
        return <HRView employees={employees} />;
      case 'Keuangan':
        return (
          <FinanceView 
            accounts={accounts} 
            paymentConfig={paymentConfig} 
            onUpdatePaymentConfig={handleUpdatePaymentConfig} 
          />
        );
      case 'AI':
        return (
          <div className="max-w-4xl mx-auto py-12 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto mb-8">
              <i className="fas fa-robot text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold">Asisten AI Chat</h2>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
              Gunakan asisten AI di pojok kanan bawah untuk bertanya tentang data bisnis Anda menggunakan bahasa sehari-hari. 
              Misalnya: "Berapa total stok kopi arabika di semua gudang?" atau "Berapa penjualan bulan lalu?"
            </p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <i className="fas fa-tools text-6xl mb-4"></i>
            <p className="text-xl font-medium">Modul "{activeModule}" Sedang Dalam Pengembangan</p>
            <p className="text-sm">Silakan cek modul Dashboard, Inventori, Penjualan, atau SDM yang sudah aktif.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <main className="ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeModule}</h1>
            <p className="text-slate-500 text-sm mt-1">Selamat datang kembali, Mari kelola bisnis Anda dengan efisien.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 px-4">
              <i className="fas fa-calendar-day text-indigo-500"></i>
              <span className="text-sm font-semibold">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <button className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
              <i className="fas fa-bell"></i>
            </button>
          </div>
        </header>

        {renderContent()}
      </main>

      <AIChat businessData={businessData} />
    </div>
  );
};

export default App;
