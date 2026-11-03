import React from 'react';
import {
  Users,
  UserCheck,
  Clock,
  CalendarDays,
  Banknote,
  AlertTriangle,
  Gift,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import { Employee, AttendanceRecord, LeaveApplication, PayrollRun } from '../types/hris';

interface AdminDashboardProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveApplications: LeaveApplication[];
  payrollRuns: PayrollRun[];
  onNavigate: (tab: any) => void;
  onOpenNewEmployeeModal: () => void;
  onOpenPayrollModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  employees,
  attendance,
  leaveApplications,
  payrollRuns,
  onNavigate,
  onOpenNewEmployeeModal,
  onOpenPayrollModal,
}) => {
  const activeEmployees = employees.filter((e) => e.employmentStatus === 'Active');
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === today);
  const presentCount = todayAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'Late').length;
  const attendanceRate = activeEmployees.length > 0 ? Math.round((presentCount / activeEmployees.length) * 100) : 0;

  const pendingLeaves = leaveApplications.filter((l) => l.status === 'Pending Manager' || l.status === 'Pending HR');

  // Probation / Contract ending soon
  const probationEmployees = employees.filter((e) => e.employmentType === 'Probation');

  // Latest payroll run or calculated stats
  const latestPayroll = payrollRuns[0];
  const totalMonthlyGrossEstimate = activeEmployees.reduce((acc, e) => {
    return acc + e.basicSalary + (e.dearnessAllowance || 0) + (e.houseRentAllowance || 0) + (e.transportAllowance || 0) + (e.mealAllowance || 0) + (e.communicationAllowance || 0) + (e.otherAllowances || 0);
  }, 0);
  const totalEmployerSSFEstimate = activeEmployees.reduce((acc, e) => {
    return acc + (e.isEnrolledInSSF ? Math.round(e.basicSalary * 0.20) : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive HR & Compliance Overview</h1>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-medium">
              Live Production State
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Monitoring workforce operations, Nepal Labor Act compliance, SSF contributions, and progressive TDS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              onNavigate('employees');
              onOpenNewEmployeeModal();
            }}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
          >
            <Users className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>
          <button
            onClick={() => {
              onNavigate('payroll');
              onOpenPayrollModal();
            }}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-950/40 transition"
          >
            <Banknote className="w-4 h-4" />
            <span>Run Monthly Payroll</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div
          onClick={() => onNavigate('employees')}
          className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 hover:bg-slate-800/60 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Workforce</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{employees.length}</span>
            <span className="text-xs text-emerald-400 font-medium">({activeEmployees.length} Active)</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Engineering, HR & Finance</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </div>
        </div>

        {/* Today's Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 hover:bg-slate-800/60 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's Attendance</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{attendanceRate}%</span>
            <span className="text-xs text-slate-400 font-medium">
              ({presentCount}/{activeEmployees.length} Checked In)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span className={lateCount > 0 ? 'text-amber-400' : 'text-slate-500'}>
              {lateCount} Late Arrivals flagged
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </div>
        </div>

        {/* Pending Leave Approvals */}
        <div
          onClick={() => onNavigate('leaves')}
          className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 hover:bg-slate-800/60 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Leave Requests</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/20 transition">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{pendingLeaves.length}</span>
            <span className="text-xs text-amber-400 font-medium">Requires Approval</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Multi-tier workflow active</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </div>
        </div>

        {/* Estimated Monthly Payroll */}
        <div
          onClick={() => onNavigate('payroll')}
          className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-700 hover:bg-slate-800/60 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Est. Monthly Gross</span>
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl group-hover:bg-rose-500/20 transition">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1.5">
            <span className="text-xs text-slate-400">NPR</span>
            <span className="text-2xl font-extrabold text-white">
              {(totalMonthlyGrossEstimate / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Employer SSF: NPR {(totalEmployerSSFEstimate / 1000).toFixed(0)}k</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Payroll & Compliance summary + Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Payroll Processing Status & Summary */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Nepal Payroll & Statutory Summary</h2>
              <p className="text-xs text-slate-400">Current fiscal year 2081/82 disbursement & tax metrics</p>
            </div>
            <button
              onClick={() => onNavigate('payroll')}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center space-x-1"
            >
              <span>View History</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {latestPayroll ? (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <span className="text-xs text-slate-400">Last Executed Run</span>
                  <div className="text-base font-semibold text-white">
                    {latestPayroll.monthNepali} ({latestPayroll.fiscalYear})
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    latestPayroll.status === 'Locked'
                      ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700'
                      : 'bg-amber-900/60 text-amber-200 border border-amber-700'
                  }`}
                >
                  {latestPayroll.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Gross Payable:</span>
                  <strong className="text-white font-mono text-sm">
                    NPR {latestPayroll.totalGrossPayable.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Employee SSF (11%):</span>
                  <strong className="text-amber-400 font-mono text-sm">
                    NPR {latestPayroll.totalEmployeeSSF.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Income Tax (TDS):</span>
                  <strong className="text-rose-400 font-mono text-sm">
                    NPR {latestPayroll.totalIncomeTaxTDS.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Net Disbursed:</span>
                  <strong className="text-emerald-400 font-mono text-sm">
                    NPR {latestPayroll.totalNetPayable.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-xl p-6 text-center">
              <Banknote className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-300">No Payroll Processed Yet This Month</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                All employee attendance and salary structures are loaded. Ready to calculate Nepal progressive tax and SSF.
              </p>
              <button
                onClick={() => {
                  onNavigate('payroll');
                  onOpenPayrollModal();
                }}
                className="mt-4 inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow"
              >
                <span>Launch Monthly Payroll Run</span>
              </button>
            </div>
          )}

          {/* Statutory Nepal Pillars */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-indigo-400 font-medium mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>SSF Compliance</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                11% employee + 20% employer contribution active. Exempts employees from 1% Social Security Tax.
              </p>
            </div>

            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400 font-medium mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Progressive TDS</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Finance Act 2081/82 single (500k-5M+) and couple (600k-5M+) slabs with 10% female rebate.
              </p>
            </div>

            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-medium mb-1">
                <FileCheck2 className="w-4 h-4" />
                <span>Bank Export</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                One-click export of salary disbursement spreadsheets for Nabil, NIC Asia, Global IME, and ConnectIPS.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Lifecycle Milestones */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Workforce Reminders</h2>
            <p className="text-xs text-slate-400 mb-4">Probation, contract renewal & birthdays</p>

            <div className="space-y-3">
              {/* Probation Alert */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start space-x-3">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">Probation Assessment Due</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {probationEmployees.length} employee currently on probation ({probationEmployees.map((e) => e.fullName).join(', ')}).
                  </p>
                </div>
              </div>

              {/* Birthday reminder */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start space-x-3">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">Upcoming Birthdays</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Rohan Thapa (Finance Officer) on Nov 05.
                  </p>
                </div>
              </div>

              {/* Public Holiday alert */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start space-x-3">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">Upcoming Gazetted Holiday</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Tihar (Laxmi Puja & Bhai Tika) - 3 days public holidays starting Nov 09.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigate('deployment_guide')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition"
            >
              <span>View Google Sheets Master Schema</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
