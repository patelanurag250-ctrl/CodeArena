import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Medal,
  Award,
  Search,
  User,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { LeaderboardUser } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [rankings, setRankings] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const res = await api.getLeaderboard(period);
      setRankings(res.leaderboard);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = rankings.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentUserRank = rankings.find(r => r.userId === user?.id);

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F3F5F2] tracking-tight flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-[#FFB800]" /> Arena Global Rankings
          </h1>
          <p className="text-xs md:text-sm text-[#929B9C] mt-1">
            Real-time ratings calculated from solved problems, contest performances, and streaks.
          </p>
        </div>

        {/* Current User Rank Pill */}
        {currentUserRank && (
          <div className="flex items-center gap-3 bg-[#151A1E] border border-[#B8F36B]/40 px-4 py-2.5 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-[#B8F36B]/20 text-[#B8F36B] flex items-center justify-center font-bold text-xs">
              #{currentUserRank.rank}
            </div>
            <div>
              <div className="text-xs font-bold text-[#F3F5F2] flex items-center gap-1.5">
                Your Rank: <span className="text-[#B8F36B]">#{currentUserRank.rank}</span>
              </div>
              <div className="text-[10px] text-[#929B9C] font-mono">
                {currentUserRank.rating} Rating • {currentUserRank.solvedCount} Solved
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-[#151A1E] p-1 rounded-xl border border-[#252C2E]">
          {(['weekly', 'monthly', 'all-time'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono transition-colors cursor-pointer ${
                period === p
                  ? 'bg-[#B8F36B] text-[#0B0D0F]'
                  : 'text-[#929B9C] hover:text-[#F3F5F2]'
              }`}
            >
              {p.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#929B9C]" />
          <input
            type="text"
            placeholder="Search ranked coder..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#151A1E] border border-[#252C2E] rounded-xl text-xs text-[#F3F5F2] placeholder-[#929B9C]/50 focus:outline-none focus:border-[#B8F36B]"
          />
        </div>
      </div>

      {/* Podium for Top 3 */}
      {filtered.length >= 3 && !searchQuery && (
        <div className="grid grid-cols-3 gap-4 pt-4 pb-2">
          {/* Rank 2 */}
          <div className="p-5 rounded-2xl bg-[#151A1E] border border-slate-700/60 text-center space-y-2 mt-4">
            <div className="w-10 h-10 rounded-full bg-slate-400 text-[#0B0D0F] font-bold flex items-center justify-center mx-auto text-sm shadow-[0_0_12px_rgba(148,163,184,0.3)]">
              #2
            </div>
            <div className="font-bold text-sm text-[#F3F5F2] truncate">{filtered[1].username}</div>
            <div className="text-xs text-[#69D5C5] font-mono font-bold">{filtered[1].rating} rating</div>
            <div className="text-[10px] text-[#929B9C] font-mono">{filtered[1].solvedCount} solved</div>
          </div>

          {/* Rank 1 (Tallest) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#1A2024] to-[#151A1E] border border-[#FFB800]/50 text-center space-y-2 shadow-[0_0_20px_rgba(255,184,0,0.15)] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFB800] text-[#0B0D0F] px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono tracking-wider">
              Champion
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FFB800] text-[#0B0D0F] font-extrabold flex items-center justify-center mx-auto text-base">
              #1
            </div>
            <div className="font-extrabold text-base text-[#F3F5F2] truncate">{filtered[0].username}</div>
            <div className="text-sm text-[#B8F36B] font-mono font-bold">{filtered[0].rating} rating</div>
            <div className="text-[11px] text-[#929B9C] font-mono">{filtered[0].solvedCount} problems solved</div>
          </div>

          {/* Rank 3 */}
          <div className="p-5 rounded-2xl bg-[#151A1E] border border-amber-900/60 text-center space-y-2 mt-6">
            <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center mx-auto text-sm shadow-[0_0_12px_rgba(180,83,9,0.3)]">
              #3
            </div>
            <div className="font-bold text-sm text-[#F3F5F2] truncate">{filtered[2].username}</div>
            <div className="text-xs text-[#FFB800] font-mono font-bold">{filtered[2].rating} rating</div>
            <div className="text-[10px] text-[#929B9C] font-mono">{filtered[2].solvedCount} solved</div>
          </div>
        </div>
      )}

      {/* Rankings Table */}
      <div className="rounded-2xl bg-[#151A1E] border border-[#252C2E] overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-mono uppercase text-[#929B9C] bg-[#111417]">
          <div className="col-span-2 sm:col-span-1">Rank</div>
          <div className="col-span-5 sm:col-span-5">Developer</div>
          <div className="col-span-3 sm:col-span-2 text-center">Rating</div>
          <div className="col-span-2 sm:col-span-2 text-center hidden sm:block">Solved</div>
          <div className="col-span-2 sm:col-span-2 text-right">Streak</div>
        </div>

        <div className="divide-y divide-[#252C2E]">
          {filtered.map(coder => {
            const isMe = user?.id === coder.userId;

            return (
              <div
                key={coder.userId}
                className={`grid grid-cols-12 items-center px-6 py-3.5 text-xs transition-colors ${
                  isMe
                    ? 'bg-[#B8F36B]/10 border-l-4 border-l-[#B8F36B]'
                    : 'hover:bg-[#1A2024]/60'
                }`}
              >
                {/* Rank */}
                <div className="col-span-2 sm:col-span-1 font-mono font-bold">
                  {coder.rank === 1 ? (
                    <span className="text-[#FFB800]">#1</span>
                  ) : coder.rank === 2 ? (
                    <span className="text-slate-300">#2</span>
                  ) : coder.rank === 3 ? (
                    <span className="text-amber-500">#3</span>
                  ) : (
                    <span className="text-[#929B9C]">#{coder.rank}</span>
                  )}
                </div>

                {/* Username + Level */}
                <div className="col-span-5 sm:col-span-5 flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-full bg-[#1A2024] border border-[#252C2E] flex items-center justify-center font-bold text-xs text-[#B8F36B] shrink-0">
                    {coder.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-[#F3F5F2] truncate flex items-center gap-1.5">
                      {coder.username}
                      {isMe && (
                        <span className="text-[10px] bg-[#B8F36B] text-[#0B0D0F] px-1.5 py-0.2 rounded font-mono font-bold">
                          YOU
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-[#929B9C] font-mono block">
                      {coder.experienceLevel}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="col-span-3 sm:col-span-2 text-center font-mono font-bold text-[#B8F36B]">
                  {coder.rating}
                </div>

                {/* Problems Solved */}
                <div className="col-span-2 sm:col-span-2 text-center font-mono text-[#F3F5F2] hidden sm:block">
                  {coder.solvedCount}
                </div>

                {/* Streak */}
                <div className="col-span-2 sm:col-span-2 text-right font-mono font-bold text-[#FF8A00] flex items-center justify-end gap-1">
                  <Flame className="w-3.5 h-3.5 fill-[#FF8A00]" />
                  <span>{coder.streak}d</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
