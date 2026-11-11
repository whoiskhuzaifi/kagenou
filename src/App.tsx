import { useMemo, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

import type {
  AcademicSubTab,
  Announcement,
  ForumPost,
  KasSummary,
  Schedule,
  StudyPlan,
  TabId,
  Task,
  Transaction,
  User,
} from './types';
import {
  initialAnnouncements,
  initialForum,
  initialSchedules,
  initialStudyPlans,
  initialTasks,
  initialTransactions,
} from './data/mockData';

import { useAuth } from './context/AuthContext';
import { useTabRoute } from './hooks/useTabRoute';

import LoginView from './components/auth/LoginView';
import ErrorBoundary from './components/common/ErrorBoundary';
import NotFoundView from './components/common/NotFoundView';
import Sidebar from './components/layout/Sidebar';
import MobileHeader from './components/layout/MobileHeader';
import MobileDrawer from './components/layout/MobileDrawer';
import DashboardView from './components/dashboard/DashboardView';
import ScheduleView from './components/schedule/ScheduleView';
import AnnouncementsView from './components/announcements/AnnouncementsView';
import TasksView from './components/tasks/TasksView';
import FinanceView from './components/finance/FinanceView';
import AcademicToolsView from './components/academic/AcademicToolsView';
import ForumView from './components/forum/ForumView';

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400" role="status" aria-live="polite">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      <span className="sr-only">Memuat...</span>
    </div>
  );
}

/**
 * Seluruh state & tampilan portal. Hanya di-mount saat user sudah login, sehingga
 * state (data kelas) otomatis ter-reset ketika logout / ganti akun.
 */
function PortalShell({ user, onLogout }: { user: User; onLogout: () => void }) {
  const { route, navigate } = useTabRoute();
  const activeTab: TabId | null = route === 'not-found' ? null : route;

  const [academicSubTab, setAcademicSubTab] = useState<AcademicSubTab>('journals');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // State Data Kelas
  // TODO: ganti mock data dengan query Supabase (tabel sudah tersedia di supabase/schema.sql).
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(initialForum);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(initialStudyPlans);

  const handleNavigate = (tab: TabId) => {
    navigate(tab);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    onLogout();
  };

  // Ringkasan Keuangan Kas
  const kasSummary = useMemo<KasSummary>(() => {
    const totalIn = transactions.filter((t) => t.type === 'in').reduce((acc, curr) => acc + curr.amount, 0);
    const totalOut = transactions.filter((t) => t.type === 'out').reduce((acc, curr) => acc + curr.amount, 0);
    return { totalIn, totalOut, balance: totalIn - totalOut };
  }, [transactions]);

  const badges: Partial<Record<TabId, number>> = {
    announcements: announcements.length,
    tasks: tasks.filter((t) => t.status === 'Pending').length,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
      <MobileDrawer
        open={drawerOpen}
        user={user}
        activeTab={activeTab}
        badges={badges}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <Sidebar
        user={user}
        activeTab={activeTab}
        badges={badges}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
        {route !== 'not-found' && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-2xl font-bold text-white capitalize">{route.replace('-', ' ')}</h2>
              <p className="text-sm text-slate-400">
                {user.role === 'admin'
                  ? 'Mode Pengurus Kelas - Anda memiliki hak akses Penuh (Create/Edit/Delete)'
                  : 'Mode Mahasiswa - Mode Baca & Interaksi Akademik'}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Supabase RLS Active
            </span>
          </div>
        )}

        {/* Error di satu halaman tidak menjatuhkan sidebar/navigasi; reset otomatis saat pindah halaman. */}
        <ErrorBoundary resetKeys={[route]}>
          {route === 'not-found' && <NotFoundView onGoHome={() => navigate('dashboard')} />}
          {route === 'dashboard' && (
            <DashboardView
              user={user}
              announcements={announcements}
              tasks={tasks}
              schedules={schedules}
              kasSummary={kasSummary}
              setActiveTab={navigate}
            />
          )}
          {route === 'schedule' && (
            <ScheduleView user={user} schedules={schedules} setSchedules={setSchedules} />
          )}
          {route === 'announcements' && (
            <AnnouncementsView user={user} announcements={announcements} setAnnouncements={setAnnouncements} />
          )}
          {route === 'tasks' && <TasksView user={user} tasks={tasks} setTasks={setTasks} />}
          {route === 'finance' && (
            <FinanceView user={user} transactions={transactions} setTransactions={setTransactions} kasSummary={kasSummary} />
          )}
          {route === 'academic' && (
            <AcademicToolsView
              academicSubTab={academicSubTab}
              setAcademicSubTab={setAcademicSubTab}
              studyPlans={studyPlans}
              setStudyPlans={setStudyPlans}
            />
          )}
          {route === 'forum' && (
            <ForumView user={user} forumPosts={forumPosts} setForumPosts={setForumPosts} />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  const { user, loading, signOut } = useAuth();

  // AUTH GUARD
  if (loading) return <FullScreenLoader />;
  if (!user) return <LoginView />;

  return <PortalShell user={user} onLogout={() => void signOut()} />;
}
