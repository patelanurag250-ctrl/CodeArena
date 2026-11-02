import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Sparkles,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Shield,
  Code2,
  Terminal,
  ExternalLink,
  Save,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user, demoLogin, logout } = useAuth();
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [tabSize, setTabSize] = useState<number>(2);
  const [lineWrap, setLineWrap] = useState<boolean>(true);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    api.getSystemStatus().then(res => {
      setSystemStatus(res);
    }).catch(err => {
      console.error('Failed to get status', err);
    });
  }, []);

  const handleSavePreferences = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#F3F5F2] tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-[#B8F36B]" /> Platform Settings & Environment
        </h1>
        <p className="text-xs md:text-sm text-[#929B9C] mt-1">
          Inspect backend integrations, execution services, Gemini AI configuration, and code editor settings.
        </p>
      </div>

      {/* Section 1: AI & Execution Engine Health */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#F3F5F2] flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#69D5C5]" /> Service Status & Execution Engines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gemini AI Status Card */}
          <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#B8F36B]/10 text-[#B8F36B]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F3F5F2]">Gemini AI Mentor</h3>
                  <span className="text-[11px] text-[#929B9C] font-mono">Model: gemini-3.8-flash</span>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1.5 ${
                  systemStatus?.gemini?.configured
                    ? 'bg-[#B8F36B]/15 text-[#B8F36B] border border-[#B8F36B]/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}
              >
                {systemStatus?.gemini?.configured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" /> Unconfigured
                  </>
                )}
              </span>
            </div>

            <p className="text-xs text-[#929B9C] leading-relaxed">
              Provides real-time beginner explanations, multi-tier hints, complexity breakdowns, and debugging diagnostics inside the Coding Workspace.
            </p>

            <div className="p-3 rounded-xl bg-[#1A2024] border border-[#252C2E] text-xs space-y-1">
              <div className="text-[#929B9C]">
                Configured via: <code className="text-[#B8F36B] font-mono">GEMINI_API_KEY</code>
              </div>
              <div className="text-[11px] text-[#929B9C]">
                In AI Studio, the Gemini API key is automatically attached to server routes.
              </div>
            </div>
          </div>

          {/* Judge0 Execution Status Card */}
          <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#69D5C5]/10 text-[#69D5C5]">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F3F5F2]">Judge0 Remote Compiler</h3>
                  <span className="text-[11px] text-[#929B9C] font-mono">C++, Python, Java, JS</span>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1.5 ${
                  systemStatus?.judge0?.configured
                    ? 'bg-[#69D5C5]/15 text-[#69D5C5] border border-[#69D5C5]/30'
                    : 'bg-[#1A2024] text-[#929B9C] border border-[#252C2E]'
                }`}
              >
                {systemStatus?.judge0?.configured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </>
                ) : (
                  'Optional Remote'
                )}
              </span>
            </div>

            <p className="text-xs text-[#929B9C] leading-relaxed">
              Connects to Judge0 CE or custom self-hosted compiler instance for remote multi-language binary compilation and sandbox execution.
            </p>

            <div className="p-3 rounded-xl bg-[#1A2024] border border-[#252C2E] text-xs space-y-1">
              <div className="text-[#929B9C]">
                Configured via: <code className="text-[#69D5C5] font-mono">JUDGE0_API_KEY</code> &{' '}
                <code className="text-[#69D5C5] font-mono">JUDGE0_API_HOST</code>
              </div>
              <div className="text-[11px] text-[#929B9C]">
                {systemStatus?.judge0?.configured
                  ? `Connected to ${systemStatus.judge0.host}`
                  : 'Not set. JavaScript executes locally in the isolated Node.js sandbox.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Editor Preferences */}
      <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
        <h3 className="text-base font-bold text-[#F3F5F2] flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#B8F36B]" /> Monaco Editor Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#929B9C] mb-1.5">Tab Indentation</label>
            <select
              value={tabSize}
              onChange={e => setTabSize(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#1A2024] border border-[#252C2E] rounded-xl text-xs text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
            >
              <option value={2}>2 Spaces (Recommended)</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#929B9C] mb-1.5">Line Wrapping</label>
            <select
              value={lineWrap ? 'on' : 'off'}
              onChange={e => setLineWrap(e.target.value === 'on')}
              className="w-full px-3 py-2 bg-[#1A2024] border border-[#252C2E] rounded-xl text-xs text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
            >
              <option value="on">Soft Wrap Enabled</option>
              <option value="off">No Wrap (Horizontal Scroll)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedNotice && (
            <span className="text-xs text-[#B8F36B] font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Preferences saved!
            </span>
          )}
          <button
            onClick={handleSavePreferences}
            className="ml-auto px-4 py-2 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Section 3: Switch Profile / Fast Demo Testing */}
      <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
        <h3 className="text-base font-bold text-[#F3F5F2] flex items-center gap-2">
          <User className="w-5 h-5 text-[#69D5C5]" /> Account & Demo Profiles
        </h3>
        <p className="text-xs text-[#929B9C]">
          Switch between pre-populated developer accounts to test multiple ranking positions, streaks, and submissions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => demoLogin('alex')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              user?.username === 'AlexChen'
                ? 'bg-[#B8F36B]/10 border-[#B8F36B]'
                : 'bg-[#1A2024] border-[#252C2E] hover:border-[#3A4549]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-[#F3F5F2]">Alex Chen (Senior Dev)</span>
              {user?.username === 'AlexChen' && (
                <span className="text-[10px] bg-[#B8F36B] text-[#0B0D0F] px-1.5 py-0.2 rounded font-bold font-mono">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-[#929B9C]">1845 Rating • 12 Day Streak • 9 Solved</p>
          </button>

          <button
            onClick={() => demoLogin('sarah')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              user?.username === 'SarahLin'
                ? 'bg-[#69D5C5]/10 border-[#69D5C5]'
                : 'bg-[#1A2024] border-[#252C2E] hover:border-[#3A4549]'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-[#F3F5F2]">Sarah Lin (CS Student)</span>
              {user?.username === 'SarahLin' && (
                <span className="text-[10px] bg-[#69D5C5] text-[#0B0D0F] px-1.5 py-0.2 rounded font-bold font-mono">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-[#929B9C]">1610 Rating • 6 Day Streak • 6 Solved</p>
          </button>
        </div>
      </div>
    </div>
  );
};
