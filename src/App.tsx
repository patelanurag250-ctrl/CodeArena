import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Sidebar, PageId } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';

import { Dashboard } from './pages/Dashboard';
import { ProblemList } from './pages/ProblemList';
import { CodingWorkspace } from './pages/CodingWorkspace';
import { Contests } from './pages/Contests';
import { Leaderboard } from './pages/Leaderboard';
import { Bookmarks } from './pages/Bookmarks';
import { Submissions } from './pages/Submissions';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';

export function CodeArenaApp() {
  const [activePage, setActivePage] = useState<PageId>('overview');
  const [currentProblemId, setCurrentProblemId] = useState<string>('two-sum');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const handleSelectProblem = (id: string) => {
    setCurrentProblemId(id);
    setActivePage('workspace');
  };

  return (
    <div className="min-h-screen bg-[#0B0D0F] text-[#F3F5F2] flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={page => setActivePage(page)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenAuth={() => setAuthModalOpen(true)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          onToggleMobile={() => setMobileMenuOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
          onNavigate={page => setActivePage(page)}
          onSelectProblem={handleSelectProblem}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'overview' && (
            <Dashboard
              onNavigate={page => setActivePage(page)}
              onSelectProblem={handleSelectProblem}
            />
          )}

          {activePage === 'problems' && (
            <ProblemList
              onSelectProblem={handleSelectProblem}
              onNavigate={page => setActivePage(page)}
            />
          )}

          {activePage === 'workspace' && (
            <CodingWorkspace
              problemId={currentProblemId}
              onNavigate={page => setActivePage(page)}
              onSelectProblem={handleSelectProblem}
            />
          )}

          {activePage === 'contests' && (
            <Contests
              onNavigate={page => setActivePage(page)}
              onSelectProblem={handleSelectProblem}
            />
          )}

          {activePage === 'leaderboard' && <Leaderboard />}

          {activePage === 'bookmarks' && (
            <Bookmarks
              onNavigate={page => setActivePage(page)}
              onSelectProblem={handleSelectProblem}
            />
          )}

          {activePage === 'submissions' && <Submissions />}

          {activePage === 'profile' && (
            <Profile
              onNavigate={page => setActivePage(page)}
              onSelectProblem={handleSelectProblem}
            />
          )}

          {activePage === 'settings' && <Settings />}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CodeArenaApp />
    </AuthProvider>
  );
}
