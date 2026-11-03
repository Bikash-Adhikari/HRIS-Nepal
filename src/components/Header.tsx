import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Clock,
  UserCheck,
  Bell,
  RefreshCw,
  LogOut,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { UserSession } from '../types/hris';

interface HeaderProps {
  currentUser: UserSession;
  onSwitchUser: (user: UserSession) => void;
  onResetData: () => void;
  activeFiscalYear: string;
  onNavigateToDeployment: () => void;
}

export const PRESET_USERS: UserSession[] = [
  {
    userId: 'USR-ADMIN-001',
    employeeId: 'EMP-0001',
    email: 'bikash@himalayancloud.com.np',
    fullName: 'Bikash Adhikari',
    role: 'super_admin',
    departmentId: 'DEP-001',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    userId: 'USR-HR-002',
    employeeId: 'EMP-0002',
    email: 'sunita.m@himalayancloud.com.np',
    fullName: 'Sunita Maharjan',
    role: 'hr_admin',
    departmentId: 'DEP-002',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    userId: 'USR-STAFF-005',
    employeeId: 'EMP-0005',
    email: 'aarav.s@himalayancloud.com.np',
    fullName: 'Aarav Sharma',
    role: 'staff',
    departmentId: 'DEP-001',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onResetData,
  activeFiscalYear,
  onNavigateToDeployment,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <span className="bg-red-900/60 text-red-200 border border-red-700/50 text-xs px-2 py-0.5 rounded-full font-medium">Super Admin</span>;
      case 'hr_admin':
        return <span className="bg-purple-900/60 text-purple-200 border border-purple-700/50 text-xs px-2 py-0.5 rounded-full font-medium">HR Admin</span>;
      default:
        return <span className="bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 text-xs px-2 py-0.5 rounded-full font-medium">Staff Portal</span>;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-red-950/30">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">HamroHR</span>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-semibold bg-red-600/30 text-red-300 border border-red-500/40 rounded">
                🇳🇵 Nepal Edition
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Labor Act 2074 & SSF Compliant HRIS</p>
          </div>
        </div>

        {/* Middle Stats: Fiscal Year & Nepal Time */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            <span>Fiscal Year:</span>
            <strong className="text-white font-mono">{activeFiscalYear} BS</strong>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kathmandu (NPT):</span>
            <strong className="text-emerald-300 font-mono">UTC+5:45</strong>
          </div>
        </div>

        {/* Right Controls: Role Switcher, Apps Script Export, User Info */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNavigateToDeployment}
            className="hidden lg:flex items-center space-x-1.5 text-xs bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 px-3 py-1.5 rounded-lg transition"
            title="Inspect 26-sheet schema & Google Apps Script deployable files"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
            <span>Apps Script / Sheets Code</span>
          </button>

          <button
            onClick={onResetData}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            title="Reset demo database to original state"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2.5 p-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-left transition"
              aria-label="Toggle user role menu"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-red-500/40"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                  {currentUser.fullName}
                </div>
                <div className="mt-0.5">{getRoleBadge(currentUser.role)}</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-700">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Switch Active Persona</p>
                  <p className="text-[11px] text-slate-500">Test different role permissions & least-privilege view</p>
                </div>

                {PRESET_USERS.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => {
                      onSwitchUser(user);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 flex items-center space-x-3 hover:bg-slate-700/60 transition ${
                      currentUser.userId === user.userId ? 'bg-slate-700/40' : ''
                    }`}
                  >
                    <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{user.fullName}</span>
                        {getRoleBadge(user.role)}
                      </div>
                      <span className="text-[11px] text-slate-400">{user.email}</span>
                    </div>
                  </button>
                ))}

                <div className="border-t border-slate-700 mt-1 pt-1 px-2">
                  <div className="p-2 text-[11px] text-amber-300/80 bg-amber-950/40 rounded border border-amber-800/40">
                    <Shield className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                    Least Privilege Enforced: Staff cannot view company payroll or fellow employee personal data.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
