import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,
  ArrowUpDown,
  Code2,
  X,
  Play,
} from 'lucide-react';
import { Problem, Difficulty } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ProblemListProps {
  onSelectProblem: (id: string) => void;
  onNavigate: (page: any) => void;
}

const TOPICS = [
  'All',
  'Arrays',
  'Strings',
  'Binary Search',
  'Sorting',
  'Linked Lists',
  'Stacks',
  'Queues',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy Algorithms',
  'Backtracking',
  'Hashing',
];

export const ProblemList: React.FC<ProblemListProps> = ({ onSelectProblem, onNavigate }) => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<(Problem & { isSolved?: boolean; isBookmarked?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved'>('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  useEffect(() => {
    loadProblems();
  }, [user]);

  async function loadProblems() {
    setLoading(true);
    try {
      const res = await api.getProblems();
      setProblems(res.problems);
    } catch (err) {
      console.error('Failed to load problems', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleBookmark = async (e: React.MouseEvent, problemId: string) => {
    e.stopPropagation();
    try {
      const res = await api.toggleBookmark(problemId);
      setProblems(prev =>
        prev.map(p => (p.id === problemId ? { ...p, isBookmarked: res.isBookmarked } : p))
      );
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  // Filter logic
  const filteredProblems = problems.filter(p => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(query);
      const matchId = p.id.toLowerCase().includes(query);
      const matchTags = p.topicTags.some(t => t.toLowerCase().includes(query));
      if (!matchTitle && !matchId && !matchTags) return false;
    }

    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
      return false;
    }

    if (selectedTopic !== 'All' && !p.topicTags.includes(selectedTopic)) {
      return false;
    }

    if (statusFilter === 'Solved' && !p.isSolved) return false;
    if (statusFilter === 'Unsolved' && p.isSolved) return false;

    if (bookmarkedOnly && !p.isBookmarked) return false;

    return true;
  });

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        return 'text-[#69D5C5] bg-[#69D5C5]/10 border-[#69D5C5]/20';
      case 'Medium':
        return 'text-[#FFB800] bg-[#FFB800]/10 border-[#FFB800]/20';
      case 'Hard':
        return 'text-[#FF5C5C] bg-[#FF5C5C]/10 border-[#FF5C5C]/20';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F3F5F2] tracking-tight flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-[#B8F36B]" /> Problem Explorer
          </h1>
          <p className="text-xs md:text-sm text-[#929B9C] mt-1">
            Curated bank of algorithmic challenges with Monaco workspace, test runners, and Gemini mentorship.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-[#151A1E] border border-[#252C2E] px-4 py-2 rounded-xl text-xs font-mono">
          <span className="text-[#929B9C]">Showing:</span>
          <span className="text-[#B8F36B] font-bold">{filteredProblems.length}</span>
          <span className="text-[#929B9C]">of {problems.length} problems</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#929B9C]" />
            <input
              type="text"
              placeholder="Search problems by title, topic, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-[#1A2024] border border-[#252C2E] rounded-xl text-xs md:text-sm text-[#F3F5F2] placeholder-[#929B9C]/50 focus:outline-none focus:border-[#B8F36B]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#929B9C] hover:text-[#F3F5F2]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2.5 bg-[#1A2024] border border-[#252C2E] rounded-xl text-xs text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B] font-medium"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-2.5 bg-[#1A2024] border border-[#252C2E] rounded-xl text-xs text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B] font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Solved">Solved</option>
              <option value="Unsolved">Unsolved</option>
            </select>

            {/* Bookmarked Filter Button */}
            <button
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                bookmarkedOnly
                  ? 'bg-[#B8F36B]/15 text-[#B8F36B] border-[#B8F36B]/40'
                  : 'bg-[#1A2024] text-[#929B9C] border-[#252C2E] hover:text-[#F3F5F2]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarkedOnly ? 'fill-[#B8F36B]' : ''}`} />
              <span className="hidden sm:inline">Saved</span>
            </button>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-[#B8F36B] text-[#0B0D0F] font-bold'
                  : 'bg-[#1A2024] text-[#929B9C] hover:text-[#F3F5F2] border border-[#252C2E]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Table / List */}
      <div className="rounded-2xl bg-[#151A1E] border border-[#252C2E] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#929B9C] text-sm">
            Loading problem collection...
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#1A2024] text-[#929B9C] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#F3F5F2]">No problems match your criteria</h3>
            <p className="text-xs text-[#929B9C]">
              Try adjusting your search query, topic filter, or difficulty settings.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDifficulty('All');
                setSelectedTopic('All');
                setStatusFilter('All');
                setBookmarkedOnly(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#252C2E] hover:bg-[#B8F36B] hover:text-[#0B0D0F] text-xs font-medium transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#252C2E]">
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-mono uppercase text-[#929B9C] bg-[#111417]">
              <div className="col-span-1">Status</div>
              <div className="col-span-5 md:col-span-6">Title & Topics</div>
              <div className="col-span-2 text-center">Difficulty</div>
              <div className="col-span-2 text-center hidden md:block">Acceptance</div>
              <div className="col-span-4 md:col-span-1 text-right">Action</div>
            </div>

            {/* Problem Rows */}
            {filteredProblems.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProblem(p.id);
                  onNavigate('workspace');
                }}
                className="grid grid-cols-12 items-center px-6 py-3.5 hover:bg-[#1A2024]/60 transition-colors cursor-pointer group"
              >
                {/* Status Column */}
                <div className="col-span-1 flex items-center gap-2">
                  {p.isSolved ? (
                    <span title="Solved">
                      <CheckCircle2 className="w-4 h-4 text-[#B8F36B]" />
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#252C2E]" />
                  )}
                  <button
                    onClick={e => handleToggleBookmark(e, p.id)}
                    className="text-[#929B9C] hover:text-[#B8F36B] transition-colors p-1"
                    title={p.isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${p.isBookmarked ? 'fill-[#B8F36B] text-[#B8F36B]' : ''}`}
                    />
                  </button>
                </div>

                {/* Title & Topic Tags */}
                <div className="col-span-5 md:col-span-6 pr-4 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#929B9C] font-mono">{idx + 1}.</span>
                    <span className="text-sm font-semibold text-[#F3F5F2] group-hover:text-[#B8F36B] transition-colors truncate">
                      {p.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 overflow-x-hidden">
                    {p.topicTags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#1A2024] text-[#929B9C] font-mono border border-[#252C2E] shrink-0"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-[#929B9C] font-mono ml-1 hidden sm:inline">
                      • {p.estimatedMinutes}m
                    </span>
                  </div>
                </div>

                {/* Difficulty */}
                <div className="col-span-2 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getDifficultyColor(
                      p.difficulty
                    )}`}
                  >
                    {p.difficulty}
                  </span>
                </div>

                {/* Acceptance Rate */}
                <div className="col-span-2 text-center text-xs font-mono text-[#929B9C] hidden md:block">
                  {p.acceptanceRate}%
                </div>

                {/* Solve Action */}
                <div className="col-span-4 md:col-span-1 text-right">
                  <button
                    onClick={() => {
                      onSelectProblem(p.id);
                      onNavigate('workspace');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#252C2E] group-hover:bg-[#B8F36B] text-[#929B9C] group-hover:text-[#0B0D0F] font-bold text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" /> Solve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
