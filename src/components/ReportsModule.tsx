import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Filter,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  CalendarDays,
  Shield,
  Eye,
  TrendingUp,
  Percent,
  AlertCircle,
} from 'lucide-react';
import {
  Employee,
  AttendanceRecord,
  LeaveBalance,
  PayrollRun,
  PayrollDetail,
  UserSession,
} from '../types/hris';
import { calculateNepalTax } from '../lib/nepalTaxEngine';

interface ReportsModuleProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveBalances: LeaveBalance[];
  payrollRuns: PayrollRun[];
  getPayrollDetails: (runId: string) => PayrollDetail[];
  currentUser: UserSession;
  onViewPayslip?: (detail: PayrollDetail) => void;
  onViewTaxSlip?: (detail: PayrollDetail, mode?: 'monthly' | 'annual') => void;
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  employees,
  attendance,
  leaveBalances,
  payrollRuns,
  getPayrollDetails,
  currentUser,
  onViewPayslip,
  onViewTaxSlip,
}) => {
  const [selectedReportType, setSelectedReportType] = useState<
    'employee_all_detail' | 'leave_report' | 'annual_tax_slip' | 'payroll_register' | 'ssf_schedule'
  >('employee_all_detail');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterLeaveType, setFilterLeaveType] = useState('ALL');

  const latestRun = payrollRuns[0];
  const payrollDetails = latestRun ? getPayrollDetails(latestRun.id) : [];

  // Filtered lists
  const filteredEmployees = employees.filter((e) => {
    const matchesSearch =
      e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.panNumber.includes(searchQuery) ||
      (e.citizenshipNumber && e.citizenshipNumber.includes(searchQuery)) ||
      (e.nationalIdNumber && e.nationalIdNumber.includes(searchQuery));
    const matchesDept = filterDept === 'ALL' || e.departmentId === filterDept;
    return matchesSearch && matchesDept;
  });

  const filteredLeaveBalances = leaveBalances.filter((b) => {
    const emp = employees.find((e) => e.id === b.employeeId);
    const matchesSearch =
      b.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp && emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterLeaveType === 'ALL' || b.leaveTypeId === filterLeaveType;
    const matchesDept = filterDept === 'ALL' || (emp && emp.departmentId === filterDept);
    return matchesSearch && matchesType && matchesDept;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `HamroHR_Report_${selectedReportType}.csv`;

    if (selectedReportType === 'employee_all_detail') {
      headers = [
        'Employee ID',
        'Full Name',
        'Blood Group',
        'Date of Birth',
        'Gender',
        'Marital Status',
        'Father Name',
        'Mother Name',
        'Spouse Name',
        'Dependent Children',
        'Official Email',
        'Personal Email',
        'Mobile Phone',
        'Alternate Phone',
        'Permanent Address',
        'Temporary Address',
        'Citizenship Number',
        'Citizenship District',
        'Citizenship Issue Date (BS)',
        'National ID (NID No)',
        'Passport Number',
        'Passport Expiry',
        'Highest Education',
        'University / Board',
        'Graduation Year',
        'Total Past Experience (Yrs)',
        'Previous Organization',
        'Department ID',
        'Designation ID',
        'Employment Type',
        'Employment Status',
        'Joining Date',
        'Notice Period (Days)',
        'Work Location',
        'Bank Name',
        'Bank Branch',
        'Bank Account Number',
        'Nepal PAN (9 Digits)',
        'SSF Enrolled',
        'SSF Number',
        'CIT Number',
        'PF Number',
        'Basic Salary (SSF Base)',
        'Dearness Allowance',
        'House Rent Allowance',
        'Transport Allowance',
        'Communication Allowance',
        'Meal Allowance',
        'Other Allowances',
        'Monthly Gross Salary',
      ];
      rows = filteredEmployees.map((e) => {
        const gross =
          e.basicSalary +
          (e.dearnessAllowance || 0) +
          (e.houseRentAllowance || 0) +
          (e.transportAllowance || 0) +
          (e.communicationAllowance || 0) +
          (e.mealAllowance || 0) +
          (e.otherAllowances || 0);

        return [
          e.id,
          `"${e.fullName}"`,
          `"${e.bloodGroup || 'B+'}"`,
          e.dateOfBirth,
          e.gender,
          e.maritalStatus,
          `"${e.fatherName || ''}"`,
          `"${e.motherName || ''}"`,
          `"${e.spouseName || ''}"`,
          e.dependentChildrenCount ?? 0,
          `"${e.officialEmail}"`,
          `"${e.personalEmail || ''}"`,
          `"${e.phone}"`,
          `"${e.alternatePhone || ''}"`,
          `"${e.permanentAddress}"`,
          `"${e.temporaryAddress || ''}"`,
          `"${e.citizenshipNumber || ''}"`,
          `"${e.citizenshipIssuedDistrict || ''}"`,
          `"${e.citizenshipIssuedDate || ''}"`,
          `"${e.nationalIdNumber || ''}"`,
          `"${e.passportNumber || ''}"`,
          `"${e.passportExpiryDate || ''}"`,
          `"${e.highestEducation || ''}"`,
          `"${e.universityOrBoard || ''}"`,
          `"${e.graduationYear || ''}"`,
          e.totalPastExperienceYears || 0,
          `"${e.previousOrganization || ''}"`,
          e.departmentId,
          e.designationId,
          `"${e.employmentType}"`,
          e.employmentStatus,
          e.joiningDate,
          e.noticePeriodDays || 30,
          `"${e.workLocation}"`,
          `"${e.bankName}"`,
          `"${e.bankBranch || 'Main Branch'}"`,
          `"${e.accountNumber}"`,
          `"${e.panNumber}"`,
          e.isEnrolledInSSF ? 'YES' : 'NO',
          `"${e.ssfNumber || ''}"`,
          `"${e.citNumber || ''}"`,
          `"${e.pfNumber || ''}"`,
          e.basicSalary,
          e.dearnessAllowance || 0,
          e.houseRentAllowance || 0,
          e.transportAllowance || 0,
          e.communicationAllowance || 0,
          e.mealAllowance || 0,
          e.otherAllowances || 0,
          gross,
        ];
      });
    } else if (selectedReportType === 'leave_report') {
      headers = [
        'Employee ID',
        'Employee Name',
        'Leave Type',
        'Fiscal Year',
        'Annual Entitlement (Labour Act 2074)',
        'Opening Balance',
        'Taken (Days)',
        'Pending Requests',
        'Remaining Balance',
        'Utilization (%)',
      ];
      rows = filteredLeaveBalances.map((b) => {
        const emp = employees.find((e) => e.id === b.employeeId);
        const utilization =
          b.annualEntitlement > 0 ? Math.round((b.taken / b.annualEntitlement) * 100) : 0;
        return [
          b.employeeId,
          `"${emp?.fullName || b.employeeId}"`,
          `"${b.leaveTypeName}"`,
          b.fiscalYear,
          b.annualEntitlement,
          b.annualEntitlement,
          b.taken,
          b.pendingRequests,
          b.remainingBalance,
          `${utilization}%`,
        ];
      });
    } else if (selectedReportType === 'annual_tax_slip') {
      headers = [
        'Employee ID',
        'Employee Name',
        'Nepal PAN',
        'Marital Status',
        'SSF Enrolled',
        'Annual Gross Salary',
        'SSF Relief (Sec 63)',
        'CIT/EPF Relief',
        'Insurance Relief',
        'Taxable Income',
        'Slab 1 (1%/0%)',
        'Slab 2 (10%)',
        'Slab 3 (20%)',
        'Slab 4 (30%)',
        'Slab 5 (36%)',
        'Slab 6 (39%)',
        'Female Sole Rebate (10%)',
        'Total Annual Tax Due',
        'Monthly TDS Rate',
      ];
      rows = filteredEmployees.map((e) => {
        const gross =
          e.basicSalary +
          (e.dearnessAllowance || 0) +
          (e.houseRentAllowance || 0) +
          (e.transportAllowance || 0) +
          (e.communicationAllowance || 0) +
          (e.mealAllowance || 0) +
          (e.otherAllowances || 0);

        const res = calculateNepalTax({
          maritalStatus: e.maritalStatus,
          monthlyGrossSalary: gross,
          annualBasicSalary: e.basicSalary * 12,
          isEnrolledInSSF: e.isEnrolledInSSF,
          isFemaleResidentSoleEmployment: e.isFemaleSoleEmployment ?? false,
          dashainBonusMonths: 1,
          lifeInsurancePremiumAnnual: 25000,
          remoteAreaCategory: e.remoteAreaCategory ?? 'None',
        });

        return [
          e.id,
          `"${e.fullName}"`,
          `"${e.panNumber}"`,
          e.maritalStatus,
          res.grossAnnualIncome,
          res.retirementContributionDeduction,
          res.totalAllowableDeductions - res.retirementContributionDeduction,
          res.lifeInsuranceDeduction,
          res.taxableIncome,
          res.slabs[0]?.taxAmount || 0,
          res.slabs[1]?.taxAmount || 0,
          res.slabs[2]?.taxAmount || 0,
          res.slabs[3]?.taxAmount || 0,
          res.slabs[4]?.taxAmount || 0,
          res.slabs[5]?.taxAmount || 0,
          res.femaleRebateAmount,
          res.netAnnualTaxLiability,
          res.monthlyTDS,
        ];
      });
    } else if (selectedReportType === 'payroll_register') {
      headers = [
        'Employee ID',
        'Full Name',
        'Department',
        'Basic Salary',
        'Allowances',
        'Gross Earnings',
        'Employee SSF (11%)',
        'Income Tax TDS',
        'Loan Deductions',
        'Net Payable Salary',
        'Employer SSF (20%)',
        'Total CTC',
      ];
      rows = payrollDetails.map((d) => [
        d.employeeId,
        `"${d.employeeName}"`,
        `"${d.departmentName}"`,
        d.basicSalary,
        d.grossEarnings - d.basicSalary,
        d.grossEarnings,
        d.employeeSSF,
        d.incomeTaxTDS,
        d.loanDeduction,
        d.netPayableSalary,
        d.employerSSF,
        d.totalCompanyCost,
      ]);
    } else {
      headers = [
        'SSF Registration No',
        'Employee ID',
        'Employee Name',
        'Basic Salary (Contribution Base)',
        'Employee Contribution (11%)',
        'Employer Contribution (20%)',
        'Total SSF Remittance (31%)',
      ];
      rows = payrollDetails
        .filter((d) => d.isEnrolledInSSF)
        .map((d) => [
          `"${d.ssfNumber || ''}"`,
          d.employeeId,
          `"${d.employeeName}"`,
          d.basicSalary,
          d.employeeSSF,
          d.employerSSF,
          d.employeeSSF + d.employerSSF,
        ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Statutory Reports & Regulatory Filings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Export compliant records for Nepal IRD (Income Tax Section 87/88), SSF Remittances, and Master Employee Dossiers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV / Excel</span>
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setSelectedReportType('employee_all_detail')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'employee_all_detail'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employee All Detail Report</span>
        </button>

        <button
          onClick={() => setSelectedReportType('leave_report')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'leave_report'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Leave Utilization & Balances Report</span>
        </button>

        <button
          onClick={() => setSelectedReportType('annual_tax_slip')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'annual_tax_slip'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Annual Tax & TDS Statements (Annex 10)</span>
        </button>

        <button
          onClick={() => setSelectedReportType('payroll_register')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'payroll_register'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Monthly Payroll Register</span>
        </button>

        <button
          onClick={() => setSelectedReportType('ssf_schedule')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            selectedReportType === 'ssf_schedule'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>SSF 31% Remittance Schedule</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search report records by Employee ID, Name, PAN, NID, or Citizenship..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Departments</option>
            <option value="DEP-001">Engineering & Tech</option>
            <option value="DEP-002">Human Resources</option>
            <option value="DEP-003">Finance & Compliance</option>
            <option value="DEP-004">Client Success & Ops</option>
          </select>

          {selectedReportType === 'leave_report' && (
            <select
              value={filterLeaveType}
              onChange={(e) => setFilterLeaveType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Leave Types</option>
              <option value="LT-001">Home / Annual Leave</option>
              <option value="LT-002">Sick Leave</option>
              <option value="LT-003">Mourning / Kriya Leave</option>
              <option value="LT-004">Maternity Leave</option>
            </select>
          )}
        </div>
      </div>

      {/* REPORT VIEW 1: Employee All Detail Report */}
      {selectedReportType === 'employee_all_detail' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                <span>Master Employee Dossier Report (मास्टर कर्मचारी सम्पूर्ण विवरण प्रतिवेदन)</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Displaying all statutory, citizenship, blood group, academic, banking, and remuneration records ({filteredEmployees.length} records).
              </p>
            </div>
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-xl text-xs font-mono font-medium border border-slate-700">
              Active FY: 2081/82
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Blood & Kin</th>
                  <th className="px-4 py-3 font-semibold">Citizenship & NID</th>
                  <th className="px-4 py-3 font-semibold">Education & Career</th>
                  <th className="px-4 py-3 font-semibold">Employment & Notice</th>
                  <th className="px-4 py-3 font-semibold">Banking & PAN/SSF</th>
                  <th className="px-4 py-3 font-semibold">Monthly Gross</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEmployees.map((emp) => {
                  const gross =
                    emp.basicSalary +
                    (emp.dearnessAllowance || 0) +
                    (emp.houseRentAllowance || 0) +
                    (emp.transportAllowance || 0) +
                    (emp.communicationAllowance || 0) +
                    (emp.mealAllowance || 0) +
                    (emp.otherAllowances || 0);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={emp.avatarUrl}
                            alt={emp.fullName}
                            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-white">{emp.fullName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {emp.id} • {emp.officialEmail}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">{emp.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1.5">
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {emp.bloodGroup || 'B+'}
                          </span>
                          <span className="text-slate-300 capitalize">{emp.maritalStatus}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Father: <span className="text-slate-200">{emp.fatherName || 'N/A'}</span>
                        </div>
                        {emp.spouseName && (
                          <div className="text-[10px] text-slate-400">
                            Spouse: <span className="text-slate-200">{emp.spouseName}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-200 text-[11px]">
                          Citiz: {emp.citizenshipNumber || 'N/A'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {emp.citizenshipIssuedDistrict || 'Kathmandu'} ({emp.citizenshipIssuedDate || '2070-01-01'})
                        </div>
                        <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                          NID: {emp.nationalIdNumber || 'Not registered'}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{emp.highestEducation || 'Bachelor Degree'}</div>
                        <div className="text-[11px] text-slate-400">
                          {emp.universityOrBoard || 'Tribhuvan University'} ({emp.graduationYear || '2020'})
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
                          Past Exp: {emp.totalPastExperienceYears || 0} Yrs ({emp.previousOrganization || 'First Org'})
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{emp.employmentType}</div>
                        <div className="text-[11px] text-slate-400">
                          Joined: {emp.joiningDate} • Notice: {emp.noticePeriodDays || 30}d
                        </div>
                        <div className="mt-1">
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                            {emp.employmentStatus}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-200 text-[11px]">PAN: {emp.panNumber}</div>
                        <div className="text-[10px]">
                          {emp.isEnrolledInSSF ? (
                            <span className="text-emerald-400">SSF: {emp.ssfNumber}</span>
                          ) : (
                            <span className="text-amber-400">Non-SSF (1% SST)</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {emp.bankName} (***{emp.accountNumber.slice(-4)})
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-mono font-bold text-emerald-400">
                          NPR {gross.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Basic: NPR {emp.basicSalary.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT VIEW 2: Leave Utilization & Balance Report */}
      {selectedReportType === 'leave_report' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-rose-400" />
                <span>Statutory Leave Balances & Utilization Report (बिदा उपयोग प्रतिवेदन)</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Statutory annual entitlements as per Nepal Labour Act 2074: Home Leave (1 day per 20 days worked), Sick Leave (12 days fully paid).
              </p>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-xl text-xs font-mono font-medium">
              Fiscal Year: 2081/82
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Leave Category</th>
                  <th className="px-4 py-3 font-semibold text-center">Entitlement</th>
                  <th className="px-4 py-3 font-semibold text-center">Taken</th>
                  <th className="px-4 py-3 font-semibold text-center">Pending</th>
                  <th className="px-4 py-3 font-semibold text-center">Remaining Balance</th>
                  <th className="px-4 py-3 font-semibold">Utilization Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLeaveBalances.map((bal) => {
                  const emp = employees.find((e) => e.id === bal.employeeId);
                  const utilPercent =
                    bal.annualEntitlement > 0
                      ? Math.min(100, Math.round((bal.taken / bal.annualEntitlement) * 100))
                      : 0;

                  return (
                    <tr key={`${bal.employeeId}-${bal.leaveTypeId}`} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{emp?.fullName || bal.employeeId}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{bal.employeeId}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{bal.leaveTypeName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">FY {bal.fiscalYear}</div>
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-medium text-slate-300">
                        {bal.annualEntitlement} Days
                      </td>

                      <td className="px-4 py-3 text-center font-mono font-semibold text-rose-400">
                        {bal.taken} Days
                      </td>

                      <td className="px-4 py-3 text-center font-mono text-amber-300">
                        {bal.pendingRequests} Days
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800">
                          {bal.remainingBalance} Days Left
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                            <div
                              className={`h-full rounded-full ${
                                utilPercent > 75
                                  ? 'bg-rose-500'
                                  : utilPercent > 40
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${utilPercent}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-slate-300">{utilPercent}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT VIEW 3: Annual Tax Statements (Annex 10) */}
      {selectedReportType === 'annual_tax_slip' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-400" />
                <span>Annual Tax & TDS Statements (आन्तरिक राजस्व विभाग - अनुसूची १० प्रतिवेदन)</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Full annual progressive slab breakdown, SSF Sec 63 deductions, and female sole employment rebates. Click any employee to view their Annex-10 slip.
              </p>
            </div>
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-xl text-xs font-mono font-medium">
              Nepal Finance Act 2081/82
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee & PAN</th>
                  <th className="px-4 py-3 font-semibold">Marital & SSF</th>
                  <th className="px-4 py-3 font-semibold">Annual Gross</th>
                  <th className="px-4 py-3 font-semibold">Tax Deductible Relief</th>
                  <th className="px-4 py-3 font-semibold">Taxable Income</th>
                  <th className="px-4 py-3 font-semibold">Annual Tax Due</th>
                  <th className="px-4 py-3 font-semibold">Monthly TDS</th>
                  <th className="px-4 py-3 font-semibold text-right">Tax Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredEmployees.map((emp) => {
                  const gross =
                    emp.basicSalary +
                    (emp.dearnessAllowance || 0) +
                    (emp.houseRentAllowance || 0) +
                    (emp.transportAllowance || 0) +
                    (emp.communicationAllowance || 0) +
                    (emp.mealAllowance || 0) +
                    (emp.otherAllowances || 0);

                  const taxRes = calculateNepalTax({
                    maritalStatus: emp.maritalStatus,
                    monthlyGrossSalary: gross,
                    annualBasicSalary: emp.basicSalary * 12,
                    isEnrolledInSSF: emp.isEnrolledInSSF,
                    isFemaleResidentSoleEmployment: emp.isFemaleSoleEmployment ?? false,
                    dashainBonusMonths: 1,
                    lifeInsurancePremiumAnnual: 25000,
                    remoteAreaCategory: emp.remoteAreaCategory ?? 'None',
                  });

                  // Construct synthetic payroll detail for modal
                  const syntheticDetail: PayrollDetail = {
                    id: `PAYD-ANNUAL-${emp.id}`,
                    payrollRunId: 'PAY-0001',
                    employeeId: emp.id,
                    employeeName: emp.fullName,
                    departmentName: emp.departmentId,
                    designationTitle: emp.designationId,
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
                    basicSalary: emp.basicSalary,
                    dearnessAllowance: emp.dearnessAllowance || 0,
                    houseRentAllowance: emp.houseRentAllowance || 0,
                    transportAllowance: emp.transportAllowance || 0,
                    communicationAllowance: emp.communicationAllowance || 0,
                    mealAllowance: emp.mealAllowance || 0,
                    otherAllowances: emp.otherAllowances || 0,
                    overtimeAmount: 0,
                    festivalBonusAmount: 0,
                    performanceBonus: 0,
                    grossEarnings: gross,
                    isEnrolledInSSF: emp.isEnrolledInSSF,
                    employeeSSF: Math.round(emp.basicSalary * 0.11),
                    incomeTaxTDS: taxRes.monthlyTDS,
                    loanDeduction: 0,
                    unpaidLeaveDeduction: 0,
                    otherDeductions: 0,
                    totalDeductions: Math.round(emp.basicSalary * 0.11) + taxRes.monthlyTDS,
                    netPayableSalary: gross - (Math.round(emp.basicSalary * 0.11) + taxRes.monthlyTDS),
                    employerSSF: Math.round(emp.basicSalary * 0.20),
                    totalCompanyCost: gross + Math.round(emp.basicSalary * 0.20),
                    paymentStatus: 'Paid',
                  };

                  return (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{emp.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {emp.id} • PAN: {emp.panNumber}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="text-slate-200 capitalize font-medium">{emp.maritalStatus}</div>
                        <div className="text-[10px]">
                          {emp.isEnrolledInSSF ? (
                            <span className="text-emerald-400">SSF 0% base exemption</span>
                          ) : (
                            <span className="text-amber-400">Non-SSF 1% SST</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono font-medium text-slate-200">
                        NPR {taxRes.grossAnnualIncome.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono text-indigo-300">
                        NPR {taxRes.totalAllowableDeductions.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono font-semibold text-slate-100">
                        NPR {taxRes.taxableIncome.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-rose-400">
                        NPR {taxRes.netAnnualTaxLiability.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 font-mono font-semibold text-emerald-400">
                        NPR {taxRes.monthlyTDS.toLocaleString()}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onViewTaxSlip && onViewTaxSlip(syntheticDetail, 'annual')}
                            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-medium transition"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Annex 10</span>
                          </button>
                          <button
                            onClick={() => onViewTaxSlip && onViewTaxSlip(syntheticDetail, 'monthly')}
                            className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1 rounded-lg text-[11px] font-medium transition"
                          >
                            <span>TDS</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT VIEW 4: Monthly Payroll Register */}
      {selectedReportType === 'payroll_register' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                <span>Monthly Payroll Register & Payslip Central (मासिक तलब दर्ता तथा भरपाई)</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Comprehensive disbursement register showing SSF 11%/20%, Section 87 TDS deductions, and Net Take-home pay.
              </p>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-xl text-xs font-mono font-medium">
              Run: {latestRun?.monthNepali || 'Ashwin 2081'}
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Basic / Gross</th>
                  <th className="px-4 py-3 font-semibold">Employee SSF (11%)</th>
                  <th className="px-4 py-3 font-semibold">Income Tax TDS</th>
                  <th className="px-4 py-3 font-semibold">Net Payable Salary</th>
                  <th className="px-4 py-3 font-semibold">Employer SSF (20%)</th>
                  <th className="px-4 py-3 font-semibold text-right">Slips & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payrollDetails.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{d.employeeName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {d.employeeId} • {d.departmentName}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="text-slate-200">NPR {d.basicSalary.toLocaleString()} (Basic)</div>
                      <div className="text-emerald-400 text-[11px]">NPR {d.grossEarnings.toLocaleString()} (Gross)</div>
                    </td>

                    <td className="px-4 py-3 font-mono text-amber-300">
                      NPR {d.employeeSSF.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 font-mono text-rose-400">
                      NPR {d.incomeTaxTDS.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-sm">
                      NPR {d.netPayableSalary.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 font-mono text-indigo-300">
                      NPR {d.employerSSF.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onViewPayslip && onViewPayslip(d)}
                          className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-500 text-white px-2 py-1 rounded-lg text-[11px] font-medium transition"
                          title="View Full Monthly Payslip"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Payslip</span>
                        </button>
                        <button
                          onClick={() => onViewTaxSlip && onViewTaxSlip(d, 'monthly')}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2 py-1 rounded-lg text-[11px] font-medium transition"
                          title="View Monthly TDS Slip"
                        >
                          Tax Slip
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT VIEW 5: SSF Remittance Schedule */}
      {selectedReportType === 'ssf_schedule' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Social Security Fund (SSF) Remittance Schedule (सामाजिक सुरक्षा कोष विवरण)</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Official 31% remittance schedule (11% Employee + 20% Employer contribution on statutory basic wages) for SSF Portal upload.
              </p>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-xl text-xs font-mono font-medium">
              SSF Act 2074
            </span>
          </div>

          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">SSF Registration No.</th>
                  <th className="px-4 py-3 font-semibold">Employee ID & Name</th>
                  <th className="px-4 py-3 font-semibold">Basic Wage (Base)</th>
                  <th className="px-4 py-3 font-semibold">Employee 11%</th>
                  <th className="px-4 py-3 font-semibold">Employer 20%</th>
                  <th className="px-4 py-3 font-semibold">Total Remittance (31%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payrollDetails
                  .filter((d) => d.isEnrolledInSSF)
                  .map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-slate-100">
                        {d.ssfNumber || 'SSF-NOT-ASSIGNED'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{d.employeeName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{d.employeeId}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-slate-200">
                        NPR {d.basicSalary.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-amber-300">
                        NPR {d.employeeSSF.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-indigo-300">
                        NPR {d.employerSSF.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 text-sm">
                        NPR {(d.employeeSSF + d.employerSSF).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
