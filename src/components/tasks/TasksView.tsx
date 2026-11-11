import type { Dispatch, SetStateAction } from 'react';
import type { Task, User } from '../../types';

interface TasksViewProps {
  user: User;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}

export default function TasksView(_props: TasksViewProps) {
  return (
    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60">
      <h3 className="text-lg font-bold text-white mb-2">Tugas &amp; Assignment</h3>
      <p className="text-sm text-slate-400">Kelola dan lihat tenggat waktu tugas perkuliahan.</p>
    </div>
  );
}
