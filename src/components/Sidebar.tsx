import React from 'react';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  BarChart3,
  Bookmark,
  FileCheck2,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  Flame,
  Terminal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type PageId =
  | 'overview'
  | 'problems'
  | 'workspace'
  | 'contests'
  | 'leaderboard'
  | 'bookmarks'
  | 'submissions'
  | 'profile'
  | 'settings';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAuth: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onOpenAuth,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview' as PageId, label: 'Overview', icon: LayoutDashboard },
    { id: 'problems' as PageId, label: 'Problems', icon: Code2, badge: '20' },
    { id: 'contests' as PageId, label: 'Contests', icon: Trophy, pulse: true },
    { id: 'leaderboard' as PageId, label: 'Leaderboard', icon: BarChart3 },
    {
      id: 'bookmarks' as PageId,
      label: 'Bookmarks',
      icon: Bookmark,
      count: user?.bookmarkedProblemIds?.length,
    },
    {
      id: 'submissions' as PageId,
      label: 'Submissions',
      icon: FileCheck2,
      count: user?.totalSubmissionsCount,
    },
    { id: 'profile' as PageId, label: 'Profile', icon: User },
    { id: 'settings' as PageId, label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id: PageId) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-[#111417] border-r border-[#252C2E] flex flex-col justify-between transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Top Header / Logo */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#252C2E]">
            <div
              onClick={() => onNavigate('overview')}
              className="flex items-center gap-2.5 cursor-pointer overflow-hidden select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B8F36B] to-[#69D5C5] flex items-center justify-center text-[#0B0D0F] shadow-[0_0_15px_rgba(184,243,107,0.3)] shrink-0 font-extrabold">
                <Terminal className="w-5 h-5 stroke-[2.5]" />
              </div>
              {!collapsed && (
                <div className="leading-tight">
                  <span className="font-extrabold text-base tracking-tight text-[#F3F5F2] flex items-center gap-1">
                    Code<span className="text-[#B8F36B]">Arena</span>
                  </span>
                  <span className="text-[10px] text-[#929B9C] block font-mono">
                    AI COMPETITIVE PLATFORM
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-[#929B9C] hover:text-[#F3F5F2] hover:bg-[#151A1E] transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* User Quick Info Banner (if expanded) */}
          {!collapsed && user && (
            <div className="mx-3 mt-3 p-2.5 rounded-xl bg-[#151A1E] border border-[#252C2E]/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#B8F36B]/50 shrink-0 bg-[#1A2024]">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#B8F36B]">
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-[#F3F5F2] truncate">{user.username}</div>
                  <div className="text-[10px] text-[#929B9C] flex items-center gap-1 font-mono">
                    <span className="text-[#B8F36B] font-bold">{user.rating}</span> rating
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#FF8A00] bg-[#FF8A00]/10 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono">
                <Flame className="w-3.5 h-3.5 fill-[#FF8A00]" />
                {user.streak}d
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-[#B8F36B]/15 text-[#B8F36B] border border-[#B8F36B]/30'
                      : 'text-[#929B9C] hover:text-[#F3F5F2] hover:bg-[#151A1E]'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-[#B8F36B]' : 'text-[#929B9C] group-hover:text-[#F3F5F2]'
                    }`}
                  />

                  {!collapsed && (
                    <span className="truncate flex-1 text-left font-medium">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1A2024] text-[#929B9C] border border-[#252C2E] font-mono">
                      {item.badge}
                    </span>
                  )}

                  {!collapsed && item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1A2024] text-[#B8F36B] border border-[#B8F36B]/20 font-mono">
                      {item.count}
                    </span>
                  )}

                  {!collapsed && item.pulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#69D5C5] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#69D5C5]"></span>
                    </span>
                  )}

                  {/* Active pip on left */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#B8F36B] rounded-r" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#252C2E] space-y-2">
          {/* AI Status pill */}
          {!collapsed ? (
            <div className="p-2.5 rounded-xl bg-[#151A1E] border border-[#252C2E] text-xs">
              <div className="flex items-center justify-between text-[#929B9C] mb-1 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-[#B8F36B]">
                  <Sparkles className="w-3.5 h-3.5" /> Gemini 3.8 Mentor
                </span>
                <span className="text-[10px] text-[#69D5C5] bg-[#69D5C5]/10 px-1.5 py-0.2 rounded">
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-[#929B9C]/80 leading-snug">
                Real-time hints, complexity & debugging ready.
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title="Gemini AI Active">
              <div className="p-2 rounded-xl bg-[#B8F36B]/10 text-[#B8F36B]">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          )}

          {user ? (
            <button
              onClick={logout}
              title={collapsed ? 'Sign Out' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-2 px-3 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Sign In / Demo</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
