import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Filter,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { Employee, AttendanceRecord, LeaveBalance, PayrollRun, PayrollDetail, UserSession } from '../types/hris';

interface ReportsModuleProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveBalances: LeaveBalance[];
  payrollRuns: PayrollRun[];
  getPayrollDetails: (runId: string) => PayrollDetail[];
  currentUser: UserSession;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  employees,
  attendance,
  leaveBalances,
  payrollRuns,
  getPayrollDetails,
  currentUser,
}) => {
  const [selectedReportType, setSelectedReportType] = useState<
    'payroll_register' | 'ssf_schedule' | 'ird_tax' | 'employee_directory' | 'leave_balances'
  >('payroll_register');

  const latestRun = payrollRuns[0];
  const payrollDetails = latestRun ? getPayrollDetails(latestRun.id) : [];

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `HamroHR_Report_${selectedReportType}.csv`;

    if (selectedReportType === 'payroll_register') {
      headers = [
        'Employee ID',
        'Full Name',
        'Department',
        'Basic Salary',
        'Allowances',
        'Gross Earnings',
        'Employee SSF (11%)',
        'Income Tax TDS',
        'Loan Deductions',
        'Net Payable Salary',
        'Employer SSF (20%)',
        'Total CTC',
      ];
      rows = payrollDetails.map((d) => [
        d.employeeId,
        `"${d.employeeName}"`,
        `"${d.departmentName}"`,
        d.basicSalary,
        d.grossEarnings - d.basicSalary,
        d.grossEarnings,
        d.employeeSSF,
        d.incomeTaxTDS,
        d.loanDeduction,
        d.netPayableSalary,
        d.employerSSF,
        d.totalCompanyCost,
      ]);
    } else if (selectedReportType === 'ssf_schedule') {
      headers = [
        'SSF Registration No',
        'Employee ID',
        'Employee Name',
        'Basic Salary (Contribution Base)',
        'Employee Contribution (11%)',
        'Employer Contribution (20%)',
        'Total SSF Remittance (31%)',
      ];
      rows = payrollDetails
        .filter((d) => d.isEnrolledInSSF)
        .map((d) => [
          `"${d.ssfNumber || ''}"`,
          d.employeeId,
          `"${d.employeeName}"`,
          d.basicSalary,
          d.employeeSSF,
          d.employerSSF,
          d.employeeSSF + d.employerSSF,
        ]);
    } else if (selectedReportType === 'employee_directory') {
      headers = [
        'Employee ID',
        'Full Name',
        'Official Email',
        'Mobile Phone',
        'Department',
        'Designation',
        'Employment Type',
        'PAN Number',
        'SSF Number',
        'Status',
      ];
      rows = employees.map((e) => [
        e.id,
        `"${e.fullName}"`,
        `"${e.officialEmail}"`,
        `"${e.phone}"`,
        e.departmentId,
        e.designationId,
        `"${e.employmentType}"`,
        `"${e.panNumber}"`,
        `"${e.ssfNumber || ''}"`,
        e.employmentStatus,
      ]);
    } else {
      headers = ['Employee ID', 'Leave Type', 'Fiscal Year', 'Entitlement', 'Taken', 'Pending', 'Remaining'];
      rows = leaveBalances.map((b) => [
        b.employeeId,
        `"${b.leaveTypeName}"`,
        b.fiscalYear,
        b.annualEntitlement,
        b.taken,
        b.pendingRequests,
        b.remainingBalance,
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Statutory Reports & Exports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Export verified Nepal compliance data for Inland Revenue Department (IRD) and Social Security Fund (SSF) portals.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Current Report to CSV</span>
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setSelectedReportType('payroll_register')}
          className={`px-3 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'payroll_register'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Monthly Payroll Register
        </button>
        <button
          onClick={() => setSelectedReportType('ssf_schedule')}
          className={`px-3 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'ssf_schedule'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          SSF 31% Remittance Schedule
        </button>
        <button
          onClick={() => setSelectedReportType('employee_directory')}
          className={`px-3 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'employee_directory'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Employee Master Directory
        </button>
        <button
          onClick={() => setSelectedReportType('leave_balances')}
          className={`px-3 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'leave_balances'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Leave Balance Summary
        </button>
      </div>

      {/* Report Table View */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="font-semibold text-white">
            {selectedReportType === 'payroll_register' && 'Monthly Payroll Register (Ashwin 2081)'}
            {selectedReportType === 'ssf_schedule' && 'Social Security Fund (SSF) Remittance Schedule'}
            {selectedReportType === 'employee_directory' && 'Organization Employee Master'}
            {selectedReportType === 'leave_balances' && 'Leave Entitlement & Utilization Log'}
          </span>
          <span className="text-slate-400 font-mono">Format: Excel-Compatible CSV / Printable</span>
        </div>

        <div className="overflow-x-auto">
          {selectedReportType === 'payroll_register' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Employee</th>
                  <th className="px-4 py-2.5 font-semibold">Basic</th>
                  <th className="px-4 py-2.5 font-semibold">Gross</th>
                  <th className="px-4 py-2.5 font-semibold">SSF (11%)</th>
                  <th className="px-4 py-2.5 font-semibold">TDS</th>
                  <th className="px-4 py-2.5 font-semibold">Net Salary</th>
                  <th className="px-4 py-2.5 font-semibold">Employer SSF (20%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payrollDetails.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-semibold text-white">{d.employeeName}</td>
                    <td className="px-4 py-2.5 font-mono">NPR {d.basicSalary.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono">NPR {d.grossEarnings.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-amber-300">NPR {d.employeeSSF.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-rose-400">NPR {d.incomeTaxTDS.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">
                      NPR {d.netPayableSalary.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-indigo-300">NPR {d.employerSSF.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReportType === 'ssf_schedule' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">SSF Reg. No.</th>
                  <th className="px-4 py-2.5 font-semibold">Employee</th>
                  <th className="px-4 py-2.5 font-semibold">Contribution Base (Basic)</th>
                  <th className="px-4 py-2.5 font-semibold">Employee (11%)</th>
                  <th className="px-4 py-2.5 font-semibold">Employer (20%)</th>
                  <th className="px-4 py-2.5 font-semibold">Total Remittance (31%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payrollDetails.filter((d) => d.isEnrolledInSSF).map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-mono text-slate-300">{d.ssfNumber || 'N/A'}</td>
                    <td className="px-4 py-2.5 font-semibold text-white">{d.employeeName}</td>
                    <td className="px-4 py-2.5 font-mono">NPR {d.basicSalary.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-amber-300">NPR {d.employeeSSF.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono text-indigo-300">NPR {d.employerSSF.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">
                      NPR {(d.employeeSSF + d.employerSSF).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReportType === 'employee_directory' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">ID</th>
                  <th className="px-4 py-2.5 font-semibold">Full Name</th>
                  <th className="px-4 py-2.5 font-semibold">Official Email</th>
                  <th className="px-4 py-2.5 font-semibold">Phone</th>
                  <th className="px-4 py-2.5 font-semibold">Nepal PAN</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-mono text-rose-400">{e.id}</td>
                    <td className="px-4 py-2.5 font-semibold text-white">{e.fullName}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">{e.officialEmail}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">{e.phone}</td>
                    <td className="px-4 py-2.5 font-mono text-slate-300">{e.panNumber || 'N/A'}</td>
                    <td className="px-4 py-2.5">
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {e.employmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReportType === 'leave_balances' && (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Employee ID</th>
                  <th className="px-4 py-2.5 font-semibold">Category</th>
                  <th className="px-4 py-2.5 font-semibold">Entitlement</th>
                  <th className="px-4 py-2.5 font-semibold">Taken</th>
                  <th className="px-4 py-2.5 font-semibold">Pending</th>
                  <th className="px-4 py-2.5 font-semibold">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {leaveBalances.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-mono text-slate-300">{b.employeeId}</td>
                    <td className="px-4 py-2.5 font-medium text-white">{b.leaveTypeName}</td>
                    <td className="px-4 py-2.5 font-mono">{b.annualEntitlement} days</td>
                    <td className="px-4 py-2.5 font-mono text-rose-400">{b.taken} days</td>
                    <td className="px-4 py-2.5 font-mono text-amber-400">{b.pendingRequests} days</td>
                    <td className="px-4 py-2.5 font-mono font-bold text-emerald-400">{b.remainingBalance} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
