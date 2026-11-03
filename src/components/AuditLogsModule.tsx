import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Shield, Clock, Lock } from 'lucide-react';
import { AuditLog } from '../types/hris';

interface AuditLogsModuleProps {
  logs: AuditLog[];
}

export const AuditLogsModule: React.FC<AuditLogsModuleProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.recordId.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesModule = filterModule === 'ALL' || log.module === filterModule;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Compliance Audit Trail</h1>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              Immutable Log
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic and timestamped audit logs for all sensitive payroll approvals, salary alterations, and leave transactions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User, Record ID, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
        >
          <option value="ALL">All Modules</option>
          <option value="Payroll">Payroll</option>
          <option value="Leave">Leave</option>
          <option value="Employees">Employees</option>
          <option value="Attendance">Attendance</option>
          <option value="Loans">Loans</option>
          <option value="System">System</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
              <tr>
                <th className="px-4 py-3 font-semibold">Timestamp (UTC)</th>
                <th className="px-4 py-3 font-semibold">Acting User</th>
                <th className="px-4 py-3 font-semibold">Module</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Target Record ID</th>
                <th className="px-4 py-3 font-semibold">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-white block">{log.userName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{log.userRole}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.action === 'APPROVE' || log.action === 'LOCK'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : log.action === 'CREATE'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          : log.action === 'UPDATE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-rose-400">{log.recordId}</td>
                  <td className="px-4 py-3 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
