import type { Dispatch, SetStateAction } from 'react';
import type { ForumPost, User } from '../../types';

interface ForumViewProps {
  user: User;
  forumPosts: ForumPost[];
  setForumPosts: Dispatch<SetStateAction<ForumPost[]>>;
}

export default function ForumView(_props: ForumViewProps) {
  return (
    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
      <h3 className="text-lg font-bold text-white mb-2">Forum Kritik &amp; Saran</h3>
      <p className="text-sm text-slate-400">Wadah penyampaian aspirasi mahasiswa dan respon pengurus kelas.</p>
    </div>
  );
}
