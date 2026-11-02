import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Clock,
  Users,
  CheckCircle2,
  Play,
  Calendar,
  AlertCircle,
  Medal,
  ChevronRight,
  Flame,
  ArrowRight,
  Award,
} from 'lucide-react';
import { Contest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ContestsProps {
  onNavigate: (page: any) => void;
  onSelectProblem: (id: string) => void;
}

export const Contests: React.FC<ContestsProps> = ({ onNavigate, onSelectProblem }) => {
  const { user } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    loadContests();
  }, []);

  async function loadContests() {
    setLoading(true);
    try {
      const res = await api.getContests();
      setContests(res.contests);
      if (res.contests.length > 0) {
        setSelectedContest(res.contests[0]);
      }
    } catch (err) {
      console.error('Failed to load contests', err);
    } finally {
      setLoading(false);
    }
  }

  const handleJoin = async (contestId: string) => {
    if (!user) return;
    try {
      await api.joinContest(contestId);
      loadContests();
    } catch (err) {
      console.error('Failed to join contest', err);
    }
  };

  const filteredContests = contests.filter(c => {
    if (filterTab === 'all') return true;
    return c.status === filterTab;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F3F5F2] tracking-tight flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-[#FFB800]" /> Arena Contests & Tournaments
          </h1>
          <p className="text-xs md:text-sm text-[#929B9C] mt-1">
            Compete in live timed algorithmic contests, climb global ratings, and unlock arena badges.
          </p>
        </div>

        {/* Demo Contest Notice */}
        <div className="flex items-center gap-2 bg-[#151A1E] border border-[#252C2E] px-3.5 py-1.5 rounded-xl text-xs text-[#929B9C]">
          <span className="w-2 h-2 rounded-full bg-[#B8F36B]" />
          <span>Interactive Functional Demo Arena</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#252C2E] pb-3">
        {(['all', 'active', 'upcoming', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-colors cursor-pointer ${
              filterTab === tab
                ? 'bg-[#B8F36B] text-[#0B0D0F]'
                : 'bg-[#151A1E] text-[#929B9C] hover:text-[#F3F5F2] border border-[#252C2E]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contests Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredContests.map(c => {
            const isRegistered = Boolean(user && c.registeredUserIds.includes(user.id));
            const isSelected = selectedContest?.id === c.id;

            return (
              <div
                key={c.id}
                onClick={() => setSelectedContest(c)}
                className={`p-6 rounded-2xl bg-[#151A1E] border transition-all cursor-pointer ${
                  isSelected ? 'border-[#B8F36B] shadow-[0_0_15px_rgba(184,243,107,0.15)]' : 'border-[#252C2E] hover:border-[#3A4549]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase font-mono ${
                        c.status === 'active'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse'
                          : c.status === 'upcoming'
                          ? 'bg-[#69D5C5]/10 text-[#69D5C5] border border-[#69D5C5]/30'
                          : 'bg-[#929B9C]/10 text-[#929B9C] border border-[#252C2E]'
                      }`}
                    >
                      {c.status === 'active' ? '● Live Now' : c.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </span>

                    <span className="text-[11px] font-mono text-[#929B9C] bg-[#1A2024] px-2 py-0.5 rounded">
                      {c.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#929B9C] font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#B8F36B]" />
                    <span>{c.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#F3F5F2] mb-1.5">{c.title}</h3>
                <p className="text-xs text-[#929B9C] leading-relaxed mb-4">{c.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-[#252C2E] text-xs">
                  <div className="flex items-center gap-4 text-[#929B9C] font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#69D5C5]" /> {c.participantCount} registered
                    </span>
                    <span>•</span>
                    <span>{c.problemIds.length} Problems</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status === 'active' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (c.problemIds.length > 0) {
                            onSelectProblem(c.problemIds[0]);
                            onNavigate('workspace');
                          }
                        }}
                        className="px-4 py-1.5 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#0B0D0F]" /> Enter Contest
                      </button>
                    )}

                    {c.status === 'upcoming' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleJoin(c.id);
                        }}
                        disabled={isRegistered}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isRegistered
                            ? 'bg-[#1A2024] text-[#B8F36B] border border-[#B8F36B]/30'
                            : 'bg-[#B8F36B] text-[#0B0D0F] hover:bg-[#a5db5f]'
                        }`}
                      >
                        {isRegistered ? 'Registered ✓' : 'Register Now'}
                      </button>
                    )}

                    {c.status === 'completed' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          if (c.problemIds.length > 0) {
                            onSelectProblem(c.problemIds[0]);
                            onNavigate('workspace');
                          }
                        }}
                        className="px-3 py-1.5 bg-[#1A2024] hover:bg-[#252C2E] text-[#929B9C] hover:text-[#F3F5F2] rounded-lg text-xs font-semibold border border-[#252C2E]"
                      >
                        Practice Problems
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Contest Detail & Live Leaderboard */}
        {selectedContest && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F3F5F2] flex items-center gap-2">
                  <Medal className="w-4 h-4 text-[#FFB800]" /> Contest Problems
                </h3>
                <span className="text-[11px] text-[#929B9C] font-mono">
                  {selectedContest.problemIds.length} Tasks
                </span>
              </div>

              <div className="space-y-2">
                {selectedContest.problemIds.map((pid, idx) => (
                  <div
                    key={pid}
                    onClick={() => {
                      onSelectProblem(pid);
                      onNavigate('workspace');
                    }}
                    className="p-3 rounded-xl bg-[#1A2024] hover:bg-[#1E252A] border border-[#252C2E] flex items-center justify-between cursor-pointer group text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-5 h-5 rounded-full bg-[#111417] text-[#929B9C] flex items-center justify-center text-[10px] font-mono font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-semibold text-[#F3F5F2] group-hover:text-[#B8F36B] transition-colors truncate">
                        {pid.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-[#929B9C] group-hover:text-[#B8F36B] transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Contest Leaderboard */}
            <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#F3F5F2] flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#B8F36B]" /> Contest Leaderboard
                </h3>
                <span className="text-[10px] text-[#B8F36B] font-mono">LIVE RANKINGS</span>
              </div>

              {selectedContest.leaderboard.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#929B9C]">
                  Contest has not concluded yet. Leaderboard will calculate live during problem submissions.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedContest.leaderboard.map(entry => (
                    <div
                      key={entry.userId}
                      className="p-2.5 rounded-xl bg-[#1A2024] border border-[#252C2E] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] ${
                            entry.rank === 1
                              ? 'bg-[#FFB800] text-[#0B0D0F]'
                              : entry.rank === 2
                              ? 'bg-slate-300 text-[#0B0D0F]'
                              : entry.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-[#151A1E] text-[#929B9C]'
                          }`}
                        >
                          {entry.rank}
                        </span>
                        <span className="font-semibold text-[#F3F5F2]">{entry.username}</span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-[#B8F36B] font-bold">{entry.score} pts</span>
                        <span className="text-[#929B9C]">{entry.solvedCount} solved</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
