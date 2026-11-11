import { useState } from 'react';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { Plus, Trash2, CheckCircle2, Clock, Flame } from 'lucide-react';
import type { StudyPlan } from '../../types';

interface StudyPlannerToolProps {
  studyPlans: StudyPlan[];
  setStudyPlans: Dispatch<SetStateAction<StudyPlan[]>>;
}

export default function StudyPlannerTool({ studyPlans, setStudyPlans }: StudyPlannerToolProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState('1 jam');

  const doneCount = studyPlans.filter((p) => p.isDone).length;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setStudyPlans((prev) => [
      ...prev,
      { id: String(Date.now()), title: title.trim(), date, duration: duration.trim() || '1 jam', isDone: false },
    ]);
    setTitle('');
  };

  const toggle = (id: string) =>
    setStudyPlans((prev) => prev.map((p) => (p.id === id ? { ...p, isDone: !p.isDone } : p)));

  const remove = (id: string) => setStudyPlans((prev) => prev.filter((p) => p.id !== id));

  const inputClass =
    'px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500';

  return (
    <div className="p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">Study Planner</h3>
          <p className="text-sm text-slate-400">Rencanakan sesi belajar pribadi.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
          <Flame className="w-3.5 h-3.5" /> {doneCount}/{studyPlans.length} selesai
        </span>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-[1fr_9rem_7rem_auto] gap-2">
        <input className={`${inputClass} min-w-0`} placeholder="Topik belajar" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        <input className={inputClass} placeholder="Durasi" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition"
        >
          <Plus className="w-4 h-4" /> Tambah
        </button>
      </form>

      {studyPlans.length === 0 && <p className="text-sm text-slate-400">Belum ada rencana belajar.</p>}

      <ul className="space-y-2">
        {studyPlans.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3 bg-slate-900/70 border border-slate-700/70 rounded-xl">
            <button
              onClick={() => toggle(p.id)}
              aria-label={p.isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
              className={p.isDone ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${p.isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                {p.title}
              </p>
              <p className="text-xs text-slate-400 inline-flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> {p.date} • {p.duration}
              </p>
            </div>
            <button
              onClick={() => remove(p.id)}
              aria-label="Hapus rencana"
              className="p-1.5 text-slate-400 hover:text-rose-400 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
