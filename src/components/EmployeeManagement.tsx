import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Camera,
  Shield,
  CreditCard,
  Building2,
  Briefcase,
  FileText,
  Check,
  X,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Employee, Department, Designation, UserSession } from '../types/hris';
import { STATUTORY_MIN_WAGE_NEPAL } from '../lib/nepalSSFEngine';

interface EmployeeManagementProps {
  employees: Employee[];
  departments: Department[];
  designations: Designation[];
  currentUser: UserSession;
  onSaveEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  departments,
  designations,
  currentUser,
  onSaveEmployee,
  onDeleteEmployee,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'bank' | 'salary'>('personal');

  // Selected employee for view drawer
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    fullName: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '1995-01-01',
    gender: 'Male',
    maritalStatus: 'single',
    personalEmail: '',
    officialEmail: '',
    phone: '+977-98',
    permanentAddress: '',
    temporaryAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    citizenshipNumber: '',
    citizenshipIssuedDistrict: 'Kathmandu',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time Permanent',
    departmentId: departments[0]?.id || 'DEP-001',
    designationId: designations[0]?.id || 'DES-001',
    employmentStatus: 'Active',
    workLocation: 'Lalitpur Head Office',
    bankName: 'Nabil Bank Ltd.',
    bankBranch: 'Main Branch',
    accountHolderName: '',
    accountNumber: '',
    panNumber: '',
    isEnrolledInSSF: true,
    ssfNumber: '',
    remoteAreaCategory: 'None',
    isFemaleSoleEmployment: false,
    basicSalary: 35000,
    dearnessAllowance: 4000,
    houseRentAllowance: 10000,
    transportAllowance: 3500,
    communicationAllowance: 2000,
    mealAllowance: 3000,
    otherAllowances: 1000,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.officialEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.panNumber.includes(searchQuery);

    const matchesDept = selectedDept === 'ALL' || emp.departmentId === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.employmentStatus === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      fullName: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dateOfBirth: '1995-01-01',
      gender: 'Male',
      maritalStatus: 'single',
      personalEmail: '',
      officialEmail: '',
      phone: '+977-98',
      permanentAddress: '',
      temporaryAddress: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      citizenshipNumber: '',
      citizenshipIssuedDistrict: 'Kathmandu',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-time Permanent',
      departmentId: departments[0]?.id || 'DEP-001',
      designationId: designations[0]?.id || 'DES-001',
      employmentStatus: 'Active',
      workLocation: 'Lalitpur Head Office',
      bankName: 'Nabil Bank Ltd.',
      bankBranch: 'Main Branch',
      accountHolderName: '',
      accountNumber: '',
      panNumber: '',
      isEnrolledInSSF: true,
      ssfNumber: '',
      remoteAreaCategory: 'None',
      isFemaleSoleEmployment: false,
      basicSalary: 35000,
      dearnessAllowance: 4000,
      houseRentAllowance: 10000,
      transportAllowance: 3500,
      communicationAllowance: 2000,
      mealAllowance: 3000,
      otherAllowances: 1000,
    });
    setValidationError(null);
    setActiveTab('personal');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setFormData({ ...emp });
    setValidationError(null);
    setActiveTab('personal');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setValidationError('Invalid file type. Only JPG, PNG, and WebP are accepted.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setValidationError('Image size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatarUrl: event.target?.result as string }));
        setValidationError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.officialEmail) {
      setValidationError('Full Name and Official Email are required.');
      return;
    }
    if (formData.panNumber && !/^\d{9}$/.test(formData.panNumber.trim())) {
      setValidationError('Nepal PAN must be a valid 9-digit number.');
      return;
    }
    if ((formData.basicSalary || 0) < 10000) {
      setValidationError(`Basic Salary must be at least NPR 10,820 (Nepal statutory minimum basic wage).`);
      return;
    }

    onSaveEmployee(formData as Employee);
    setIsModalOpen(false);
  };

  const totalMonthlyGross =
    (formData.basicSalary || 0) +
    (formData.dearnessAllowance || 0) +
    (formData.houseRentAllowance || 0) +
    (formData.transportAllowance || 0) +
    (formData.communicationAllowance || 0) +
    (formData.mealAllowance || 0) +
    (formData.otherAllowances || 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Employee Master Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage comprehensive personnel records, PAN, SSF enrollment, and salary structures.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Employee ID, Name, Official Email, or PAN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Notice Period">Notice Period</option>
            <option value="Terminated">Terminated</option>
            <option value="Resigned">Resigned</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Department & Role</th>
                <th className="px-4 py-3 font-semibold">Nepal PAN & SSF</th>
                <th className="px-4 py-3 font-semibold">Basic / Gross Salary</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEmployees.map((emp) => {
                const dept = departments.find((d) => d.id === emp.departmentId)?.name || 'General';
                const desig = designations.find((d) => d.id === emp.designationId)?.title || 'Staff';
                const gross =
                  emp.basicSalary +
                  (emp.dearnessAllowance || 0) +
                  (emp.houseRentAllowance || 0) +
                  (emp.transportAllowance || 0) +
                  (emp.mealAllowance || 0) +
                  (emp.communicationAllowance || 0) +
                  (emp.otherAllowances || 0);

                return (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white">{emp.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                            <span>{emp.id}</span>
                            <span>•</span>
                            <span>{emp.officialEmail}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">{desig}</div>
                      <div className="text-[11px] text-slate-400">{dept}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-mono text-slate-300">PAN: {emp.panNumber || 'N/A'}</span>
                      </div>
                      <div className="text-[10px] mt-0.5">
                        {emp.isEnrolledInSSF ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <Check className="w-3 h-3 inline" /> SSF Enrolled ({emp.ssfNumber})
                          </span>
                        ) : (
                          <span className="text-amber-400">Non-SSF (1% SST)</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200 font-mono">
                        NPR {emp.basicSalary.toLocaleString()} (Basic)
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono">
                        NPR {gross.toLocaleString()} (Gross)
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          emp.employmentStatus === 'Active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : emp.employmentStatus === 'On Leave'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {emp.employmentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setViewingEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="View Employee Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition"
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to archive ${emp.fullName}?`)) {
                              onDeleteEmployee(emp.id);
                            }
                          }}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition"
                          title="Archive Employee"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">
                  {editingId ? `Edit Employee (${editingId})` : 'Onboard New Employee'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`py-3 px-3 border-b-2 transition ${
                  activeTab === 'personal'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Personal Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employment')}
                className={`py-3 px-3 border-b-2 transition ${
                  activeTab === 'employment'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Employment & Roles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`py-3 px-3 border-b-2 transition ${
                  activeTab === 'bank'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Bank & Nepal Tax/SSF
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('salary')}
                className={`py-3 px-3 border-b-2 transition ${
                  activeTab === 'salary'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                4. Salary Structure
              </button>
            </div>

            {validationError && (
              <div className="mx-6 mt-4 p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 text-xs space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tab 1: Personal Details */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  {/* Photo Upload Section */}
                  <div className="flex items-center space-x-4 p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                    <img
                      src={formData.avatarUrl}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-500/50"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">Profile Photo</span>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Accepts JPG, PNG, WebP (Restricted Google Drive Storage)
                      </p>
                      <label className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border border-slate-700 transition">
                        <Camera className="w-3.5 h-3.5 text-rose-400" />
                        <span>Choose Photo</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                        placeholder="e.g. Bikash Adhikari"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Marital Status (For Tax Slabs)</label>
                      <select
                        value={formData.maritalStatus}
                        onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      >
                        <option value="single">Single (NPR 500k base slab)</option>
                        <option value="couple">Couple / Married (NPR 600k base slab)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Official Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.officialEmail}
                        onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                        placeholder="emp@himalayancloud.com.np"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="+977-98XXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Permanent Address (Nepal)</label>
                      <input
                        type="text"
                        value={formData.permanentAddress}
                        onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                        placeholder="Municipality, Ward, District, Province"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Citizenship Certificate No.</label>
                      <input
                        type="text"
                        value={formData.citizenshipNumber}
                        onChange={(e) => setFormData({ ...formData, citizenshipNumber: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="e.g. 27-01-71-09432"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Employment & Roles */}
              {activeTab === 'employment' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Joining Date</label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as any })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value="Full-time Permanent">Full-time Permanent</option>
                      <option value="Probation">Probation (3-6 Months)</option>
                      <option value="Contract">Fixed-term Contract</option>
                      <option value="Trainee/Intern">Trainee / Intern</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Department</label>
                    <select
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Designation</label>
                    <select
                      value={formData.designationId}
                      onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    >
                      {designations.map((des) => (
                        <option key={des.id} value={des.id}>
                          {des.title} ({des.gradeLevel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Employment Status</label>
                    <select
                      value={formData.employmentStatus}
                      onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Notice Period">Notice Period</option>
                      <option value="Resigned">Resigned</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Work Location</label>
                    <input
                      type="text"
                      value={formData.workLocation}
                      onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      placeholder="e.g. Lalitpur Head Office"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Bank & Nepal Tax/SSF */}
              {activeTab === 'bank' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Bank Name</label>
                      <select
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      >
                        <option value="Nabil Bank Ltd.">Nabil Bank Ltd.</option>
                        <option value="NIC Asia Bank Ltd.">NIC Asia Bank Ltd.</option>
                        <option value="Global IME Bank Ltd.">Global IME Bank Ltd.</option>
                        <option value="Everest Bank Ltd.">Everest Bank Ltd.</option>
                        <option value="Sanima Bank Ltd.">Sanima Bank Ltd.</option>
                        <option value="Standard Chartered Nepal">Standard Chartered Nepal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Bank Account Number</label>
                      <input
                        type="text"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="e.g. 01901017500234"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Nepal PAN Number (9 Digits) *</label>
                      <input
                        type="text"
                        maxLength={9}
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="e.g. 109283746"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">SSF Number</label>
                      <input
                        type="text"
                        value={formData.ssfNumber}
                        onChange={(e) => setFormData({ ...formData, ssfNumber: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="e.g. SSF-00129845"
                      />
                    </div>
                  </div>

                  {/* SSF & Tax Toggles */}
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Enrolled in Social Security Fund (SSF)?</span>
                        <span className="text-[11px] text-slate-400">
                          11% employee + 20% employer. Also grants 0% Social Security Tax exemption on initial slab!
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.isEnrolledInSSF}
                        onChange={(e) => setFormData({ ...formData, isEnrolledInSSF: e.target.checked })}
                        className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-700/60 pt-3">
                      <div>
                        <span className="font-semibold text-white block">Female Resident Sole Employment?</span>
                        <span className="text-[11px] text-slate-400">
                          Grants 10% tax rebate under Section 51 of Nepal Income Tax Act 2058.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.isFemaleSoleEmployment}
                        onChange={(e) => setFormData({ ...formData, isFemaleSoleEmployment: e.target.checked })}
                        className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Salary Structure */}
              {activeTab === 'salary' && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-300 font-semibold">Total Monthly Gross Salary</span>
                      <div className="text-xl font-black text-white font-mono mt-0.5">
                        NPR {totalMonthlyGross.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      Annualized Gross: NPR {(totalMonthlyGross * 12).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Basic Salary (NPR) * <span className="text-slate-500">(SSF Base)</span>
                      </label>
                      <input
                        type="number"
                        min={10820}
                        required
                        value={formData.basicSalary}
                        onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Dearness Allowance (महङ्गी भत्ता)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.dearnessAllowance}
                        onChange={(e) => setFormData({ ...formData, dearnessAllowance: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">House Rent Allowance (घरभाडा भत्ता)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.houseRentAllowance}
                        onChange={(e) => setFormData({ ...formData, houseRentAllowance: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Transport Allowance (यातायात भत्ता)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.transportAllowance}
                        onChange={(e) => setFormData({ ...formData, transportAllowance: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Communication Allowance</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.communicationAllowance}
                        onChange={(e) => setFormData({ ...formData, communicationAllowance: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Meal / Food Allowance</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.mealAllowance}
                        onChange={(e) => setFormData({ ...formData, mealAllowance: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-2">
                  {activeTab !== 'salary' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'personal') setActiveTab('employment');
                        else if (activeTab === 'employment') setActiveTab('bank');
                        else if (activeTab === 'bank') setActiveTab('salary');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-medium transition"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-xl font-semibold shadow-md shadow-rose-950/40 transition"
                    >
                      {editingId ? 'Update Employee' : 'Confirm & Save to Google Sheets'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Detail Modal / Drawer */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative">
            <button
              onClick={() => setViewingEmployee(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 pb-4 border-b border-slate-800">
              <img
                src={viewingEmployee.avatarUrl}
                alt={viewingEmployee.fullName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-rose-500/50"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{viewingEmployee.fullName}</h3>
                <span className="text-xs text-slate-400 font-mono">{viewingEmployee.id} • {viewingEmployee.officialEmail}</span>
                <div className="mt-1">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    {viewingEmployee.employmentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
              <div>
                <span className="text-slate-400 block">Department:</span>
                <span className="text-slate-200 font-medium">
                  {departments.find((d) => d.id === viewingEmployee.departmentId)?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Designation:</span>
                <span className="text-slate-200 font-medium">
                  {designations.find((d) => d.id === viewingEmployee.designationId)?.title}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Nepal PAN:</span>
                <span className="text-slate-200 font-mono">{viewingEmployee.panNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">SSF Enrollment:</span>
                <span className="text-emerald-400 font-medium">
                  {viewingEmployee.isEnrolledInSSF ? `Active (${viewingEmployee.ssfNumber})` : 'Not enrolled'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Bank Account:</span>
                <span className="text-slate-200 font-mono">{viewingEmployee.bankName} ({viewingEmployee.accountNumber})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Monthly Basic / Gross:</span>
                <span className="text-emerald-400 font-mono font-semibold">
                  NPR {viewingEmployee.basicSalary.toLocaleString()} Basic
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setViewingEmployee(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-medium"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
