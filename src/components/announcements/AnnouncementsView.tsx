import type { Dispatch, SetStateAction } from 'react';
import type { Announcement, User } from '../../types';

interface AnnouncementsViewProps {
  user: User;
  announcements: Announcement[];
  setAnnouncements: Dispatch<SetStateAction<Announcement[]>>;
}

export default function AnnouncementsView(_props: AnnouncementsViewProps) {
  return (
    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
      <h3 className="text-lg font-bold text-white mb-2">Pengumuman Kelas</h3>
      <p className="text-sm text-slate-400">Daftar pengumuman resmi pengurus kelas.</p>
    </div>
  );
}
