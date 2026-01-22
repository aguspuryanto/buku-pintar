
import React, { useState } from 'react';
import { Product } from '../types';
// Fixed: WAREHOUSES is exported from constants.tsx, not types.ts
import { WAREHOUSES } from '../constants';

interface InventoryViewProps {
  products: Product[];
}

const InventoryView: React.FC<InventoryViewProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('Semua');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = selectedWarehouse === 'Semua' || p.stocks[selectedWarehouse] !== undefined;
    return matchesSearch && matchesWarehouse;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Kelola Inventori</h2>
          <p className="text-slate-500 text-sm">Monitor stok di multi-gudang dan transfer barang.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <i className="fas fa-plus"></i> Tambah Produk
          </button>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
            <i className="fas fa-right-left"></i> Transfer Stok
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Cari SKU atau nama produk..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
            >
              <option value="Semua">Semua Gudang</option>
              {WAREHOUSES.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Info Produk</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stok</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Harga Jual</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => {
                  // Add explicit types to fix "Operator '+' cannot be applied to types 'unknown' and 'unknown'" error
                  const totalStock = Object.values(p.stocks).reduce((a: number, b: number) => a + b, 0);
                  const isLow = totalStock < p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <i className="fas fa-box"></i>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{p.category}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${isLow ? 'text-rose-500' : 'text-slate-700'}`}>
                          {totalStock} {p.unit}
                        </span>
                        {isLow && <span className="ml-2 px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] rounded uppercase font-bold">Tipis</span>}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold">Rp {p.price.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                          <i className="fas fa-ellipsis-vertical"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-warehouse text-indigo-500"></i>
            Sebaran Gudang
          </h3>
          <div className="space-y-4">
            {WAREHOUSES.map(w => {
              const stockInWh = products.reduce((acc, curr) => acc + (curr.stocks[w] || 0), 0);
              return (
                <div key={w} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600">{w}</span>
                    <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-full">{stockInWh} unit</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full transition-all" style={{ width: `${Math.min(100, (stockInWh/500)*100)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
