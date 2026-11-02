import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Play,
  ArrowRight,
  Trash2,
  Code2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Problem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface BookmarksProps {
  onNavigate: (page: any) => void;
  onSelectProblem: (id: string) => void;
}

export const Bookmarks: React.FC<BookmarksProps> = ({ onNavigate, onSelectProblem }) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, [user]);

  async function loadBookmarks() {
    setLoading(true);
    try {
      const res = await api.getBookmarks();
      setBookmarks(res.bookmarks);
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    } finally {
      setLoading(false);
    }
  }

  const handleRemove = async (problemId: string) => {
    try {
      await api.toggleBookmark(problemId);
      setBookmarks(prev => prev.filter(p => p.id !== problemId));
    } catch (err) {
      console.error('Failed to remove bookmark', err);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#F3F5F2] tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-[#B8F36B] fill-[#B8F36B]" /> Saved Problem Bookmarks
          </h1>
          <p className="text-xs md:text-sm text-[#929B9C] mt-1">
            Personal collection of problems you have saved for focused practice, interview prep, or review.
          </p>
        </div>

        <div className="text-xs font-mono text-[#929B9C] bg-[#151A1E] px-3.5 py-1.5 rounded-xl border border-[#252C2E]">
          {bookmarks.length} Problems Saved
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-[#929B9C]">Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="p-16 rounded-2xl bg-[#151A1E] border border-[#252C2E] text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1A2024] text-[#929B9C] flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-[#F3F5F2]">No Bookmarks Yet</h3>
          <p className="text-xs text-[#929B9C] max-w-sm mx-auto">
            Click the bookmark icon on any problem in the Problem Explorer or Coding Workspace to save it here.
          </p>
          <button
            onClick={() => onNavigate('problems')}
            className="px-4 py-2 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Explore Problems
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map(p => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E] hover:border-[#B8F36B]/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                      p.difficulty === 'Easy'
                        ? 'bg-[#69D5C5]/10 text-[#69D5C5]'
                        : p.difficulty === 'Medium'
                        ? 'bg-[#FFB800]/10 text-[#FFB800]'
                        : 'bg-[#FF5C5C]/10 text-[#FF5C5C]'
                    }`}
                  >
                    {p.difficulty}
                  </span>
                  <button
                    onClick={() => handleRemove(p.id)}
                    className="p-1 text-[#929B9C] hover:text-red-400 transition-colors"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-[#F3F5F2] group-hover:text-[#B8F36B] transition-colors mb-2">
                  {p.title}
                </h3>

                <p className="text-xs text-[#929B9C] line-clamp-2 leading-relaxed mb-3 font-sans">
                  {p.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {p.topicTags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#1A2024] text-[#929B9C] font-mono border border-[#252C2E]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#252C2E] flex items-center justify-between text-xs">
                <span className="text-[#929B9C] font-mono text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#B8F36B]" /> {p.estimatedMinutes} mins
                </span>
                <button
                  onClick={() => {
                    onSelectProblem(p.id);
                    onNavigate('workspace');
                  }}
                  className="px-3 py-1.5 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-[#0B0D0F]" /> Solve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
