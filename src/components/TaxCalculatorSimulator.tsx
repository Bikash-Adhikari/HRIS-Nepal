import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  Percent,
  Check,
  Info,
  DollarSign,
  Building2,
  Sparkles,
} from 'lucide-react';
import { calculateNepalTax, TaxpayerInput } from '../lib/nepalTaxEngine';
import { calculateNepalSSF } from '../lib/nepalSSFEngine';

export const TaxCalculatorSimulator: React.FC = () => {
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'couple'>('single');
  const [monthlyGross, setMonthlyGross] = useState<number>(65000);
  const [basicSalary, setBasicSalary] = useState<number>(39000);
  const [isEnrolledInSSF, setIsEnrolledInSSF] = useState<boolean>(true);
  const [hasDashainBonus, setHasDashainBonus] = useState<boolean>(true);
  const [isFemaleSoleEmployment, setIsFemaleSoleEmployment] = useState<boolean>(false);
  const [lifeInsurance, setLifeInsurance] = useState<number>(25000);
  const [remoteArea, setRemoteArea] = useState<'None' | 'A' | 'B' | 'C' | 'D' | 'E'>('None');

  const taxInput: TaxpayerInput = {
    maritalStatus,
    monthlyGrossSalary: monthlyGross,
    annualBasicSalary: basicSalary * 12,
    isEnrolledInSSF,
    dashainBonusMonths: hasDashainBonus ? 1 : 0,
    isFemaleResidentSoleEmployment: isFemaleSoleEmployment,
    lifeInsurancePremiumAnnual: lifeInsurance,
    remoteAreaCategory: remoteArea,
  };

  const taxResult = calculateNepalTax(taxInput);
  const ssfResult = calculateNepalSSF({ basicSalary, isEnrolled: isEnrolledInSSF });

  const monthlyNetTakeHome = Math.round(
    monthlyGross - ssfResult.employeeContribution - taxResult.monthlyTDS
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Nepal Income Tax & SSF Sandbox</h1>
          <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
            FY 2081/82 Finance Act Slabs
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Interactive simulator to verify individual progressive tax liability, SSF 11%+20%, and statutory exemptions under Nepal Inland Revenue Department (IRD) rules.
        </p>
      </div>

      {/* Simulator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-rose-400" />
            <span>Taxpayer Parameters</span>
          </h2>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Assessment Category</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMaritalStatus('single')}
                className={`py-2 px-3 rounded-xl font-medium border text-center transition ${
                  maritalStatus === 'single'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                Single (Individual)
              </button>
              <button
                type="button"
                onClick={() => setMaritalStatus('couple')}
                className={`py-2 px-3 rounded-xl font-medium border text-center transition ${
                  maritalStatus === 'couple'
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                Couple (Married)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Monthly Gross (NPR)</label>
              <input
                type="number"
                step={1000}
                value={monthlyGross}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMonthlyGross(val);
                  setBasicSalary(Math.round(val * 0.6));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Monthly Basic (NPR)</label>
              <input
                type="number"
                step={1000}
                value={basicSalary}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm"
              />
              <span className="text-[10px] text-slate-500">Base for 11% SSF</span>
            </div>
          </div>

          {/* Statutory Toggles */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Enrolled in SSF?</span>
                <span className="text-[11px] text-slate-400">
                  Exempts employee from 1% SST on first slab!
                </span>
              </div>
              <input
                type="checkbox"
                checked={isEnrolledInSSF}
                onChange={(e) => setIsEnrolledInSSF(e.target.checked)}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-700/60 pt-2.5">
              <div>
                <span className="font-semibold text-white block">Include 1-Month Dashain Bonus?</span>
                <span className="text-[11px] text-slate-400">Festival bonus is taxable under IRD</span>
              </div>
              <input
                type="checkbox"
                checked={hasDashainBonus}
                onChange={(e) => setHasDashainBonus(e.target.checked)}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-700/60 pt-2.5">
              <div>
                <span className="font-semibold text-white block">Female Resident Sole Employment?</span>
                <span className="text-[11px] text-slate-400">10% tax rebate under Section 51</span>
              </div>
              <input
                type="checkbox"
                checked={isFemaleSoleEmployment}
                onChange={(e) => setIsFemaleSoleEmployment(e.target.checked)}
                className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Life Insurance (Annual NPR)
              </label>
              <input
                type="number"
                max={40000}
                value={lifeInsurance}
                onChange={(e) => setLifeInsurance(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
              <span className="text-[10px] text-slate-500">Max deductible: 40k</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Remote Area Rebate</label>
              <select
                value={remoteArea}
                onChange={(e) => setRemoteArea(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
              >
                <option value="None">None (Kathmandu)</option>
                <option value="A">Class A (NPR 50,000)</option>
                <option value="B">Class B (NPR 40,000)</option>
                <option value="C">Class C (NPR 30,000)</option>
                <option value="D">Class D (NPR 20,000)</option>
                <option value="E">Class E (NPR 10,000)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output: Calculations & Slab Breakdown (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs block">Monthly Tax (TDS)</span>
              <div className="text-2xl font-black text-rose-400 font-mono mt-1">
                NPR {taxResult.monthlyTDS.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">
                Annual: NPR {taxResult.netAnnualTaxLiability.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs block">Monthly SSF (11%)</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                NPR {ssfResult.employeeContribution.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500">
                Employer 20%: NPR {ssfResult.employerContribution.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-400 text-xs block">Net Monthly Take-Home</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                NPR {monthlyNetTakeHome.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">After SSF & TDS</span>
            </div>
          </div>

          {/* Income & Deductions Summary Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-semibold text-white">Total Annual Assessable Income:</span>
              <span className="font-mono text-white text-sm font-bold">
                NPR {taxResult.totalAssessableIncome.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 text-slate-300">
              <div>
                <span>• SSF Retirement Deduction:</span>
                <strong className="text-white ml-1 font-mono">
                  -NPR {taxResult.retirementContributionDeduction.toLocaleString()}
                </strong>
              </div>
              <div>
                <span>• Life Insurance Deduction:</span>
                <strong className="text-white ml-1 font-mono">
                  -NPR {taxResult.lifeInsuranceDeduction.toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
              <span className="font-semibold text-rose-300">Net Taxable Income:</span>
              <span className="font-mono text-rose-300 text-sm font-bold">
                NPR {taxResult.taxableIncome.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Slab Breakdown Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Progressive Slabs Breakdown ({taxInput.maritalStatus.toUpperCase()})
              </span>
              <span className="text-[11px] text-slate-400">{taxResult.sstExemptNote}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Income Slab</th>
                    <th className="px-4 py-2.5 font-semibold">Tax Rate</th>
                    <th className="px-4 py-2.5 font-semibold">Taxable Amount</th>
                    <th className="px-4 py-2.5 font-semibold text-right">Tax Payable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {taxResult.slabs.map((slab, idx) => (
                    <tr
                      key={idx}
                      className={slab.applicableAmount > 0 ? 'bg-slate-800/30' : 'opacity-40'}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-200">{slab.slabLabel}</td>
                      <td className="px-4 py-2.5 font-mono text-amber-300">{(slab.rate * 100).toFixed(0)}%</td>
                      <td className="px-4 py-2.5 font-mono">
                        NPR {slab.applicableAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 font-mono font-semibold text-right text-rose-400">
                        NPR {slab.taxAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {taxResult.femaleRebateAmount > 0 && (
              <div className="p-3 bg-purple-950/40 border-t border-purple-800/50 flex items-center justify-between text-xs text-purple-200">
                <span>Section 51 Female Resident Sole Employment Rebate (10%):</span>
                <span className="font-mono font-bold">-NPR {taxResult.femaleRebateAmount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
