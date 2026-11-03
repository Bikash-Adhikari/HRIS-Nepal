import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNepalTax } from './nepalTaxEngine';

test('Single taxpayer with SSF enrollment is exempt from 1% SST on first 500k', () => {
  const result = calculateNepalTax({
    maritalStatus: 'single',
    monthlyGrossSalary: 40000,
    annualBasicSalary: 480000,
    isEnrolledInSSF: true,
    dashainBonusMonths: 0,
  });

  // Annual gross: 480,000.
  // SSF deduction (11% of 480k = 52,800).
  // Taxable income = 480,000 - 52,800 = 427,200.
  // Within first slab of 500,000.
  // Since enrolled in SSF, rate is 0%.
  assert.equal(result.slabs[0].rate, 0);
  assert.equal(result.grossTaxLiability, 0);
  assert.equal(result.netAnnualTaxLiability, 0);
  assert.equal(result.monthlyTDS, 0);
});

test('Single taxpayer WITHOUT SSF pays 1% SST on first slab', () => {
  const result = calculateNepalTax({
    maritalStatus: 'single',
    monthlyGrossSalary: 40000,
    annualBasicSalary: 480000,
    isEnrolledInSSF: false,
    dashainBonusMonths: 0,
  });

  // Annual gross: 480,000. Taxable: 480,000.
  // First slab up to 500k @ 1% SST
  assert.equal(result.slabs[0].rate, 0.01);
  assert.equal(result.grossTaxLiability, 4800);
  assert.equal(result.netAnnualTaxLiability, 4800);
  assert.equal(result.monthlyTDS, 400);
});

test('Couple taxpayer in 2nd slab (NPR 750,000) with SSF calculates progressive tax correctly', () => {
  const result = calculateNepalTax({
    maritalStatus: 'couple',
    monthlyGrossSalary: 75000,
    annualBasicSalary: 600000,
    isEnrolledInSSF: true,
    dashainBonusMonths: 1, // 50,000 bonus
  });

  // Gross = 75k * 12 + 50k = 950,000
  // SSF 11% of 600k = 66,000
  // Taxable = 950,000 - 66,000 = 884,000
  // Couple slabs:
  // 1st 600k @ 0% (SSF exempt) = 0
  // 2nd 200k (600k-800k) @ 10% = 20,000
  // 3rd 84k (800k-884k) @ 20% = 16,800
  // Total tax = 20,000 + 16,800 = 36,800
  assert.equal(result.grossTaxLiability, 36800);
  assert.equal(result.netAnnualTaxLiability, 36800);
});

test('Female resident sole employment gets 10% tax rebate', () => {
  const result = calculateNepalTax({
    maritalStatus: 'single',
    monthlyGrossSalary: 70000,
    annualBasicSalary: 600000,
    isEnrolledInSSF: true,
    dashainBonusMonths: 0,
    isFemaleResidentSoleEmployment: true,
  });

  // Gross = 840,000
  // SSF = 66,000 -> Taxable = 774,000
  // Single slabs:
  // 1st 500k @ 0% (SSF) = 0
  // 2nd 200k @ 10% = 20,000
  // 3rd 74k @ 20% = 14,800
  // Gross tax = 34,800
  // Female 10% rebate = 3,480
  // Net tax = 31,320
  assert.equal(result.grossTaxLiability, 34800);
  assert.equal(result.femaleRebateAmount, 3480);
  assert.equal(result.netAnnualTaxLiability, 31320);
});
