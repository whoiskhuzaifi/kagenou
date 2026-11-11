import type { Dispatch, SetStateAction } from 'react';
import type { Schedule, User } from '../../types';

interface ScheduleViewProps {
  user: User;
  schedules: Schedule[];
  setSchedules: Dispatch<SetStateAction<Schedule[]>>;
}

export default function ScheduleView(_props: ScheduleViewProps) {
  return (
    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
      <h3 className="text-lg font-bold text-white mb-2">Jadwal Perkuliahan</h3>
      <p className="text-sm text-slate-400">Modul manajemen jadwal matakuliah.</p>
    </div>
  );
}
