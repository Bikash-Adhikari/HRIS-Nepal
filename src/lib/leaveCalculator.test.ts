import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWorkingLeaveDays, validateLeaveBalance } from './leaveCalculator';

test('calculateWorkingLeaveDays excludes Saturday (Nepal weekly holiday)', () => {
  // 2026-11-06 (Friday) to 2026-11-08 (Sunday)
  // Friday = Nov 6, Saturday = Nov 7, Sunday = Nov 8
  const result = calculateWorkingLeaveDays({
    startDate: '2026-11-06',
    endDate: '2026-11-08',
    weeklyHolidays: [6], // Saturday
    publicHolidays: [],
  });

  assert.equal(result.totalCalendarDays, 3);
  assert.equal(result.weeklyHolidaysExcluded, 1); // Saturday excluded
  assert.equal(result.totalWorkingDays, 2); // Friday + Sunday
});

test('calculateWorkingLeaveDays excludes public holidays', () => {
  // 2026-11-02 (Monday) to 2026-11-04 (Wednesday)
  // Let's declare Nov 3 as Public Holiday
  const result = calculateWorkingLeaveDays({
    startDate: '2026-11-02',
    endDate: '2026-11-04',
    weeklyHolidays: [6],
    publicHolidays: ['2026-11-03'],
  });

  assert.equal(result.totalCalendarDays, 3);
  assert.equal(result.publicHolidaysExcluded, 1);
  assert.equal(result.totalWorkingDays, 2);
});

test('calculateWorkingLeaveDays handles half-day leave', () => {
  const result = calculateWorkingLeaveDays({
    startDate: '2026-11-05',
    endDate: '2026-11-05',
    isHalfDay: true,
    weeklyHolidays: [6],
  });

  assert.equal(result.totalCalendarDays, 1);
  assert.equal(result.totalWorkingDays, 0.5);
});

test('validateLeaveBalance checks available vs pending and requested', () => {
  // Balance: 10, Pending: 3 -> Available: 7
  const valid = validateLeaveBalance(10, 3, 5);
  assert.equal(valid.canApply, true);

  const invalid = validateLeaveBalance(10, 3, 8);
  assert.equal(invalid.canApply, false);
});
