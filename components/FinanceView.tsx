
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
      desc: 'Populer di Indonesia: GoPay, ShopeePay, & Virtual Accounts.'
    },
    { 
      id: 'Xendit', 
      name: 'Xendit', 
      icon: 'fa-bolt', 
      color: 'bg-indigo-500',
      desc: 'Infrastruktur pembayaran modern dengan aktivasi cepat.'
    },
    { 
      id: 'Manual', 
      name: 'Manual / Bank', 
      icon: 'fa-building-columns', 
      color: 'bg-slate-600',
      desc: 'Konfirmasi pembayaran dilakukan manual oleh admin.'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 bg-slate-200/50 rounded-2xl w-full sm:w-fit overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('COA')}
          className={`flex-1 sm:flex-none whitespace-nowrap px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === 'COA' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Daftar Akun
        </button>
        <button 
          onClick={() => setActiveTab('Gateway')}
          className={`flex-1 sm:flex-none whitespace-nowrap px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeTab === 'Gateway' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Gateways
        </button>
      </div>

      {activeTab === 'COA' ? (
        <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Chart of Accounts</h2>
            <button className="w-full sm:w-auto px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
              + Tambah Akun
            </button>
          </div>
          <div className="overflow-x-auto -mx-5 md:mx-0">
            <div className="inline-block min-w-full align-middle px-5 md:px-0">
              <table className="min-w-full text-left">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="py-4 text-slate-400 text-[10px] font-bold uppercase whitespace-nowrap">Kode</th>
                    <th className="py-4 text-slate-400 text-[10px] font-bold uppercase whitespace-nowrap px-4">Nama Akun</th>
                    <th className="py-4 text-slate-400 text-[10px] font-bold uppercase whitespace-nowrap">Tipe</th>
                    <th className="py-4 text-slate-400 text-[10px] font-bold uppercase text-right whitespace-nowrap">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {accounts.map(acc => (
                    <tr key={acc.code} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 font-mono text-xs text-indigo-600 font-bold whitespace-nowrap">{acc.code}</td>
                      <td className="py-4 font-semibold text-xs text-slate-700 px-4">{acc.name}</td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-500 border border-slate-200 whitespace-nowrap">{acc.type}</span>
                      </td>
                      <td className="py-4 text-right font-black text-xs text-slate-800 whitespace-nowrap">Rp {acc.balance.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg md:text-xl font-bold">Pilih Gateway Aktif</h3>
            <div className="grid gap-4">
              {gateways.map(gw => (
                <div 
                  key={gw.id}
                  onClick={() => onUpdatePaymentConfig({ activeGateway: gw.id })}
                  className={`p-5 md:p-6 rounded-3xl border-2 transition-all cursor-pointer flex gap-4 md:gap-5 ${
                    paymentConfig.activeGateway === gw.id 
                      ? 'border-indigo-600 bg-indigo-50/50' 
                      : 'border-slate-100 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${gw.color} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                    <i className={`fas ${gw.icon} text-xl md:text-2xl`}></i>
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm md:text-lg truncate">{gw.name}</span>
                      {paymentConfig.activeGateway === gw.id && (
                        <span className="bg-indigo-600 text-white text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-black uppercase shrink-0">Aktif</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed truncate-3-lines">{gw.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h4 className="font-bold text-sm md:text-base flex items-center gap-2">
                <i className="fas fa-key text-amber-500"></i>
                Konfigurasi API
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Server Key / Secret</label>
                  <input 
                    type="password"
                    placeholder="Enter API Key"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={paymentConfig.activeGateway === 'Midtrans' ? paymentConfig.midtransApiKey : paymentConfig.xenditApiKey}
                    onChange={(e) => {
                       if (paymentConfig.activeGateway === 'Midtrans') onUpdatePaymentConfig({ midtransApiKey: e.target.value });
                       else onUpdatePaymentConfig({ xenditApiKey: e.target.value });
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div>
                    <p className="text-[10px] font-bold text-amber-900 uppercase">Mode Sandbox</p>
                    <p className="text-[10px] text-amber-700">Gunakan untuk testing.</p>
                  </div>
                  <button 
                    onClick={() => onUpdatePaymentConfig({ isSandbox: !paymentConfig.isSandbox })}
                    className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${paymentConfig.isSandbox ? 'bg-amber-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${paymentConfig.isSandbox ? 'right-0.5' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>

              <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs md:text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceView;
