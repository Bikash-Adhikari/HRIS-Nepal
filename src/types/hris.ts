/**
 * Comprehensive Human Resource Information System (HRIS) Types
 * Aligned with 26 Google Sheets Database Tables & Nepal Labor/Tax Compliance.
 */

export type UserRole = 'super_admin' | 'hr_admin' | 'finance_manager' | 'reporting_manager' | 'staff';

export interface UserSession {
  userId: string;
  employeeId?: string;
  email: string;
  fullName: string;
  role: UserRole;
  departmentId?: string;
  avatarUrl?: string;
}

export interface CompanySettings {
  companyName: string;
  registrationNumber: string;
  panNumber: string;
  ssfEmployerCode: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string;
  currentFiscalYear: string; // e.g. "2081/82"
  workingDaysPerWeek: number; // usually 6 or 5
  standardDailyHours: number; // 8 hours
  weekendDays: number[]; // [6] for Saturday
  officeStartTime: string; // "09:00"
  officeEndTime: string; // "17:00"
  currency: string; // "NPR"
}

export interface Department {
  id: string; // DEP-001
  name: string;
  code: string;
  headEmployeeId?: string;
  description: string;
  activeCount?: number;
}

export interface Designation {
  id: string; // DES-001
  title: string;
  departmentId: string;
  gradeLevel: string; // Junior, Mid, Senior, Lead, Executive
  description: string;
}

export interface Employee {
  id: string; // EMP-0001
  userId?: string;
  
  // Personal Info
  fullName: string;
  avatarUrl: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'single' | 'couple';
  personalEmail: string;
  officialEmail: string;
  phone: string;
  permanentAddress: string;
  temporaryAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  citizenshipNumber: string;
  citizenshipIssuedDistrict: string;
  
  // Employment Info
  joiningDate: string;
  employmentType: 'Full-time Permanent' | 'Probation' | 'Contract' | 'Trainee/Intern' | 'Part-time';
  departmentId: string;
  designationId: string;
  reportingManagerId?: string;
  employmentStatus: 'Active' | 'On Leave' | 'Notice Period' | 'Terminated' | 'Resigned';
  probationEndDate?: string;
  confirmationDate?: string;
  contractEndDate?: string;
  workLocation: string; // Kathmandu, Pokhara, Remote, etc.
  
  // Bank & Payroll Info
  bankName: string;
  bankBranch: string;
  accountHolderName: string;
  accountNumber: string;
  panNumber: string;
  isEnrolledInSSF: boolean;
  ssfNumber?: string;
  citNumber?: string;
  pfNumber?: string;
  remoteAreaCategory: 'None' | 'A' | 'B' | 'C' | 'D' | 'E';
  isFemaleSoleEmployment: boolean;
  
  // Current active salary structure
  basicSalary: number; // in NPR
  dearnessAllowance: number;
  houseRentAllowance: number;
  transportAllowance: number;
  communicationAllowance: number;
  mealAllowance: number;
  otherAllowances: number;
  
  // Documents count
  documentsCount?: number;
}

export interface AttendanceRecord {
  id: string; // ATT-0001
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // "09:05:22"
  checkOutTime?: string; // "17:15:10"
  status: 'Present' | 'Late' | 'Half Day' | 'On Leave' | 'Absent' | 'Holiday' | 'Weekly Off';
  workHours: number;
  overtimeHours: number;
  source: 'Web Check-in' | 'Biometric' | 'Admin Manual' | 'CSV Import';
  remarks?: string;
  location?: string;
  correctionRequested?: boolean;
  correctionReason?: string;
}

export interface LeaveType {
  id: string; // LT-001
  name: string;
  code: string; // AL, SL, CL, ML, PL, BL, UL
  annualQuota: number; // e.g. 18 for AL, 12 for SL
  isCarryForwardable: boolean;
  maxCarryForwardDays: number;
  isPaid: boolean;
  requiresDocument: boolean;
  documentPrompt?: string;
  genderEligibility: 'All' | 'Male' | 'Female';
  description: string;
}

export interface LeaveApplication {
  id: string; // LEAVE-0001
  employeeId: string;
  employeeName: string;
  departmentId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayPeriod?: 'first_half' | 'second_half';
  calendarDays: number;
  workingDays: number;
  reason: string;
  documentFileId?: string;
  documentFileName?: string;
  status: 'Pending Manager' | 'Pending HR' | 'Approved' | 'Rejected' | 'Cancelled';
  managerApproval?: {
    approverId: string;
    approverName: string;
    status: 'Approved' | 'Rejected';
    comment?: string;
    actionDate: string;
  };
  hrApproval?: {
    approverId: string;
    approverName: string;
    status: 'Approved' | 'Rejected';
    comment?: string;
    actionDate: string;
  };
  appliedAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  fiscalYear: string;
  openingBalance: number;
  annualEntitlement: number;
  accrued: number;
  taken: number;
  pendingRequests: number;
  remainingBalance: number;
  carriedForward: number;
}

export interface Holiday {
  id: string; // HOL-001
  name: string;
  nameNepali?: string;
  date: string; // YYYY-MM-DD
  durationDays: number;
  applicableGender: 'All' | 'Female';
  description: string;
  isNational: boolean;
}

export interface AdvanceAndLoan {
  id: string; // LOAN-0001
  employeeId: string;
  employeeName: string;
  type: 'Salary Advance' | 'Staff Loan' | 'Emergency Aid';
  principalAmount: number;
  approvedDate: string;
  monthlyDeductionAmount: number;
  totalRepaid: number;
  remainingBalance: number;
  status: 'Active' | 'Completed' | 'Suspended';
  purpose: string;
  repaymentHistory: {
    payrollRunId: string;
    date: string;
    amount: number;
  }[];
}

export interface PayrollRun {
  id: string; // PAY-0001
  fiscalYear: string; // "2081/82"
  monthNepali: string; // "Shrawan", "Bhadra", "Ashwin", "Kartik", etc.
  monthGregorian: string; // "August 2024"
  status: 'Draft' | 'Under Review' | 'Approved' | 'Locked' | 'Disbursed';
  processedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  totalEmployees: number;
  totalGrossPayable: number;
  totalEmployeeSSF: number;
  totalIncomeTaxTDS: number;
  totalOtherDeductions: number;
  totalNetPayable: number;
  totalEmployerSSF: number;
  notes?: string;
}

export interface PayrollDetail {
  id: string; // PAYD-0001
  payrollRunId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  designationTitle: string;
  bankName: string;
  bankAccountNumber: string;
  panNumber: string;
  ssfNumber?: string;
  maritalStatus: 'single' | 'couple';
  
  // Attendance components
  totalMonthDays: number;
  presentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  weeklyOffDays: number;
  publicHolidayDays: number;
  payableDays: number;
  
  // Earnings
  basicSalary: number;
  dearnessAllowance: number;
  houseRentAllowance: number;
  transportAllowance: number;
  communicationAllowance: number;
  mealAllowance: number;
  otherAllowances: number;
  overtimeAmount: number;
  festivalBonusAmount: number; // Dashain bonus if applicable
  performanceBonus: number;
  grossEarnings: number;
  
  // Nepal Tax & Statutory Deductions
  isEnrolledInSSF: boolean;
  employeeSSF: number; // 11% of basic
  incomeTaxTDS: number; // monthly progressive TDS
  loanDeduction: number;
  unpaidLeaveDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  
  // Net Payable
  netPayableSalary: number;
  
  // Employer Cost (separate, not deducted from net pay)
  employerSSF: number; // 20% of basic
  totalCompanyCost: number; // Gross + Employer SSF
  
  paymentStatus: 'Pending' | 'Paid';
  paymentReference?: string;
}

export interface EmployeeDocument {
  id: string; // DOC-0001
  employeeId: string;
  documentType: 'Citizenship' | 'Resume/CV' | 'Offer Letter' | 'Contract' | 'Certificate' | 'PAN Card' | 'Medical' | 'Other';
  fileName: string;
  fileSizeKb: number;
  mimeType: string;
  driveFileId: string;
  driveViewUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  isRestricted: boolean; // Staff cannot view if confidential HR document
}

export interface AuditLog {
  id: string; // AUD-0001
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  module: 'Auth' | 'Employees' | 'Attendance' | 'Leave' | 'Payroll' | 'Tax Settings' | 'SSF Settings' | 'Loans' | 'System';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'LOCK' | 'EXPORT' | 'LOGIN';
  recordId: string;
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string; // NOTIF-0001
  targetUserId: string;
  targetRole?: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  type: 'leave' | 'payroll' | 'attendance' | 'document' | 'system';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewCycle: string; // e.g. "Q2 2081/82"
  rating: number; // 1 to 5
  strengths: string;
  areasOfImprovement: string;
  status: 'Completed' | 'Pending';
  date: string;
}

export interface TrainingRecord {
  id: string;
  employeeId: string;
  trainingTitle: string;
  institution: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'In Progress';
  certificateDriveId?: string;
}

export interface ResignationOrTermination {
  id: string;
  employeeId: string;
  type: 'Resignation' | 'Termination' | 'Contract Expiry';
  noticeDate: string;
  lastWorkingDay: string;
  reason: string;
  exitInterviewStatus: 'Completed' | 'Pending';
  gratuityPayable: number;
  leaveEncashmentPayable: number;
  finalSettlementAmount: number;
  settlementStatus: 'Draft' | 'Approved' | 'Settled';
}
