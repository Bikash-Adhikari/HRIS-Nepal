import React, { useState } from 'react';
import {
  Printer,
  X,
  Building2,
  FileText,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Download,
  Shield,
} from 'lucide-react';
import { PayrollDetail, CompanySettings, Employee } from '../types/hris';
import { calculateNepalTax } from '../lib/nepalTaxEngine';

interface TaxSlipModalProps {
  detail: PayrollDetail;
  employee?: Employee;
  companySettings: CompanySettings;
  onClose: () => void;
  defaultMode?: 'monthly' | 'annual';
}

export const TaxSlipModal: React.FC<TaxSlipModalProps> = ({
  detail,
  employee,
  companySettings,
  onClose,
  defaultMode = 'monthly',
}) => {
  const [mode, setMode] = useState<'monthly' | 'annual'>(defaultMode);

  // Compute full annual tax statement
  const annualGross = (detail.grossEarnings * 12);
  const taxAnnualResult = calculateNepalTax({
    maritalStatus: detail.maritalStatus,
    monthlyGrossSalary: detail.grossEarnings,
    annualBasicSalary: detail.basicSalary * 12,
    isEnrolledInSSF: detail.isEnrolledInSSF,
    isFemaleResidentSoleEmployment: employee?.isFemaleSoleEmployment ?? false,
    dashainBonusMonths: 1,
    lifeInsurancePremiumAnnual: 25000,
    remoteAreaCategory: employee?.remoteAreaCategory ?? 'None',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-800/60 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300">Nepal IRD Tax Certificate</span>
            <div className="bg-slate-950 p-1 rounded-xl flex space-x-1 border border-slate-800 text-xs">
              <button
                onClick={() => setMode('monthly')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  mode === 'monthly' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly TDS Slip
              </button>
              <button
                onClick={() => setMode('annual')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  mode === 'annual' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Tax Clearance Slip
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Certificate Body */}
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
                Withholding Agent PAN: <strong>{companySettings.panNumber}</strong> | SSF Employer Code: <strong>{companySettings.ssfEmployerCode}</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 block">
                {mode === 'monthly'
                  ? 'Monthly Tax Deduction at Source (TDS) Certificate'
                  : 'Annual Income Tax Clearance Statement'}
              </span>
              <span className="text-sm font-extrabold text-slate-800 block mt-0.5">
                {mode === 'monthly' ? 'Ashwin 2081 BS' : `Fiscal Year ${companySettings.currentFiscalYear} BS`}
              </span>
              <span className="text-[10px] text-slate-500">
                Governed by Nepal Income Tax Act 2058 (Section 87 & Schedule 1)
              </span>
            </div>
          </div>

          {/* Taxpayer Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px]">
            <div>
              <span className="text-slate-500 block">Employee Name:</span>
              <strong className="text-slate-900">{detail.employeeName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Employee PAN:</span>
              <strong className="text-slate-900 font-mono text-xs">{detail.panNumber || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Tax Assessment Category:</span>
              <strong className="text-slate-900 capitalize">
                {detail.maritalStatus === 'single' ? 'Single (NPR 500k base)' : 'Couple (NPR 600k base)'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">SSF Registration:</span>
              <strong className="text-emerald-700 font-mono">
                {detail.isEnrolledInSSF ? `${detail.ssfNumber} (0% SST)` : 'Non-SSF Contributor'}
              </strong>
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
              <span className="text-slate-500 block">Bank Account:</span>
              <strong className="text-slate-900 font-mono">{detail.bankName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Certificate No:</span>
              <strong className="text-slate-900 font-mono">TDS-2081-{detail.employeeId}</strong>
            </div>
          </div>

          {/* Mode 1: Monthly TDS Certificate */}
          {mode === 'monthly' && (
            <div className="space-y-4">
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-300">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block mb-2">
                  Monthly Tax Withholding Details (Ashwin 2081)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Total Monthly Earnings:</span>
                    <strong className="text-slate-900 font-mono">NPR {detail.grossEarnings.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SSF Deduction (11%):</span>
                    <strong className="text-amber-700 font-mono">NPR {detail.employeeSSF.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Estimated Annualized Tax:</span>
                    <strong className="text-slate-900 font-mono">NPR {taxAnnualResult.netAnnualTaxLiability.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Monthly TDS Deducted:</span>
                    <strong className="text-rose-700 font-mono text-sm font-bold">NPR {detail.incomeTaxTDS.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-1">
                <div className="font-semibold text-slate-900">Statutory Compliance Note:</div>
                <div>• Tax has been calculated according to the Finance Act 2081/82 progressive individual tax slabs.</div>
                <div>• {taxAnnualResult.sstExemptNote}</div>
                <div>• Remitted electronically to Inland Revenue Office (IRO) revenue account under Head 11112 (Remuneration Tax).</div>
              </div>
            </div>
          )}

          {/* Mode 2: Annual Tax Statement (Nepal IRD Annex 10 format) */}
          {mode === 'annual' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border border-slate-300">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2">Income & Deductions Head</th>
                      <th className="p-2 text-right">Calculation Basis</th>
                      <th className="p-2 text-right">Amount (NPR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-medium">1. Gross Remuneration & Benefits (12 Months)</td>
                      <td className="p-2 text-right font-mono text-slate-500">{detail.grossEarnings.toLocaleString()} × 12</td>
                      <td className="p-2 text-right font-mono font-semibold">{taxAnnualResult.grossAnnualIncome.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-rose-700">2. Dashain Festival Allowance (Section 37)</td>
                      <td className="p-2 text-right font-mono text-slate-500">1 Month Basic</td>
                      <td className="p-2 text-right font-mono font-semibold">{taxAnnualResult.festivalBonus.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2">Total Assessable Remuneration Income</td>
                      <td className="p-2 text-right text-slate-500">-</td>
                      <td className="p-2 text-right font-mono">NPR {taxAnnualResult.totalAssessableIncome.toLocaleString()}</td>
                    </tr>

                    {/* Deductions */}
                    <tr>
                      <td className="p-2 pl-4 text-slate-700">Less: SSF / Retirement Contribution (11% + Exemption limit)</td>
                      <td className="p-2 text-right text-slate-500">Lesser of 1/3 or 500k</td>
                      <td className="p-2 text-right font-mono text-rose-700">-{taxAnnualResult.retirementContributionDeduction.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-4 text-slate-700">Less: Life Insurance Premium (Section 12)</td>
                      <td className="p-2 text-right text-slate-500">Max limit: 40,000</td>
                      <td className="p-2 text-right font-mono text-rose-700">-{taxAnnualResult.lifeInsuranceDeduction.toLocaleString()}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2">Net Taxable Employment Income</td>
                      <td className="p-2 text-right text-slate-500">-</td>
                      <td className="p-2 text-right font-mono text-emerald-800">NPR {taxAnnualResult.taxableIncome.toLocaleString()}</td>
                    </tr>

                    {/* Tax Liability */}
                    <tr>
                      <td className="p-2 font-medium">Gross Tax Liability on Slabs</td>
                      <td className="p-2 text-right text-slate-500">Progressive Schedule</td>
                      <td className="p-2 text-right font-mono font-semibold">{taxAnnualResult.grossTaxLiability.toLocaleString()}</td>
                    </tr>
                    {taxAnnualResult.femaleRebateAmount > 0 && (
                      <tr>
                        <td className="p-2 pl-4 text-purple-700">Less: Female Resident Sole Employment Rebate (10%)</td>
                        <td className="p-2 text-right text-slate-500">Section 51</td>
                        <td className="p-2 text-right font-mono text-purple-700">-{taxAnnualResult.femaleRebateAmount.toLocaleString()}</td>
                      </tr>
                    )}
                    <tr className="bg-slate-900 text-white font-bold text-xs">
                      <td className="p-2">Net Annual Tax Liability (Annual TDS)</td>
                      <td className="p-2 text-right text-slate-300">Effective Rate: {taxAnnualResult.effectiveTaxRate}%</td>
                      <td className="p-2 text-right font-mono">NPR {taxAnnualResult.netAnnualTaxLiability.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Slabs Detail Grid */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider block mb-1">
                  Tax Slabs Progression Applied ({detail.maritalStatus.toUpperCase()} CATEGORY)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                  {taxAnnualResult.slabs.map((s, idx) => (
                    <div key={idx} className="bg-white p-1.5 rounded border border-slate-200">
                      <span className="text-slate-500 block truncate">{s.slabLabel}</span>
                      <strong className="text-slate-900 font-mono">
                        {(s.rate * 100).toFixed(0)}% = NPR {s.taxAmount.toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certification & Signatures */}
          <div className="pt-6 border-t border-slate-300 text-[11px] text-slate-600 space-y-4">
            <p className="italic">
              "We hereby certify that the tax deduction stated above has been computed in accordance with the Nepal Income Tax Act 2058 and Finance Act rules, and the withheld amount has been deposited to the Government Treasury through IRD Portal / ConnectIPS."
            </p>

            <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="border-t border-slate-400 pt-1.5">
                <span className="font-bold text-slate-900 block">Withholding Officer</span>
                <span className="text-[10px] text-slate-500">Accounts & Tax Compliance Dept.</span>
              </div>
              <div className="border-t border-slate-400 pt-1.5">
                <span className="font-bold text-slate-900 block">Authorized Signatory & Seal</span>
                <span className="text-[10px] text-slate-500">{companySettings.companyName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
