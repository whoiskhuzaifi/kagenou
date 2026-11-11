import {
  LayoutDashboard,
  Calendar,
  Bell,
  CheckSquare,
  Wallet,
  BookMarked,
  MessageSquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TabId } from '../../types';

export interface NavEntry {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

export const NAV_ENTRIES: NavEntry[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Jadwal Kuliah', icon: Calendar },
  { id: 'announcements', label: 'Pengumuman', icon: Bell },
  { id: 'tasks', label: 'Tugas Kelas', icon: CheckSquare },
  { id: 'finance', label: 'Keuangan Kas', icon: Wallet },
  { id: 'academic', label: 'Fitur Akademik', icon: BookMarked },
  { id: 'forum', label: 'Forum Kritik & Saran', icon: MessageSquare },
];

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

export default function NavItem({ icon: Icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          active ? 'bg-white text-indigo-700 font-bold' : 'bg-slate-700 text-slate-300'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
