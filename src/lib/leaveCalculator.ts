/**
 * Leave Calculation Engine for Nepal Labor Act
 * Accurately determines working days, excludes Saturday weekends & public holidays,
 * handles half-day leaves and balance validation.
 */

export interface LeaveCalculationOptions {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isHalfDay?: boolean;
  halfDayPeriod?: 'first_half' | 'second_half';
  publicHolidays?: string[]; // Array of YYYY-MM-DD strings
  weeklyHolidays?: number[]; // default [6] for Saturday (Nepal standard weekend)
}

export interface LeaveDaysCalculationResult {
  totalCalendarDays: number;
  totalWorkingDays: number;
  weeklyHolidaysExcluded: number;
  publicHolidaysExcluded: number;
  datesIncluded: string[];
}

export function calculateWorkingLeaveDays(options: LeaveCalculationOptions): LeaveDaysCalculationResult {
  const {
    startDate,
    endDate,
    isHalfDay = false,
    publicHolidays = [],
    weeklyHolidays = [6], // 6 = Saturday (Nepal standard)
  } = options;

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    return {
      totalCalendarDays: 0,
      totalWorkingDays: 0,
      weeklyHolidaysExcluded: 0,
      publicHolidaysExcluded: 0,
      datesIncluded: [],
    };
  }

  // If half day and start == end
  if (isHalfDay && startDate === endDate) {
    const dayOfWeek = start.getDay();
    const isWeeklyHol = weeklyHolidays.includes(dayOfWeek);
    const isPublicHol = publicHolidays.includes(startDate);

    if (isWeeklyHol || isPublicHol) {
      return {
        totalCalendarDays: 1,
        totalWorkingDays: 0,
        weeklyHolidaysExcluded: isWeeklyHol ? 1 : 0,
        publicHolidaysExcluded: isPublicHol ? 1 : 0,
        datesIncluded: [],
      };
    }

    return {
      totalCalendarDays: 1,
      totalWorkingDays: 0.5,
      weeklyHolidaysExcluded: 0,
      publicHolidaysExcluded: 0,
      datesIncluded: [startDate],
    };
  }

  let totalCalendar = 0;
  let weeklyHolidaysCount = 0;
  let publicHolidaysCount = 0;
  const dates: string[] = [];

  const current = new Date(start);
  while (current <= end) {
    totalCalendar++;
    const dateStr = current.toISOString().split('T')[0];
    const dayOfWeek = current.getDay();

    if (weeklyHolidays.includes(dayOfWeek)) {
      weeklyHolidaysCount++;
    } else if (publicHolidays.includes(dateStr)) {
      publicHolidaysCount++;
    } else {
      dates.push(dateStr);
    }

    current.setDate(current.getDate() + 1);
  }

  const workingDays = isHalfDay && dates.length === 1 ? 0.5 : dates.length;

  return {
    totalCalendarDays: totalCalendar,
    totalWorkingDays: workingDays,
    weeklyHolidaysExcluded: weeklyHolidaysCount,
    publicHolidaysExcluded: publicHolidaysCount,
    datesIncluded: dates,
  };
}

export function validateLeaveBalance(
  currentBalance: number,
  pendingLeaveDays: number,
  requestedDays: number
): { canApply: boolean; availableBalance: number; message: string } {
  const availableBalance = currentBalance - pendingLeaveDays;
  if (requestedDays <= 0) {
    return { canApply: false, availableBalance, message: 'Requested leave days must be greater than zero.' };
  }
  if (requestedDays > availableBalance) {
    return {
      canApply: false,
      availableBalance,
      message: `Insufficient leave balance. Available: ${availableBalance} days (Total: ${currentBalance}, Pending: ${pendingLeaveDays}), Requested: ${requestedDays} days.`,
    };
  }
  return {
    canApply: true,
    availableBalance,
    message: `Leave application valid. Remaining balance after approval will be ${availableBalance - requestedDays} days.`,
  };
}
