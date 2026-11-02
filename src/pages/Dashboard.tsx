import React, { useState, useEffect } from 'react';
import {
  Code2,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  Play,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Problem, Submission, Contest } from '../types';

interface DashboardProps {
  onNavigate: (page: any) => void;
  onSelectProblem: (id: string) => void;
}

const MOTIVATIONS = [
  "“Programs must be written for people to read, and only incidentally for machines to execute.” – Harold Abelson",
  "“First, solve the problem. Then, write the code.” – John Johnson",
  "“Simplicity is prerequisite for reliability.” – Edsger W. Dijkstra",
  "“Make it work, make it right, make it fast.” – Kent Beck",
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectProblem }) => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [activityMap, setActivityMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [probRes, subRes, contestRes] = await Promise.all([
          api.getProblems(),
          api.getSubmissions(),
          api.getContests(),
        ]);
        setProblems(probRes.problems);
        setSubmissions(subRes.submissions);
        setContests(contestRes.contests);

        if (user) {
          const actRes = await api.getUserActivity(user.id);
          setActivityMap(actRes.activity || {});
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const motivation = MOTIVATIONS[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % MOTIVATIONS.length];

  // Daily Challenge Problem
  const dailyChallenge = problems.find(p => p.id === 'two-sum') || problems[0];

  // Continue Solving Problems (unsolved or bookmarked)
  const continueProblems = problems
    .filter(p => !user?.solvedProblemIds.includes(p.id))
    .slice(0, 3);

  // Recommended problems based on user experience level
  const recommendedProblems = problems
    .filter(p => {
      if (user?.experienceLevel === 'Beginner') return p.difficulty === 'Easy';
      if (user?.experienceLevel === 'Advanced' || user?.experienceLevel === 'Competitive')
        return p.difficulty === 'Medium' || p.difficulty === 'Hard';
      return p.difficulty === 'Medium';
    })
    .slice(0, 3);

  // Weekly Activity Chart Data (last 7 days)
  const weeklyData = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    const count = activityMap[dateStr] || (user?.solvedProblemIds?.length ? Math.floor((i * 3) % 4) : 0);
    weeklyData.push({
      day: dayName,
      date: dateStr,
      submissions: count,
    });
  }

  // Difficulty Distribution
  const totalSolved = user?.problemsSolvedCount || 0;
  const easySolved = user?.easySolvedCount || 0;
  const mediumSolved = user?.mediumSolvedCount || 0;
  const hardSolved = user?.hardSolvedCount || 0;

  const difficultyPieData = [
    { name: 'Easy', value: easySolved || 1, color: '#69D5C5' },
    { name: 'Medium', value: mediumSolved || 1, color: '#FFB800' },
    { name: 'Hard', value: hardSolved || 1, color: '#FF5C5C' },
  ];

  // Activity Heatmap (Last 70 days, 10 weeks x 7 days)
  const heatmapDays = [];
  const now = new Date();
  for (let i = 69; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dStr = d.toISOString().split('T')[0];
    const count = activityMap[dStr] || 0;
    heatmapDays.push({ date: dStr, count });
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111417] via-[#151A1E] to-[#111417] border border-[#252C2E] p-6 md:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#B8F36B]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#929B9C]">
              <Calendar className="w-3.5 h-3.5 text-[#B8F36B]" />
              <span>{currentDateFormatted}</span>
              <span className="text-[#252C2E]">•</span>
              <span className="text-[#69D5C5] font-semibold">Season 2026 Open</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#F3F5F2] tracking-tight">
              Welcome back, <span className="text-[#B8F36B]">{user?.username || 'Developer'}</span>!
            </h1>

            <p className="text-xs md:text-sm text-[#929B9C] italic max-w-2xl leading-relaxed">
              {motivation}
            </p>
          </div>

          {/* Daily Challenge Card Highlight */}
          {dailyChallenge && (
            <div className="shrink-0 p-4 rounded-xl bg-[#1A2024] border border-[#252C2E] hover:border-[#B8F36B]/40 transition-colors w-full md:w-80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#B8F36B] flex items-center gap-1.5 uppercase font-mono tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Daily Challenge
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#69D5C5]/10 text-[#69D5C5] font-mono">
                  {dailyChallenge.difficulty}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F3F5F2] truncate mb-1">
                {dailyChallenge.title}
              </h3>
              <p className="text-[11px] text-[#929B9C] line-clamp-1 mb-3">
                {dailyChallenge.topicTags.join(' • ')}
              </p>
              <button
                onClick={() => {
                  onSelectProblem(dailyChallenge.id);
                  onNavigate('workspace');
                }}
                className="w-full py-2 px-3 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-[#0B0D0F]" /> Solve Today's Problem
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Statistics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Solved */}
        <div className="col-span-2 p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#929B9C]">Problems Solved</span>
            <div className="p-2 rounded-xl bg-[#B8F36B]/10 text-[#B8F36B]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#F3F5F2] font-mono">{totalSolved}</span>
            <span className="text-xs text-[#929B9C] font-mono">/ {problems.length || 20}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#1A2024] h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-[#B8F36B] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalSolved / (problems.length || 20)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Easy */}
        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <span className="text-xs text-[#929B9C] block mb-1">Easy</span>
          <div className="text-2xl font-bold text-[#69D5C5] font-mono">{easySolved}</div>
          <span className="text-[10px] text-[#929B9C] block mt-1">Foundation</span>
        </div>

        {/* Medium */}
        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <span className="text-xs text-[#929B9C] block mb-1">Medium</span>
          <div className="text-2xl font-bold text-[#FFB800] font-mono">{mediumSolved}</div>
          <span className="text-[10px] text-[#929B9C] block mt-1">Interview Core</span>
        </div>

        {/* Hard */}
        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <span className="text-xs text-[#929B9C] block mb-1">Hard</span>
          <div className="text-2xl font-bold text-[#FF5C5C] font-mono">{hardSolved}</div>
          <span className="text-[10px] text-[#929B9C] block mt-1">Advanced DSA</span>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#929B9C]">Streak</span>
            <Flame className="w-4 h-4 text-[#FF8A00] fill-[#FF8A00]" />
          </div>
          <div className="text-2xl font-bold text-[#FF8A00] font-mono">{user?.streak || 1}d</div>
          <span className="text-[10px] text-[#929B9C] block mt-1">Keep it burning!</span>
        </div>
      </div>

      {/* 3. Visualizations: Activity Heatmap & Weekly Chart & Difficulty Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Coding Activity Chart (Recharts) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F3F5F2]">Weekly Coding Activity</h3>
              <p className="text-xs text-[#929B9C]">Submissions and problem attempts this week</p>
            </div>
            <span className="text-xs text-[#B8F36B] font-mono bg-[#B8F36B]/10 px-2.5 py-1 rounded-lg">
              {user?.totalSubmissionsCount || 0} Submissions
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  stroke="#929B9C"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#252C2E' }}
                />
                <YAxis
                  stroke="#929B9C"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#252C2E' }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111417',
                    borderColor: '#252C2E',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F3F5F2',
                  }}
                  cursor={{ fill: '#1A2024' }}
                />
                <Bar dataKey="submissions" fill="#B8F36B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Heatmap Grid */}
          <div className="pt-2 border-t border-[#252C2E]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#929B9C]">70-Day Activity Heatmap</span>
              <div className="flex items-center gap-1.5 text-[10px] text-[#929B9C]">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-[#1A2024]" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B8F36B]/30" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B8F36B]/60" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#B8F36B]" />
                <span>More</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {heatmapDays.map((h, idx) => {
                let bg = 'bg-[#1A2024]';
                if (h.count >= 4) bg = 'bg-[#B8F36B]';
                else if (h.count >= 2) bg = 'bg-[#B8F36B]/70';
                else if (h.count === 1) bg = 'bg-[#B8F36B]/30';

                return (
                  <div
                    key={idx}
                    title={`${h.date}: ${h.count} actions`}
                    className={`w-3.5 h-3.5 rounded-xs ${bg} transition-transform hover:scale-125 cursor-pointer`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Problem Difficulty Breakdown */}
        <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F3F5F2]">Solving Distribution</h3>
            <p className="text-xs text-[#929B9C]">Breakdown by problem complexity</p>

            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyPieData}
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {difficultyPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111417',
                      borderColor: '#252C2E',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#252C2E]">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#929B9C]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#69D5C5]" /> Easy
              </span>
              <span className="font-mono font-bold text-[#F3F5F2]">{easySolved} solved</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#929B9C]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" /> Medium
              </span>
              <span className="font-mono font-bold text-[#F3F5F2]">{mediumSolved} solved</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-[#929B9C]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C5C]" /> Hard
              </span>
              <span className="font-mono font-bold text-[#F3F5F2]">{hardSolved} solved</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Continue Solving & Recommended Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Solving */}
        <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F5F2] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B8F36B]" /> Continue Solving
            </h3>
            <button
              onClick={() => onNavigate('problems')}
              className="text-xs text-[#B8F36B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              All Problems <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {continueProblems.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProblem(p.id);
                  onNavigate('workspace');
                }}
                className="p-3.5 rounded-xl bg-[#1A2024] hover:bg-[#1E252A] border border-[#252C2E] hover:border-[#B8F36B]/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="overflow-hidden pr-3">
                  <div className="text-sm font-semibold text-[#F3F5F2] group-hover:text-[#B8F36B] transition-colors truncate">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-[#929B9C] flex items-center gap-2 mt-0.5">
                    <span
                      className={`font-semibold ${
                        p.difficulty === 'Easy'
                          ? 'text-[#69D5C5]'
                          : p.difficulty === 'Medium'
                          ? 'text-[#FFB800]'
                          : 'text-[#FF5C5C]'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                    <span>•</span>
                    <span>{p.topicTags.slice(0, 2).join(', ')}</span>
                    <span>•</span>
                    <span>{p.acceptanceRate}% acceptance</span>
                  </div>
                </div>

                <button className="px-3 py-1.5 rounded-lg bg-[#252C2E] group-hover:bg-[#B8F36B] text-[#929B9C] group-hover:text-[#0B0D0F] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1">
                  Solve <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended for Your Level */}
        <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F5F2] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#69D5C5]" /> Recommended for {user?.experienceLevel || 'Intermediate'}
            </h3>
            <span className="text-[11px] text-[#929B9C] font-mono">Curated DSA Path</span>
          </div>

          <div className="space-y-2.5">
            {recommendedProblems.map(p => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProblem(p.id);
                  onNavigate('workspace');
                }}
                className="p-3.5 rounded-xl bg-[#1A2024] hover:bg-[#1E252A] border border-[#252C2E] hover:border-[#69D5C5]/30 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="overflow-hidden pr-3">
                  <div className="text-sm font-semibold text-[#F3F5F2] group-hover:text-[#69D5C5] transition-colors truncate">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-[#929B9C] flex items-center gap-2 mt-0.5">
                    <span
                      className={`font-semibold ${
                        p.difficulty === 'Easy'
                          ? 'text-[#69D5C5]'
                          : p.difficulty === 'Medium'
                          ? 'text-[#FFB800]'
                          : 'text-[#FF5C5C]'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                    <span>•</span>
                    <span>{p.topicTags.slice(0, 2).join(', ')}</span>
                    <span>•</span>
                    <span>Est. {p.estimatedMinutes} mins</span>
                  </div>
                </div>

                <button className="px-3 py-1.5 rounded-lg bg-[#252C2E] group-hover:bg-[#69D5C5] text-[#929B9C] group-hover:text-[#0B0D0F] font-semibold text-xs transition-colors shrink-0 flex items-center gap-1">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Submissions & Upcoming Contests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Submissions */}
        <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F5F2]">Recent Submissions</h3>
            <button
              onClick={() => onNavigate('submissions')}
              className="text-xs text-[#B8F36B] hover:underline"
            >
              View All History
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#929B9C]">
              No submissions yet. Pick a problem in the Problem Explorer and run your code!
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.slice(0, 4).map(sub => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-[#1A2024] border border-[#252C2E] flex items-center justify-between text-xs"
                >
                  <div className="overflow-hidden pr-2">
                    <div className="font-semibold text-[#F3F5F2] truncate">{sub.problemTitle}</div>
                    <div className="text-[11px] text-[#929B9C] flex items-center gap-2 mt-0.5 font-mono">
                      <span className="uppercase">{sub.language}</span>
                      <span>•</span>
                      <span>{new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        sub.status === 'Accepted'
                          ? 'bg-[#B8F36B]/10 text-[#B8F36B]'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span className="text-[11px] text-[#929B9C] font-mono">
                      {sub.executionTimeMs}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Arena Contests */}
        <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F5F2] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FFB800]" /> Arena Tournaments & Contests
            </h3>
            <button
              onClick={() => onNavigate('contests')}
              className="text-xs text-[#B8F36B] hover:underline"
            >
              Contest Arena
            </button>
          </div>

          <div className="space-y-2.5">
            {contests.slice(0, 2).map(c => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-[#1A2024] border border-[#252C2E] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      c.status === 'active'
                        ? 'bg-red-500/10 text-red-400 animate-pulse'
                        : 'bg-[#69D5C5]/10 text-[#69D5C5]'
                    }`}
                  >
                    {c.status === 'active' ? '● Live Now' : 'Upcoming'}
                  </span>
                  <span className="text-[11px] text-[#929B9C] font-mono">
                    {c.durationMinutes} mins • {c.problemIds.length} Problems
                  </span>
                </div>

                <div className="text-sm font-bold text-[#F3F5F2]">{c.title}</div>
                <p className="text-xs text-[#929B9C] line-clamp-1">{c.description}</p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#929B9C]">
                    {c.participantCount} developers registered
                  </span>
                  <button
                    onClick={() => onNavigate('contests')}
                    className="px-3 py-1 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    {c.status === 'active' ? 'Enter Contest' : 'Register'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
