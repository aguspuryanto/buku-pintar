
import React, { useState } from 'react';
import { Account, PaymentConfig, PaymentGateway } from '../types';

interface FinanceViewProps {
  accounts: Account[];
  paymentConfig: PaymentConfig;
  onUpdatePaymentConfig: (updates: Partial<PaymentConfig>) => void;
}

const FinanceView: React.FC<FinanceViewProps> = ({ accounts, paymentConfig, onUpdatePaymentConfig }) => {
  const [activeTab, setActiveTab] = useState<'COA' | 'Gateway'>('COA');

  const gateways: { id: PaymentGateway; name: string; icon: string; color: string; desc: string }[] = [
    { 
      id: 'Midtrans', 
      name: 'Midtrans', 
      icon: 'fa-shuttle-space', 
      color: 'bg-blue-600',
      desc: 'Sistem pembayaran paling populer di Indonesia dengan dukungan GoPay, ShopeePay, & Virtual Accounts.'
    },
    { 
      id: 'Xendit', 
      name: 'Xendit', 
      icon: 'fa-bolt', 
      color: 'bg-indigo-500',
      desc: 'Infrastruktur pembayaran modern untuk bisnis dengan aktivasi cepat dan dashboard yang intuitif.'
    },
    { 
      id: 'Manual', 
      name: 'Manual / Bank Transfer', 
      icon: 'fa-building-columns', 
      color: 'bg-slate-600',
      desc: 'Gunakan instruksi transfer manual. Pembayaran harus dikonfirmasi manual oleh admin.'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-slate-200/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('COA')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'COA' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Daftar Akun (COA)
        </button>
        <button 
          onClick={() => setActiveTab('Gateway')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'Gateway' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Payment Gateways
        </button>
      </div>

      {activeTab === 'COA' ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Chart of Accounts</h2>
            <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">
              + Tambah Akun
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="py-4 text-slate-400 text-xs font-bold uppercase">Kode</th>
                  <th className="py-4 text-slate-400 text-xs font-bold uppercase">Nama Akun</th>
                  <th className="py-4 text-slate-400 text-xs font-bold uppercase">Tipe</th>
                  <th className="py-4 text-slate-400 text-xs font-bold uppercase text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {accounts.map(acc => (
                  <tr key={acc.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-mono text-sm text-indigo-600 font-bold">{acc.code}</td>
                    <td className="py-4 font-semibold text-sm text-slate-700">{acc.name}</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-500 border border-slate-200">{acc.type}</span>
                    </td>
                    <td className="py-4 text-right font-black text-sm text-slate-800">Rp {acc.balance.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold">Pilih Gateway Aktif</h3>
            <div className="grid gap-4">
              {gateways.map(gw => (
                <div 
                  key={gw.id}
                  onClick={() => onUpdatePaymentConfig({ activeGateway: gw.id })}
                  className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex gap-5 ${
                    paymentConfig.activeGateway === gw.id 
                      ? 'border-indigo-600 bg-indigo-50/50' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${gw.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                    <i className={`fas ${gw.icon} text-2xl`}></i>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{gw.name}</span>
                      {paymentConfig.activeGateway === gw.id && (
                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Aktif</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{gw.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h4 className="font-bold flex items-center gap-2">
                <i className="fas fa-key text-amber-500"></i>
                Konfigurasi API
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Midtrans Server Key</label>
                  <input 
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={paymentConfig.midtransApiKey}
                    onChange={(e) => onUpdatePaymentConfig({ midtransApiKey: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Xendit Secret Key</label>
                  <input 
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={paymentConfig.xenditApiKey}
                    onChange={(e) => onUpdatePaymentConfig({ xenditApiKey: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Mode Sandbox</p>
                    <p className="text-[10px] text-amber-700">Gunakan untuk testing.</p>
                  </div>
                  <button 
                    onClick={() => onUpdatePaymentConfig({ isSandbox: !paymentConfig.isSandbox })}
                    className={`w-12 h-6 rounded-full transition-all relative ${paymentConfig.isSandbox ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${paymentConfig.isSandbox ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                Simpan Perubahan
              </button>
            </div>
            
            <div className="bg-indigo-600 p-6 rounded-3xl text-white space-y-4 overflow-hidden relative">
              <i className="fas fa-shield-halved absolute -right-4 -bottom-4 text-8xl text-indigo-500 opacity-30"></i>
              <h4 className="font-bold relative z-10">Kenapa menggunakan Payment Gateway?</h4>
              <ul className="text-sm space-y-2 relative z-10 text-indigo-100">
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle mt-1 text-emerald-400"></i>
                  Rekonsiliasi otomatis.
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle mt-1 text-emerald-400"></i>
                  Terima kartu kredit, e-wallet, & QRIS.
                </li>
                <li className="flex items-start gap-2">
                  <i className="fas fa-check-circle mt-1 text-emerald-400"></i>
                  Lacak status real-time.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
