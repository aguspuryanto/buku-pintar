
import React from 'react';
import { Employee } from '../types';

interface HRViewProps {
  employees: Employee[];
}

const HRView: React.FC<HRViewProps> = ({ employees }) => {
  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Manajemen SDM & Gaji</h2>
          <p className="text-slate-500 text-sm">Kelola upah borongan, gaji tetap, dan pinjaman karyawan.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <i className="fas fa-plus"></i> Tambah Karyawan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map(emp => {
          const totalBorongan = emp.boronganRate * emp.completedTasks;
          const grossSalary = emp.baseSalary + totalBorongan;
          const netSalary = grossSalary - emp.loans;

          return (
            <div key={emp.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{emp.name}</h3>
                    <p className="text-sm text-slate-500">{emp.role}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Gaji Pokok:</span>
                    <span className="font-semibold">Rp {emp.baseSalary.toLocaleString('id-ID')}</span>
                  </div>
                  {emp.boronganRate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Upah Borongan ({emp.completedTasks} task):</span>
                      <span className="font-semibold text-emerald-600">+ Rp {totalBorongan.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  {emp.loans > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Potongan Pinjaman:</span>
                      <span className="font-semibold text-rose-500">- Rp {emp.loans.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-800">Gaji Bersih:</span>
                    <span className="text-lg font-bold text-indigo-600 underline decoration-indigo-200 decoration-4">
                      Rp {netSalary.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 flex gap-2">
                <button className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors">
                  Detail Absensi
                </button>
                <button className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors">
                  Slip Gaji
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HRView;
