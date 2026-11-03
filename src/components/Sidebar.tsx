import React from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Banknote,
  Calculator,
  FileText,
  ShieldCheck,
  FileSpreadsheet,
  Settings,
  CreditCard,
  UserCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types/hris';

export type NavigationTab =
  | 'admin_dashboard'
  | 'staff_dashboard'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'payroll'
  | 'loans'
  | 'tax_simulator'
  | 'reports'
  | 'audit_logs'
  | 'deployment_guide'
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  userRole: UserRole;
  pendingLeaveCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userRole,
  pendingLeaveCount,
}) => {
  const isAdmin = userRole === 'super_admin' || userRole === 'hr_admin' || userRole === 'finance_manager';

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {isAdmin ? 'Administrative Modules' : 'Staff Self-Service'}
          </div>

          <nav className="space-y-1">
            {isAdmin ? (
              <button
                onClick={() => onSelectTab('admin_dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'admin_dashboard'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Executive Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectTab('staff_dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'staff_dashboard'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>My Dashboard</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onSelectTab('employees')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'employees'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Employee Master</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('attendance')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'attendance'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{isAdmin ? 'Attendance & Biometrics' : 'My Attendance'}</span>
            </button>

            <button
              onClick={() => onSelectTab('leaves')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'leaves'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <CalendarDays className="w-4 h-4 shrink-0" />
                <span>{isAdmin ? 'Leave Workflows' : 'Leave Applications'}</span>
              </div>
              {isAdmin && pendingLeaveCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
                  {pendingLeaveCount}
                </span>
              )}
            </button>

            {isAdmin && (
              <button
                onClick={() => onSelectTab('payroll')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'payroll'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Banknote className="w-4 h-4 shrink-0" />
                <span>Nepal Payroll Run</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => onSelectTab('loans')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'loans'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Advances & Loans</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('tax_simulator')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'tax_simulator'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>Nepal Tax & SSF Sandbox</span>
            </button>
          </nav>
        </div>

        {/* Analytics & Compliance Section */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Governance & Architecture
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => onSelectTab('reports')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'reports'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>{isAdmin ? 'Statutory Reports & Bank CSV' : 'My Payslip Archive'}</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onSelectTab('audit_logs')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'audit_logs'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Compliance Audit Logs</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab('deployment_guide')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                currentTab === 'deployment_guide'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-indigo-300 hover:bg-indigo-950/40 hover:text-indigo-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>Apps Script & Sheets Hub</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => onSelectTab('settings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentTab === 'settings'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Statutory Settings</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-950/40">
        <div className="flex items-center space-x-1.5 text-slate-300 font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span>Nepal Statutory Engine</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Social Security Fund (SSF 11%+20%) & Inland Revenue Dept FY 2081/82 Finance Act Slabs.
        </p>
      </div>
    </aside>
  );
};
