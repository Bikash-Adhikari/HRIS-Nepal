/**
 * Nepal Social Security Fund (SSF) Calculation Engine
 * Compliant with Social Security Act 2074 (2017) and Operating Procedures.
 */

export interface SSFInput {
  basicSalary: number;
  isEnrolled: boolean;
  customEmployeeRate?: number; // Default: 0.11 (11%)
  customEmployerRate?: number; // Default: 0.20 (20%)
  applicableFloor?: number; // Minimum statutory wage in Nepal, default 17300
}

export interface SSFSchemeBreakdown {
  name: string;
  contributor: 'Employer' | 'Both';
  rate: number;
  amount: number;
}

export interface SSFCalculationResult {
  isEnrolled: boolean;
  contributionBase: number;
  employeeRate: number;
  employerRate: number;
  totalRate: number;
  
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  
  schemes: SSFSchemeBreakdown[];
  complianceNotes: string;
}

export const STATUTORY_MIN_WAGE_NEPAL = 17300; // As per Nepal Government Gazette (Shrawan 2080 onwards: Basic 10,820 + Allowance 6,480 = 17,300)

export function calculateNepalSSF(input: SSFInput): SSFCalculationResult {
  if (!input.isEnrolled) {
    return {
      isEnrolled: false,
      contributionBase: 0,
      employeeRate: 0,
      employerRate: 0,
      totalRate: 0,
      employeeContribution: 0,
      employerContribution: 0,
      totalContribution: 0,
      schemes: [],
      complianceNotes: 'Employee is not enrolled in SSF. 1% Social Security Tax (SST) applies on initial income tax slab.',
    };
  }

  const base = Math.max(0, input.basicSalary);
  const employeeRate = input.customEmployeeRate ?? 0.11;
  const employerRate = input.customEmployerRate ?? 0.20;
  const totalRate = employeeRate + employerRate;

  const employeeContribution = Math.round(base * employeeRate);
  const employerContribution = Math.round(base * employerRate);
  const totalContribution = employeeContribution + employerContribution;

  // Detailed scheme allocation under SSF rules (31% total)
  // 1. Medical, Health & Maternity Scheme: 1.00% (Employer)
  // 2. Accident & Disability Protection Scheme: 1.40% (Employer)
  // 3. Dependent Family Security Scheme: 0.27% (Employer)
  // 4. Old Age Protection (Pension + Gratuity + Retirement): 28.33% (Employee 11% + Employer 17.33%)
  const schemes: SSFSchemeBreakdown[] = [
    {
      name: 'Medical, Health & Maternity Protection',
      contributor: 'Employer',
      rate: 0.01,
      amount: Math.round(base * 0.01),
    },
    {
      name: 'Accident & Disability Protection',
      contributor: 'Employer',
      rate: 0.014,
      amount: Math.round(base * 0.014),
    },
    {
      name: 'Dependent Family Protection',
      contributor: 'Employer',
      rate: 0.0027,
      amount: Math.round(base * 0.0027),
    },
    {
      name: 'Old Age Security (Pension, Gratuity & Retirement Fund)',
      contributor: 'Both',
      rate: 0.2833,
      amount: Math.round(base * 0.2833),
    },
  ];

  return {
    isEnrolled: true,
    contributionBase: base,
    employeeRate,
    employerRate,
    totalRate,
    employeeContribution,
    employerContribution,
    totalContribution,
    schemes,
    complianceNotes:
      'Enrolled in SSF: 11% deducted from employee salary, 20% contributed by employer. Employee is exempt from 1% SST.',
  };
}
