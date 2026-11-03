import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  Save,
  AlertCircle,
} from 'lucide-react';
import { CompanySettings, UserSession } from '../types/hris';

interface SettingsProps {
  settings: CompanySettings;
  onUpdateSettings: (settings: CompanySettings) => void;
  currentUser: UserSession;
}

export const SettingsAndComplianceModule: React.FC<SettingsProps> = ({
  settings,
  onUpdateSettings,
  currentUser,
}) => {
  const [formData, setFormData] = useState<CompanySettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-white tracking-tight">Organization Profile & Statutory Configuration</h1>
          <span className="bg-rose-950 text-rose-300 border border-rose-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
            Admin Controlled
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure company registration numbers, Nepal PAN & SSF employer credentials, working hours, and fiscal calendar.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-200 rounded-xl text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Company settings and compliance parameters updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Identity */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-rose-400" />
            <span>Company Legal Registration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Registered Name</label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Registration No. (OCR)</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Nepal PAN (9 Digits)</label>
              <input
                type="text"
                maxLength={9}
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">SSF Employer Registration Code</label>
              <input
                type="text"
                value={formData.ssfEmployerCode}
                onChange={(e) => setFormData({ ...formData, ssfEmployerCode: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Registered Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Working Hours & Calendar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-xs space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Working Calendar & Office Timing</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Current Fiscal Year</label>
              <select
                value={formData.currentFiscalYear}
                onChange={(e) => setFormData({ ...formData, currentFiscalYear: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="2081/82">2081/82 BS (Current)</option>
                <option value="2080/81">2080/81 BS</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Office Start Time</label>
              <input
                type="time"
                value={formData.officeStartTime}
                onChange={(e) => setFormData({ ...formData, officeStartTime: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Office End Time</label>
              <input
                type="time"
                value={formData.officeEndTime}
                onChange={(e) => setFormData({ ...formData, officeEndTime: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Working Days Per Week</label>
              <select
                value={formData.workingDaysPerWeek}
                onChange={(e) => setFormData({ ...formData, workingDaysPerWeek: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value={6}>6 Days / Week (Saturday Weekend - Standard)</option>
                <option value={5}>5 Days / Week (Friday & Saturday)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Standard Daily Work Hours</label>
              <input
                type="number"
                min={4}
                max={12}
                value={formData.standardDailyHours}
                onChange={(e) => setFormData({ ...formData, standardDailyHours: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-md shadow-rose-950/40 transition text-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
