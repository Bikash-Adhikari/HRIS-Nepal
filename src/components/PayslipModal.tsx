import React from 'react';
import {
  Printer,
  X,
  Building2,
  CheckCircle2,
  Download,
  Shield,
  FileCheck2,
} from 'lucide-react';
import { PayrollDetail, CompanySettings } from '../types/hris';

interface PayslipModalProps {
  detail: PayrollDetail | null;
  companySettings: CompanySettings;
  onClose: () => void;
}

function numberToWordsNPR(rawNum: number): string {
  let num = Math.round(rawNum);
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero Rupees Only';

  function convertGroup(n: number): string {
    n = Math.floor(n);
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) {
      const tens = b[Math.floor(n / 10)];
      const ones = a[n % 10];
      return (tens + (ones ? ' ' + ones : '')).trim() + ' ';
    }
    const hundreds = a[Math.floor(n / 100)] + ' Hundred ';
    const rem = n % 100;
    if (rem === 0) return hundreds;
    if (rem < 20) return hundreds + a[rem] + ' ';
    const tens = b[Math.floor(rem / 10)];
    const ones = a[rem % 10];
    return hundreds + (tens + (ones ? ' ' + ones : '')).trim() + ' ';
  }

  let words = '';
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;

  if (crore > 0) words += convertGroup(crore) + 'Crore ';
  if (lakh > 0) words += convertGroup(lakh) + 'Lakh ';
  if (thousand > 0) words += convertGroup(thousand) + 'Thousand ';
  if (num > 0) words += convertGroup(num);

  return words.trim() + ' Rupees Only';
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  detail,
  companySettings,
  onClose,
}) => {
  if (!detail) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-800/60 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300">Official Payslip Preview</span>
            <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-800">
              Verified & Locked
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-8 bg-white text-slate-900 text-xs font-sans space-y-6">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-rose-700" />
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  {companySettings.companyName}
                </h1>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">{companySettings.address}, {companySettings.city}, Nepal</p>
              <p className="text-[11px] text-slate-600">
                PAN: <strong>{companySettings.panNumber}</strong> | SSF Employer Code: <strong>{companySettings.ssfEmployerCode}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                Salary Payslip
              </span>
              <span className="text-sm font-extrabold text-slate-800 block mt-0.5">
                Ashwin 2081 (FY {companySettings.currentFiscalYear})
              </span>
              <span className="text-[10px] text-slate-500">Ref: {detail.id}</span>
            </div>
          </div>

          {/* Employee Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-500 block">Employee ID:</span>
              <strong className="text-slate-900 font-mono">{detail.employeeId}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Full Name:</span>
              <strong className="text-slate-900">{detail.employeeName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Department:</span>
              <strong className="text-slate-900">{detail.departmentName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Designation:</span>
              <strong className="text-slate-900">{detail.designationTitle}</strong>
            </div>

            <div>
              <span className="text-slate-500 block">Nepal PAN:</span>
              <strong className="text-slate-900 font-mono">{detail.panNumber || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">SSF Number:</span>
              <strong className="text-slate-900 font-mono">{detail.ssfNumber || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Bank & Account:</span>
              <strong className="text-slate-900 font-mono truncate block">
                {detail.bankName} ({detail.bankAccountNumber})
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Days Paid:</span>
              <strong className="text-slate-900 font-mono">{detail.payableDays} / {detail.totalMonthDays} Days</strong>
            </div>
          </div>

          {/* Earnings vs Deductions Table */}
          <div className="grid grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div>
              <div className="bg-slate-100 px-3 py-1.5 font-bold uppercase text-[10px] tracking-wider text-slate-700 border-b border-slate-300 flex justify-between">
                <span>Earnings Description</span>
                <span>Amount (NPR)</span>
              </div>
              <div className="divide-y divide-slate-100 text-[11px]">
                <div className="py-1.5 flex justify-between">
                  <span>Basic Salary</span>
                  <span className="font-mono">{detail.basicSalary.toLocaleString()}</span>
                </div>
                {detail.dearnessAllowance > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span>Dearness Allowance</span>
                    <span className="font-mono">{detail.dearnessAllowance.toLocaleString()}</span>
                  </div>
                )}
                {detail.houseRentAllowance > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-mono">{detail.houseRentAllowance.toLocaleString()}</span>
                  </div>
                )}
                {detail.transportAllowance > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span>Transport Allowance</span>
                    <span className="font-mono">{detail.transportAllowance.toLocaleString()}</span>
                  </div>
                )}
                {detail.communicationAllowance > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span>Communication Allowance</span>
                    <span className="font-mono">{detail.communicationAllowance.toLocaleString()}</span>
                  </div>
                )}
                {detail.mealAllowance > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span>Meal Allowance</span>
                    <span className="font-mono">{detail.mealAllowance.toLocaleString()}</span>
                  </div>
                )}
                {detail.festivalBonusAmount > 0 && (
                  <div className="py-1.5 flex justify-between font-semibold text-rose-700">
                    <span>Dashain Festival Bonus</span>
                    <span className="font-mono">{detail.festivalBonusAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 pt-2 border-t-2 border-slate-300 flex justify-between font-bold text-xs">
                <span>Total Gross Earnings:</span>
                <span className="font-mono">NPR {detail.grossEarnings.toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div>
              <div className="bg-slate-100 px-3 py-1.5 font-bold uppercase text-[10px] tracking-wider text-slate-700 border-b border-slate-300 flex justify-between">
                <span>Deductions Description</span>
                <span>Amount (NPR)</span>
              </div>
              <div className="divide-y divide-slate-100 text-[11px]">
                <div className="py-1.5 flex justify-between">
                  <div>
                    <span>Employee SSF (11%)</span>
                    <span className="text-[10px] text-slate-400 block">Social Security Act 2074</span>
                  </div>
                  <span className="font-mono">{detail.employeeSSF.toLocaleString()}</span>
                </div>
                <div className="py-1.5 flex justify-between">
                  <div>
                    <span>Income Tax (Progressive TDS)</span>
                    <span className="text-[10px] text-slate-400 block">Nepal IRD Finance Act</span>
                  </div>
                  <span className="font-mono">{detail.incomeTaxTDS.toLocaleString()}</span>
                </div>
                {detail.loanDeduction > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span>Staff Loan Installment</span>
                    <span className="font-mono">{detail.loanDeduction.toLocaleString()}</span>
                  </div>
                )}
                {detail.unpaidLeaveDeduction > 0 && (
                  <div className="py-1.5 flex justify-between">
                    <span>Unpaid Leave Deduction</span>
                    <span className="font-mono">{detail.unpaidLeaveDeduction.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 pt-2 border-t-2 border-slate-300 flex justify-between font-bold text-xs text-rose-700">
                <span>Total Deductions:</span>
                <span className="font-mono">NPR {detail.totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Take Home Highlight Box */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-slate-300 uppercase tracking-wider block">
                Net Disbursed Salary:
              </span>
              <div className="text-2xl font-black font-mono mt-0.5">
                NPR {detail.netPayableSalary.toLocaleString()}
              </div>
            </div>
            <div className="text-right text-xs text-slate-300 sm:max-w-xs">
              <span className="text-[10px] text-slate-400 block uppercase">In Words:</span>
              <span className="font-semibold italic">{numberToWordsNPR(detail.netPayableSalary)}</span>
            </div>
          </div>

          {/* Employer Statutory Cost Note (Shown separately by Nepal Law) */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-600 flex justify-between items-center">
            <div>
              <strong>Employer SSF Contribution (20% paid by company):</strong> NPR {detail.employerSSF.toLocaleString()}
              <span className="block text-slate-500">
                (Old Age Protection, Accident & Healthcare Schemes. Not deducted from employee pay.)
              </span>
            </div>
            <span className="font-mono text-slate-800 font-bold">
              Total Company CTC: NPR {detail.totalCompanyCost.toLocaleString()}
            </span>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-1.5">
              <span className="font-semibold text-slate-800 block">Prepared By: Finance Officer</span>
              <span className="text-[10px] text-slate-500">Himalayan Cloud Solutions Pvt. Ltd.</span>
            </div>
            <div className="border-t border-slate-400 pt-1.5">
              <span className="font-semibold text-slate-800 block">Authorized Signature & Stamp</span>
              <span className="text-[10px] text-slate-500">Human Resources Department</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
