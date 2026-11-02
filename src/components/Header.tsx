import React, { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Sparkles,
  Cpu,
  Trophy,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface HeaderProps {
  onToggleMobile: () => void;
  onOpenAuth: () => void;
  onNavigate: (page: any) => void;
  onSelectProblem?: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobile,
  onOpenAuth,
  onNavigate,
  onSelectProblem,
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStatus, setSystemStatus] = useState<{
    gemini: boolean;
    judge0: boolean;
  }>({ gemini: true, judge0: false });

  useEffect(() => {
    api.getSystemStatus().then(res => {
      setSystemStatus({
        gemini: res.gemini.configured,
        judge0: res.judge0.configured,
      });
    }).catch(() => {
      // ignore
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('problems');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0B0D0F]/90 backdrop-blur-md border-b border-[#252C2E] px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left Mobile Menu Toggle + Breadcrumbs/Daily */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-lg text-[#929B9C] hover:text-[#F3F5F2] hover:bg-[#151A1E] md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Daily Challenge Pill */}
        <button
          onClick={() => {
            if (onSelectProblem) onSelectProblem('two-sum');
            onNavigate('workspace');
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151A1E] hover:bg-[#1A2024] border border-[#252C2E] text-xs text-[#F3F5F2] transition-colors group cursor-pointer"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#B8F36B] animate-pulse" />
          <span className="text-[#929B9C]">Daily Challenge:</span>
          <span className="font-semibold text-[#B8F36B] group-hover:underline">Two Sum</span>
          <span className="text-[10px] px-1 bg-[#B8F36B]/20 text-[#B8F36B] rounded font-mono">+10 XP</span>
        </button>
      </div>

      {/* Middle Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#929B9C]" />
          <input
            type="text"
            placeholder="Search problems by name or topic (e.g. Arrays, DP, Tree)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-[#151A1E] border border-[#252C2E] rounded-lg text-xs text-[#F3F5F2] placeholder-[#929B9C]/60 focus:outline-none focus:border-[#B8F36B] transition-colors"
          />
        </form>
      </div>

      {/* Right Controls: Engine Badges + User */}
      <div className="flex items-center gap-2.5">
        {/* Gemini Engine Badge */}
        <div
          title={systemStatus.gemini ? 'Gemini 3.8 Flash AI Mentor Connected' : 'Gemini API not configured'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border ${
            systemStatus.gemini
              ? 'bg-[#B8F36B]/10 border-[#B8F36B]/30 text-[#B8F36B]'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Gemini AI</span>
          <span className="text-[10px]">{systemStatus.gemini ? 'ON' : 'OFF'}</span>
        </div>

        {/* Judge0 Execution Badge */}
        <div
          title={
            systemStatus.judge0
              ? 'Judge0 Remote Execution Connected'
              : 'Judge0 not configured (using isolated JS sandbox)'
          }
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border ${
            systemStatus.judge0
              ? 'bg-[#69D5C5]/10 border-[#69D5C5]/30 text-[#69D5C5]'
              : 'bg-[#151A1E] border-[#252C2E] text-[#929B9C]'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Judge0</span>
          <span className="text-[10px]">{systemStatus.judge0 ? 'REMOTE' : 'JS SANDBOX'}</span>
        </div>

        {/* User Profile / Login */}
        {user ? (
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 pl-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#252C2E] group-hover:border-[#B8F36B] transition-colors bg-[#151A1E] flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#B8F36B]">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-[#F3F5F2] group-hover:text-[#B8F36B] transition-colors">
                {user.username}
              </div>
              <div className="text-[10px] text-[#929B9C] font-mono">
                {user.experienceLevel}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3 py-1.5 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Sign In / Demo
          </button>
        )}
      </div>
    </header>
  );
};
