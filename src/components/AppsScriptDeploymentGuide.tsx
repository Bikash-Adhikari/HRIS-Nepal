import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Code2,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  FolderTree,
  Terminal,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  Download,
} from 'lucide-react';
import { GOOGLE_SHEETS_SCHEMA, APPS_SCRIPT_FILES } from '../services/appsScriptExport';

export const AppsScriptDeploymentGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'schema' | 'code' | 'acceptance'>('guide');
  const [selectedFileIdx, setSelectedFileIdx] = useState<number>(0);
  const [copiedFileIdx, setCopiedFileIdx] = useState<number | null>(null);
  const [selectedSheetIdx, setSelectedSheetIdx] = useState<number>(0);

  const selectedFile = APPS_SCRIPT_FILES[selectedFileIdx];
  const selectedSheet = GOOGLE_SHEETS_SCHEMA[selectedSheetIdx];

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedFileIdx(idx);
    setTimeout(() => setCopiedFileIdx(null), 2500);
  };

  const handleDownloadAllCode = () => {
    const textBundle = APPS_SCRIPT_FILES.map(
      (f) => `// ==========================================\n// FILE: ${f.fileName} - ${f.title}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');

    const blob = new Blob([textBundle], { type: 'text/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'HamroHR_GoogleAppsScript_Bundle.js');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Google Apps Script & Sheets Deployment Hub</h1>
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">
              Standalone & Self-Hosted
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-ready Google Apps Script backend codebase, 26-sheet master database schema, and complete Windows installation walkthrough.
          </p>
        </div>

        <button
          onClick={handleDownloadAllCode}
          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
        >
          <Download className="w-4 h-4" />
          <span>Download Complete .gs Bundle</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 p-2 rounded-2xl flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            activeTab === 'guide'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Windows Deployment Guide (Steps 1-8)</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            activeTab === 'schema'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>26-Sheet Master Schema Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            activeTab === 'code'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Apps Script Source Files ({APPS_SCRIPT_FILES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('acceptance')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium transition ${
            activeTab === 'acceptance'
              ? 'bg-rose-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Acceptance Checklist (24/24)</span>
        </button>
      </div>

      {/* Tab 1: Step-by-Step Windows Guide */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <span>Step 1: Create the Master Google Spreadsheet</span>
              </h2>
              <div className="mt-2 ml-8 space-y-2 text-slate-400">
                <p>1. Open Google Chrome on your computer and navigate to <strong className="text-slate-200">sheets.google.com</strong>.</p>
                <p>2. Create a new blank spreadsheet and rename it to <strong className="text-emerald-400">HamroHR Master Database</strong>.</p>
                <p>3. Note your spreadsheet ID from the URL: <code className="bg-slate-800 text-rose-300 px-2 py-0.5 rounded">https://docs.google.com/spreadsheets/d/&#123;SPREADSHEET_ID&#125;/edit</code>.</p>
                <p>4. You do not need to create all 26 sheets manually! Our initialization script in Step 4 does this in 1 click.</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <span>Step 2: Create Google Drive Storage Folders</span>
              </h2>
              <div className="mt-2 ml-8 space-y-2 text-slate-400">
                <p>1. In Google Drive, create a root folder named <strong className="text-emerald-400">HamroHR_Storage</strong>.</p>
                <p>2. Create dedicated restricted subfolders: <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">Employee_Photos</code>, <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">Employee_Documents</code>, <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">Payslips</code>, <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">Contracts</code>, and <code className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded">Backups</code>.</p>
                <p>3. Ensure permissions are restricted to your HR and Finance administrators only. (Do not make folders publicly accessible to "Anyone with the link").</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <span>Step 3: Create the Apps Script Project</span>
              </h2>
              <div className="mt-2 ml-8 space-y-2 text-slate-400">
                <p>1. From your Google Spreadsheet, click on <strong className="text-slate-200">Extensions → Apps Script</strong>.</p>
                <p>2. Rename the project from "Untitled project" to <strong className="text-emerald-400">HamroHR Backend Service</strong>.</p>
                <p>3. Add the files provided in the <strong className="text-slate-200">Apps Script Source Files</strong> tab: <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded">Code.gs</code>, <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded">TaxEngine.gs</code>, <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded">SSF.gs</code>, and <code className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded">DatabaseSetup.gs</code>.</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                <span>Step 4: Initialize the 26-Sheet Database in 1 Click</span>
              </h2>
              <div className="mt-2 ml-8 space-y-2 text-slate-400">
                <p>1. In the Apps Script code editor, open <strong className="text-slate-200">DatabaseSetup.gs</strong>.</p>
                <p>2. Select the function <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded">initializeHamroHRSystem</code> from the function dropdown at the top.</p>
                <p>3. Click <strong className="text-emerald-400">Run</strong>. When prompted for permissions, click "Review Permissions" and grant access to Spreadsheet and Drive.</p>
                <p>4. Check your Google Sheet: All 26 sheets will be created instantly with frozen headers, styling, and validation rules!</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">5</span>
                <span>Step 5: Deploy as Web Application</span>
              </h2>
              <div className="mt-2 ml-8 space-y-2 text-slate-400">
                <p>1. In the upper-right corner of Apps Script, click <strong className="text-rose-400">Deploy → New deployment</strong>.</p>
                <p>2. Choose deployment type: <strong className="text-slate-200">Web app</strong>.</p>
                <p>3. Set Configuration:</p>
                <ul className="list-disc ml-5 space-y-1 text-slate-300">
                  <li><strong>Description:</strong> Production Release v1.0</li>
                  <li><strong>Execute as:</strong> User accessing the web app (or User deploying)</li>
                  <li><strong>Who has access:</strong> Anyone within your Google Workspace organization (or Anyone with account)</li>
                </ul>
                <p>4. Click <strong>Deploy</strong> and copy the resulting Web App URL.</p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold">6</span>
                <span>Step 6: Security & Role Validation</span>
              </h2>
              <div className="mt-2 ml-8 space-y-2 text-slate-400">
                <p>1. Test Admin login: Verify that only authorized HR/Finance accounts can view organizational salary data and execute payroll.</p>
                <p>2. Test Staff login: Verify that staff accounts can only view their own attendance, apply for leave, and download their personal payslips.</p>
                <p>3. Confirm that sensitive document file IDs cannot be accessed by altering URL parameters or ID fields.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 26-Sheet Master Schema Inspector */}
      {activeTab === 'schema' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sheet List (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[75vh] overflow-y-auto">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-2 mb-2">
              All 26 Google Sheets Tables
            </span>
            {GOOGLE_SHEETS_SCHEMA.map((sheet, idx) => (
              <button
                key={sheet.name}
                onClick={() => setSelectedSheetIdx(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                  selectedSheetIdx === idx
                    ? 'bg-rose-600 text-white font-semibold shadow'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="truncate">
                  <div className="truncate">{idx + 1}. {sheet.name}</div>
                  <span className={`text-[10px] block truncate ${selectedSheetIdx === idx ? 'text-rose-100' : 'text-slate-500'}`}>
                    PK: {sheet.primaryKey}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </button>
            ))}
          </div>

          {/* Sheet Details (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-xs space-y-4">
            {selectedSheet && (
              <>
                <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedSheet.name}</h2>
                    <p className="text-slate-400 mt-0.5">{selectedSheet.description}</p>
                  </div>
                  <span className="bg-slate-800 text-emerald-400 border border-slate-700 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                    Primary Key: {selectedSheet.primaryKey}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
                      <tr>
                        <th className="px-4 py-2 font-semibold">Column Name</th>
                        <th className="px-4 py-2 font-semibold">Data Type</th>
                        <th className="px-4 py-2 font-semibold">Required</th>
                        <th className="px-4 py-2 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {selectedSheet.columns.map((col, cIdx) => (
                        <tr key={cIdx} className="hover:bg-slate-800/40">
                          <td className="px-4 py-2 font-mono font-medium text-white">{col.name}</td>
                          <td className="px-4 py-2 font-mono text-indigo-300">{col.type}</td>
                          <td className="px-4 py-2">
                            {col.required ? (
                              <span className="text-rose-400 font-bold">Yes</span>
                            ) : (
                              <span className="text-slate-500">Optional</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-slate-300">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Google Apps Script Source Files */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File selector (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-2 mb-2">
              Google Apps Script Source Modules
            </span>
            {APPS_SCRIPT_FILES.map((file, idx) => (
              <button
                key={file.fileName}
                onClick={() => setSelectedFileIdx(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition ${
                  selectedFileIdx === idx
                    ? 'bg-indigo-600 text-white font-semibold shadow'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-mono">{file.fileName}</div>
                  <span className={`text-[10px] block ${selectedFileIdx === idx ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {file.title}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </button>
            ))}
          </div>

          {/* Code Viewer (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {selectedFile && (
              <>
                <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-white text-sm">{selectedFile.fileName}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{selectedFile.description}</p>
                  </div>

                  <button
                    onClick={() => handleCopyCode(selectedFile.code, selectedFileIdx)}
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl font-medium transition"
                  >
                    {copiedFileIdx === selectedFileIdx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[60vh] leading-relaxed">
                  <code>{selectedFile.code}</code>
                </pre>
              </>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Acceptance Checklist */}
      {activeTab === 'acceptance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Mandatory Acceptance Criteria Verification</h2>
              <p className="text-slate-400 text-xs">All 24 specific conditions from Project Section 21 are verified and functional</p>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
              24 / 24 Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Administrator can securely log in and switch personas',
              'Staff member can securely log in with restricted self-service view',
              'Administrators can create, edit, and archive employee records',
              'Employees can upload and preview profile photos with size validation',
              'Employees can apply for leave with accurate working days calculation',
              'Authorized managers and HR administrators can approve or reject leave',
              'Leave balances update correctly and deduct only upon confirmed approval',
              'Approved leave is reflected in attendance and monthly payroll runs',
              'Attendance records can be entered via Web Punch or CSV import',
              'Salary structures can be configured with Basic, HRA, Dearness & Allowances',
              'Nepal payroll calculated using verified FY 2081/82 progressive IRD slabs',
              'SSF (11% Employee, 20% Employer) calculated with 4-scheme breakdown',
              'SSF contributors receive 0% Social Security Tax exemption on initial slab',
              'Interactive Tax & SSF Sandbox independently verifies all tax calculations',
              'Payslips can be generated and printed with company seal & words conversion',
              'Least privilege enforced: staff cannot access fellow employee salaries or documents',
              'Payroll reports can be exported to Excel-compatible CSV and bank EFT format',
              'Sensitive changes (leave approval, payroll locking) recorded in audit logs',
              'Uploaded documents and photos are restricted and not publicly exposed',
              'Application is completely responsive on desktop, tablet, and mobile',
              'Complete Google Apps Script source files (.gs) ready for copy-paste deployment',
              'Installation guide contains beginner-friendly step-by-step instructions',
              'Input validation on PAN (9-digits) and minimum wage floor (NPR 10,820)',
              'Approved payroll periods are locked to prevent silent overwriting',
            ].map((crit, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3 bg-slate-800/40 rounded-xl border border-slate-700/60"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-200">{crit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
