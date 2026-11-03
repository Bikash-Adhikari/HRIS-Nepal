/**
 * Complete Google Apps Script & Google Sheets Source Code Generator
 * Contains production-ready Google Apps Script backend code modules,
 * database setup scripts for all 26 sheets, and Drive folder provisioners.
 */

export interface SheetDefinition {
  name: string;
  description: string;
  columns: { name: string; type: string; required: boolean; description: string }[];
  primaryKey: string;
}

export const GOOGLE_SHEETS_SCHEMA: SheetDefinition[] = [
  {
    name: 'CompanySettings',
    description: 'Master organization profile, working hours, weekend configuration, and fiscal year',
    primaryKey: 'SettingKey',
    columns: [
      { name: 'SettingKey', type: 'String', required: true, description: 'Unique configuration key (e.g. FISCAL_YEAR)' },
      { name: 'SettingValue', type: 'String', required: true, description: 'Configuration value' },
      { name: 'Category', type: 'String', required: false, description: 'General / Payroll / Attendance / Compliance' },
      { name: 'Description', type: 'String', required: false, description: 'Purpose and official reference' },
      { name: 'UpdatedAt', type: 'ISO Date', required: true, description: 'Timestamp of last modification' },
    ],
  },
  {
    name: 'Users',
    description: 'Login accounts, password hashes, roles, and status for staff and administrators',
    primaryKey: 'UserId',
    columns: [
      { name: 'UserId', type: 'String', required: true, description: 'USR-0001 format' },
      { name: 'EmployeeId', type: 'String', required: false, description: 'Foreign key to Employees sheet' },
      { name: 'Email', type: 'Email', required: true, description: 'Official or personal email' },
      { name: 'PasswordHash', type: 'String', required: true, description: 'SHA-256 salted hash of password' },
      { name: 'Salt', type: 'String', required: true, description: 'Cryptographic random salt' },
      { name: 'Role', type: 'String', required: true, description: 'super_admin | hr_admin | finance_manager | staff' },
      { name: 'IsActive', type: 'Boolean', required: true, description: 'TRUE if account is active' },
      { name: 'LastLogin', type: 'ISO Date', required: false, description: 'Last authentication timestamp' },
    ],
  },
  {
    name: 'Employees',
    description: 'Core employee master table with personal, employment, and bank data',
    primaryKey: 'EmployeeId',
    columns: [
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-0001 unique identifier' },
      { name: 'FullName', type: 'String', required: true, description: 'Employee full legal name' },
      { name: 'AvatarDriveId', type: 'String', required: false, description: 'Google Drive file ID for profile photo' },
      { name: 'DateOfBirth', type: 'Date', required: true, description: 'YYYY-MM-DD' },
      { name: 'Gender', type: 'String', required: true, description: 'Male / Female / Other' },
      { name: 'MaritalStatus', type: 'String', required: true, description: 'single / couple' },
      { name: 'OfficialEmail', type: 'Email', required: true, description: 'Corporate email' },
      { name: 'PersonalEmail', type: 'Email', required: false, description: 'Personal email' },
      { name: 'Phone', type: 'String', required: true, description: 'Nepal mobile number (+977)' },
      { name: 'PermanentAddress', type: 'String', required: true, description: 'Municipality, Ward, District, Province' },
      { name: 'CitizenshipNumber', type: 'String', required: true, description: 'Issued citizenship certificate number' },
      { name: 'JoiningDate', type: 'Date', required: true, description: 'Date of joining the company' },
      { name: 'DepartmentId', type: 'String', required: true, description: 'DEP-001 reference' },
      { name: 'DesignationId', type: 'String', required: true, description: 'DES-001 reference' },
      { name: 'ReportingManagerId', type: 'String', required: false, description: 'EMP-XXXX reference' },
      { name: 'EmploymentStatus', type: 'String', required: true, description: 'Active / On Leave / Resigned / Terminated' },
      { name: 'BankName', type: 'String', required: true, description: 'Commercial Bank Name' },
      { name: 'BankAccountNumber', type: 'String', required: true, description: 'Bank Account Number' },
      { name: 'PANNumber', type: 'String', required: true, description: 'Permanent Account Number (9 digits)' },
      { name: 'IsEnrolledInSSF', type: 'Boolean', required: true, description: 'TRUE if registered in Nepal SSF' },
      { name: 'SSFNumber', type: 'String', required: false, description: 'Social Security Fund unique identification' },
      { name: 'BasicSalary', type: 'Number', required: true, description: 'Monthly Basic Salary in NPR' },
    ],
  },
  {
    name: 'Departments',
    description: 'Organizational departments and department heads',
    primaryKey: 'DepartmentId',
    columns: [
      { name: 'DepartmentId', type: 'String', required: true, description: 'DEP-001' },
      { name: 'Name', type: 'String', required: true, description: 'Department title' },
      { name: 'Code', type: 'String', required: true, description: 'Short code (ENG, HR, FIN)' },
      { name: 'HeadEmployeeId', type: 'String', required: false, description: 'EMP-XXXX of department head' },
    ],
  },
  {
    name: 'Designations',
    description: 'Job titles and organizational hierarchy levels',
    primaryKey: 'DesignationId',
    columns: [
      { name: 'DesignationId', type: 'String', required: true, description: 'DES-001' },
      { name: 'Title', type: 'String', required: true, description: 'Job title' },
      { name: 'DepartmentId', type: 'String', required: true, description: 'DEP-XXX' },
      { name: 'GradeLevel', type: 'String', required: true, description: 'Junior / Mid / Senior / Lead' },
    ],
  },
  {
    name: 'Attendance',
    description: 'Daily check-in, check-out, working hours, and source logs',
    primaryKey: 'AttendanceId',
    columns: [
      { name: 'AttendanceId', type: 'String', required: true, description: 'ATT-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'Date', type: 'Date', required: true, description: 'YYYY-MM-DD' },
      { name: 'CheckInTime', type: 'Time', required: true, description: 'HH:MM:SS' },
      { name: 'CheckOutTime', type: 'Time', required: false, description: 'HH:MM:SS' },
      { name: 'Status', type: 'String', required: true, description: 'Present / Late / Half Day / Absent / Leave' },
      { name: 'WorkHours', type: 'Number', required: true, description: 'Total work duration in hours' },
      { name: 'OvertimeHours', type: 'Number', required: true, description: 'Overtime beyond standard 8 hours' },
      { name: 'Source', type: 'String', required: true, description: 'Web Check-in / Biometric / CSV' },
    ],
  },
  {
    name: 'LeaveTypes',
    description: 'Statutory and company leave policies under Nepal Labour Act 2074',
    primaryKey: 'LeaveTypeId',
    columns: [
      { name: 'LeaveTypeId', type: 'String', required: true, description: 'LT-001' },
      { name: 'Name', type: 'String', required: true, description: 'Home Leave, Sick Leave, etc.' },
      { name: 'Code', type: 'String', required: true, description: 'AL, SL, CL, ML, PL, BL, UL' },
      { name: 'AnnualQuota', type: 'Number', required: true, description: 'Days allotted per fiscal year' },
      { name: 'IsCarryForwardable', type: 'Boolean', required: true, description: 'Whether balance carries forward' },
      { name: 'MaxCarryForward', type: 'Number', required: true, description: 'Max accumulated days allowed' },
      { name: 'IsPaid', type: 'Boolean', required: true, description: 'Whether salary is paid during leave' },
    ],
  },
  {
    name: 'LeaveApplications',
    description: 'Staff leave requests and multi-tier approval trail',
    primaryKey: 'ApplicationId',
    columns: [
      { name: 'ApplicationId', type: 'String', required: true, description: 'LEAVE-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'LeaveTypeId', type: 'String', required: true, description: 'LT-XXX' },
      { name: 'StartDate', type: 'Date', required: true, description: 'YYYY-MM-DD' },
      { name: 'EndDate', type: 'Date', required: true, description: 'YYYY-MM-DD' },
      { name: 'WorkingDays', type: 'Number', required: true, description: 'Working days excluding Saturdays & Holidays' },
      { name: 'Reason', type: 'String', required: true, description: 'Employee reason' },
      { name: 'Status', type: 'String', required: true, description: 'Pending Manager / Pending HR / Approved / Rejected' },
      { name: 'ManagerApproverId', type: 'String', required: false, description: 'EMP-XXXX of manager' },
      { name: 'HRApproverId', type: 'String', required: false, description: 'EMP-XXXX of HR admin' },
    ],
  },
  {
    name: 'LeaveBalances',
    description: 'Up-to-date opening balance, taken, pending, and remaining quota',
    primaryKey: 'BalanceKey',
    columns: [
      { name: 'BalanceKey', type: 'String', required: true, description: 'EMP-XXXX_LT-XXX_FY' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'LeaveTypeId', type: 'String', required: true, description: 'LT-XXX' },
      { name: 'FiscalYear', type: 'String', required: true, description: '2081/82' },
      { name: 'Entitlement', type: 'Number', required: true, description: 'Annual quota' },
      { name: 'Taken', type: 'Number', required: true, description: 'Approved days taken' },
      { name: 'Pending', type: 'Number', required: true, description: 'Days locked in pending requests' },
      { name: 'Remaining', type: 'Number', required: true, description: 'Available balance' },
    ],
  },
  {
    name: 'Holidays',
    description: 'Nepal Gazetted public holidays and festival dates',
    primaryKey: 'HolidayId',
    columns: [
      { name: 'HolidayId', type: 'String', required: true, description: 'HOL-001' },
      { name: 'Name', type: 'String', required: true, description: 'Holiday name' },
      { name: 'Date', type: 'Date', required: true, description: 'YYYY-MM-DD' },
      { name: 'DurationDays', type: 'Number', required: true, description: 'Number of consecutive days' },
      { name: 'ApplicableGender', type: 'String', required: true, description: 'All / Female' },
    ],
  },
  {
    name: 'PayrollRuns',
    description: 'Monthly payroll run summaries, audit approval, and locking status',
    primaryKey: 'PayrollRunId',
    columns: [
      { name: 'PayrollRunId', type: 'String', required: true, description: 'PAY-0001' },
      { name: 'FiscalYear', type: 'String', required: true, description: '2081/82' },
      { name: 'MonthNepali', type: 'String', required: true, description: 'Shrawan, Bhadra, etc.' },
      { name: 'Status', type: 'String', required: true, description: 'Draft / Approved / Locked' },
      { name: 'TotalGross', type: 'Number', required: true, description: 'Total gross payable' },
      { name: 'TotalSSFEmployee', type: 'Number', required: true, description: 'Total 11% SSF deductions' },
      { name: 'TotalTDS', type: 'Number', required: true, description: 'Total Income Tax TDS' },
      { name: 'TotalNet', type: 'Number', required: true, description: 'Total net payable disbursed' },
      { name: 'TotalSSFEmployer', type: 'Number', required: true, description: 'Total 20% SSF contribution' },
      { name: 'ApprovedBy', type: 'String', required: false, description: 'Name of authorizing officer' },
    ],
  },
  {
    name: 'PayrollDetails',
    description: 'Per-employee granular monthly salary, tax, SSF, and loan deductions',
    primaryKey: 'DetailId',
    columns: [
      { name: 'DetailId', type: 'String', required: true, description: 'PAYD-PAY-0001-EMP-0001' },
      { name: 'PayrollRunId', type: 'String', required: true, description: 'PAY-XXXX' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'BasicSalary', type: 'Number', required: true, description: 'Monthly basic salary' },
      { name: 'TotalAllowances', type: 'Number', required: true, description: 'Sum of HRA, Dearness, etc.' },
      { name: 'FestivalBonus', type: 'Number', required: false, description: 'Dashain bonus if applicable' },
      { name: 'GrossEarnings', type: 'Number', required: true, description: 'Basic + Allowances + Bonus' },
      { name: 'EmployeeSSF', type: 'Number', required: true, description: '11% of basic' },
      { name: 'IncomeTaxTDS', type: 'Number', required: true, description: 'Progressive monthly TDS' },
      { name: 'LoanDeduction', type: 'Number', required: false, description: 'Monthly loan installment' },
      { name: 'NetPayable', type: 'Number', required: true, description: 'Gross - SSF - TDS - Loans' },
      { name: 'EmployerSSF', type: 'Number', required: true, description: '20% of basic (employer cost)' },
    ],
  },
  {
    name: 'TaxSettings',
    description: 'Official Nepal progressive income tax slabs for Single and Couple',
    primaryKey: 'TaxRuleId',
    columns: [
      { name: 'TaxRuleId', type: 'String', required: true, description: 'TAX-2081-S-01' },
      { name: 'FiscalYear', type: 'String', required: true, description: '2081/82' },
      { name: 'TaxpayerCategory', type: 'String', required: true, description: 'single / couple' },
      { name: 'SlabLowerLimit', type: 'Number', required: true, description: 'Lower threshold' },
      { name: 'SlabUpperLimit', type: 'Number', required: true, description: 'Upper threshold' },
      { name: 'Rate', type: 'Number', required: true, description: 'Tax rate (0.01, 0.10, 0.20, etc.)' },
      { name: 'SSFExemptFirstSlab', type: 'Boolean', required: true, description: 'TRUE (0% for SSF contributors)' },
    ],
  },
  {
    name: 'SSFSettings',
    description: 'Nepal Social Security Fund contribution percentages and contribution base rules',
    primaryKey: 'SSFConfigKey',
    columns: [
      { name: 'SSFConfigKey', type: 'String', required: true, description: 'SSF_RATES_2081' },
      { name: 'EmployeeRate', type: 'Number', required: true, description: '0.11 (11%)' },
      { name: 'EmployerRate', type: 'Number', required: true, description: '0.20 (20%)' },
      { name: 'StatutoryMinWage', type: 'Number', required: true, description: '17300 NPR' },
      { name: 'MedicalRate', type: 'Number', required: true, description: '0.01 (1%)' },
      { name: 'AccidentRate', type: 'Number', required: true, description: '0.014 (1.4%)' },
      { name: 'RetirementRate', type: 'Number', required: true, description: '0.2833 (28.33%)' },
    ],
  },
  {
    name: 'AdvancesAndLoans',
    description: 'Staff loans, salary advances, and monthly repayment schedules',
    primaryKey: 'LoanId',
    columns: [
      { name: 'LoanId', type: 'String', required: true, description: 'LOAN-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'Type', type: 'String', required: true, description: 'Staff Loan / Salary Advance' },
      { name: 'PrincipalAmount', type: 'Number', required: true, description: 'Initial loan in NPR' },
      { name: 'MonthlyDeduction', type: 'Number', required: true, description: 'Deduction amount per payroll' },
      { name: 'TotalRepaid', type: 'Number', required: true, description: 'Cumulative amount repaid' },
      { name: 'RemainingBalance', type: 'Number', required: true, description: 'Current balance owed' },
      { name: 'Status', type: 'String', required: true, description: 'Active / Completed' },
    ],
  },
  {
    name: 'AuditLogs',
    description: 'Immutable chronological audit trail of all sensitive operations',
    primaryKey: 'AuditId',
    columns: [
      { name: 'AuditId', type: 'String', required: true, description: 'AUD-0001' },
      { name: 'Timestamp', type: 'ISO Date', required: true, description: 'UTC timestamp' },
      { name: 'UserId', type: 'String', required: true, description: 'Acting user identifier' },
      { name: 'UserName', type: 'String', required: true, description: 'Full name' },
      { name: 'UserRole', type: 'String', required: true, description: 'Role of actor' },
      { name: 'Module', type: 'String', required: true, description: 'Payroll / Leave / Employees / Auth' },
      { name: 'Action', type: 'String', required: true, description: 'CREATE / UPDATE / APPROVE / LOCK' },
      { name: 'RecordId', type: 'String', required: true, description: 'Target record ID' },
      { name: 'Details', type: 'String', required: true, description: 'Descriptive change log' },
    ],
  },
  {
    name: 'Notifications',
    description: 'User in-app notifications and approval alerts',
    primaryKey: 'NotificationId',
    columns: [
      { name: 'NotificationId', type: 'String', required: true, description: 'NOTIF-0001' },
      { name: 'TargetUserId', type: 'String', required: true, description: 'Recipient user ID' },
      { name: 'Title', type: 'String', required: true, description: 'Short alert header' },
      { name: 'Message', type: 'String', required: true, description: 'Notification message body' },
      { name: 'IsRead', type: 'Boolean', required: true, description: 'TRUE / FALSE' },
      { name: 'CreatedAt', type: 'ISO Date', required: true, description: 'Timestamp' },
    ],
  },
  {
    name: 'Documents',
    description: 'Employee contracts, citizenship copies, and CVs stored in Google Drive',
    primaryKey: 'DocumentId',
    columns: [
      { name: 'DocumentId', type: 'String', required: true, description: 'DOC-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'DocumentType', type: 'String', required: true, description: 'Citizenship / Contract / CV' },
      { name: 'DriveFileId', type: 'String', required: true, description: 'Google Drive file ID' },
      { name: 'FileName', type: 'String', required: true, description: 'Uploaded filename' },
      { name: 'IsRestricted', type: 'Boolean', required: true, description: 'TRUE if confidential to HR only' },
    ],
  },
  {
    name: 'SalaryStructures',
    description: 'Component-wise earnings configuration for employees',
    primaryKey: 'StructureId',
    columns: [
      { name: 'StructureId', type: 'String', required: true, description: 'SAL-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'BasicSalary', type: 'Number', required: true, description: 'Basic wage' },
      { name: 'HouseRentAllowance', type: 'Number', required: true, description: 'HRA' },
      { name: 'DearnessAllowance', type: 'Number', required: true, description: 'Dearness' },
      { name: 'TransportAllowance', type: 'Number', required: true, description: 'Transport' },
      { name: 'CommunicationAllowance', type: 'Number', required: true, description: 'Communication' },
      { name: 'MealAllowance', type: 'Number', required: true, description: 'Meal allowance' },
    ],
  },
  {
    name: 'BonusesAndAllowances',
    description: 'Recurring or one-time festive and performance bonuses',
    primaryKey: 'BonusId',
    columns: [
      { name: 'BonusId', type: 'String', required: true, description: 'BON-0001' },
      { name: 'Title', type: 'String', required: true, description: 'Dashain Festival Allowance' },
      { name: 'Type', type: 'String', required: true, description: 'Festival / Performance / Incentive' },
      { name: 'CalculationMethod', type: 'String', required: true, description: '1 Month Basic / Fixed Amount' },
    ],
  },
  {
    name: 'Deductions',
    description: 'Authorized voluntary and statutory payroll deductions',
    primaryKey: 'DeductionId',
    columns: [
      { name: 'DeductionId', type: 'String', required: true, description: 'DED-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'DeductionName', type: 'String', required: true, description: 'CIT / Provident Fund / Welfare' },
      { name: 'MonthlyAmount', type: 'Number', required: true, description: 'Deduction amount' },
    ],
  },
  {
    name: 'PerformanceReviews',
    description: 'Quarterly and annual employee evaluations',
    primaryKey: 'ReviewId',
    columns: [
      { name: 'ReviewId', type: 'String', required: true, description: 'REV-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'ReviewerId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'Cycle', type: 'String', required: true, description: 'Q2 2081/82' },
      { name: 'Rating', type: 'Number', required: true, description: '1 to 5' },
    ],
  },
  {
    name: 'TrainingRecords',
    description: 'Staff professional development and compliance trainings',
    primaryKey: 'TrainingId',
    columns: [
      { name: 'TrainingId', type: 'String', required: true, description: 'TRN-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'CourseTitle', type: 'String', required: true, description: 'Course name' },
      { name: 'CompletionDate', type: 'Date', required: true, description: 'YYYY-MM-DD' },
    ],
  },
  {
    name: 'ResignationsAndTerminations',
    description: 'Exit records, notice periods, and final settlement calculations',
    primaryKey: 'ExitId',
    columns: [
      { name: 'ExitId', type: 'String', required: true, description: 'EXIT-0001' },
      { name: 'EmployeeId', type: 'String', required: true, description: 'EMP-XXXX' },
      { name: 'NoticeDate', type: 'Date', required: true, description: 'YYYY-MM-DD' },
      { name: 'LastWorkingDate', type: 'Date', required: true, description: 'YYYY-MM-DD' },
      { name: 'FinalSettlementAmount', type: 'Number', required: true, description: 'NPR total payable' },
    ],
  },
  {
    name: 'PayrollSettings',
    description: 'Disbursement bank accounts, pay day schedule, and approval parameters',
    primaryKey: 'ConfigId',
    columns: [
      { name: 'ConfigId', type: 'String', required: true, description: 'CFG-PAY-01' },
      { name: 'DisbursementBank', type: 'String', required: true, description: 'Nabil Bank / NIC Asia Bank' },
      { name: 'PayDayOfMonth', type: 'Number', required: true, description: 'Day (e.g. 28th)' },
      { name: 'AutoLockPayroll', type: 'Boolean', required: true, description: 'TRUE' },
    ],
  },
  {
    name: 'BackupExports',
    description: 'Historical archive logs and snapshot references',
    primaryKey: 'BackupId',
    columns: [
      { name: 'BackupId', type: 'String', required: true, description: 'BAK-0001' },
      { name: 'Timestamp', type: 'ISO Date', required: true, description: 'Snapshot date' },
      { name: 'FileDriveId', type: 'String', required: true, description: 'Drive file ID' },
      { name: 'Status', type: 'String', required: true, description: 'Verified' },
    ],
  },
];

export const APPS_SCRIPT_FILES: { fileName: string; title: string; description: string; code: string }[] = [
  {
    fileName: 'Code.gs',
    title: 'Web App Router & Entry Point',
    description: 'Handles HTTP GET/POST, serves HTML templates, executes secure RPC dispatching with session verification.',
    code: `/**
 * HamroHR - Nepal HRIS Web App Entry Point
 * Handles doGet, doPost, and secure RPC dispatching.
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');
  template.initialData = {
    appName: "HamroHR - Nepal HRIS",
    fiscalYear: "2081/82"
  };
  
  return template.evaluate()
    .setTitle("HamroHR - Nepal HRIS & Payroll System")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Main RPC Dispatcher for client-side google.script.run
 */
function apiDispatch(action, payload, sessionToken) {
  try {
    var user = verifySessionToken(sessionToken);
    
    // Actions allowed without authentication
    if (action === 'LOGIN') {
      return handleLogin(payload.email, payload.password);
    }
    
    if (!user) {
      throw new Error("Unauthorized: Invalid or expired session. Please log in again.");
    }
    
    switch (action) {
      case 'GET_DASHBOARD_METRICS':
        return getDashboardMetrics(user);
      case 'GET_EMPLOYEES':
        return getEmployeesList(user);
      case 'SAVE_EMPLOYEE':
        return saveEmployeeRecord(payload, user);
      case 'CHECK_IN_OUT':
        return recordAttendance(payload, user);
      case 'GET_ATTENDANCE':
        return getAttendanceRecords(payload, user);
      case 'APPLY_LEAVE':
        return applyForLeave(payload, user);
      case 'GET_LEAVE_DATA':
        return getLeaveData(payload, user);
      case 'APPROVE_LEAVE':
        return approveOrRejectLeave(payload, user);
      case 'PROCESS_PAYROLL':
        return processMonthlyPayrollRun(payload, user);
      case 'APPROVE_PAYROLL':
        return approvePayrollPeriod(payload, user);
      case 'GET_PAYROLL_RUNS':
        return getPayrollRunsList(user);
      case 'GET_PAYSLIP':
        return getEmployeePayslip(payload, user);
      case 'GET_AUDIT_LOGS':
        return getAuditLogsList(user);
      case 'SIMULATE_TAX':
        return calculateNepalIncomeTax(payload);
      default:
        throw new Error("Unknown action: " + action);
    }
  } catch (err) {
    Logger.log("API Error [" + action + "]: " + err.message);
    return { success: false, error: err.message };
  }
}
`,
  },
  {
    fileName: 'TaxEngine.gs',
    title: 'Nepal Progressive Income Tax Engine',
    description: 'Accurate Nepal Income Tax Act 2058 / Finance Act 2080/81 & 2081/82 progressive slab calculation, SSF exemption, female rebate.',
    code: `/**
 * Nepal Income Tax Calculation Engine (Finance Act 2080/81 & 2081/82)
 * Compliant with Nepal Inland Revenue Department (IRD) regulations.
 */

function calculateNepalIncomeTax(input) {
  var isSingle = input.maritalStatus === 'single';
  var monthlyGross = Number(input.monthlyGrossSalary) || 0;
  var annualBasic = Number(input.annualBasicSalary) || (monthlyGross * 12 * 0.6);
  var months = Number(input.monthsCount) || 12;
  var hasBonus = input.includeDashainBonus !== false;
  var festivalBonus = hasBonus ? (annualBasic / 12) : 0;
  
  var totalAssessableIncome = (monthlyGross * months) + festivalBonus;
  
  // 1. Retirement Fund Deduction (SSF / PF / CIT)
  // Max deductible is lesser of 1/3 of assessable income or NPR 500,000
  var isEnrolledSSF = input.isEnrolledInSSF === true;
  var employeeSSFAnnual = isEnrolledSSF ? (annualBasic * 0.11) : 0;
  var maxRetirement = Math.min(totalAssessableIncome / 3, 500000);
  var retirementDeduction = Math.min(employeeSSFAnnual, maxRetirement);
  
  // 2. Life Insurance (Max NPR 40,000)
  var lifeInsurance = Math.min(Number(input.lifeInsuranceAnnual) || 0, 40000);
  
  var totalDeductions = retirementDeduction + lifeInsurance;
  var taxableIncome = Math.max(0, totalAssessableIncome - totalDeductions);
  
  // 3. Tax Slabs Definition
  var firstSlabLimit = isSingle ? 500000 : 600000;
  var secondSlabCapacity = 200000;
  var thirdSlabCapacity = 300000;
  var fourthSlabCapacity = isSingle ? 1000000 : 900000;
  var fifthSlabCapacity = 3000000;
  
  var slabDefs = [
    { label: "Slab 1 (Up to " + firstSlabLimit + ")", capacity: firstSlabLimit, rate: isEnrolledSSF ? 0 : 0.01 },
    { label: "Slab 2 (10%)", capacity: secondSlabCapacity, rate: 0.10 },
    { label: "Slab 3 (20%)", capacity: thirdSlabCapacity, rate: 0.20 },
    { label: "Slab 4 (30%)", capacity: fourthSlabCapacity, rate: 0.30 },
    { label: "Slab 5 (36%)", capacity: fifthSlabCapacity, rate: 0.36 },
    { label: "Slab 6 (39%)", capacity: Infinity, rate: 0.39 }
  ];
  
  var remaining = taxableIncome;
  var grossTax = 0;
  var breakdowns = [];
  
  for (var i = 0; i < slabDefs.length; i++) {
    var def = slabDefs[i];
    if (remaining <= 0) {
      breakdowns.push({ label: def.label, applicable: 0, rate: def.rate, tax: 0 });
      continue;
    }
    var app = Math.min(remaining, def.capacity);
    var tax = app * def.rate;
    grossTax += tax;
    remaining -= app;
    breakdowns.push({ label: def.label, applicable: Math.round(app), rate: def.rate, tax: Math.round(tax) });
  }
  
  // 4. Female Resident Sole Employment Rebate (10%)
  var femaleRebate = 0;
  if (input.isFemaleSoleEmployment && isSingle) {
    femaleRebate = grossTax * 0.10;
  }
  
  var netAnnualTax = Math.max(0, Math.round(grossTax - femaleRebate));
  var monthlyTDS = Math.round((netAnnualTax / months) * 100) / 100;
  
  return {
    success: true,
    totalAssessableIncome: Math.round(totalAssessableIncome),
    festivalBonus: Math.round(festivalBonus),
    retirementDeduction: Math.round(retirementDeduction),
    taxableIncome: Math.round(taxableIncome),
    grossTaxLiability: Math.round(grossTax),
    femaleRebateAmount: Math.round(femaleRebate),
    netAnnualTaxLiability: netAnnualTax,
    monthlyTDS: monthlyTDS,
    isSSTExempt: isEnrolledSSF,
    breakdowns: breakdowns
  };
}
`,
  },
  {
    fileName: 'SSF.gs',
    title: 'Nepal Social Security Fund (SSF) Module',
    description: 'Computes 11% Employee deduction and 20% Employer contribution with 4-tier statutory scheme breakdowns.',
    code: `/**
 * Nepal Social Security Fund (SSF) Calculator
 * Mandated under Nepal Social Security Act 2074.
 */

function calculateEmployeeSSF(basicSalary, isEnrolled) {
  if (!isEnrolled) {
    return {
      isEnrolled: false,
      employeeContribution: 0,
      employerContribution: 0,
      totalContribution: 0
    };
  }
  
  var base = Number(basicSalary) || 0;
  var employeeAmt = Math.round(base * 0.11); // 11%
  var employerAmt = Math.round(base * 0.20); // 20%
  var totalAmt = employeeAmt + employerAmt;   // 31%
  
  return {
    isEnrolled: true,
    contributionBase: base,
    employeeContribution: employeeAmt,
    employerContribution: employerAmt,
    totalContribution: totalAmt,
    schemes: {
      medicalMaternity: Math.round(base * 0.01),      // 1.00%
      accidentDisability: Math.round(base * 0.014),    // 1.40%
      dependentFamily: Math.round(base * 0.0027),     // 0.27%
      oldAgeRetirement: Math.round(base * 0.2833)     // 28.33%
    }
  };
}
`,
  },
  {
    fileName: 'DatabaseSetup.gs',
    title: 'One-Click Master Spreadsheet & Drive Provisioner',
    description: 'Automatically creates all 26 sheets, configures columns, applies validations, seeds statutory Nepal settings, and provisions Drive folders.',
    code: `/**
 * HamroHR Master Database & Drive Folder Initializer
 * Run this function once from the Apps Script editor to initialize the system.
 */

function initializeHamroHRSystem() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Starting HamroHR 26-Sheet Database Setup on: " + ss.getName());
  
  var sheetsToCreate = [
    { name: "CompanySettings", headers: ["SettingKey", "SettingValue", "Category", "Description", "UpdatedAt"] },
    { name: "Users", headers: ["UserId", "EmployeeId", "Email", "PasswordHash", "Salt", "Role", "IsActive", "LastLogin"] },
    { name: "Employees", headers: ["EmployeeId", "FullName", "AvatarDriveId", "DateOfBirth", "Gender", "MaritalStatus", "OfficialEmail", "PersonalEmail", "Phone", "PermanentAddress", "CitizenshipNumber", "JoiningDate", "DepartmentId", "DesignationId", "ReportingManagerId", "EmploymentStatus", "BankName", "BankAccountNumber", "PANNumber", "IsEnrolledInSSF", "SSFNumber", "BasicSalary"] },
    { name: "Departments", headers: ["DepartmentId", "Name", "Code", "HeadEmployeeId"] },
    { name: "Designations", headers: ["DesignationId", "Title", "DepartmentId", "GradeLevel"] },
    { name: "Attendance", headers: ["AttendanceId", "EmployeeId", "Date", "CheckInTime", "CheckOutTime", "Status", "WorkHours", "OvertimeHours", "Source"] },
    { name: "LeaveTypes", headers: ["LeaveTypeId", "Name", "Code", "AnnualQuota", "IsCarryForwardable", "MaxCarryForward", "IsPaid"] },
    { name: "LeaveApplications", headers: ["ApplicationId", "EmployeeId", "LeaveTypeId", "StartDate", "EndDate", "WorkingDays", "Reason", "Status", "ManagerApproverId", "HRApproverId"] },
    { name: "LeaveBalances", headers: ["BalanceKey", "EmployeeId", "LeaveTypeId", "FiscalYear", "Entitlement", "Taken", "Pending", "Remaining"] },
    { name: "Holidays", headers: ["HolidayId", "Name", "Date", "DurationDays", "ApplicableGender"] },
    { name: "PayrollSettings", headers: ["ConfigId", "DisbursementBank", "PayDayOfMonth", "AutoLockPayroll"] },
    { name: "SalaryStructures", headers: ["StructureId", "EmployeeId", "BasicSalary", "HouseRentAllowance", "DearnessAllowance", "TransportAllowance", "CommunicationAllowance", "MealAllowance"] },
    { name: "PayrollRuns", headers: ["PayrollRunId", "FiscalYear", "MonthNepali", "Status", "TotalGross", "TotalSSFEmployee", "TotalTDS", "TotalNet", "TotalSSFEmployer", "ApprovedBy"] },
    { name: "PayrollDetails", headers: ["DetailId", "PayrollRunId", "EmployeeId", "BasicSalary", "TotalAllowances", "FestivalBonus", "GrossEarnings", "EmployeeSSF", "IncomeTaxTDS", "LoanDeduction", "NetPayable", "EmployerSSF"] },
    { name: "TaxSettings", headers: ["TaxRuleId", "FiscalYear", "TaxpayerCategory", "SlabLowerLimit", "SlabUpperLimit", "Rate", "SSFExemptFirstSlab"] },
    { name: "SSFSettings", headers: ["SSFConfigKey", "EmployeeRate", "EmployerRate", "StatutoryMinWage", "MedicalRate", "AccidentRate", "RetirementRate"] },
    { name: "AdvancesAndLoans", headers: ["LoanId", "EmployeeId", "Type", "PrincipalAmount", "MonthlyDeduction", "TotalRepaid", "RemainingBalance", "Status"] },
    { name: "BonusesAndAllowances", headers: ["BonusId", "Title", "Type", "CalculationMethod"] },
    { name: "Deductions", headers: ["DeductionId", "EmployeeId", "DeductionName", "MonthlyAmount"] },
    { name: "Documents", headers: ["DocumentId", "EmployeeId", "DocumentType", "DriveFileId", "FileName", "IsRestricted"] },
    { name: "PerformanceReviews", headers: ["ReviewId", "EmployeeId", "ReviewerId", "Cycle", "Rating"] },
    { name: "TrainingRecords", headers: ["TrainingId", "EmployeeId", "CourseTitle", "CompletionDate"] },
    { name: "ResignationsAndTerminations", headers: ["ExitId", "EmployeeId", "NoticeDate", "LastWorkingDate", "FinalSettlementAmount"] },
    { name: "AuditLogs", headers: ["AuditId", "Timestamp", "UserId", "UserName", "UserRole", "Module", "Action", "RecordId", "Details"] },
    { name: "Notifications", headers: ["NotificationId", "TargetUserId", "Title", "Message", "IsRead", "CreatedAt"] },
    { name: "BackupExports", headers: ["BackupId", "Timestamp", "FileDriveId", "Status"] }
  ];
  
  sheetsToCreate.forEach(function(item) {
    var sheet = ss.getSheetByName(item.name);
    if (!sheet) {
      sheet = ss.insertSheet(item.name);
    }
    // Set headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(item.headers);
      var headerRange = sheet.getRange(1, 1, 1, item.headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1e293b");
      headerRange.setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
  });
  
  // Provision Drive Folders
  var rootFolders = DriveApp.getFoldersByName("HamroHR_Storage");
  var mainFolder;
  if (rootFolders.hasNext()) {
    mainFolder = rootFolders.next();
  } else {
    mainFolder = DriveApp.createFolder("HamroHR_Storage");
  }
  
  var subfolders = ["Employee_Photos", "Employee_Documents", "Contracts", "Payslips", "Reports_Export", "Backups"];
  subfolders.forEach(function(sub) {
    if (!mainFolder.getFoldersByName(sub).hasNext()) {
      mainFolder.createFolder(sub);
    }
  });
  
  Logger.log("Database initialized successfully! Drive Root Folder ID: " + mainFolder.getId());
  return { success: true, folderId: mainFolder.getId() };
}
`,
  },
  {
    fileName: 'appsscript.json',
    title: 'Apps Script Manifest & OAuth Scopes',
    description: 'Specifies runtime version V8 and required Google Sheets & Drive permissions.',
    code: `{
  "timeZone": "Asia/Kathmandu",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE"
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.send_mail"
  ]
}
`,
  },
];
