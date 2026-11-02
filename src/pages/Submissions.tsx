import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  Eye,
  Filter,
  X,
  Code2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Submission, SubmissionStatus, ProgrammingLanguage } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Submissions: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [languageFilter, setLanguageFilter] = useState<string>('All');

  // Modal to inspect full code
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [user]);

  async function loadSubmissions() {
    setLoading(true);
    try {
      const res = await api.getSubmissions();
      setSubmissions(res.submissions);
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = submissions.filter(s => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (languageFilter !== 'All' && s.language !== languageFilter) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F3F5F2] tracking-tight flex items-center gap-2.5">
            <FileCheck2 className="w-7 h-7 text-[#69D5C5]" /> Submission History
          </h1>
          <p className="text-xs md:text-sm text-[#929B9C] mt-1">
            Complete record of your code submissions, execution runtimes, memory diagnostics, and statuses.
          </p>
        </div>

        <div className="text-xs font-mono text-[#929B9C] bg-[#151A1E] px-3.5 py-1.5 rounded-xl border border-[#252C2E]">
          {submissions.length} Total Submissions
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-3 bg-[#151A1E] p-3 rounded-2xl border border-[#252C2E]">
        <div className="flex items-center gap-2 text-xs text-[#929B9C]">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#1A2024] border border-[#252C2E] rounded-xl px-3 py-1.5 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
        >
          <option value="All">All Verdicts</option>
          <option value="Accepted">Accepted</option>
          <option value="Wrong Answer">Wrong Answer</option>
          <option value="Time Limit Exceeded">Time Limit Exceeded</option>
          <option value="Runtime Error">Runtime Error</option>
          <option value="Compilation Error">Compilation Error</option>
        </select>

        <select
          value={languageFilter}
          onChange={e => setLanguageFilter(e.target.value)}
          className="bg-[#1A2024] border border-[#252C2E] rounded-xl px-3 py-1.5 text-xs text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
        >
          <option value="All">All Languages</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#151A1E] border border-[#252C2E] overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-mono uppercase text-[#929B9C] bg-[#111417]">
          <div className="col-span-2">Verdict</div>
          <div className="col-span-4">Problem</div>
          <div className="col-span-2 text-center">Language</div>
          <div className="col-span-2 text-center hidden md:block">Runtime & Memory</div>
          <div className="col-span-2 text-right">Date & Inspect</div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#929B9C]">Loading submission records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#929B9C]">
            No submissions found matching selected filters.
          </div>
        ) : (
          <div className="divide-y divide-[#252C2E]">
            {filtered.map(sub => (
              <div
                key={sub.id}
                className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-[#1A2024]/60 transition-colors text-xs"
              >
                {/* Verdict */}
                <div className="col-span-2 flex items-center gap-2">
                  {sub.status === 'Accepted' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#B8F36B] shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span
                    className={`font-mono font-bold truncate ${
                      sub.status === 'Accepted' ? 'text-[#B8F36B]' : 'text-red-400'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                {/* Problem Title */}
                <div className="col-span-4 pr-3 overflow-hidden">
                  <div className="font-semibold text-[#F3F5F2] truncate">{sub.problemTitle}</div>
                  <div className="text-[10px] text-[#929B9C] font-mono">
                    Passed {sub.passedTestCases} / {sub.totalTestCases} test cases
                  </div>
                </div>

                {/* Language */}
                <div className="col-span-2 text-center font-mono font-semibold text-[#929B9C] uppercase">
                  {sub.language}
                </div>

                {/* Runtime & Memory */}
                <div className="col-span-2 text-center hidden md:block font-mono text-[11px] text-[#929B9C]">
                  <div>{sub.executionTimeMs} ms</div>
                  <div className="text-[10px]">{Math.round(sub.memoryKb / 1024) || 12} MB</div>
                </div>

                {/* Date & View Code */}
                <div className="col-span-4 md:col-span-2 text-right flex items-center justify-end gap-2">
                  <span className="text-[10px] text-[#929B9C] font-mono hidden sm:inline">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setSelectedSubmission(sub)}
                    className="p-1.5 bg-[#1A2024] hover:bg-[#252C2E] text-[#929B9C] hover:text-[#B8F36B] rounded-lg transition-colors cursor-pointer"
                    title="View submitted code"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code Inspection Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl bg-[#111417] border border-[#252C2E] rounded-2xl p-6 text-[#F3F5F2] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#252C2E] shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">{selectedSubmission.problemTitle}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      selectedSubmission.status === 'Accepted'
                        ? 'bg-[#B8F36B]/20 text-[#B8F36B]'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {selectedSubmission.status}
                  </span>
                </div>
                <div className="text-xs text-[#929B9C] font-mono mt-0.5">
                  Submitted in {selectedSubmission.language.toUpperCase()} • {selectedSubmission.executionTimeMs} ms •{' '}
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-[#929B9C] hover:text-[#F3F5F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-y-auto rounded-xl bg-[#0B0D0F] border border-[#252C2E] p-4 font-mono text-xs text-[#F3F5F2] whitespace-pre">
              {selectedSubmission.code}
            </div>

            {/* Diagnostics if failed */}
            {selectedSubmission.errorDetails && (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 text-xs font-mono text-red-300">
                <span className="font-bold block mb-1">Execution Diagnostics:</span>
                <pre className="whitespace-pre-wrap">{selectedSubmission.errorDetails}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
