
import React, { useState } from 'react';
import { Transaction, PaymentConfig } from '../types';

interface SalesViewProps {
  transactions: Transaction[];
  paymentConfig: PaymentConfig;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

const SalesView: React.FC<SalesViewProps> = ({ transactions, paymentConfig, onUpdateTransaction }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const salesInvoices = transactions.filter(t => t.type === 'Penjualan');

  const generatePaymentLink = async (invoice: Transaction) => {
    setIsGenerating(true);
    // Simulate API call to Midtrans/Xendit
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockLink = paymentConfig.activeGateway === 'Midtrans' 
      ? `https://app.sandbox.midtrans.com/snap/v2/vtweb/${Math.random().toString(36).substring(7)}`
      : `https://checkout.xendit.co/web/${Math.random().toString(36).substring(7)}`;

    onUpdateTransaction(invoice.id, { 
      paymentLink: mockLink, 
      paymentGateway: paymentConfig.activeGateway 
    });
    
    if (selectedInvoice?.id === invoice.id) {
      setSelectedInvoice({ ...invoice, paymentLink: mockLink, paymentGateway: paymentConfig.activeGateway });
    }
    
    setIsGenerating(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Lunas': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Belum Bayar': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Kadaluarsa': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Daftar Penjualan</h2>
          <p className="text-slate-500 text-sm">Kelola faktur, lacak pembayaran, dan kirim tagihan.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100 font-semibold">
          <i className="fas fa-plus"></i> Buat Faktur Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Faktur</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pelanggan</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Link</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salesInvoices.map(invoice => (
              <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-bold text-indigo-600">{invoice.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold">{invoice.customerVendor}</p>
                    <p className="text-[10px] text-slate-400">{invoice.customerEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{invoice.date}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800">Rp {invoice.total.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {invoice.status === 'Lunas' ? (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <i className="fas fa-check-circle"></i> Terbayar
                    </span>
                  ) : invoice.paymentLink ? (
                    <a 
                      href={invoice.paymentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                    >
                      <i className="fas fa-link"></i> Salin Link
                    </a>
                  ) : (
                    <button 
                      onClick={() => generatePaymentLink(invoice)}
                      disabled={isGenerating}
                      className="text-xs text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
                    >
                      {isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-magic"></i>}
                      Generate Link
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => setSelectedInvoice(invoice)}
                    className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Detail Modal/Side Panel */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-xl">Detail Faktur</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Nomor Faktur</p>
                  <h4 className="text-2xl font-black text-slate-800">{selectedInvoice.id}</h4>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusStyle(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Pelanggan</p>
                  <p className="font-bold text-slate-700">{selectedInvoice.customerVendor}</p>
                  <p className="text-sm text-slate-500">{selectedInvoice.customerEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Tanggal Terbit</p>
                  <p className="font-bold text-slate-700">{selectedInvoice.date}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Daftar Barang</p>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  {selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <p className="font-bold">Rp {(item.qty * item.price).toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center mt-2">
                    <span className="font-bold text-slate-800">Total Tagihan</span>
                    <span className="text-xl font-black text-indigo-600">Rp {selectedInvoice.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.status !== 'Lunas' && (
                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <i className="fas fa-credit-card"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-900">Pembayaran Online</p>
                      <p className="text-[10px] text-indigo-600 uppercase tracking-tighter">Powered by {selectedInvoice.paymentGateway || paymentConfig.activeGateway}</p>
                    </div>
                  </div>
                  
                  {selectedInvoice.paymentLink ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-indigo-200 text-xs font-mono text-slate-500 break-all select-all">
                        {selectedInvoice.paymentLink}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100">
                          Kirim ke WhatsApp
                        </button>
                        <button className="p-3 bg-white border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50">
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => generatePaymentLink(selectedInvoice)}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-bolt"></i>}
                      Aktifkan Link Pembayaran
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-white transition-all">
                Cetak PDF
              </button>
              <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                Tandai Lunas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesView;
