import { Wallet, CheckSquare, Bell, Calendar } from 'lucide-react';
import type { Announcement, KasSummary, Schedule, TabId, Task, User } from '../../types';
import StatCard from './StatCard';

interface DashboardViewProps {
  user: User;
  announcements: Announcement[];
  tasks: Task[];
  schedules: Schedule[];
  kasSummary: KasSummary;
  setActiveTab: (tab: TabId) => void;
}

export default function DashboardView({ user, announcements, tasks, schedules, kasSummary }: DashboardViewProps) {
  const pendingTasks = tasks.filter((t) => t.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30">
            Selamat Datang Kembali 👋
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {user.role === 'admin'
              ? 'Kelola pengumuman kelas, pengeluaran kas, jadwal pertemuaan matkul, dan tugas mahasiswa di satu tempat.'
              : 'Pantau pengumuman terbaru, tugas mendesak, sisa uang kas kelas, dan akses alat akademik modern.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Saldo Kas Kelas"
          value={`Rp ${kasSummary.balance.toLocaleString('id-ID')}`}
          icon={Wallet}
          color="emerald"
          subtitle={`Total Masuk: Rp ${kasSummary.totalIn.toLocaleString('id-ID')}`}
        />
        <StatCard
          title="Tugas Pending"
          value={`${pendingTasks.length} Tugas`}
          icon={CheckSquare}
          color="amber"
          subtitle="Membutuhkan penyelesaian"
        />
        <StatCard
          title="Pengumuman Aktif"
          value={`${announcements.length} Info`}
          icon={Bell}
          color="indigo"
          subtitle="Informasi resmi kelas"
        />
        <StatCard
          title="Total Matakuliah"
          value={`${schedules.length} Jadwal`}
          icon={Calendar}
          color="blue"
          subtitle="Jadwal perkuliahan minggu ini"
        />
      </div>
    </div>
  );
}
