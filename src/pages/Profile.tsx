import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  FileCheck2,
  Bookmark,
  Edit3,
  Clock,
  Sparkles,
  ArrowRight,
  Save,
  X,
  Code2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Submission, Problem } from '../types';

interface ProfileProps {
  onNavigate: (page: any) => void;
  onSelectProblem: (id: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ onNavigate, onSelectProblem }) => {
  const { user, updateProfile } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [bookmarks, setBookmarks] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(user?.avatarUrl || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editLevel, setEditLevel] = useState(user?.experienceLevel || 'Intermediate');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      try {
        const [subRes, bmRes] = await Promise.all([
          api.getSubmissions(),
          api.getBookmarks(),
        ]);
        setSubmissions(subRes.submissions);
        setBookmarks(bmRes.bookmarks);
      } catch (err) {
        console.error('Failed to load profile user data', err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="p-12 text-center text-[#929B9C]">
        Please sign in or select a demo account to view profile.
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        username: editUsername,
        avatarUrl: editAvatarUrl,
        bio: editBio,
        experienceLevel: editLevel as any,
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  const successRate = user.totalSubmissionsCount > 0
    ? Math.round((user.problemsSolvedCount / user.totalSubmissionsCount) * 100)
    : 0;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Profile Hero Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#151A1E] border border-[#252C2E] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#B8F36B] bg-[#111417] shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(184,243,107,0.2)]">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-[#B8F36B]">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-[#F3F5F2]">{user.username}</h1>
                <span className="text-xs bg-[#B8F36B]/15 text-[#B8F36B] border border-[#B8F36B]/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {user.experienceLevel}
                </span>
              </div>
              <p className="text-xs text-[#929B9C] max-w-lg leading-relaxed">
                {user.bio || 'Competitive coder striving for algorithm mastery.'}
              </p>
              <div className="flex items-center gap-4 text-[11px] text-[#929B9C] font-mono pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#69D5C5]" /> Joined{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span className="text-[#F3F5F2] font-bold">{user.email}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditUsername(user.username);
              setEditAvatarUrl(user.avatarUrl || '');
              setEditBio(user.bio || '');
              setEditLevel(user.experienceLevel);
              setIsEditing(true);
            }}
            className="px-4 py-2 bg-[#1A2024] hover:bg-[#252C2E] border border-[#252C2E] hover:border-[#B8F36B]/40 text-[#F3F5F2] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Edit3 className="w-4 h-4 text-[#B8F36B]" /> Edit Profile
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <span className="text-xs text-[#929B9C] block mb-1">Arena Rating</span>
          <div className="text-2xl font-extrabold text-[#B8F36B] font-mono">{user.rating}</div>
          <span className="text-[10px] text-[#929B9C] mt-1 block">Global Standing</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <span className="text-xs text-[#929B9C] block mb-1">Total Solved</span>
          <div className="text-2xl font-extrabold text-[#F3F5F2] font-mono">
            {user.problemsSolvedCount}
          </div>
          <span className="text-[10px] text-[#929B9C] mt-1 block">
            {user.easySolvedCount} Easy • {user.mediumSolvedCount} Med • {user.hardSolvedCount} Hard
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#929B9C]">Active Streak</span>
            <Flame className="w-4 h-4 text-[#FF8A00] fill-[#FF8A00]" />
          </div>
          <div className="text-2xl font-extrabold text-[#FF8A00] font-mono">{user.streak} Days</div>
          <span className="text-[10px] text-[#929B9C] mt-1 block">Consistency Record</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#151A1E] border border-[#252C2E]">
          <span className="text-xs text-[#929B9C] block mb-1">Success Rate</span>
          <div className="text-2xl font-extrabold text-[#69D5C5] font-mono">{successRate}%</div>
          <span className="text-[10px] text-[#929B9C] mt-1 block">
            {user.totalSubmissionsCount} Total Submissions
          </span>
        </div>
      </div>

      {/* Bookmarked & Recent Submissions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookmarked Problems */}
        <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F5F2] flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#B8F36B] fill-[#B8F36B]" /> Saved Bookmarks ({bookmarks.length})
            </h3>
            <button
              onClick={() => onNavigate('bookmarks')}
              className="text-xs text-[#B8F36B] hover:underline"
            >
              View All
            </button>
          </div>

          {bookmarks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#929B9C]">
              No bookmarked problems. Save problems from the Explorer to tackle later!
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookmarks.slice(0, 4).map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProblem(p.id);
                    onNavigate('workspace');
                  }}
                  className="p-3 rounded-xl bg-[#1A2024] hover:bg-[#1E252A] border border-[#252C2E] flex items-center justify-between cursor-pointer group text-xs"
                >
                  <div className="truncate pr-3">
                    <span className="font-semibold text-[#F3F5F2] group-hover:text-[#B8F36B] transition-colors truncate block">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-[#929B9C] font-mono">
                      {p.difficulty} • {p.topicTags.join(', ')}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#929B9C] group-hover:text-[#B8F36B] shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="p-6 rounded-2xl bg-[#151A1E] border border-[#252C2E] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F3F5F2] flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#69D5C5]" /> Recent Activity
            </h3>
            <button
              onClick={() => onNavigate('submissions')}
              className="text-xs text-[#B8F36B] hover:underline"
            >
              Full History
            </button>
          </div>

          {submissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#929B9C]">
              No submissions recorded. Test your code in the workspace to build your portfolio!
            </div>
          ) : (
            <div className="space-y-2">
              {submissions.slice(0, 4).map(sub => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-[#1A2024] border border-[#252C2E] flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-[#F3F5F2] truncate block">{sub.problemTitle}</span>
                    <span className="text-[10px] text-[#929B9C] font-mono">
                      {sub.language.toUpperCase()} • {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                      sub.status === 'Accepted'
                        ? 'bg-[#B8F36B]/15 text-[#B8F36B]'
                        : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#111417] border border-[#252C2E] rounded-2xl p-6 text-[#F3F5F2] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Edit Profile Information</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-[#929B9C] hover:text-[#F3F5F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#929B9C] mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={e => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#929B9C] mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={editAvatarUrl}
                  onChange={e => setEditAvatarUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#929B9C] mb-1">Bio / Headline</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={e => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#929B9C] mb-1">Experience Level</label>
                <select
                  value={editLevel}
                  onChange={e => setEditLevel(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Competitive">Competitive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-xs font-semibold text-[#929B9C] hover:text-[#F3F5F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
