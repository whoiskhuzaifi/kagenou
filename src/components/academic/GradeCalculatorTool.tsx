import { useMemo, useState } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';

const GRADE_POINTS: Record<string, number> = {
  A: 4,
  'A-': 3.75,
  'B+': 3.5,
  B: 3,
  'B-': 2.75,
  'C+': 2.5,
  C: 2,
  D: 1,
  E: 0,
};

interface CourseRow {
  id: number;
  name: string;
  sks: number;
  grade: string;
}

export default function GradeCalculatorTool() {
  const [rows, setRows] = useState<CourseRow[]>([
    { id: 1, name: '', sks: 3, grade: 'A' },
  ]);

  const result = useMemo(() => {
    const totalSks = rows.reduce((acc, r) => acc + r.sks, 0);
    const totalPoints = rows.reduce((acc, r) => acc + r.sks * GRADE_POINTS[r.grade], 0);
    return { totalSks, gpa: totalSks > 0 ? totalPoints / totalSks : 0 };
  }, [rows]);

  const update = (id: number, patch: Partial<CourseRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () =>
    setRows((prev) => [...prev, { id: Date.now(), name: '', sks: 3, grade: 'A' }]);

  const removeRow = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Kalkulator IPK / IPS</h3>
        <p className="text-sm text-slate-400">Skala 4.0 berdasarkan bobot SKS.</p>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1fr_4.5rem_4.5rem_auto] gap-2 items-center">
            <input
              value={r.name}
              onChange={(e) => update(r.id, { name: e.target.value })}
              placeholder="Mata kuliah"
              className="min-w-0 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              min={1}
              max={6}
              value={r.sks}
              onChange={(e) => update(r.id, { sks: Math.max(1, Number(e.target.value) || 1) })}
              aria-label="SKS"
              className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <select
              value={r.grade}
              onChange={(e) => update(r.id, { grade: e.target.value })}
              aria-label="Nilai"
              className="px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {Object.keys(GRADE_POINTS).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button
              onClick={() => removeRow(r.id)}
              disabled={rows.length === 1}
              aria-label="Hapus baris"
              className="p-2 text-slate-400 hover:text-rose-400 disabled:opacity-30 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-sm text-slate-200 rounded-xl transition"
      >
        <Plus className="w-4 h-4" /> Tambah Mata Kuliah
      </button>

      <div className="flex items-center gap-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
        <Calculator className="w-8 h-8 text-indigo-400" />
        <div>
          <p className="text-xs text-slate-400">Indeks Prestasi ({result.totalSks} SKS)</p>
          <p className="text-2xl font-bold text-white">{result.gpa.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
