import { BookOpen, RefreshCw, LogOut } from 'lucide-react';
import type { TabId, User } from '../../types';
import NavItem, { NAV_ENTRIES } from './NavItem';

interface SidebarProps {
  user: User;
  activeTab: TabId | null;
  badges: Partial<Record<TabId, number>>;
  onNavigate: (tab: TabId) => void;
  /** Opsional: hanya untuk mode demo. Di produksi, role berasal dari tabel `profiles`. */
  onToggleRole?: () => void;
  onLogout: () => void;
}

export default function Sidebar({ user, activeTab, badges, onNavigate, onToggleRole, onLogout }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-800/90 border-r border-slate-700/60 p-4 sticky top-0 h-screen justify-between z-20">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 text-white">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">ClassPortal</h1>
            <span className="text-xs text-indigo-400 font-medium">TI-4A Express</span>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Akses Role Saat Ini:</span>
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
              user.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {user.role}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="truncate flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          {onToggleRole && (
            <button
              onClick={onToggleRole}
              className="w-full mt-2 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-600 transition flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Switch ke {user.role === 'admin' ? 'Mahasiswa' : 'Admin'}
            </button>
          )}
        </div>

        <nav className="space-y-1">
          {NAV_ENTRIES.map((entry) => (
            <NavItem
              key={entry.id}
              icon={entry.icon}
              label={entry.label}
              active={activeTab === entry.id}
              onClick={() => onNavigate(entry.id)}
              badge={badges[entry.id]}
            />
          ))}
        </nav>
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition text-sm font-medium"
      >
        <LogOut className="w-5 h-5" />
        <span>Keluar System</span>
      </button>
    </aside>
  );
}
