import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  Check,
  X,
  Filter,
  Calendar,
} from 'lucide-react';
import { LeaveApplication, LeaveBalance, LeaveType, Employee, Holiday, UserSession } from '../types/hris';
import { calculateWorkingLeaveDays, validateLeaveBalance } from '../lib/leaveCalculator';

interface LeaveModuleProps {
  leaveApplications: LeaveApplication[];
  leaveBalances: LeaveBalance[];
  leaveTypes: LeaveType[];
  employees: Employee[];
  holidays: Holiday[];
  currentUser: UserSession;
  onSubmitLeave: (app: LeaveApplication) => void;
  onReviewLeave: (id: string, action: 'Approved' | 'Rejected', comment: string, roleLevel: 'manager' | 'hr') => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (open: boolean) => void;
}

export const LeaveModule: React.FC<LeaveModuleProps> = ({
  leaveApplications,
  leaveBalances,
  leaveTypes,
  employees,
  holidays,
  currentUser,
  onSubmitLeave,
  onReviewLeave,
  isApplyModalOpen,
  setIsApplyModalOpen,
}) => {
  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'hr_admin';
  const isManager = currentUser.role === 'reporting_manager' || isAdmin;

  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'balances'>('applications');
  const [reviewModalApp, setReviewModalApp] = useState<LeaveApplication | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  // Apply Form State
  const defaultEmpId = currentUser.employeeId || employees[0]?.id || 'EMP-0001';
  const [selectedEmpId, setSelectedEmpId] = useState(defaultEmpId);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState(leaveTypes[0]?.id || 'LT-001');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Calculate live working days excluding Saturday & Nepal Gazetted holidays
  const holidayDateStrings = holidays.map((h) => h.date);
  const calcResult = calculateWorkingLeaveDays({
    startDate,
    endDate,
    isHalfDay,
    publicHolidays: holidayDateStrings,
    weeklyHolidays: [6], // 6 = Saturday in Nepal
  });

  // Check current employee balance
  const activeBalance = leaveBalances.find(
    (b) => b.employeeId === selectedEmpId && b.leaveTypeId === selectedLeaveTypeId
  );
  const currentRemaining = activeBalance ? activeBalance.remainingBalance : 0;
  const currentPending = activeBalance ? activeBalance.pendingRequests : 0;
  const balanceCheck = validateLeaveBalance(currentRemaining, currentPending, calcResult.totalWorkingDays);

  const selectedLeaveType = leaveTypes.find((lt) => lt.id === selectedLeaveTypeId);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setValidationError('Please enter a clear reason for the leave application.');
      return;
    }
    if (calcResult.totalWorkingDays <= 0) {
      setValidationError('Selected date range contains no working days (falls on weekend or public holidays).');
      return;
    }
    if (!balanceCheck.canApply) {
      setValidationError(balanceCheck.message);
      return;
    }

    const emp = employees.find((e) => e.id === selectedEmpId);
    const newApp: LeaveApplication = {
      id: '',
      employeeId: selectedEmpId,
      employeeName: emp?.fullName || 'Employee',
      departmentId: emp?.departmentId || 'DEP-001',
      leaveTypeId: selectedLeaveTypeId,
      leaveTypeName: selectedLeaveType?.name || 'Leave',
      startDate,
      endDate,
      isHalfDay,
      calendarDays: calcResult.totalCalendarDays,
      workingDays: calcResult.totalWorkingDays,
      reason,
      status: 'Pending Manager',
      appliedAt: new Date().toISOString(),
    };

    onSubmitLeave(newApp);
    setIsApplyModalOpen(false);
    setReason('');
    setValidationError(null);
  };

  const visibleApplications = leaveApplications.filter((app) => {
    if (isAdmin) return true;
    return app.employeeId === currentUser.employeeId;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Leave Management & Workflows</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Nepal Labour Act 2074 leave quotas, Saturday weekend deduction, and multi-tier approval trail.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-800 p-1 rounded-xl flex space-x-1 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveSubTab('applications')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeSubTab === 'applications' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Leave Requests
            </button>
            <button
              onClick={() => setActiveSubTab('balances')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                activeSubTab === 'balances' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Quota Balances
            </button>
          </div>

          <button
            onClick={() => {
              setValidationError(null);
              setIsApplyModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'applications' ? (
        /* Applications Table */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="px-4 py-3 font-semibold">Application ID</th>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Leave Category</th>
                  <th className="px-4 py-3 font-semibold">Duration (Working Days)</th>
                  <th className="px-4 py-3 font-semibold">Reason</th>
                  <th className="px-4 py-3 font-semibold">Status & Approver</th>
                  {isManager && <th className="px-4 py-3 font-semibold text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {visibleApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-semibold text-rose-400">{app.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{app.employeeName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{app.employeeId}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200">{app.leaveTypeName}</td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-emerald-400 font-semibold">
                        {app.workingDays} working days
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {app.startDate} to {app.endDate}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-xs truncate" title={app.reason}>
                      {app.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : app.status === 'Rejected'
                            ? 'bg-red-950 text-red-300 border border-red-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                      {app.managerApproval && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Mgr: {app.managerApproval.approverName} ({app.managerApproval.status})
                        </div>
                      )}
                    </td>
                    {isManager && (
                      <td className="px-4 py-3 text-right">
                        {(app.status === 'Pending Manager' || (app.status === 'Pending HR' && isAdmin)) && (
                          <button
                            onClick={() => {
                              setReviewModalApp(app);
                              setReviewComment('');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg transition"
                          >
                            Review
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Leave Balances Grid */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Leave Type</th>
                  <th className="px-4 py-3 font-semibold">Fiscal Year</th>
                  <th className="px-4 py-3 font-semibold">Entitlement</th>
                  <th className="px-4 py-3 font-semibold">Taken</th>
                  <th className="px-4 py-3 font-semibold">Pending</th>
                  <th className="px-4 py-3 font-semibold">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leaveBalances
                  .filter((b) => isAdmin || b.employeeId === currentUser.employeeId)
                  .map((b, idx) => {
                    const emp = employees.find((e) => e.id === b.employeeId);
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white">{emp?.fullName || b.employeeId}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">{b.employeeId}</span>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-200">{b.leaveTypeName}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">{b.fiscalYear}</td>
                        <td className="px-4 py-3 font-mono">{b.annualEntitlement} days</td>
                        <td className="px-4 py-3 font-mono text-rose-400">{b.taken} days</td>
                        <td className="px-4 py-3 font-mono text-amber-400">{b.pendingRequests} days</td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-sm">
                          {b.remainingBalance} days
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CalendarDays className="w-5 h-5 text-rose-400" />
                <span>Submit Leave Application</span>
              </h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="mt-4 p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 mt-4 text-xs">
              {isAdmin && (
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Applying on Behalf Of</label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    {employees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.fullName} ({e.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">Leave Category (Nepal Labour Act)</label>
                <select
                  value={selectedLeaveTypeId}
                  onChange={(e) => setSelectedLeaveTypeId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  {leaveTypes.map((lt) => (
                    <option key={lt.id} value={lt.id}>
                      {lt.name} (Quota: {lt.annualQuota} days)
                    </option>
                  ))}
                </select>
                {selectedLeaveType && (
                  <p className="text-[10px] text-slate-400 mt-1">{selectedLeaveType.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              {/* Working Days Auto-Calculation Summary Box */}
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Working Days (excluding Saturdays & Holidays):</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {calcResult.totalWorkingDays} Day(s)
                  </span>
                </div>
                {calcResult.weeklyHolidaysExcluded > 0 && (
                  <div className="text-[10px] text-slate-400">
                    * {calcResult.weeklyHolidaysExcluded} Saturday weekend(s) excluded from quota.
                  </div>
                )}
                {calcResult.publicHolidaysExcluded > 0 && (
                  <div className="text-[10px] text-slate-400">
                    * {calcResult.publicHolidaysExcluded} Nepal Public Holiday(s) excluded.
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-slate-700/60 pt-1.5 mt-1 text-[11px]">
                  <span className="text-slate-300">Remaining Balance in this category:</span>
                  <span className="text-emerald-400 font-semibold">{currentRemaining} days</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detail the reason and any urgent contacts..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 placeholder-slate-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-xl font-semibold shadow"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal for Managers & HR */}
      {reviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Review Leave Application</h3>
              <button onClick={() => setReviewModalApp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                <div className="font-semibold text-white">{reviewModalApp.employeeName}</div>
                <div className="text-slate-400 mt-1">
                  {reviewModalApp.leaveTypeName} • {reviewModalApp.workingDays} working days ({reviewModalApp.startDate} to {reviewModalApp.endDate})
                </div>
                <div className="text-slate-300 mt-2 italic bg-slate-800/60 p-2 rounded">
                  "{reviewModalApp.reason}"
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Approver Comments</label>
                <input
                  type="text"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="e.g. Approved. Ensure coverage."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const roleLevel = reviewModalApp.status === 'Pending Manager' ? 'manager' : 'hr';
                    onReviewLeave(reviewModalApp.id, 'Rejected', reviewComment || 'Rejected by approver', roleLevel);
                    setReviewModalApp(null);
                  }}
                  className="bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-700 px-4 py-2 rounded-xl font-medium transition"
                >
                  Reject Request
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const roleLevel = reviewModalApp.status === 'Pending Manager' ? 'manager' : 'hr';
                    onReviewLeave(reviewModalApp.id, 'Approved', reviewComment || 'Approved', roleLevel);
                    setReviewModalApp(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-semibold shadow transition"
                >
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
