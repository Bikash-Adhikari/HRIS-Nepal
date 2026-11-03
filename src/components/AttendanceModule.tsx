import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  FileSpreadsheet,
  Search,
  Filter,
  Check,
  X,
} from 'lucide-react';
import { AttendanceRecord, Employee, UserSession } from '../types/hris';

interface AttendanceModuleProps {
  attendance: AttendanceRecord[];
  employees: Employee[];
  currentUser: UserSession;
  onCheckIn: (employeeId: string) => void;
  onCheckOut: (employeeId: string) => void;
  onAddManualAttendance: (record: AttendanceRecord) => void;
}

export const AttendanceModule: React.FC<AttendanceModuleProps> = ({
  attendance,
  employees,
  currentUser,
  onCheckIn,
  onCheckOut,
  onAddManualAttendance,
}) => {
  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'hr_admin';
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Manual Form State
  const [manualRecord, setManualRecord] = useState<Partial<AttendanceRecord>>({
    employeeId: employees[0]?.id || '',
    date: selectedDate,
    checkInTime: '09:00:00',
    checkOutTime: '17:00:00',
    status: 'Present',
    workHours: 8.0,
    overtimeHours: 0,
    source: 'Admin Manual',
    remarks: 'Approved by HR',
  });

  const filteredRecords = attendance.filter((rec) => {
    // If staff, only show their own
    if (!isAdmin && rec.employeeId !== currentUser.employeeId) {
      return false;
    }
    const emp = employees.find((e) => e.id === rec.employeeId);
    const matchesSearch =
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp && emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRecord.employeeId) return;

    onAddManualAttendance(manualRecord as AttendanceRecord);
    setIsManualModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Attendance & Time Tracking</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time biometric punch logs, office geofence verification, and monthly work-hours reconciliation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {isAdmin && (
            <>
              <button
                onClick={() => setIsCsvModalOpen(true)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Import Biometric CSV</span>
              </button>
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Manual Attendance Entry</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Employee ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Employee</th>
                <th className="px-4 py-3 font-semibold">Check In</th>
                <th className="px-4 py-3 font-semibold">Check Out</th>
                <th className="px-4 py-3 font-semibold">Work Hours</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRecords.map((rec) => {
                const emp = employees.find((e) => e.id === rec.employeeId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono text-slate-300">{rec.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={emp?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={emp?.fullName || rec.employeeId}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-white">{emp?.fullName || rec.employeeId}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{rec.employeeId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-medium">{rec.checkInTime}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {rec.checkOutTime || <span className="text-amber-400 text-[11px]">In Progress</span>}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-white">
                      {rec.workHours} hrs
                      {rec.overtimeHours > 0 && (
                        <span className="text-purple-400 ml-1 text-[11px]">(+{rec.overtimeHours} OT)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.status === 'Present'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : rec.status === 'Late'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{rec.source}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Add Attendance Entry</h3>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Employee</label>
                <select
                  value={manualRecord.employeeId}
                  onChange={(e) => setManualRecord({ ...manualRecord, employeeId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={manualRecord.date}
                  onChange={(e) => setManualRecord({ ...manualRecord, date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Check In Time</label>
                  <input
                    type="time"
                    value={manualRecord.checkInTime}
                    onChange={(e) => setManualRecord({ ...manualRecord, checkInTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Check Out Time</label>
                  <input
                    type="time"
                    value={manualRecord.checkOutTime}
                    onChange={(e) => setManualRecord({ ...manualRecord, checkOutTime: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Status</label>
                <select
                  value={manualRecord.status}
                  onChange={(e) => setManualRecord({ ...manualRecord, status: e.target.value as any })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late Arrival</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl font-semibold shadow"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                <span>Import Biometric Machine CSV</span>
              </h3>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-slate-300">
                Upload raw export from your office biometric device (ZKTeco, Realtime, or Anviz). The system automatically parses employee IDs and calculates late arrivals based on office start time.
              </p>

              <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span className="text-slate-300 font-medium block">Drop .csv attendance file here</span>
                <span className="text-[11px] text-slate-500">Columns: EmployeeId, Date, CheckIn, CheckOut</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 font-mono text-[11px] text-slate-300">
                <span className="text-slate-500 block mb-1">Expected CSV Sample:</span>
                EMP-0001,2026-11-03,09:02:11,17:05:00<br />
                EMP-0002,2026-11-03,08:58:30,17:15:20
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert('Sample CSV imported successfully! 5 employee punch logs merged.');
                    setIsCsvModalOpen(false);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-semibold shadow"
                >
                  Simulate Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
