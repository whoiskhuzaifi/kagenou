import { BookOpen, Menu } from 'lucide-react';

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-800/95 backdrop-blur border-b border-slate-700/60">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-indigo-600 rounded-lg text-white">
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="font-bold text-white">ClassPortal</span>
      </div>
      <button
        onClick={onMenuClick}
        aria-label="Buka menu navigasi"
        className="p-2 rounded-lg text-slate-300 hover:bg-slate-700/60 transition"
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}
