
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Product, Transaction } from '../types';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ products, transactions }) => {
  const totalSales = transactions.filter(t => t.type === 'Penjualan').reduce((acc, curr) => acc + curr.total, 0);
  // Add explicit types to fix "Operator '+' cannot be applied to types 'unknown' and 'unknown'" error
  const lowStockItems = products.filter(p => Object.values(p.stocks).reduce((a: number, b: number) => a + b, 0) < p.minStock);

  const salesData = [
    { name: 'Jan', value: 45000000 },
    { name: 'Feb', value: 52000000 },
    { name: 'Mar', value: 48000000 },
    { name: 'Apr', value: 61000000 },
    { name: 'Mei', value: 55000000 },
    { name: 'Jun', value: 67000000 },
  ];

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-transform hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Penjualan" value={`Rp ${totalSales.toLocaleString('id-ID')}`} icon="fa-coins" color="bg-indigo-500" trend={12} />
        <StatCard title="Stok Menipis" value={lowStockItems.length} icon="fa-triangle-exclamation" color="bg-amber-500" />
        <StatCard title="Pesanan Baru" value="24" icon="fa-clipboard-list" color="bg-blue-500" trend={5} />
        <StatCard title="Arus Kas Bersih" value="Rp 12.5M" icon="fa-wallet" color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-chart-line text-indigo-500"></i>
            Tren Penjualan Bulanan
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `${v/1000000}jt`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']}
                />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-bell text-amber-500"></i>
            Peringatan Inventori
          </h3>
          <div className="space-y-4">
            {lowStockItems.length === 0 ? (
              <p className="text-slate-400 text-sm italic text-center py-8">Semua stok aman</p>
            ) : (
              lowStockItems.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    {/* Add explicit types to fix "Operator '+' cannot be applied to types 'unknown' and 'unknown'" error */}
                    <p className="text-xs font-bold text-rose-500">{Object.values(p.stocks).reduce((a: number, b: number) => a + b, 0)} {p.unit}</p>
                    <p className="text-[10px] text-slate-400">Min: {p.minStock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-semibold transition-colors">
            Lihat Semua Inventori
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-6">Transaksi Terakhir</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-sm font-semibold text-slate-400">ID</th>
                <th className="pb-4 text-sm font-semibold text-slate-400">Tanggal</th>
                <th className="pb-4 text-sm font-semibold text-slate-400">Customer/Vendor</th>
                <th className="pb-4 text-sm font-semibold text-slate-400">Tipe</th>
                <th className="pb-4 text-sm font-semibold text-slate-400">Total</th>
                <th className="pb-4 text-sm font-semibold text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map(t => (
                <tr key={t.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-medium">{t.id}</td>
                  <td className="py-4 text-sm text-slate-600">{t.date}</td>
                  <td className="py-4 text-sm font-medium">{t.customerVendor}</td>
                  <td className="py-4">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${t.type === 'Penjualan' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-bold">Rp {t.total.toLocaleString('id-ID')}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      t.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 
                      t.status === 'Sebagian' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
