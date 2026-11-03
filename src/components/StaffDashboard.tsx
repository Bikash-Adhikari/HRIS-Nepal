import React, { useState } from 'react';
import {
  Clock,
  CalendarDays,
  FileText,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Download,
  Eye,
  Shield,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Employee, AttendanceRecord, LeaveBalance, LeaveApplication, Holiday, PayrollDetail } from '../types/hris';

interface StaffDashboardProps {
  currentEmployee: Employee;
  attendance: AttendanceRecord[];
  leaveBalances: LeaveBalance[];
  leaveApplications: LeaveApplication[];
  holidays: Holiday[];
  onCheckIn: (employeeId: string) => void;
  onCheckOut: (employeeId: string) => void;
  onApplyLeave: () => void;
  onViewPayslip: (detail: any) => void;
  onNavigateTab: (tab: any) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentEmployee,
  attendance,
  leaveBalances,
  leaveApplications,
  holidays,
  onCheckIn,
  onCheckOut,
  onApplyLeave,
  onViewPayslip,
  onNavigateTab,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((a) => a.employeeId === currentEmployee.id && a.date === today);

  const myLeaves = leaveApplications.filter((l) => l.employeeId === currentEmployee.id);
  const myBalances = leaveBalances.filter((b) => b.employeeId === currentEmployee.id);

  // Simulated latest payslip for this staff member
  const latestPayslipDetail = {
    id: `PAYD-LATEST-${currentEmployee.id}`,
    payrollRunId: 'PAY-0001',
    employeeId: currentEmployee.id,
    employeeName: currentEmployee.fullName,
    departmentName: 'Engineering & Tech',
    designationTitle: 'Junior Frontend Developer',
    bankName: currentEmployee.bankName,
    bankAccountNumber: currentEmployee.accountNumber,
    panNumber: currentEmployee.panNumber,
    ssfNumber: currentEmployee.ssfNumber,
    maritalStatus: currentEmployee.maritalStatus,
    totalMonthDays: 30,
    presentDays: 26,
    paidLeaveDays: 0,
    unpaidLeaveDays: 0,
    weeklyOffDays: 4,
    publicHolidayDays: 0,
    payableDays: 30,
    basicSalary: currentEmployee.basicSalary,
    dearnessAllowance: currentEmployee.dearnessAllowance || 3500,
    houseRentAllowance: currentEmployee.houseRentAllowance || 8500,
    transportAllowance: currentEmployee.transportAllowance || 3000,
    communicationAllowance: currentEmployee.communicationAllowance || 1500,
    mealAllowance: currentEmployee.mealAllowance || 2500,
    otherAllowances: currentEmployee.otherAllowances || 500,
    overtimeAmount: 0,
    festivalBonusAmount: 0,
    performanceBonus: 0,
    grossEarnings: currentEmployee.basicSalary + 19500,
    isEnrolledInSSF: currentEmployee.isEnrolledInSSF,
    employeeSSF: Math.round(currentEmployee.basicSalary * 0.11),
    incomeTaxTDS: 0,
    loanDeduction: 5000,
    unpaidLeaveDeduction: 0,
    otherDeductions: 0,
    totalDeductions: Math.round(currentEmployee.basicSalary * 0.11) + 5000,
    netPayableSalary: currentEmployee.basicSalary + 19500 - (Math.round(currentEmployee.basicSalary * 0.11) + 5000),
    employerSSF: Math.round(currentEmployee.basicSalary * 0.20),
    totalCompanyCost: currentEmployee.basicSalary + 19500 + Math.round(currentEmployee.basicSalary * 0.20),
    paymentStatus: 'Paid' as const,
    paymentReference: 'TXN-98214059',
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img
            src={currentEmployee.avatarUrl}
            alt={currentEmployee.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Namaste, {currentEmployee.fullName} 🙏</h1>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                {currentEmployee.employmentType}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-1">
              {currentEmployee.id} • {currentEmployee.workLocation} • Reporting to Bikash Adhikari
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onApplyLeave}
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
          <button
            onClick={() => onNavigateTab('tax_simulator')}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <span>My Tax Calculator</span>
          </button>
        </div>
      </div>

      {/* Grid: Check-in Widget & Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Attendance Check-in Widget */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today's Punch Card</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">{today}</span>
            </div>

            <div className="text-center py-4 bg-slate-800/40 rounded-xl border border-slate-800 mb-4">
              <Clock className="w-8 h-8 text-indigo-400 mx-auto mb-2 animate-pulse" />
              <div className="text-xs text-slate-400">Current Status</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {todayRecord ? (
                  <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" /> Checked In at {todayRecord.checkInTime}
                  </span>
                ) : (
                  <span className="text-amber-400">Not Checked In Yet</span>
                )}
              </div>
              {todayRecord?.checkOutTime && (
                <div className="text-xs text-slate-400 mt-1">Checked Out at {todayRecord.checkOutTime}</div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              {!todayRecord ? (
                <button
                  onClick={() => onCheckIn(currentEmployee.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md shadow-emerald-950/40"
                >
                  Punch Check In (Office)
                </button>
              ) : !todayRecord.checkOutTime ? (
                <button
                  onClick={() => onCheckOut(currentEmployee.id)}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-md shadow-rose-950/40"
                >
                  Punch Check Out
                </button>
              ) : (
                <div className="w-full bg-slate-800 text-slate-400 font-medium py-2 rounded-xl text-xs text-center border border-slate-700">
                  Full Shift Completed ({todayRecord.workHours} hrs)
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-4 leading-tight">
            * Server-verified timestamp logged to Google Sheets Attendance tab.
          </p>
        </div>

        {/* Leave Balances Grid */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">My Leave Entitlement (FY 2081/82)</h2>
              <p className="text-xs text-slate-400">Nepal Labour Act 2074 accrued quotas</p>
            </div>
            <button
              onClick={() => onNavigateTab('leaves')}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center space-x-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {myBalances.map((b) => (
              <div key={b.leaveTypeId} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="text-xs font-semibold text-slate-300 truncate" title={b.leaveTypeName}>
                  {b.leaveTypeName}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-white">{b.remainingBalance}</span>
                    <span className="text-xs text-slate-400 ml-1">days left</span>
                  </div>
                  <span className="text-xs bg-slate-700/60 px-2 py-0.5 rounded text-slate-300 font-mono">
                    Quota: {b.annualEntitlement}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-700/50 pt-2">
                  <span>Taken: {b.taken} days</span>
                  {b.pendingRequests > 0 && (
                    <span className="text-amber-400 font-medium">{b.pendingRequests} pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pending Applications Alert */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 mb-2">My Active Requests</h3>
            {myLeaves.length > 0 ? (
              <div className="space-y-2">
                {myLeaves.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-lg border border-slate-700/40 text-xs"
                  >
                    <div>
                      <span className="font-medium text-slate-200">{l.leaveTypeName}</span>
                      <span className="text-slate-400 ml-2">
                        {l.startDate} to {l.endDate} ({l.workingDays} working days)
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        l.status === 'Approved'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : l.status === 'Rejected'
                          ? 'bg-red-950 text-red-300 border border-red-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No pending leave requests.</p>
            )}
          </div>
        </div>
      </div>

      {/* Two Column: Latest Payslip & Holidays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Payslip Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">My Latest Payslip</h2>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
              Disbursed (Ashwin 2081)
            </span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div>
                <span className="text-slate-400">Net Take-Home Pay</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  NPR {latestPayslipDetail.netPayableSalary.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => onViewPayslip(latestPayslipDetail)}
                className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Payslip</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <span className="text-slate-400 block">Gross Earnings:</span>
                <span className="text-slate-200 font-medium">NPR {latestPayslipDetail.grossEarnings.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">SSF Contribution (11%):</span>
                <span className="text-amber-300 font-medium">NPR {latestPayslipDetail.employeeSSF.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Bank Account:</span>
                <span className="text-slate-200 font-mono">{currentEmployee.bankName} (***{currentEmployee.accountNumber.slice(-4)})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Employer SSF (20% paid):</span>
                <span className="text-indigo-300 font-medium">NPR {latestPayslipDetail.employerSSF.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nepal Gazetted Public Holidays */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-white">Upcoming Nepal Holidays</h2>
            </div>
            <span className="text-xs text-slate-400">Bikram Sambat 2081</span>
          </div>

          <div className="space-y-2.5">
            {holidays.slice(0, 4).map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-xs"
              >
                <div>
                  <div className="font-semibold text-white flex items-center space-x-2">
                    <span>{h.name}</span>
                    {h.nameNepali && <span className="text-rose-400 text-[11px]">({h.nameNepali})</span>}
                  </div>
                  <span className="text-slate-400 text-[11px]">{h.description}</span>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="font-mono text-emerald-400 font-semibold">{h.date}</span>
                  <div className="text-[10px] text-slate-500">{h.durationDays} day(s) off</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
