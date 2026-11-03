/**
 * Mock Database & Persistent Local Store
 * Emulates the 26 Google Sheets tables with complete CRUD operations,
 * relational lookups, audit logging, and role authorization.
 */

import {
  CompanySettings,
  Department,
  Designation,
  Employee,
  AttendanceRecord,
  LeaveType,
  LeaveApplication,
  LeaveBalance,
  Holiday,
  PayrollRun,
  PayrollDetail,
  AdvanceAndLoan,
  AuditLog,
  NotificationItem,
  UserSession,
} from '../types/hris';
import { calculateNepalTax } from '../lib/nepalTaxEngine';
import { calculateNepalSSF } from '../lib/nepalSSFEngine';

const STORAGE_KEY = 'HAMRO_HRIS_DATABASE_V1';

export const INITIAL_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'Himalayan Cloud Solutions Pvt. Ltd.',
  registrationNumber: '241908/078/079',
  panNumber: '609823415',
  ssfEmployerCode: 'SSF-EM-99214',
  address: 'Jhamsikhel-03, Lalitpur',
  city: 'Kathmandu Valley',
  country: 'Nepal',
  phone: '+977-1-5542890',
  email: 'hr@himalayancloud.com.np',
  website: 'https://himalayancloud.com.np',
  logoUrl: '',
  currentFiscalYear: '2081/82',
  workingDaysPerWeek: 6,
  standardDailyHours: 8,
  weekendDays: [6], // Saturday
  officeStartTime: '09:00',
  officeEndTime: '17:00',
  currency: 'NPR',
};

export const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'DEP-001', name: 'Engineering & Tech', code: 'ENG', headEmployeeId: 'EMP-0001', description: 'Software engineering, cloud infrastructure & DevOps' },
  { id: 'DEP-002', name: 'Human Resources', code: 'HR', headEmployeeId: 'EMP-0002', description: 'Talent acquisition, employee welfare & Nepal compliance' },
  { id: 'DEP-003', name: 'Finance & Accounts', code: 'FIN', headEmployeeId: 'EMP-0003', description: 'Payroll disbursement, IRD tax returns, and audit' },
  { id: 'DEP-004', name: 'Product & Design', code: 'PRD', headEmployeeId: 'EMP-0004', description: 'UI/UX design and product strategy' },
];

export const INITIAL_DESIGNATIONS: Designation[] = [
  { id: 'DES-001', title: 'Principal Architect', departmentId: 'DEP-001', gradeLevel: 'Lead', description: 'Oversees engineering architecture' },
  { id: 'DES-002', title: 'Senior Software Engineer', departmentId: 'DEP-001', gradeLevel: 'Senior', description: 'Full-stack application development' },
  { id: 'DES-003', title: 'HR Manager & Compliance Lead', departmentId: 'DEP-002', gradeLevel: 'Senior', description: 'Labor act & SSF specialist' },
  { id: 'DES-004', title: 'Finance Officer', departmentId: 'DEP-003', gradeLevel: 'Mid', description: 'Nepal tax calculations and reconciliations' },
  { id: 'DES-005', title: 'Product Designer', departmentId: 'DEP-004', gradeLevel: 'Mid', description: 'Visual and UX design' },
  { id: 'DES-006', title: 'Junior Frontend Developer', departmentId: 'DEP-001', gradeLevel: 'Junior', description: 'React and web interfaces' },
];

export const INITIAL_LEAVE_TYPES: LeaveType[] = [
  {
    id: 'LT-001',
    name: 'Annual Home Leave (घर विदा)',
    code: 'AL',
    annualQuota: 18,
    isCarryForwardable: true,
    maxCarryForwardDays: 90,
    isPaid: true,
    requiresDocument: false,
    genderEligibility: 'All',
    description: '1 day per 20 working days worked as per Section 40 of Nepal Labour Act 2074.',
  },
  {
    id: 'LT-002',
    name: 'Sick Leave (बिरामी विदा)',
    code: 'SL',
    annualQuota: 12,
    isCarryForwardable: true,
    maxCarryForwardDays: 45,
    isPaid: true,
    requiresDocument: true,
    documentPrompt: 'Medical certificate from a registered physician required for leaves exceeding 3 days.',
    genderEligibility: 'All',
    description: 'Fully paid sick leave as per Section 41 of Nepal Labour Act 2074.',
  },
  {
    id: 'LT-003',
    name: 'Casual Leave (भइपरी विदा)',
    code: 'CL',
    annualQuota: 6,
    isCarryForwardable: false,
    maxCarryForwardDays: 0,
    isPaid: true,
    requiresDocument: false,
    genderEligibility: 'All',
    description: 'For unforeseen personal emergencies and family ceremonies.',
  },
  {
    id: 'LT-004',
    name: 'Maternity Leave (सुत्केरी विदा)',
    code: 'ML',
    annualQuota: 98,
    isCarryForwardable: false,
    maxCarryForwardDays: 0,
    isPaid: true,
    requiresDocument: true,
    documentPrompt: 'Hospital maternity card or birth certificate.',
    genderEligibility: 'Female',
    description: '98 days total (60 days fully paid) as per Section 45 of Nepal Labour Act.',
  },
  {
    id: 'LT-005',
    name: 'Paternity Leave (सुत्केरी स्याहार विदा)',
    code: 'PL',
    annualQuota: 15,
    isCarryForwardable: false,
    maxCarryForwardDays: 0,
    isPaid: true,
    requiresDocument: true,
    genderEligibility: 'Male',
    description: '15 days fully paid leave for male employees upon child birth.',
  },
  {
    id: 'LT-006',
    name: 'Mourning / Bereavement Leave (क्रिया विदा)',
    code: 'BL',
    annualQuota: 13,
    isCarryForwardable: false,
    maxCarryForwardDays: 0,
    isPaid: true,
    requiresDocument: false,
    genderEligibility: 'All',
    description: '13 days fully paid as per Nepal cultural traditions and Labour Act Section 44.',
  },
  {
    id: 'LT-007',
    name: 'Unpaid Leave (अवैतनिक विदा)',
    code: 'UL',
    annualQuota: 30,
    isCarryForwardable: false,
    maxCarryForwardDays: 0,
    isPaid: false,
    requiresDocument: true,
    genderEligibility: 'All',
    description: 'Leave without pay subject to management approval.',
  },
];

export const INITIAL_HOLIDAYS: Holiday[] = [
  { id: 'HOL-001', name: 'Dashain Holiday (Bijaya Dashami)', nameNepali: 'विजया दशमी', date: '2026-10-21', durationDays: 5, applicableGender: 'All', description: 'Main national festival of Nepal', isNational: true },
  { id: 'HOL-002', name: 'Tihar (Laxmi Puja & Bhai Tika)', nameNepali: 'तिहार', date: '2026-11-09', durationDays: 3, applicableGender: 'All', description: 'Festival of Lights', isNational: true },
  { id: 'HOL-003', name: 'Constitution Day', nameNepali: 'संविधान दिवस', date: '2026-09-19', durationDays: 1, applicableGender: 'All', description: 'Nepal National Constitution Day', isNational: true },
  { id: 'HOL-004', name: 'Maha Shivaratri', nameNepali: 'महाशिवरात्री', date: '2027-03-06', durationDays: 1, applicableGender: 'All', description: 'Pashupatinath celebration', isNational: true },
  { id: 'HOL-005', name: 'International Women\'s Day', nameNepali: 'अन्तर्राष्ट्रिय महिला दिवस', date: '2027-03-08', durationDays: 1, applicableGender: 'Female', description: 'Holiday for female employees', isNational: true },
  { id: 'HOL-006', name: 'Nepali New Year (Baisakh 1)', nameNepali: 'नयाँ वर्ष २०८२', date: '2027-04-14', durationDays: 1, applicableGender: 'All', description: 'First day of Bikram Sambat Calendar', isNational: true },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-0001',
    fullName: 'Bikash Adhikari',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '1989-08-14',
    gender: 'Male',
    maritalStatus: 'couple',
    personalEmail: 'bikash.adhikari@gmail.com',
    officialEmail: 'bikash@himalayancloud.com.np',
    phone: '+977-9841234567',
    permanentAddress: 'Ward 4, Pokhara, Kaski, Gandaki Province',
    temporaryAddress: 'Jhamsikhel, Lalitpur',
    emergencyContactName: 'Pratima Adhikari',
    emergencyContactPhone: '+977-9841998877',
    emergencyContactRelation: 'Spouse',
    citizenshipNumber: '48-01-70-12890',
    citizenshipIssuedDistrict: 'Kaski',
    joiningDate: '2021-04-15',
    employmentType: 'Full-time Permanent',
    departmentId: 'DEP-001',
    designationId: 'DES-001',
    employmentStatus: 'Active',
    confirmationDate: '2021-10-15',
    workLocation: 'Lalitpur Head Office',
    bankName: 'Nabil Bank Ltd.',
    bankBranch: 'Pulchowk Branch',
    accountHolderName: 'Bikash Adhikari',
    accountNumber: '01901017500234',
    panNumber: '109283746',
    isEnrolledInSSF: true,
    ssfNumber: 'SSF-00129845',
    remoteAreaCategory: 'None',
    isFemaleSoleEmployment: false,
    basicSalary: 85000,
    dearnessAllowance: 10000,
    houseRentAllowance: 25000,
    transportAllowance: 8000,
    communicationAllowance: 4000,
    mealAllowance: 6000,
    otherAllowances: 2000,
  },
  {
    id: 'EMP-0002',
    fullName: 'Sunita Maharjan',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '1993-03-22',
    gender: 'Female',
    maritalStatus: 'single',
    personalEmail: 'sunita.maharjan@yahoo.com',
    officialEmail: 'sunita.m@himalayancloud.com.np',
    phone: '+977-9851098765',
    permanentAddress: 'Patan Dhoka, Lalitpur',
    temporaryAddress: 'Patan Dhoka, Lalitpur',
    emergencyContactName: 'Birendra Maharjan',
    emergencyContactPhone: '+977-9851122334',
    emergencyContactRelation: 'Father',
    citizenshipNumber: '27-01-71-09432',
    citizenshipIssuedDistrict: 'Lalitpur',
    joiningDate: '2022-01-10',
    employmentType: 'Full-time Permanent',
    departmentId: 'DEP-002',
    designationId: 'DES-003',
    reportingManagerId: 'EMP-0001',
    employmentStatus: 'Active',
    confirmationDate: '2022-07-10',
    workLocation: 'Lalitpur Head Office',
    bankName: 'NIC Asia Bank',
    bankBranch: 'Jawalakhel Branch',
    accountHolderName: 'Sunita Maharjan',
    accountNumber: '29481029384756',
    panNumber: '203948571',
    isEnrolledInSSF: true,
    ssfNumber: 'SSF-00239481',
    remoteAreaCategory: 'None',
    isFemaleSoleEmployment: true, // 10% tax rebate applicable
    basicSalary: 55000,
    dearnessAllowance: 6000,
    houseRentAllowance: 15000,
    transportAllowance: 5000,
    communicationAllowance: 3000,
    mealAllowance: 4000,
    otherAllowances: 1000,
  },
  {
    id: 'EMP-0003',
    fullName: 'Rohan Thapa',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '1995-11-05',
    gender: 'Male',
    maritalStatus: 'single',
    personalEmail: 'rohan.thapa@gmail.com',
    officialEmail: 'rohan.t@himalayancloud.com.np',
    phone: '+977-9813456789',
    permanentAddress: 'Ward 2, Dharan, Sunsari',
    temporaryAddress: 'Baneshwor, Kathmandu',
    emergencyContactName: 'Sita Thapa',
    emergencyContactPhone: '+977-9813009988',
    emergencyContactRelation: 'Mother',
    citizenshipNumber: '14-02-73-00918',
    citizenshipIssuedDistrict: 'Sunsari',
    joiningDate: '2023-06-01',
    employmentType: 'Full-time Permanent',
    departmentId: 'DEP-003',
    designationId: 'DES-004',
    reportingManagerId: 'EMP-0001',
    employmentStatus: 'Active',
    confirmationDate: '2023-12-01',
    workLocation: 'Lalitpur Head Office',
    bankName: 'Global IME Bank',
    bankBranch: 'New Baneshwor Branch',
    accountHolderName: 'Rohan Thapa',
    accountNumber: '00192837465019',
    panNumber: '394857201',
    isEnrolledInSSF: true,
    ssfNumber: 'SSF-00392817',
    remoteAreaCategory: 'None',
    isFemaleSoleEmployment: false,
    basicSalary: 45000,
    dearnessAllowance: 5000,
    houseRentAllowance: 12000,
    transportAllowance: 4000,
    communicationAllowance: 2500,
    mealAllowance: 3500,
    otherAllowances: 1000,
  },
  {
    id: 'EMP-0004',
    fullName: 'Pooja Shrestha',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '1997-05-18',
    gender: 'Female',
    maritalStatus: 'single',
    personalEmail: 'pooja.shrestha@gmail.com',
    officialEmail: 'pooja.s@himalayancloud.com.np',
    phone: '+977-9860123456',
    permanentAddress: 'Bhaktapur-04, Durbar Square area',
    temporaryAddress: 'Sallaghari, Bhaktapur',
    emergencyContactName: 'Ram Shrestha',
    emergencyContactPhone: '+977-9860887766',
    emergencyContactRelation: 'Father',
    citizenshipNumber: '29-01-75-01829',
    citizenshipIssuedDistrict: 'Bhaktapur',
    joiningDate: '2023-09-15',
    employmentType: 'Full-time Permanent',
    departmentId: 'DEP-004',
    designationId: 'DES-005',
    reportingManagerId: 'EMP-0001',
    employmentStatus: 'Active',
    confirmationDate: '2024-03-15',
    workLocation: 'Lalitpur Head Office',
    bankName: 'Everest Bank Ltd.',
    bankBranch: 'Suryabinayak Branch',
    accountHolderName: 'Pooja Shrestha',
    accountNumber: '01827364501928',
    panNumber: '401928375',
    isEnrolledInSSF: true,
    ssfNumber: 'SSF-00491823',
    remoteAreaCategory: 'None',
    isFemaleSoleEmployment: true,
    basicSalary: 48000,
    dearnessAllowance: 5000,
    houseRentAllowance: 14000,
    transportAllowance: 4000,
    communicationAllowance: 2500,
    mealAllowance: 3500,
    otherAllowances: 1000,
  },
  {
    id: 'EMP-0005',
    fullName: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '2000-01-20',
    gender: 'Male',
    maritalStatus: 'single',
    personalEmail: 'aarav.sharma@outlook.com',
    officialEmail: 'aarav.s@himalayancloud.com.np',
    phone: '+977-9801234567',
    permanentAddress: 'Biratnagar-08, Morang',
    temporaryAddress: 'Kupandole, Lalitpur',
    emergencyContactName: 'Gopal Sharma',
    emergencyContactPhone: '+977-9801998877',
    emergencyContactRelation: 'Father',
    citizenshipNumber: '05-01-77-09283',
    citizenshipIssuedDistrict: 'Morang',
    joiningDate: '2024-02-01',
    employmentType: 'Probation',
    departmentId: 'DEP-001',
    designationId: 'DES-006',
    reportingManagerId: 'EMP-0001',
    employmentStatus: 'Active',
    probationEndDate: '2024-08-01',
    workLocation: 'Lalitpur Head Office',
    bankName: 'Nabil Bank Ltd.',
    bankBranch: 'Kupandole Branch',
    accountHolderName: 'Aarav Sharma',
    accountNumber: '01901099887766',
    panNumber: '509182736',
    isEnrolledInSSF: true,
    ssfNumber: 'SSF-00582910',
    remoteAreaCategory: 'None',
    isFemaleSoleEmployment: false,
    basicSalary: 32000,
    dearnessAllowance: 3500,
    houseRentAllowance: 8500,
    transportAllowance: 3000,
    communicationAllowance: 1500,
    mealAllowance: 2500,
    otherAllowances: 500,
  },
];

export const INITIAL_LEAVE_BALANCES: LeaveBalance[] = [
  // Bikash Adhikari (EMP-0001)
  { employeeId: 'EMP-0001', leaveTypeId: 'LT-001', leaveTypeName: 'Annual Home Leave (घर विदा)', fiscalYear: '2081/82', openingBalance: 14, annualEntitlement: 18, accrued: 18, taken: 4, pendingRequests: 0, remainingBalance: 28, carriedForward: 14 },
  { employeeId: 'EMP-0001', leaveTypeId: 'LT-002', leaveTypeName: 'Sick Leave (बिरामी विदा)', fiscalYear: '2081/82', openingBalance: 8, annualEntitlement: 12, accrued: 12, taken: 2, pendingRequests: 0, remainingBalance: 18, carriedForward: 8 },
  { employeeId: 'EMP-0001', leaveTypeId: 'LT-003', leaveTypeName: 'Casual Leave (भइपरी विदा)', fiscalYear: '2081/82', openingBalance: 0, annualEntitlement: 6, accrued: 6, taken: 1, pendingRequests: 0, remainingBalance: 5, carriedForward: 0 },

  // Sunita Maharjan (EMP-0002)
  { employeeId: 'EMP-0002', leaveTypeId: 'LT-001', leaveTypeName: 'Annual Home Leave (घर विदा)', fiscalYear: '2081/82', openingBalance: 10, annualEntitlement: 18, accrued: 18, taken: 3, pendingRequests: 0, remainingBalance: 25, carriedForward: 10 },
  { employeeId: 'EMP-0002', leaveTypeId: 'LT-002', leaveTypeName: 'Sick Leave (बिरामी विदा)', fiscalYear: '2081/82', openingBalance: 6, annualEntitlement: 12, accrued: 12, taken: 1, pendingRequests: 0, remainingBalance: 17, carriedForward: 6 },
  { employeeId: 'EMP-0002', leaveTypeId: 'LT-003', leaveTypeName: 'Casual Leave (भइपरी विदा)', fiscalYear: '2081/82', openingBalance: 0, annualEntitlement: 6, accrued: 6, taken: 2, pendingRequests: 0, remainingBalance: 4, carriedForward: 0 },

  // Aarav Sharma (EMP-0005) - Staff user
  { employeeId: 'EMP-0005', leaveTypeId: 'LT-001', leaveTypeName: 'Annual Home Leave (घर विदा)', fiscalYear: '2081/82', openingBalance: 0, annualEntitlement: 18, accrued: 13, taken: 2, pendingRequests: 2, remainingBalance: 9, carriedForward: 0 },
  { employeeId: 'EMP-0005', leaveTypeId: 'LT-002', leaveTypeName: 'Sick Leave (बिरामी विदा)', fiscalYear: '2081/82', openingBalance: 0, annualEntitlement: 12, accrued: 9, taken: 1, pendingRequests: 0, remainingBalance: 8, carriedForward: 0 },
  { employeeId: 'EMP-0005', leaveTypeId: 'LT-003', leaveTypeName: 'Casual Leave (भइपरी विदा)', fiscalYear: '2081/82', openingBalance: 0, annualEntitlement: 6, accrued: 6, taken: 1, pendingRequests: 0, remainingBalance: 5, carriedForward: 0 },
];

export const INITIAL_LEAVE_APPLICATIONS: LeaveApplication[] = [
  {
    id: 'LEAVE-0001',
    employeeId: 'EMP-0005',
    employeeName: 'Aarav Sharma',
    departmentId: 'DEP-001',
    leaveTypeId: 'LT-001',
    leaveTypeName: 'Annual Home Leave (घर विदा)',
    startDate: '2026-11-10',
    endDate: '2026-11-11',
    isHalfDay: false,
    calendarDays: 2,
    workingDays: 2,
    reason: 'Family visit to Biratnagar for post-festival gathering.',
    status: 'Pending Manager',
    appliedAt: '2026-11-01T10:30:00Z',
  },
  {
    id: 'LEAVE-0002',
    employeeId: 'EMP-0004',
    employeeName: 'Pooja Shrestha',
    departmentId: 'DEP-004',
    leaveTypeId: 'LT-003',
    leaveTypeName: 'Casual Leave (भइपरी विदा)',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    isHalfDay: false,
    calendarDays: 1,
    workingDays: 1,
    reason: 'Personal urgent bank errand.',
    status: 'Approved',
    managerApproval: { approverId: 'EMP-0001', approverName: 'Bikash Adhikari', status: 'Approved', comment: 'Approved. Ensure work handover.', actionDate: '2026-10-14T11:00:00Z' },
    hrApproval: { approverId: 'EMP-0002', approverName: 'Sunita Maharjan', status: 'Approved', comment: 'Leave balance deducted.', actionDate: '2026-10-14T14:20:00Z' },
    appliedAt: '2026-10-13T09:15:00Z',
  },
];

export const INITIAL_ADVANCES_AND_LOANS: AdvanceAndLoan[] = [
  {
    id: 'LOAN-0001',
    employeeId: 'EMP-0005',
    employeeName: 'Aarav Sharma',
    type: 'Staff Loan',
    principalAmount: 50000,
    approvedDate: '2026-06-01',
    monthlyDeductionAmount: 5000,
    totalRepaid: 20000,
    remainingBalance: 30000,
    status: 'Active',
    purpose: 'Relocation expenses and computer equipment upgrade',
    repaymentHistory: [
      { payrollRunId: 'PAY-0001', date: '2026-07-31', amount: 5000 },
      { payrollRunId: 'PAY-0002', date: '2026-08-31', amount: 5000 },
      { payrollRunId: 'PAY-0003', date: '2026-09-30', amount: 5000 },
      { payrollRunId: 'PAY-0004', date: '2026-10-31', amount: 5000 },
    ],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-0001',
    timestamp: '2026-11-01T09:00:00Z',
    userId: 'USR-ADMIN',
    userName: 'Bikash Adhikari (Super Admin)',
    userRole: 'super_admin',
    module: 'System',
    action: 'CREATE',
    recordId: 'SYS-INIT',
    details: 'HamroHR Nepal HRIS Database initialized with 26 Sheets and SSF/Tax rules.',
  },
  {
    id: 'AUD-0002',
    timestamp: '2026-11-02T10:15:00Z',
    userId: 'USR-ADMIN',
    userName: 'Bikash Adhikari (Super Admin)',
    userRole: 'super_admin',
    module: 'Leave',
    action: 'APPROVE',
    recordId: 'LEAVE-0002',
    details: 'Casual leave of 1 day approved for Pooja Shrestha.',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'ATT-0001',
    employeeId: 'EMP-0001',
    date: '2026-11-02',
    checkInTime: '08:55:12',
    checkOutTime: '17:05:40',
    status: 'Present',
    workHours: 8.17,
    overtimeHours: 0,
    source: 'Web Check-in',
    location: 'Lalitpur Head Office',
  },
  {
    id: 'ATT-0002',
    employeeId: 'EMP-0002',
    date: '2026-11-02',
    checkInTime: '09:02:18',
    checkOutTime: '17:10:05',
    status: 'Present',
    workHours: 8.13,
    overtimeHours: 0,
    source: 'Web Check-in',
    location: 'Lalitpur Head Office',
  },
  {
    id: 'ATT-0003',
    employeeId: 'EMP-0003',
    date: '2026-11-02',
    checkInTime: '09:25:00',
    checkOutTime: '17:30:00',
    status: 'Late',
    workHours: 8.08,
    overtimeHours: 0,
    source: 'Web Check-in',
    remarks: 'Late arrival due to traffic on Ring Road',
  },
  {
    id: 'ATT-0004',
    employeeId: 'EMP-0004',
    date: '2026-11-02',
    checkInTime: '08:58:30',
    checkOutTime: '17:02:10',
    status: 'Present',
    workHours: 8.06,
    overtimeHours: 0,
    source: 'Web Check-in',
    location: 'Lalitpur Head Office',
  },
  {
    id: 'ATT-0005',
    employeeId: 'EMP-0005',
    date: '2026-11-02',
    checkInTime: '09:05:14',
    checkOutTime: '17:15:30',
    status: 'Present',
    workHours: 8.17,
    overtimeHours: 0,
    source: 'Web Check-in',
    location: 'Lalitpur Head Office',
  },
];

export interface AppDatabaseState {
  companySettings: CompanySettings;
  departments: Department[];
  designations: Designation[];
  employees: Employee[];
  leaveTypes: LeaveType[];
  leaveBalances: LeaveBalance[];
  leaveApplications: LeaveApplication[];
  holidays: Holiday[];
  attendance: AttendanceRecord[];
  advancesAndLoans: AdvanceAndLoan[];
  payrollRuns: PayrollRun[];
  payrollDetails: PayrollDetail[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
}

export class MockDatabaseService {
  private state: AppDatabaseState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppDatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore fallback
    }
    const initial: AppDatabaseState = {
      companySettings: INITIAL_COMPANY_SETTINGS,
      departments: INITIAL_DEPARTMENTS,
      designations: INITIAL_DESIGNATIONS,
      employees: INITIAL_EMPLOYEES,
      leaveTypes: INITIAL_LEAVE_TYPES,
      leaveBalances: INITIAL_LEAVE_BALANCES,
      leaveApplications: INITIAL_LEAVE_APPLICATIONS,
      holidays: INITIAL_HOLIDAYS,
      attendance: INITIAL_ATTENDANCE,
      advancesAndLoans: INITIAL_ADVANCES_AND_LOANS,
      payrollRuns: [],
      payrollDetails: [],
      auditLogs: INITIAL_AUDIT_LOGS,
      notifications: [
        {
          id: 'NOTIF-0001',
          targetUserId: 'USR-STAFF-005',
          title: 'Leave Request Received',
          message: 'Your leave application LEAVE-0001 has been submitted to your reporting manager.',
          timestamp: '2026-11-01T10:30:00Z',
          read: false,
          type: 'leave',
        },
      ],
    };
    this.saveState(initial);
    return initial;
  }

  private saveState(state: AppDatabaseState) {
    this.state = state;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist to localStorage', e);
    }
  }

  public resetToDefault(): AppDatabaseState {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    return this.state;
  }

  // Getters
  public getState(): AppDatabaseState {
    return this.state;
  }

  public getCompanySettings(): CompanySettings {
    return this.state.companySettings;
  }

  public updateCompanySettings(settings: CompanySettings, user: UserSession): void {
    this.state.companySettings = settings;
    this.logAudit(user, 'System', 'UPDATE', 'SETTINGS', 'Updated company profile and fiscal year settings');
    this.saveState(this.state);
  }

  public getEmployees(): Employee[] {
    return this.state.employees;
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.state.employees.find((e) => e.id === id);
  }

  public addEmployee(employee: Employee, user: UserSession): void {
    // Generate EMP ID if missing
    if (!employee.id) {
      const nextNum = this.state.employees.length + 1;
      employee.id = `EMP-${String(nextNum).padStart(4, '0')}`;
    }
    this.state.employees.push(employee);
    // Initialize leave balances for this employee
    this.state.leaveTypes.forEach((lt) => {
      this.state.leaveBalances.push({
        employeeId: employee.id,
        leaveTypeId: lt.id,
        leaveTypeName: lt.name,
        fiscalYear: this.state.companySettings.currentFiscalYear,
        openingBalance: 0,
        annualEntitlement: lt.annualQuota,
        accrued: lt.annualQuota,
        taken: 0,
        pendingRequests: 0,
        remainingBalance: lt.annualQuota,
        carriedForward: 0,
      });
    });

    this.logAudit(user, 'Employees', 'CREATE', employee.id, `Created new employee record: ${employee.fullName}`);
    this.saveState(this.state);
  }

  public updateEmployee(employee: Employee, user: UserSession): void {
    const idx = this.state.employees.findIndex((e) => e.id === employee.id);
    if (idx !== -1) {
      this.state.employees[idx] = employee;
      this.logAudit(user, 'Employees', 'UPDATE', employee.id, `Updated employee profile: ${employee.fullName}`);
      this.saveState(this.state);
    }
  }

  public deleteEmployee(id: string, user: UserSession): void {
    const emp = this.getEmployeeById(id);
    this.state.employees = this.state.employees.filter((e) => e.id !== id);
    if (emp) {
      this.logAudit(user, 'Employees', 'DELETE', id, `Deactivated/Archived employee: ${emp.fullName}`);
    }
    this.saveState(this.state);
  }

  // Attendance
  public getAttendance(employeeId?: string): AttendanceRecord[] {
    if (employeeId) {
      return this.state.attendance.filter((a) => a.employeeId === employeeId);
    }
    return this.state.attendance;
  }

  public checkIn(employeeId: string, location?: string): AttendanceRecord {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Check if already checked in
    const existing = this.state.attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (existing) {
      return existing;
    }

    const startHour = parseInt(this.state.companySettings.officeStartTime.split(':')[0], 10);
    const startMin = parseInt(this.state.companySettings.officeStartTime.split(':')[1] || '0', 10);
    const isLate = now.getHours() > startHour || (now.getHours() === startHour && now.getMinutes() > startMin + 15);

    const record: AttendanceRecord = {
      id: `ATT-${String(this.state.attendance.length + 1).padStart(4, '0')}`,
      employeeId,
      date: today,
      checkInTime: timeStr,
      status: isLate ? 'Late' : 'Present',
      workHours: 0,
      overtimeHours: 0,
      source: 'Web Check-in',
      location: location || 'Web Portal (Kathmandu, Nepal)',
    };

    this.state.attendance.push(record);
    this.saveState(this.state);
    return record;
  }

  public checkOut(employeeId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const record = this.state.attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (!record) return undefined;

    record.checkOutTime = timeStr;
    const [inH, inM] = record.checkInTime.split(':').map(Number);
    const [outH, outM] = timeStr.split(':').map(Number);
    const hours = Math.max(0, (outH + outM / 60) - (inH + inM / 60));
    record.workHours = Math.round(hours * 100) / 100;
    record.overtimeHours = Math.max(0, Math.round((record.workHours - this.state.companySettings.standardDailyHours) * 100) / 100);

    this.saveState(this.state);
    return record;
  }

  public addManualAttendance(record: AttendanceRecord, user: UserSession): void {
    if (!record.id) {
      record.id = `ATT-${String(this.state.attendance.length + 1).padStart(4, '0')}`;
    }
    this.state.attendance.push(record);
    this.logAudit(user, 'Attendance', 'CREATE', record.id, `Manual attendance for ${record.employeeId} on ${record.date}`);
    this.saveState(this.state);
  }

  // Leave Management
  public getLeaveApplications(employeeId?: string): LeaveApplication[] {
    if (employeeId) {
      return this.state.leaveApplications.filter((l) => l.employeeId === employeeId);
    }
    return this.state.leaveApplications;
  }

  public getLeaveBalances(employeeId?: string): LeaveBalance[] {
    if (employeeId) {
      return this.state.leaveBalances.filter((b) => b.employeeId === employeeId);
    }
    return this.state.leaveBalances;
  }

  public submitLeaveApplication(app: LeaveApplication, user: UserSession): LeaveApplication {
    if (!app.id) {
      app.id = `LEAVE-${String(this.state.leaveApplications.length + 1).padStart(4, '0')}`;
    }
    this.state.leaveApplications.push(app);

    // Update pending balance
    const balance = this.state.leaveBalances.find(
      (b) => b.employeeId === app.employeeId && b.leaveTypeId === app.leaveTypeId
    );
    if (balance) {
      balance.pendingRequests += app.workingDays;
    }

    this.logAudit(user, 'Leave', 'CREATE', app.id, `Submitted ${app.leaveTypeName} application for ${app.workingDays} working days`);
    this.saveState(this.state);
    return app;
  }

  public reviewLeaveApplication(
    applicationId: string,
    action: 'Approved' | 'Rejected',
    comment: string,
    user: UserSession,
    roleLevel: 'manager' | 'hr'
  ): LeaveApplication | undefined {
    const app = this.state.leaveApplications.find((a) => a.id === applicationId);
    if (!app) return undefined;

    const approvalData = {
      approverId: user.employeeId || user.userId,
      approverName: user.fullName,
      status: action,
      comment,
      actionDate: new Date().toISOString(),
    };

    if (roleLevel === 'manager') {
      app.managerApproval = approvalData;
      if (action === 'Approved') {
        app.status = 'Pending HR';
      } else {
        app.status = 'Rejected';
      }
    } else {
      app.hrApproval = approvalData;
      app.status = action;
    }

    // If final decision
    if (app.status === 'Approved' || app.status === 'Rejected') {
      const balance = this.state.leaveBalances.find(
        (b) => b.employeeId === app.employeeId && b.leaveTypeId === app.leaveTypeId
      );
      if (balance) {
        balance.pendingRequests = Math.max(0, balance.pendingRequests - app.workingDays);
        if (app.status === 'Approved') {
          balance.taken += app.workingDays;
          balance.remainingBalance = Math.max(0, balance.remainingBalance - app.workingDays);
        }
      }
    }

    this.logAudit(user, 'Leave', action === 'Approved' ? 'APPROVE' : 'REJECT', app.id, `Leave ${action} by ${user.fullName}`);
    this.saveState(this.state);
    return app;
  }

  // Loans & Advances
  public getAdvancesAndLoans(employeeId?: string): AdvanceAndLoan[] {
    if (employeeId) {
      return this.state.advancesAndLoans.filter((l) => l.employeeId === employeeId);
    }
    return this.state.advancesAndLoans;
  }

  public addAdvanceOrLoan(loan: AdvanceAndLoan, user: UserSession): void {
    if (!loan.id) {
      loan.id = `LOAN-${String(this.state.advancesAndLoans.length + 1).padStart(4, '0')}`;
    }
    loan.status = 'Active';
    loan.totalRepaid = 0;
    loan.remainingBalance = loan.principalAmount;
    loan.repaymentHistory = [];
    this.state.advancesAndLoans.push(loan);
    this.logAudit(user, 'Loans', 'CREATE', loan.id, `Approved ${loan.type} of NPR ${loan.principalAmount.toLocaleString()} for ${loan.employeeName}`);
    this.saveState(this.state);
  }

  // Payroll Processing
  public getPayrollRuns(): PayrollRun[] {
    return this.state.payrollRuns;
  }

  public getPayrollDetails(runId: string): PayrollDetail[] {
    return this.state.payrollDetails.filter((d) => d.payrollRunId === runId);
  }

  public processMonthlyPayroll(
    monthNepali: string,
    monthGregorian: string,
    fiscalYear: string,
    includeDashainBonus: boolean,
    user: UserSession
  ): { run: PayrollRun; details: PayrollDetail[] } {
    const runId = `PAY-${String(this.state.payrollRuns.length + 1).padStart(4, '0')}`;
    const activeEmployees = this.state.employees.filter((e) => e.employmentStatus === 'Active');

    let totalGross = 0;
    let totalEmpSSF = 0;
    let totalTax = 0;
    let totalOtherDeductions = 0;
    let totalNet = 0;
    let totalEmployerSSF = 0;

    const details: PayrollDetail[] = activeEmployees.map((emp) => {
      const dep = this.state.departments.find((d) => d.id === emp.departmentId)?.name || 'General';
      const des = this.state.designations.find((d) => d.id === emp.designationId)?.title || 'Staff';

      // Earnings
      const basic = emp.basicSalary;
      const dearness = emp.dearnessAllowance || 0;
      const hra = emp.houseRentAllowance || 0;
      const transport = emp.transportAllowance || 0;
      const communication = emp.communicationAllowance || 0;
      const meal = emp.mealAllowance || 0;
      const otherAll = emp.otherAllowances || 0;
      const festivalBonus = includeDashainBonus ? basic : 0; // Dashain bonus is 1 month basic
      const overtime = 0;
      const perfBonus = 0;

      const monthlyGross = basic + dearness + hra + transport + communication + meal + otherAll + overtime + perfBonus;
      const totalMonthEarnings = monthlyGross + festivalBonus;

      // Nepal SSF Calculation
      const ssfRes = calculateNepalSSF({
        basicSalary: basic,
        isEnrolled: emp.isEnrolledInSSF,
      });

      // Nepal Income Tax Calculation
      const taxRes = calculateNepalTax({
        maritalStatus: emp.maritalStatus,
        monthlyGrossSalary: monthlyGross,
        annualBasicSalary: basic * 12,
        isEnrolledInSSF: emp.isEnrolledInSSF,
        isFemaleResidentSoleEmployment: emp.isFemaleSoleEmployment,
        dashainBonusMonths: includeDashainBonus ? 1 : 0,
        remoteAreaCategory: emp.remoteAreaCategory,
      });

      // Loans / Advances deduction
      const activeLoan = this.state.advancesAndLoans.find((l) => l.employeeId === emp.id && l.status === 'Active');
      const loanDeduction = activeLoan ? Math.min(activeLoan.monthlyDeductionAmount, activeLoan.remainingBalance) : 0;

      const unpaidLeaveDeduction = 0;
      const totalEmpDeductions = ssfRes.employeeContribution + taxRes.monthlyTDS + loanDeduction + unpaidLeaveDeduction;
      const netPayable = Math.max(0, totalMonthEarnings - totalEmpDeductions);

      totalGross += totalMonthEarnings;
      totalEmpSSF += ssfRes.employeeContribution;
      totalTax += taxRes.monthlyTDS;
      totalOtherDeductions += loanDeduction + unpaidLeaveDeduction;
      totalNet += netPayable;
      totalEmployerSSF += ssfRes.employerContribution;

      const detail: PayrollDetail = {
        id: `PAYD-${runId}-${emp.id}`,
        payrollRunId: runId,
        employeeId: emp.id,
        employeeName: emp.fullName,
        departmentName: dep,
        designationTitle: des,
        bankName: emp.bankName,
        bankAccountNumber: emp.accountNumber,
        panNumber: emp.panNumber,
        ssfNumber: emp.ssfNumber,
        maritalStatus: emp.maritalStatus,
        totalMonthDays: 30,
        presentDays: 26,
        paidLeaveDays: 0,
        unpaidLeaveDays: 0,
        weeklyOffDays: 4,
        publicHolidayDays: 0,
        payableDays: 30,
        basicSalary: basic,
        dearnessAllowance: dearness,
        houseRentAllowance: hra,
        transportAllowance: transport,
        communicationAllowance: communication,
        mealAllowance: meal,
        otherAllowances: otherAll,
        overtimeAmount: overtime,
        festivalBonusAmount: festivalBonus,
        performanceBonus: perfBonus,
        grossEarnings: totalMonthEarnings,
        isEnrolledInSSF: emp.isEnrolledInSSF,
        employeeSSF: ssfRes.employeeContribution,
        incomeTaxTDS: taxRes.monthlyTDS,
        loanDeduction,
        unpaidLeaveDeduction,
        otherDeductions: 0,
        totalDeductions: totalEmpDeductions,
        netPayableSalary: netPayable,
        employerSSF: ssfRes.employerContribution,
        totalCompanyCost: totalMonthEarnings + ssfRes.employerContribution,
        paymentStatus: 'Pending',
      };

      return detail;
    });

    const run: PayrollRun = {
      id: runId,
      fiscalYear,
      monthNepali,
      monthGregorian,
      status: 'Draft',
      processedAt: new Date().toISOString(),
      totalEmployees: activeEmployees.length,
      totalGrossPayable: Math.round(totalGross),
      totalEmployeeSSF: Math.round(totalEmpSSF),
      totalIncomeTaxTDS: Math.round(totalTax),
      totalOtherDeductions: Math.round(totalOtherDeductions),
      totalNetPayable: Math.round(totalNet),
      totalEmployerSSF: Math.round(totalEmployerSSF),
      notes: includeDashainBonus ? 'Includes 1 month Dashain Festival Bonus' : 'Standard monthly payroll',
    };

    this.state.payrollRuns.unshift(run);
    this.state.payrollDetails.push(...details);

    this.logAudit(user, 'Payroll', 'CREATE', runId, `Generated payroll draft for ${monthNepali} (${fiscalYear}) for ${activeEmployees.length} employees`);
    this.saveState(this.state);

    return { run, details };
  }

  public approveAndLockPayroll(runId: string, user: UserSession): PayrollRun | undefined {
    const run = this.state.payrollRuns.find((r) => r.id === runId);
    if (!run) return undefined;

    run.status = 'Locked';
    run.approvedBy = user.fullName;
    run.approvedAt = new Date().toISOString();

    // Mark details as approved
    const details = this.state.payrollDetails.filter((d) => d.payrollRunId === runId);
    details.forEach((d) => {
      d.paymentStatus = 'Paid';
      d.paymentReference = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

      // Deduct active loan if applied
      if (d.loanDeduction > 0) {
        const loan = this.state.advancesAndLoans.find((l) => l.employeeId === d.employeeId && l.status === 'Active');
        if (loan) {
          loan.totalRepaid += d.loanDeduction;
          loan.remainingBalance = Math.max(0, loan.remainingBalance - d.loanDeduction);
          loan.repaymentHistory.push({
            payrollRunId: runId,
            date: new Date().toISOString().split('T')[0],
            amount: d.loanDeduction,
          });
          if (loan.remainingBalance <= 0) {
            loan.status = 'Completed';
          }
        }
      }
    });

    this.logAudit(user, 'Payroll', 'LOCK', runId, `Approved & locked payroll period ${run.monthNepali} (${run.fiscalYear}). Net disbursement NPR ${run.totalNetPayable.toLocaleString()}`);
    this.saveState(this.state);
    return run;
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }

  private logAudit(
    user: UserSession,
    module: AuditLog['module'],
    action: AuditLog['action'],
    recordId: string,
    details: string
  ) {
    const log: AuditLog = {
      id: `AUD-${String(this.state.auditLogs.length + 1).padStart(4, '0')}`,
      timestamp: new Date().toISOString(),
      userId: user.userId,
      userName: user.fullName,
      userRole: user.role,
      module,
      action,
      recordId,
      details,
    };
    this.state.auditLogs.unshift(log);
  }
}

export const db = new MockDatabaseService();
