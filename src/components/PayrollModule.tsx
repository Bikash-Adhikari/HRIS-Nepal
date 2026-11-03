import React, { useState } from 'react';
import {
  Banknote,
  Plus,
  Lock,
  Download,
  Eye,
  FileCheck2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  Shield,
  X,
} from 'lucide-react';
import { PayrollRun, PayrollDetail, Employee, UserSession } from '../types/hris';

interface PayrollModuleProps {
  payrollRuns: PayrollRun[];
  employees: Employee[];
  currentUser: UserSession;
  onProcessPayroll: (
    monthNepali: string,
    monthGregorian: string,
    fiscalYear: string,
    includeDashainBonus: boolean
  ) => void;
  onApproveAndLockPayroll: (runId: string) => void;
  onViewPayslip: (detail: PayrollDetail) => void;
  getPayrollDetails: (runId: string) => PayrollDetail[];
  isPayrollModalOpen: boolean;
  setIsPayrollModalOpen: (open: boolean) => void;
}

export const NEPALI_MONTHS = [
  'Baisakh (बैशाख)',
  'Jestha (जेठ)',
  'Ashadh (असार)',
  'Shrawan (साउन)',
  'Bhadra (भदौ)',
  'Ashwin (असोज)',
  'Kartik (कात्तिक)',
  'Mangsir (मंसिर)',
  'Poush (पुष)',
  'Magh (माघ)',
  'Falgun (फागुन)',
  'Chaitra (चैत)',
];

export const PayrollModule: React.FC<PayrollModuleProps> = ({
  payrollRuns,
  employees,
  currentUser,
  onProcessPayroll,
  onApproveAndLockPayroll,
  onViewPayslip,
  getPayrollDetails,
  isPayrollModalOpen,
  setIsPayrollModalOpen,
}) => {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    payrollRuns[0]?.id || null
  );

  // Wizard state
  const [wizardMonth, setWizardMonth] = useState('Ashwin (असोज)');
  const [wizardFiscalYear, setWizardFiscalYear] = useState('2081/82');
  const [includeDashain, setIncludeDashain] = useState(false);

  const selectedRun = payrollRuns.find((r) => r.id === selectedRunId) || payrollRuns[0];
  const selectedDetails = selectedRun ? getPayrollDetails(selectedRun.id) : [];

  const handleLaunchRun = (e: React.FormEvent) => {
    e.preventDefault();
    const gregorianEquiv = `${wizardMonth.split(' ')[0]} 2026`;
    onProcessPayroll(wizardMonth, gregorianEquiv, wizardFiscalYear, includeDashain);
    setIsPayrollModalOpen(false);
  };

  const handleExportBankCSV = (run: PayrollRun, details: PayrollDetail[]) => {
    // Generate standard Nepal Bank Electronic Fund Transfer (EFT) CSV
    const headers = [
      'Beneficiary Name',
      'Bank Name',
      'Bank Account Number',
      'Amount (NPR)',
      'PAN Number',
      'SSF Number',
      'Payment Reference',
      'Remarks',
    ];

    const rows = details.map((d) => [
      `"${d.employeeName}"`,
      `"${d.bankName}"`,
      `"${d.bankAccountNumber}"`,
      d.netPayableSalary,
      `"${d.panNumber}"`,
      `"${d.ssfNumber || ''}"`,
      `"SAL-${run.monthNepali.split(' ')[0]}-${d.employeeId}"`,
      `"Salary for ${run.monthNepali} ${run.fiscalYear}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HamroHR_Bank_Disbursement_${run.id}_${run.monthNepali.split(' ')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Nepal Payroll Processing Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full compliance with Nepal Income Tax Act 2058 progressive slabs, SSF 11%+20%, and bank disbursement files.
          </p>
        </div>

        <button
          onClick={() => setIsPayrollModalOpen(true)}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-950/40 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Execute Monthly Payroll Run</span>
        </button>
      </div>

      {/* Main Content Area */}
      {payrollRuns.length === 0 ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 text-center">
          <Banknote className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white">No Payroll Runs Executed Yet</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Click 'Execute Monthly Payroll Run' to calculate progressive taxes, SSF deductions, and loan installments for all active employees.
          </p>
          <button
            onClick={() => setIsPayrollModalOpen(true)}
            className="mt-4 inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow"
          >
            <span>Launch First Payroll</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Payroll Run Selector Bar */}
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <span className="text-xs text-slate-400 font-medium">Select Period:</span>
              <select
                value={selectedRun?.id || ''}
                onChange={(e) => setSelectedRunId(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              >
                {payrollRuns.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id}: {r.monthNepali} ({r.fiscalYear}) - {r.status}
                  </option>
                ))}
              </select>
            </div>

            {selectedRun && (
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleExportBankCSV(selectedRun, selectedDetails)}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                  title="Export electronic bank transfer CSV (Nabil, NIC Asia, Global IME, ConnectIPS)"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export Bank CSV</span>
                </button>

                {selectedRun.status !== 'Locked' ? (
                  <button
                    onClick={() => {
                      if (confirm(`Approve and lock payroll run ${selectedRun.id}? This will finalize salary disbursement and prevent accidental alterations.`)) {
                        onApproveAndLockPayroll(selectedRun.id);
                      }
                    }}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow transition"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Approve & Lock Payroll</span>
                  </button>
                ) : (
                  <span className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Period Locked & Approved by {selectedRun.approvedBy}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Selected Run Metrics Box */}
          {selectedRun && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs">
                <span className="text-slate-400 block">Total Gross Earnings:</span>
                <span className="text-lg font-bold text-white font-mono mt-1 block">
                  NPR {selectedRun.totalGrossPayable.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">{selectedRun.totalEmployees} employees</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs">
                <span className="text-slate-400 block">Employee SSF (11%):</span>
                <span className="text-lg font-bold text-amber-400 font-mono mt-1 block">
                  NPR {selectedRun.totalEmployeeSSF.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Statutory SSF deduction</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs">
                <span className="text-slate-400 block">Nepal Tax TDS:</span>
                <span className="text-lg font-bold text-rose-400 font-mono mt-1 block">
                  NPR {selectedRun.totalIncomeTaxTDS.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">IRD Progressive TDS</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs">
                <span className="text-slate-400 block">Total Net Take-Home:</span>
                <span className="text-lg font-black text-emerald-400 font-mono mt-1 block">
                  NPR {selectedRun.totalNetPayable.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Bank transfer ready</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-xs col-span-2 sm:col-span-1">
                <span className="text-slate-400 block">Employer SSF (20%):</span>
                <span className="text-lg font-bold text-indigo-400 font-mono mt-1 block">
                  NPR {selectedRun.totalEmployerSSF.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">Company statutory cost</span>
              </div>
            </div>
          )}

          {/* Granular Per-Employee Payroll Register Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Employee Salary & Statutory Breakdown
              </span>
              <span className="text-xs text-slate-400">
                Formula: Net Pay = Gross − (SSF 11% + Income Tax + Loan Deductions)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Employee</th>
                    <th className="px-4 py-3 font-semibold">Basic Salary</th>
                    <th className="px-4 py-3 font-semibold">Allowances & Bonus</th>
                    <th className="px-4 py-3 font-semibold">Gross Earnings</th>
                    <th className="px-4 py-3 font-semibold">SSF (11%)</th>
                    <th className="px-4 py-3 font-semibold">Income Tax (TDS)</th>
                    <th className="px-4 py-3 font-semibold">Loans</th>
                    <th className="px-4 py-3 font-semibold">Net Payable</th>
                    <th className="px-4 py-3 font-semibold">Employer SSF (20%)</th>
                    <th className="px-4 py-3 font-semibold text-right">Payslip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {selectedDetails.map((det) => (
                    <tr key={det.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{det.employeeName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {det.employeeId} • {det.departmentName}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono">NPR {det.basicSalary.toLocaleString()}</td>

                      <td className="px-4 py-3 font-mono text-slate-300">
                        NPR {(det.grossEarnings - det.basicSalary).toLocaleString()}
                        {det.festivalBonusAmount > 0 && (
                          <span className="text-rose-400 text-[10px] block">+Dashain Bonus</span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono font-semibold text-white">
                        NPR {det.grossEarnings.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono text-amber-300">
                        NPR {det.employeeSSF.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono text-rose-400">
                        NPR {det.incomeTaxTDS.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-400">
                        {det.loanDeduction > 0 ? `NPR ${det.loanDeduction.toLocaleString()}` : '-'}
                      </td>

                      <td className="px-4 py-3 font-mono font-black text-emerald-400 text-sm">
                        NPR {det.netPayableSalary.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono text-indigo-300">
                        NPR {det.employerSSF.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onViewPayslip(det)}
                          className="p-1.5 text-indigo-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="Generate Official Payslip"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Payroll Processing Wizard Modal */}
      {isPayrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-emerald-400" />
                <span>Run Monthly Nepal Payroll</span>
              </h3>
              <button onClick={() => setIsPayrollModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLaunchRun} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Fiscal Year</label>
                <select
                  value={wizardFiscalYear}
                  onChange={(e) => setWizardFiscalYear(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                >
                  <option value="2081/82">FY 2081/82 (Current)</option>
                  <option value="2080/81">FY 2080/81</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Payroll Month (Bikram Sambat)</label>
                <select
                  value={wizardMonth}
                  onChange={(e) => setWizardMonth(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-medium"
                >
                  {NEPALI_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Dashain Festival Bonus?</span>
                    <span className="text-[11px] text-slate-400">
                      Adds 1 month basic salary to eligible employees as per Nepal Labour Act Section 37.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeDashain}
                    onChange={(e) => setIncludeDashain(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-[11px] text-indigo-300 space-y-1">
                <div className="font-semibold text-white">Automatic Verifications:</div>
                <div>• Pulls active attendance records to compute paid days</div>
                <div>• Applies verified 2081/82 progressive IRD tax slabs</div>
                <div>• SSF contributors receive 0% Social Security Tax exemption</div>
                <div>• Applies active loan deduction installments</div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPayrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl font-semibold shadow"
                >
                  Calculate & Generate Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
