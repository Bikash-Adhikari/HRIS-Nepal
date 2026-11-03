import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  X,
  History,
} from 'lucide-react';
import { AdvanceAndLoan, Employee, UserSession } from '../types/hris';

interface LoansModuleProps {
  advancesAndLoans: AdvanceAndLoan[];
  employees: Employee[];
  currentUser: UserSession;
  onAddLoan: (loan: AdvanceAndLoan) => void;
}

export const LoansModule: React.FC<LoansModuleProps> = ({
  advancesAndLoans,
  employees,
  currentUser,
  onAddLoan,
}) => {
  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'finance_manager';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoanForHistory, setSelectedLoanForHistory] = useState<AdvanceAndLoan | null>(null);

  // Form State
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  const [loanType, setLoanType] = useState<'Staff Loan' | 'Salary Advance'>('Staff Loan');
  const [principalAmount, setPrincipalAmount] = useState<number>(30000);
  const [monthlyDeduction, setMonthlyDeduction] = useState<number>(5000);
  const [purpose, setPurpose] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      setValidationError('Please select an employee.');
      return;
    }
    if (principalAmount <= 0 || monthlyDeduction <= 0) {
      setValidationError('Amounts must be greater than zero.');
      return;
    }
    if (monthlyDeduction > principalAmount) {
      setValidationError('Monthly deduction cannot exceed loan principal.');
      return;
    }

    const emp = employees.find((e) => e.id === employeeId);
    const newLoan: AdvanceAndLoan = {
      id: '',
      employeeId,
      employeeName: emp?.fullName || 'Employee',
      type: loanType,
      principalAmount,
      approvedDate: new Date().toISOString().split('T')[0],
      monthlyDeductionAmount: monthlyDeduction,
      totalRepaid: 0,
      remainingBalance: principalAmount,
      status: 'Active',
      purpose: purpose || 'Approved staff financial aid',
      repaymentHistory: [],
    };

    onAddLoan(newLoan);
    setIsModalOpen(false);
    setPurpose('');
    setValidationError(null);
  };

  const visibleLoans = advancesAndLoans.filter((l) => {
    if (isAdmin) return true;
    return l.employeeId === currentUser.employeeId;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Salary Advances & Staff Loans</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage employee advance requests, automated payroll installment deductions, and repayment balance tracking.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setValidationError(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Grant Advance / Loan</span>
          </button>
        )}
      </div>

      {/* Loans Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
              <tr>
                <th className="px-4 py-3 font-semibold">Loan ID</th>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Principal (NPR)</th>
                <th className="px-4 py-3 font-semibold">Monthly Installment</th>
                <th className="px-4 py-3 font-semibold">Repaid / Balance</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Repayment History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {visibleLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-semibold text-rose-400">{loan.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{loan.employeeName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{loan.employeeId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-700">
                      {loan.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-white">
                    NPR {loan.principalAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-amber-300">
                    NPR {loan.monthlyDeductionAmount.toLocaleString()} / mo
                  </td>
                  <td className="px-4 py-3 font-mono">
                    <span className="text-emerald-400">NPR {loan.totalRepaid.toLocaleString()}</span>
                    <span className="text-slate-400 text-[10px] block">
                      Balance: NPR {loan.remainingBalance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        loan.status === 'Active'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedLoanForHistory(loan)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center space-x-1"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>{loan.repaymentHistory?.length || 0} Deductions</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Loan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-rose-400" />
                <span>Issue Advance or Loan</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="mt-4 p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Beneficiary Employee</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Advance Type</label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Staff Loan">Staff Loan (Multi-Month)</option>
                  <option value="Salary Advance">Salary Advance (Next Month)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Principal (NPR)</label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    required
                    value={principalAmount}
                    onChange={(e) => setPrincipalAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Monthly Deduction (NPR)</label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    required
                    value={monthlyDeduction}
                    onChange={(e) => setMonthlyDeduction(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Purpose / Justification</label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Relocation assistance or medical emergency"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-xl font-semibold shadow"
                >
                  Authorize & Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repayment History Modal */}
      {selectedLoanForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <History className="w-5 h-5 text-indigo-400" />
                <span>Repayment History ({selectedLoanForHistory.id})</span>
              </h3>
              <button onClick={() => setSelectedLoanForHistory(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex justify-between">
                <div>
                  <span className="text-slate-400 block">Total Principal:</span>
                  <span className="text-white font-mono font-semibold">
                    NPR {selectedLoanForHistory.principalAmount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Remaining:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    NPR {selectedLoanForHistory.remainingBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-300 block">Deductions Log:</span>
                {selectedLoanForHistory.repaymentHistory && selectedLoanForHistory.repaymentHistory.length > 0 ? (
                  selectedLoanForHistory.repaymentHistory.map((rep, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-slate-800/50 rounded-lg flex items-center justify-between font-mono"
                    >
                      <span className="text-slate-300">{rep.date} ({rep.payrollRunId})</span>
                      <span className="text-emerald-400 font-semibold">-NPR {rep.amount.toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-[11px] py-2">No payroll deductions recorded yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLoanForHistory(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
