
import React from 'react';
import { Module } from '../types';

interface SidebarProps {
  activeModule: Module;
  setActiveModule: (module: Module) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, isOpen, setIsOpen }) => {
  const menuItems: { name: Module; icon: string }[] = [
    { name: 'Dashboard', icon: 'fa-chart-pie' },
    { name: 'Inventori', icon: 'fa-boxes-stacked' },
    { name: 'Penjualan', icon: 'fa-cart-shopping' },
    { name: 'Pembelian', icon: 'fa-truck-fast' },
    { name: 'Keuangan', icon: 'fa-money-bill-transfer' },
    { name: 'SDM', icon: 'fa-users' },
    { name: 'Aset', icon: 'fa-building-columns' },
    { name: 'Laporan', icon: 'fa-file-invoice-dollar' },
    { name: 'AI', icon: 'fa-robot' },
  ];

  const handleMenuClick = (name: Module) => {
    setActiveModule(name);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed left-0 top-0 h-screen bg-indigo-900 text-white overflow-y-auto flex flex-col shadow-2xl z-[70] transition-transform duration-300 ease-in-out
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-book-bookmark text-xl"></i>
            </div>
            <span className="font-bold text-xl tracking-tight">BukuPintar</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-indigo-300 hover:text-white"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item.name)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 border-l-4 ${
                activeModule === item.name 
                  ? 'bg-indigo-800/50 border-indigo-400 text-white' 
                  : 'border-transparent text-indigo-300 hover:bg-indigo-800/30 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
              <span className="font-medium text-sm tracking-wide uppercase">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-800/40 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-xs font-bold">JD</div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">John Doe</p>
              <p className="text-[10px] text-indigo-300">Admin Utama</p>
            </div>
          </div>
          <button className="text-indigo-300 hover:text-white flex items-center gap-2 text-sm transition-colors">
            <i className="fas fa-right-from-bracket"></i>
            Keluar
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
