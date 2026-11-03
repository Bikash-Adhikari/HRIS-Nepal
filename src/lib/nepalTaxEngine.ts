/**
 * Nepal Income Tax Calculation Engine
 * Compliant with Nepal Income Tax Act, 2058 and Finance Act 2080/81 & 2081/82.
 */

export interface TaxpayerInput {
  maritalStatus: 'single' | 'couple';
  monthlyGrossSalary: number; // Regular monthly salary + taxable allowances
  annualBasicSalary: number;
  monthsCount?: number; // default 12
  dashainBonusMonths?: number; // e.g. 1 month basic salary
  isEnrolledInSSF: boolean; // Crucial: SSF contributors are exempt from the 1% Social Security Tax
  isFemaleResidentSoleEmployment?: boolean; // 10% tax rebate
  employeeSSFAnnual?: number; // 11% of basic salary
  providentFundAnnual?: number;
  citAnnual?: number;
  lifeInsurancePremiumAnnual?: number; // max deductible NPR 40,000
  medicalInsuranceAnnual?: number; // max deductible NPR 20,000
  remoteAreaCategory?: 'None' | 'A' | 'B' | 'C' | 'D' | 'E'; // 50k, 40k, 30k, 20k, 10k
  approvedMedicalExpenseAnnual?: number; // max 15% credit up to NPR 750
  fiscalYear?: string;
}

export interface TaxSlabBreakdown {
  slabLabel: string;
  lowerLimit: number;
  upperLimit: number;
  applicableAmount: number;
  rate: number;
  taxAmount: number;
}

export interface TaxCalculationResult {
  grossAnnualIncome: number;
  festivalBonus: number;
  totalAssessableIncome: number;
  
  // Deductions from assessable income
  retirementContributionDeduction: number; // SSF + PF + CIT up to min(1/3, 500,000)
  lifeInsuranceDeduction: number; // up to 40,000
  medicalInsuranceDeduction: number; // up to 20,000
  remoteAreaDeduction: number;
  totalAllowableDeductions: number;
  
  taxableIncome: number;
  slabs: TaxSlabBreakdown[];
  grossTaxLiability: number;
  
  // Rebates and credits
  femaleRebateAmount: number; // 10% if eligible
  medicalTaxCreditAmount: number; // 15% of expenses, max 750
  netAnnualTaxLiability: number;
  monthlyTDS: number;
  
  effectiveTaxRate: number;
  sstExemptNote: string;
}

export const REMOTE_AREA_DEDUCTIONS: Record<string, number> = {
  None: 0,
  A: 50000,
  B: 40000,
  C: 30000,
  D: 20000,
  E: 10000,
};

export function calculateNepalTax(input: TaxpayerInput): TaxCalculationResult {
  const months = input.monthsCount ?? 12;
  const regularGrossAnnual = input.monthlyGrossSalary * months;
  const festivalBonus = (input.dashainBonusMonths ?? 1) * (input.annualBasicSalary / 12);
  const totalAssessableIncome = regularGrossAnnual + festivalBonus;

  // 1. Retirement Fund Deductions (SSF + PF + CIT)
  // Max allowable = 1/3 of total assessable income or NPR 500,000, whichever is less
  const annualSSF = input.employeeSSFAnnual ?? (input.isEnrolledInSSF ? (input.annualBasicSalary * 0.11) : 0);
  const totalRetirementContributions = annualSSF + (input.providentFundAnnual ?? 0) + (input.citAnnual ?? 0);
  const maxRetirementAllowance = Math.min(totalAssessableIncome / 3, 500000);
  const retirementContributionDeduction = Math.min(totalRetirementContributions, maxRetirementAllowance);

  // 2. Insurance Deductions
  const lifeInsuranceDeduction = Math.min(input.lifeInsurancePremiumAnnual ?? 0, 40000);
  const medicalInsuranceDeduction = Math.min(input.medicalInsuranceAnnual ?? 0, 20000);
  const remoteAreaDeduction = REMOTE_AREA_DEDUCTIONS[input.remoteAreaCategory ?? 'None'] ?? 0;

  const totalAllowableDeductions =
    retirementContributionDeduction +
    lifeInsuranceDeduction +
    medicalInsuranceDeduction +
    remoteAreaDeduction;

  const taxableIncome = Math.max(0, totalAssessableIncome - totalAllowableDeductions);

  // 3. Tax Slabs (Nepal FY 2080/81 & 2081/82)
  // Single: 500k @ 1% (or 0% if SSF), 200k @ 10%, 300k @ 20%, 1M @ 30%, 3M @ 36%, balance @ 39%
  // Couple: 600k @ 1% (or 0% if SSF), 200k @ 10%, 300k @ 20%, 900k @ 30%, 3M @ 36%, balance @ 39%
  const isSingle = input.maritalStatus === 'single';
  const firstSlabLimit = isSingle ? 500000 : 600000;
  const secondSlabLimit = 200000; // up to 700k (single) or 800k (couple)
  const thirdSlabLimit = 300000;  // up to 1M (single) or 1.1M (couple)
  const fourthSlabLimit = isSingle ? 1000000 : 900000; // up to 2M for both
  const fifthSlabLimit = 3000000; // up to 5M

  const slabDefinitions = [
    {
      label: `First Slab (Up to NPR ${firstSlabLimit.toLocaleString()})`,
      capacity: firstSlabLimit,
      rate: input.isEnrolledInSSF ? 0 : 0.01, // SSF participants pay 0% SST
      note: input.isEnrolledInSSF ? '0% (Exempt due to SSF enrollment)' : '1% Social Security Tax',
    },
    {
      label: `Next NPR ${secondSlabLimit.toLocaleString()} (10%)`,
      capacity: secondSlabLimit,
      rate: 0.10,
    },
    {
      label: `Next NPR ${thirdSlabLimit.toLocaleString()} (20%)`,
      capacity: thirdSlabLimit,
      rate: 0.20,
    },
    {
      label: `Next NPR ${fourthSlabLimit.toLocaleString()} (30%)`,
      capacity: fourthSlabLimit,
      rate: 0.30,
    },
    {
      label: `Next NPR ${fifthSlabLimit.toLocaleString()} (36%)`,
      capacity: fifthSlabLimit,
      rate: 0.36,
    },
    {
      label: `Above NPR 5,000,000 (39%)`,
      capacity: Infinity,
      rate: 0.39,
    },
  ];

  let remainingTaxable = taxableIncome;
  let lowerBound = 0;
  let grossTaxLiability = 0;
  const slabs: TaxSlabBreakdown[] = [];

  for (const def of slabDefinitions) {
    if (remainingTaxable <= 0) {
      slabs.push({
        slabLabel: def.label,
        lowerLimit: lowerBound,
        upperLimit: def.capacity === Infinity ? Infinity : lowerBound + def.capacity,
        applicableAmount: 0,
        rate: def.rate,
        taxAmount: 0,
      });
      if (def.capacity !== Infinity) lowerBound += def.capacity;
      continue;
    }

    const applicable = Math.min(remainingTaxable, def.capacity);
    const tax = applicable * def.rate;
    grossTaxLiability += tax;
    remainingTaxable -= applicable;

    slabs.push({
      slabLabel: def.label,
      lowerLimit: lowerBound,
      upperLimit: def.capacity === Infinity ? Infinity : lowerBound + def.capacity,
      applicableAmount: Math.round(applicable * 100) / 100,
      rate: def.rate,
      taxAmount: Math.round(tax * 100) / 100,
    });

    if (def.capacity !== Infinity) lowerBound += def.capacity;
  }

  // 4. Rebates & Tax Credits
  let femaleRebateAmount = 0;
  if (input.isFemaleResidentSoleEmployment && isSingle) {
    femaleRebateAmount = grossTaxLiability * 0.10; // 10% tax rebate under Section 51
  }

  // Medical tax credit: 15% of approved medical expenses, max NPR 750
  const medicalExpenses = input.approvedMedicalExpenseAnnual ?? 0;
  const medicalTaxCreditAmount = Math.min(medicalExpenses * 0.15, 750);

  const netAnnualTaxLiability = Math.max(0, Math.round(grossTaxLiability - femaleRebateAmount - medicalTaxCreditAmount));
  const monthlyTDS = Math.round((netAnnualTaxLiability / months) * 100) / 100;
  const effectiveTaxRate = taxableIncome > 0 ? (netAnnualTaxLiability / taxableIncome) * 100 : 0;

  return {
    grossAnnualIncome: regularGrossAnnual,
    festivalBonus,
    totalAssessableIncome,
    retirementContributionDeduction: Math.round(retirementContributionDeduction),
    lifeInsuranceDeduction,
    medicalInsuranceDeduction,
    remoteAreaDeduction,
    totalAllowableDeductions: Math.round(totalAllowableDeductions),
    taxableIncome: Math.round(taxableIncome),
    slabs,
    grossTaxLiability: Math.round(grossTaxLiability),
    femaleRebateAmount: Math.round(femaleRebateAmount),
    medicalTaxCreditAmount: Math.round(medicalTaxCreditAmount),
    netAnnualTaxLiability,
    monthlyTDS,
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    sstExemptNote: input.isEnrolledInSSF
      ? '1% SST is 0% (Section 1(1) proviso: Employees enrolled in SSF are exempt from 1% Social Security Tax)'
      : '1% SST applies to initial slab',
  };
}
