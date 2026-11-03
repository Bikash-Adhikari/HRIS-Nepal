import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateNepalSSF } from './nepalSSFEngine';

test('calculateNepalSSF computes 11% employee and 20% employer accurately', () => {
  const result = calculateNepalSSF({
    basicSalary: 30000,
    isEnrolled: true,
  });

  assert.equal(result.isEnrolled, true);
  assert.equal(result.employeeContribution, 3300); // 11% of 30,000
  assert.equal(result.employerContribution, 6000); // 20% of 30,000
  assert.equal(result.totalContribution, 9300);   // 31% of 30,000
  assert.equal(result.schemes.length, 4);
});

test('calculateNepalSSF returns zero contributions when unenrolled', () => {
  const result = calculateNepalSSF({
    basicSalary: 30000,
    isEnrolled: false,
  });

  assert.equal(result.isEnrolled, false);
  assert.equal(result.employeeContribution, 0);
  assert.equal(result.employerContribution, 0);
  assert.equal(result.totalContribution, 0);
});
