import type { LucideIcon } from 'lucide-react';

type StatColor = 'indigo' | 'emerald' | 'amber' | 'blue';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: StatColor;
  subtitle?: string;
}

const colorMap: Record<StatColor, string> = {
  indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export default function StatCard({ title, value, icon: Icon, color, subtitle }: StatCardProps) {
  return (
    <div className="p-5 bg-slate-800/90 border border-slate-700/70 rounded-2xl space-y-3 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{title}</span>
        <div className={`p-2.5 rounded-xl border ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
