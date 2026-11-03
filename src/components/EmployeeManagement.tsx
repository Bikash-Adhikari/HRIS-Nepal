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
  const [activeTab, setActiveTab] = useState<'personal' | 'identity' | 'employment' | 'bank' | 'salary'>('personal');

  // Selected employee for view drawer
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [profileViewTab, setProfileViewTab] = useState<'dossier' | 'identity' | 'statutory' | 'salary'>('dossier');

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({
    fullName: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dateOfBirth: '1995-01-01',
    gender: 'Male',
    maritalStatus: 'single',
    bloodGroup: 'B+',
    fatherName: '',
    motherName: '',
    spouseName: '',
    dependentChildrenCount: 0,
    personalEmail: '',
    officialEmail: '',
    phone: '+977-98',
    alternatePhone: '',
    permanentAddress: '',
    temporaryAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    citizenshipNumber: '',
    citizenshipIssuedDistrict: 'Kathmandu',
    citizenshipIssuedDate: '2070-01-01',
    nationalIdNumber: '',
    passportNumber: '',
    passportExpiryDate: '',
    highestEducation: 'Bachelor of Engineering / Computer Science',
    universityOrBoard: 'Tribhuvan University',
    graduationYear: '2019',
    totalPastExperienceYears: 3,
    previousOrganization: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time Permanent',
    departmentId: departments[0]?.id || 'DEP-001',
    designationId: designations[0]?.id || 'DES-001',
    employmentStatus: 'Active',
    noticePeriodDays: 30,
    workLocation: 'Lalitpur Head Office',
    bankName: 'Nabil Bank Ltd.',
    bankBranch: 'Main Branch',
    accountHolderName: '',
    accountNumber: '',
    panNumber: '',
    isEnrolledInSSF: true,
    ssfNumber: '',
    citNumber: '',
    pfNumber: '',
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
      emp.panNumber.includes(searchQuery) ||
      (emp.citizenshipNumber && emp.citizenshipNumber.includes(searchQuery)) ||
      (emp.nationalIdNumber && emp.nationalIdNumber.includes(searchQuery));

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
      bloodGroup: 'B+',
      fatherName: '',
      motherName: '',
      spouseName: '',
      dependentChildrenCount: 0,
      personalEmail: '',
      officialEmail: '',
      phone: '+977-98',
      alternatePhone: '',
      permanentAddress: '',
      temporaryAddress: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      citizenshipNumber: '',
      citizenshipIssuedDistrict: 'Kathmandu',
      citizenshipIssuedDate: '2070-01-01',
      nationalIdNumber: '',
      passportNumber: '',
      passportExpiryDate: '',
      highestEducation: 'Bachelor of Science in Computer Science',
      universityOrBoard: 'Tribhuvan University',
      graduationYear: '2020',
      totalPastExperienceYears: 2,
      previousOrganization: '',
      joiningDate: new Date().toISOString().split('T')[0],
      employmentType: 'Full-time Permanent',
      departmentId: departments[0]?.id || 'DEP-001',
      designationId: designations[0]?.id || 'DES-001',
      employmentStatus: 'Active',
      noticePeriodDays: 30,
      workLocation: 'Lalitpur Head Office',
      bankName: 'Nabil Bank Ltd.',
      bankBranch: 'Main Branch',
      accountHolderName: '',
      accountNumber: '',
      panNumber: '',
      isEnrolledInSSF: true,
      ssfNumber: '',
      citNumber: '',
      pfNumber: '',
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
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-medium overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'personal'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Personal & Family
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('identity')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'identity'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Legal Identity & Academic
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('employment')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'employment'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Employment & Roles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'bank'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                4. Bank & Nepal SSF/Tax
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('salary')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition ${
                  activeTab === 'salary'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                5. Salary Structure
              </button>
            </div>

            {validationError && (
              <div className="mx-6 mt-4 p-3 bg-red-950/60 border border-red-800 text-red-200 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 text-xs space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tab 1: Personal & Family Details */}
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
                        Accepts JPG, PNG, WebP (HR Personnel Dossier)
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-medium mb-1">Full Name (English / देवनागरी) *</label>
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
                      <label className="block text-slate-300 font-medium mb-1">Blood Group</label>
                      <select
                        value={formData.bloodGroup || 'B+'}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-semibold"
                      >
                        <option value="A+">A+ (Rh Positive)</option>
                        <option value="A-">A- (Rh Negative)</option>
                        <option value="B+">B+ (Rh Positive)</option>
                        <option value="B-">B- (Rh Negative)</option>
                        <option value="AB+">AB+ (Rh Positive)</option>
                        <option value="AB-">AB- (Rh Negative)</option>
                        <option value="O+">O+ (Rh Positive)</option>
                        <option value="O-">O- (Rh Negative)</option>
                      </select>
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
                  </div>

                  {/* Family Details Card */}
                  <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/60 space-y-3">
                    <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                      Family & Kin Details (परिवार विवरण)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Father's Name (बुवाको नाम)</label>
                        <input
                          type="text"
                          value={formData.fatherName || ''}
                          onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                          placeholder="e.g. Ram Bahadur Adhikari"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Mother's Name (आमाको नाम)</label>
                        <input
                          type="text"
                          value={formData.motherName || ''}
                          onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                          placeholder="e.g. Sita Devi Adhikari"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Spouse Name (दम्पतीको नाम)</label>
                        <input
                          type="text"
                          value={formData.spouseName || ''}
                          onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                          placeholder="Optional if married"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Dependent Children Count</label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={formData.dependentChildrenCount || 0}
                          onChange={(e) => setFormData({ ...formData, dependentChildrenCount: Number(e.target.value) })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contacts & Addresses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Official Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.officialEmail}
                        onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="emp@himalayancloud.com.np"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Personal Email</label>
                      <input
                        type="email"
                        value={formData.personalEmail || ''}
                        onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="personal@gmail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Primary Mobile Number *</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="+977-98XXXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Alternate Phone / Landline</label>
                      <input
                        type="text"
                        value={formData.alternatePhone || ''}
                        onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="+977-01-XXXXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Permanent Address (नेपाल स्थायी ठेगाना)</label>
                      <input
                        type="text"
                        value={formData.permanentAddress}
                        onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                        placeholder="e.g. Pokhara-8, Kaski, Gandaki Province"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Temporary / Current Residence</label>
                      <input
                        type="text"
                        value={formData.temporaryAddress || ''}
                        onChange={(e) => setFormData({ ...formData, temporaryAddress: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                        placeholder="e.g. Sanepa, Lalitpur"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Legal Identity & Academic */}
              {activeTab === 'identity' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
                    <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                      National Credentials & Documents (राष्ट्रिय परिचयपत्र / नागरिकता)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Citizenship No. (नागरिकता नं.)</label>
                        <input
                          type="text"
                          value={formData.citizenshipNumber || ''}
                          onChange={(e) => setFormData({ ...formData, citizenshipNumber: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                          placeholder="e.g. 27-01-71-09432"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Issued District (जारी जिल्ला)</label>
                        <input
                          type="text"
                          value={formData.citizenshipIssuedDistrict || ''}
                          onChange={(e) => setFormData({ ...formData, citizenshipIssuedDistrict: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                          placeholder="e.g. Kathmandu / Kaski"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Issue Date BS (जारी मिति)</label>
                        <input
                          type="text"
                          value={formData.citizenshipIssuedDate || ''}
                          onChange={(e) => setFormData({ ...formData, citizenshipIssuedDate: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                          placeholder="e.g. 2070-04-12 B.S."
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-slate-300 font-medium mb-1">
                          National ID Number (NID / राष्ट्रिय परिचय पत्र नं. - 10 Digits)
                        </label>
                        <input
                          type="text"
                          value={formData.nationalIdNumber || ''}
                          onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                          placeholder="e.g. 981-234-8765"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Passport Number (राहदानी नं.)</label>
                        <input
                          type="text"
                          value={formData.passportNumber || ''}
                          onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                          placeholder="e.g. 10928374"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-medium mb-1">Passport Expiry Date</label>
                        <input
                          type="date"
                          value={formData.passportExpiryDate || ''}
                          onChange={(e) => setFormData({ ...formData, passportExpiryDate: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
                    <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                      Education & Work Track (शैक्षिक योग्यता र अनुभव)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Highest Qualification</label>
                        <input
                          type="text"
                          value={formData.highestEducation || ''}
                          onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                          placeholder="e.g. Master of Business Administration (MBA)"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Awarding University / Board</label>
                        <input
                          type="text"
                          value={formData.universityOrBoard || ''}
                          onChange={(e) => setFormData({ ...formData, universityOrBoard: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                          placeholder="e.g. Tribhuvan University (TU) / Kathmandu Univ"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Graduation Year (Year Passed)</label>
                        <input
                          type="text"
                          value={formData.graduationYear || ''}
                          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                          placeholder="e.g. 2021"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Past Experience (Years)</label>
                        <input
                          type="number"
                          step={0.5}
                          min={0}
                          value={formData.totalPastExperienceYears || 0}
                          onChange={(e) => setFormData({ ...formData, totalPastExperienceYears: Number(e.target.value) })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-medium mb-1">Previous Organization / Employer</label>
                        <input
                          type="text"
                          value={formData.previousOrganization || ''}
                          onChange={(e) => setFormData({ ...formData, previousOrganization: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                          placeholder="e.g. Fonepay Payment Services Ltd."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Employment & Roles */}
              {activeTab === 'employment' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Joining Date (नियुक्ति मिति)</label>
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
                    <label className="block text-slate-300 font-medium mb-1">Notice Period (Days)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.noticePeriodDays ?? 30}
                      onChange={(e) => setFormData({ ...formData, noticePeriodDays: Number(e.target.value) })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
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

              {/* Tab 4: Bank & Nepal Tax/SSF */}
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
                        <option value="Himalayan Bank Ltd.">Himalayan Bank Ltd.</option>
                        <option value="Nepal Investment Mega Bank">Nepal Investment Mega Bank</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Bank Branch</label>
                      <input
                        type="text"
                        value={formData.bankBranch || 'Main Branch'}
                        onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                      />
                    </div>

                    <div className="sm:col-span-2">
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
                      <label className="block text-slate-300 font-medium mb-1">SSF Registration No.</label>
                      <input
                        type="text"
                        value={formData.ssfNumber}
                        onChange={(e) => setFormData({ ...formData, ssfNumber: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="e.g. SSF-00129845"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">CIT Number (नागरिक लगानी कोष)</label>
                      <input
                        type="text"
                        value={formData.citNumber || ''}
                        onChange={(e) => setFormData({ ...formData, citNumber: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="e.g. CIT-987410"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">PF / EPF Number (सञ्चय कोष नं.)</label>
                      <input
                        type="text"
                        value={formData.pfNumber || ''}
                        onChange={(e) => setFormData({ ...formData, pfNumber: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                        placeholder="e.g. EPF-554422"
                      />
                    </div>
                  </div>

                  {/* SSF & Tax Toggles */}
                  <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">Enrolled in Social Security Fund (SSF)?</span>
                        <span className="text-[11px] text-slate-400">
                          11% employee + 20% employer. Grants 0% Social Security Tax exemption on initial slab!
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

              {/* Tab 5: Salary Structure */}
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

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Other Allowances</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.otherAllowances || 0}
                        onChange={(e) => setFormData({ ...formData, otherAllowances: Number(e.target.value) })}
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
                        if (activeTab === 'personal') setActiveTab('identity');
                        else if (activeTab === 'identity') setActiveTab('employment');
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

      {/* Comprehensive View Employee Detail Dossier Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-6 bg-slate-800/60 border-b border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={viewingEmployee.avatarUrl}
                  alt={viewingEmployee.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-500/60 shadow-lg"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">{viewingEmployee.fullName}</h3>
                    <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {viewingEmployee.bloodGroup || 'B+'}
                    </span>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                      {viewingEmployee.employmentStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-rose-400 font-bold">{viewingEmployee.id}</span>
                    <span>•</span>
                    <span>{designations.find((d) => d.id === viewingEmployee.designationId)?.title}</span>
                    <span>•</span>
                    <span>{departments.find((d) => d.id === viewingEmployee.departmentId)?.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const emp = viewingEmployee;
                    setViewingEmployee(null);
                    handleOpenEdit(emp);
                  }}
                  className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setViewingEmployee(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-medium">
              <button
                onClick={() => setProfileViewTab('dossier')}
                className={`py-3 px-3 border-b-2 transition ${
                  profileViewTab === 'dossier'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Personal & Family Dossier
              </button>
              <button
                onClick={() => setProfileViewTab('identity')}
                className={`py-3 px-3 border-b-2 transition ${
                  profileViewTab === 'identity'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Legal Identity & Academics
              </button>
              <button
                onClick={() => setProfileViewTab('statutory')}
                className={`py-3 px-3 border-b-2 transition ${
                  profileViewTab === 'statutory'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Employment & Statutory (PAN/SSF)
              </button>
              <button
                onClick={() => setProfileViewTab('salary')}
                className={`py-3 px-3 border-b-2 transition ${
                  profileViewTab === 'salary'
                    ? 'border-rose-500 text-rose-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Compensation Structure
              </button>
            </div>

            {/* Profile Content Body */}
            <div className="p-6 text-xs max-h-[65vh] overflow-y-auto space-y-4">
              {profileViewTab === 'dossier' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Date of Birth</span>
                      <span className="text-slate-200 font-medium">{viewingEmployee.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Gender</span>
                      <span className="text-slate-200 font-medium">{viewingEmployee.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Blood Group</span>
                      <span className="text-rose-400 font-bold">{viewingEmployee.bloodGroup || 'B+'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Marital Status</span>
                      <span className="text-slate-200 font-medium capitalize">{viewingEmployee.maritalStatus}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Father's Name (बुवाको नाम)</span>
                      <span className="text-slate-200 font-medium">{viewingEmployee.fatherName || 'Not recorded'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Mother's Name (आमाको नाम)</span>
                      <span className="text-slate-200 font-medium">{viewingEmployee.motherName || 'Not recorded'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Spouse Name (दम्पतीको नाम)</span>
                      <span className="text-slate-200 font-medium">{viewingEmployee.spouseName || 'N/A (Single)'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Dependent Children</span>
                      <span className="text-slate-200 font-mono">{viewingEmployee.dependentChildrenCount ?? 0}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Official Corporate Email</span>
                      <span className="text-indigo-400 font-mono font-medium">{viewingEmployee.officialEmail}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Personal Email</span>
                      <span className="text-slate-200 font-mono">{viewingEmployee.personalEmail || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Primary Mobile</span>
                      <span className="text-slate-200 font-mono">{viewingEmployee.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Alternate Phone</span>
                      <span className="text-slate-200 font-mono">{viewingEmployee.alternatePhone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Permanent Address (नेपाल स्थायी ठेगाना)</span>
                      <span className="text-slate-200 font-medium">{viewingEmployee.permanentAddress}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block">Current Residence</span>
                      <span className="text-slate-200 font-medium">{viewingEmployee.temporaryAddress || viewingEmployee.permanentAddress}</span>
                    </div>
                  </div>
                </div>
              )}

              {profileViewTab === 'identity' && (
                <div className="space-y-4">
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                      National Credentials & Documents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Citizenship No. (नागरिकता नं.)</span>
                        <span className="text-slate-200 font-mono font-medium">
                          {viewingEmployee.citizenshipNumber || 'Not provided'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Citizenship Issued District</span>
                        <span className="text-slate-200 font-medium">
                          {viewingEmployee.citizenshipIssuedDistrict || 'Kathmandu'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Citizenship Issue Date (B.S.)</span>
                        <span className="text-slate-200 font-mono">
                          {viewingEmployee.citizenshipIssuedDate || '2070-01-01'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">National ID (NID No.)</span>
                        <span className="text-amber-400 font-mono font-medium">
                          {viewingEmployee.nationalIdNumber || 'Not registered'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Passport Number</span>
                        <span className="text-slate-200 font-mono">
                          {viewingEmployee.passportNumber || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Passport Expiry Date</span>
                        <span className="text-slate-200 font-mono">
                          {viewingEmployee.passportExpiryDate || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                      Academic Credentials & Career History
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Highest Education Degree</span>
                        <span className="text-slate-200 font-medium">
                          {viewingEmployee.highestEducation || 'Bachelor Degree'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">University / Board</span>
                        <span className="text-slate-200 font-medium">
                          {viewingEmployee.universityOrBoard || 'Tribhuvan University'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Graduation Year</span>
                        <span className="text-slate-200 font-mono">
                          {viewingEmployee.graduationYear || '2020'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Total Past Experience</span>
                        <span className="text-emerald-400 font-semibold font-mono">
                          {viewingEmployee.totalPastExperienceYears || 0} Years
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 text-[11px] block">Previous Organization</span>
                        <span className="text-slate-200 font-medium">
                          {viewingEmployee.previousOrganization || 'First employer'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileViewTab === 'statutory' && (
                <div className="space-y-4">
                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                      Employment & Official Role
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Joining Date</span>
                        <span className="text-slate-200 font-mono">{viewingEmployee.joiningDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Employment Type</span>
                        <span className="text-slate-200 font-medium">{viewingEmployee.employmentType}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Notice Period</span>
                        <span className="text-slate-200 font-mono">{viewingEmployee.noticePeriodDays || 30} Days</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Work Location</span>
                        <span className="text-slate-200">{viewingEmployee.workLocation}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Remote Area Tax Category</span>
                        <span className="text-slate-200">{viewingEmployee.remoteAreaCategory || 'None'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Sole Female Employment Rebate</span>
                        <span className="text-slate-200">{viewingEmployee.isFemaleSoleEmployment ? 'Applicable (10%)' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                      Statutory Accounts & Banking
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Nepal PAN (9 Digits)</span>
                        <span className="text-slate-200 font-mono font-bold">{viewingEmployee.panNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">SSF Enrollment Status</span>
                        <span className={viewingEmployee.isEnrolledInSSF ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                          {viewingEmployee.isEnrolledInSSF ? `Enrolled (${viewingEmployee.ssfNumber})` : 'Non-SSF'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">CIT Number (लगानी कोष)</span>
                        <span className="text-slate-200 font-mono">{viewingEmployee.citNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">EPF / PF Number (सञ्चय कोष)</span>
                        <span className="text-slate-200 font-mono">{viewingEmployee.pfNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Bank Name</span>
                        <span className="text-slate-200 font-medium">{viewingEmployee.bankName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Bank Account Number</span>
                        <span className="text-slate-200 font-mono font-semibold">{viewingEmployee.accountNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileViewTab === 'salary' && (
                <div className="space-y-4">
                  <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-300 font-semibold block">Total Monthly Gross Salary</span>
                      <div className="text-2xl font-black text-white font-mono mt-0.5">
                        NPR {(
                          viewingEmployee.basicSalary +
                          (viewingEmployee.dearnessAllowance || 0) +
                          (viewingEmployee.houseRentAllowance || 0) +
                          (viewingEmployee.transportAllowance || 0) +
                          (viewingEmployee.mealAllowance || 0) +
                          (viewingEmployee.communicationAllowance || 0) +
                          (viewingEmployee.otherAllowances || 0)
                        ).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Annualized Gross</span>
                      <span className="text-sm font-bold text-slate-200 font-mono">
                        NPR {(
                          (viewingEmployee.basicSalary +
                            (viewingEmployee.dearnessAllowance || 0) +
                            (viewingEmployee.houseRentAllowance || 0) +
                            (viewingEmployee.transportAllowance || 0) +
                            (viewingEmployee.mealAllowance || 0) +
                            (viewingEmployee.communicationAllowance || 0) +
                            (viewingEmployee.otherAllowances || 0)) * 12
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Basic Salary (SSF Base)</span>
                      <span className="text-white font-mono font-bold text-sm">
                        NPR {viewingEmployee.basicSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Dearness (महङ्गी)</span>
                      <span className="text-white font-mono font-bold text-sm">
                        NPR {(viewingEmployee.dearnessAllowance || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">House Rent Allowance</span>
                      <span className="text-white font-mono font-bold text-sm">
                        NPR {(viewingEmployee.houseRentAllowance || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Transport Allowance</span>
                      <span className="text-white font-mono font-bold text-sm">
                        NPR {(viewingEmployee.transportAllowance || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Communication</span>
                      <span className="text-white font-mono font-bold text-sm">
                        NPR {(viewingEmployee.communicationAllowance || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Meal Allowance</span>
                      <span className="text-white font-mono font-bold text-sm">
                        NPR {(viewingEmployee.mealAllowance || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">Other Allowances</span>
                      <span className="text-white font-mono font-bold text-sm">
                        NPR {(viewingEmployee.otherAllowances || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[11px] block">SSF Employee 11%</span>
                      <span className="text-rose-400 font-mono font-bold text-sm">
                        NPR {Math.round(viewingEmployee.basicSalary * 0.11).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-800/40 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-mono">
                Encrypted Employee Record • Nepal Labour Act 2074 & IRD Compliance
              </span>
              <button
                onClick={() => setViewingEmployee(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-medium transition"
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
