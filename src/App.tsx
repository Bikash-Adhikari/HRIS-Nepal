import React, { useState, useEffect } from 'react';
import { db } from './services/mockDatabase';
import {
  UserSession,
  Employee,
  AttendanceRecord,
  LeaveApplication,
  LeaveBalance,
  PayrollRun,
  PayrollDetail,
  AdvanceAndLoan,
  CompanySettings,
} from './types/hris';
import { Header, PRESET_USERS } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { StaffDashboard } from './components/StaffDashboard';
import { EmployeeManagement } from './components/EmployeeManagement';
import { AttendanceModule } from './components/AttendanceModule';
import { LeaveModule } from './components/LeaveModule';
import { PayrollModule } from './components/PayrollModule';
import { LoansModule } from './components/LoansModule';
import { TaxCalculatorSimulator } from './components/TaxCalculatorSimulator';
import { ReportsModule } from './components/ReportsModule';
import { AuditLogsModule } from './components/AuditLogsModule';
import { AppsScriptDeploymentGuide } from './components/AppsScriptDeploymentGuide';
import { SettingsAndComplianceModule } from './components/SettingsAndComplianceModule';
import { PayslipModal } from './components/PayslipModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession>(PRESET_USERS[0]);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('admin_dashboard');

  // Database reactive state
  const [dbState, setDbState] = useState(db.getState());

  // Modal triggers
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [viewingPayslipDetail, setViewingPayslipDetail] = useState<PayrollDetail | null>(null);

  const refreshState = () => {
    setDbState({ ...db.getState() });
  };

  const handleSwitchUser = (user: UserSession) => {
    setCurrentUser(user);
    if (user.role === 'staff') {
      setCurrentTab('staff_dashboard');
    } else {
      setCurrentTab('admin_dashboard');
    }
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset the HRIS database to original demonstration state?')) {
      const fresh = db.resetToDefault();
      setDbState({ ...fresh });
    }
  };

  // Handlers
  const handleSaveEmployee = (emp: Employee) => {
    const existing = db.getEmployeeById(emp.id);
    if (existing) {
      db.updateEmployee(emp, currentUser);
    } else {
      db.addEmployee(emp, currentUser);
    }
    refreshState();
  };

  const handleDeleteEmployee = (id: string) => {
    db.deleteEmployee(id, currentUser);
    refreshState();
  };

  const handleCheckIn = (employeeId: string) => {
    db.checkIn(employeeId);
    refreshState();
  };

  const handleCheckOut = (employeeId: string) => {
    db.checkOut(employeeId);
    refreshState();
  };

  const handleAddManualAttendance = (record: AttendanceRecord) => {
    db.addManualAttendance(record, currentUser);
    refreshState();
  };

  const handleSubmitLeave = (app: LeaveApplication) => {
    db.submitLeaveApplication(app, currentUser);
    refreshState();
  };

  const handleReviewLeave = (
    id: string,
    action: 'Approved' | 'Rejected',
    comment: string,
    roleLevel: 'manager' | 'hr'
  ) => {
    db.reviewLeaveApplication(id, action, comment, currentUser, roleLevel);
    refreshState();
  };

  const handleAddLoan = (loan: AdvanceAndLoan) => {
    db.addAdvanceOrLoan(loan, currentUser);
    refreshState();
  };

  const handleProcessPayroll = (
    monthNepali: string,
    monthGregorian: string,
    fiscalYear: string,
    includeDashainBonus: boolean
  ) => {
    db.processMonthlyPayroll(monthNepali, monthGregorian, fiscalYear, includeDashainBonus, currentUser);
    refreshState();
  };

  const handleApproveAndLockPayroll = (runId: string) => {
    db.approveAndLockPayroll(runId, currentUser);
    refreshState();
  };

  const handleUpdateSettings = (settings: CompanySettings) => {
    db.updateCompanySettings(settings, currentUser);
    refreshState();
  };

  const pendingLeavesCount = dbState.leaveApplications.filter(
    (l) => l.status === 'Pending Manager' || l.status === 'Pending HR'
  ).length;

  const currentEmployeeRecord = dbState.employees.find((e) => e.id === currentUser.employeeId) || dbState.employees[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header with Role Switcher & Apps Script Link */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onResetData={handleResetData}
        activeFiscalYear={dbState.companySettings.currentFiscalYear}
        onNavigateToDeployment={() => setCurrentTab('deployment_guide')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          userRole={currentUser.role}
          pendingLeaveCount={pendingLeavesCount}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Admin Dashboard */}
            {currentTab === 'admin_dashboard' && (
              <AdminDashboard
                employees={dbState.employees}
                attendance={dbState.attendance}
                leaveApplications={dbState.leaveApplications}
                payrollRuns={dbState.payrollRuns}
                onNavigate={setCurrentTab}
                onOpenNewEmployeeModal={() => setIsNewEmployeeModalOpen(true)}
                onOpenPayrollModal={() => setIsPayrollModalOpen(true)}
              />
            )}

            {/* Staff Dashboard */}
            {currentTab === 'staff_dashboard' && (
              <StaffDashboard
                currentEmployee={currentEmployeeRecord}
                attendance={dbState.attendance}
                leaveBalances={dbState.leaveBalances}
                leaveApplications={dbState.leaveApplications}
                holidays={dbState.holidays}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onApplyLeave={() => setIsApplyLeaveModalOpen(true)}
                onViewPayslip={(detail) => setViewingPayslipDetail(detail)}
                onNavigateTab={setCurrentTab}
              />
            )}

            {/* Employee Management */}
            {currentTab === 'employees' && (
              <EmployeeManagement
                employees={dbState.employees}
                departments={dbState.departments}
                designations={dbState.designations}
                currentUser={currentUser}
                onSaveEmployee={handleSaveEmployee}
                onDeleteEmployee={handleDeleteEmployee}
                isModalOpen={isNewEmployeeModalOpen}
                setIsModalOpen={setIsNewEmployeeModalOpen}
              />
            )}

            {/* Attendance Module */}
            {currentTab === 'attendance' && (
              <AttendanceModule
                attendance={dbState.attendance}
                employees={dbState.employees}
                currentUser={currentUser}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onAddManualAttendance={handleAddManualAttendance}
              />
            )}

            {/* Leave Module */}
            {currentTab === 'leaves' && (
              <LeaveModule
                leaveApplications={dbState.leaveApplications}
                leaveBalances={dbState.leaveBalances}
                leaveTypes={dbState.leaveTypes}
                employees={dbState.employees}
                holidays={dbState.holidays}
                currentUser={currentUser}
                onSubmitLeave={handleSubmitLeave}
                onReviewLeave={handleReviewLeave}
                isApplyModalOpen={isApplyLeaveModalOpen}
                setIsApplyModalOpen={setIsApplyLeaveModalOpen}
              />
            )}

            {/* Payroll Module */}
            {currentTab === 'payroll' && (
              <PayrollModule
                payrollRuns={dbState.payrollRuns}
                employees={dbState.employees}
                currentUser={currentUser}
                onProcessPayroll={handleProcessPayroll}
                onApproveAndLockPayroll={handleApproveAndLockPayroll}
                onViewPayslip={(detail) => setViewingPayslipDetail(detail)}
                getPayrollDetails={(runId) => db.getPayrollDetails(runId)}
                isPayrollModalOpen={isPayrollModalOpen}
                setIsPayrollModalOpen={setIsPayrollModalOpen}
              />
            )}

            {/* Advances & Loans */}
            {currentTab === 'loans' && (
              <LoansModule
                advancesAndLoans={dbState.advancesAndLoans}
                employees={dbState.employees}
                currentUser={currentUser}
                onAddLoan={handleAddLoan}
              />
            )}

            {/* Interactive Tax & SSF Simulator */}
            {currentTab === 'tax_simulator' && <TaxCalculatorSimulator />}

            {/* Reports & Exports */}
            {currentTab === 'reports' && (
              <ReportsModule
                employees={dbState.employees}
                attendance={dbState.attendance}
                leaveBalances={dbState.leaveBalances}
                payrollRuns={dbState.payrollRuns}
                getPayrollDetails={(runId) => db.getPayrollDetails(runId)}
                currentUser={currentUser}
              />
            )}

            {/* Audit Logs */}
            {currentTab === 'audit_logs' && <AuditLogsModule logs={dbState.auditLogs} />}

            {/* Google Apps Script & Sheets Hub */}
            {currentTab === 'deployment_guide' && <AppsScriptDeploymentGuide />}

            {/* Settings & Compliance */}
            {currentTab === 'settings' && (
              <SettingsAndComplianceModule
                settings={dbState.companySettings}
                onUpdateSettings={handleUpdateSettings}
                currentUser={currentUser}
              />
            )}
          </div>
        </main>
      </div>

      {/* Official Payslip Modal */}
      {viewingPayslipDetail && (
        <PayslipModal
          detail={viewingPayslipDetail}
          companySettings={dbState.companySettings}
          onClose={() => setViewingPayslipDetail(null)}
        />
      )}
    </div>
  );
}
