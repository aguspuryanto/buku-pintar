
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

  const exportToCSV = () => {
    const headers = ['ID Faktur', 'Pelanggan', 'Email', 'Tanggal', 'Total (Rp)', 'Status', 'Gateway'];
    const rows = salesInvoices.map(invoice => [
      invoice.id,
      invoice.customerVendor,
      invoice.customerEmail || '-',
      invoice.date,
      invoice.total,
      invoice.status,
      invoice.paymentGateway || 'Manual'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Penjualan_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold">Daftar Penjualan</h2>
          <p className="text-slate-500 text-xs md:text-sm">Kelola faktur dan tagihan.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={exportToCSV}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs md:text-sm font-semibold flex items-center justify-center gap-2"
          >
            <i className="fas fa-file-export"></i> Ekspor
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-xs md:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
            <i className="fas fa-plus"></i> Faktur Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faktur</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-indigo-600">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="min-w-[120px]">
                      <p className="text-sm font-semibold truncate">{invoice.customerVendor}</p>
                      <p className="text-[10px] text-slate-400 truncate">{invoice.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{invoice.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">Rp {invoice.total.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border whitespace-nowrap ${getStatusStyle(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setSelectedInvoice(invoice)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-full sm:max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg md:text-xl">Detail Faktur</h3>
              <button onClick={() => setSelectedInvoice(null)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 md:space-y-8">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Nomor Faktur</p>
                  <h4 className="text-xl md:text-2xl font-black text-slate-800 truncate">{selectedInvoice.id}</h4>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border shrink-0 ${getStatusStyle(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Pelanggan</p>
                  <p className="font-bold text-slate-700 text-sm md:text-base">{selectedInvoice.customerVendor}</p>
                  <p className="text-xs text-slate-500 truncate">{selectedInvoice.customerEmail}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Tanggal Terbit</p>
                  <p className="font-bold text-slate-700 text-sm md:text-base">{selectedInvoice.date}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Daftar Barang</p>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  {selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs md:text-sm">
                      <div className="flex-1 pr-4">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-[10px] md:text-xs text-slate-500">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                      <p className="font-bold shrink-0">Rp {(item.qty * item.price).toLocaleString('id-ID')}</p>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center mt-2">
                    <span className="font-bold text-slate-800 text-xs">Total Tagihan</span>
                    <span className="text-lg md:text-xl font-black text-indigo-600">Rp {selectedInvoice.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {selectedInvoice.status !== 'Lunas' && (
                <div className="p-4 md:p-5 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
                      <i className="fas fa-credit-card"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-900">Pembayaran Online</p>
                      <p className="text-[10px] text-indigo-600 uppercase tracking-tighter">Powered by {selectedInvoice.paymentGateway || paymentConfig.activeGateway}</p>
                    </div>
                  </div>
                  
                  {selectedInvoice.paymentLink ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-xl border border-indigo-200 text-[10px] font-mono text-slate-500 break-all select-all">
                        {selectedInvoice.paymentLink}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100">
                          Kirim WhatsApp
                        </button>
                        <button className="py-3 px-4 bg-white border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 text-xs font-bold">
                          Salin Link
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => generatePaymentLink(selectedInvoice)}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                      {isGenerating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-bolt"></i>}
                      Aktifkan Link Pembayaran
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-white transition-all">
                PDF
              </button>
              <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
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
