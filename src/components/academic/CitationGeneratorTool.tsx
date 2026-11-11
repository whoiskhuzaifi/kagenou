import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Quote, Copy, Check } from 'lucide-react';

type Style = 'APA' | 'MLA' | 'IEEE';

interface Fields {
  author: string;
  year: string;
  title: string;
  source: string;
  url: string;
}

function format(style: Style, f: Fields): string {
  const url = f.url.trim();
  switch (style) {
    case 'APA':
      return `${f.author} (${f.year}). ${f.title}. ${f.source}.${url ? ` ${url}` : ''}`;
    case 'MLA':
      return `${f.author}. "${f.title}." ${f.source}, ${f.year}.${url ? ` ${url}.` : ''}`;
    case 'IEEE':
      return `${f.author}, "${f.title}," ${f.source}, ${f.year}.${url ? ` [Online]. Available: ${url}` : ''}`;
  }
}

export default function CitationGeneratorTool() {
  const [style, setStyle] = useState<Style>('APA');
  const [fields, setFields] = useState<Fields>({ author: '', year: '', title: '', source: '', url: '' });
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const ready = fields.author.trim() && fields.year.trim() && fields.title.trim() && fields.source.trim();
  const output = ready ? format(style, fields) : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500';

  return (
    <div className="p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Generator Sitasi</h3>
        <p className="text-sm text-slate-400">Format APA, MLA, atau IEEE untuk satu sumber.</p>
      </div>

      <div className="flex gap-2">
        {(['APA', 'MLA', 'IEEE'] as Style[]).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition ${
              style === s
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input className={inputClass} placeholder="Penulis (mis. Santoso, B.)" value={fields.author} onChange={set('author')} />
        <input className={inputClass} placeholder="Tahun" value={fields.year} onChange={set('year')} />
        <input className={`${inputClass} sm:col-span-2`} placeholder="Judul" value={fields.title} onChange={set('title')} />
        <input className={inputClass} placeholder="Jurnal / Penerbit" value={fields.source} onChange={set('source')} />
        <input className={inputClass} placeholder="URL / DOI (opsional)" value={fields.url} onChange={set('url')} />
      </div>

      <div className="p-4 bg-slate-900/70 border border-slate-700/70 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Quote className="w-4 h-4 text-indigo-400" /> Hasil sitasi {style}
        </div>
        <p className="text-sm text-slate-200 break-words min-h-[1.5rem]">
          {output || 'Lengkapi penulis, tahun, judul, dan sumber untuk melihat hasil.'}
        </p>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 border border-slate-600 text-xs text-slate-200 rounded-lg transition"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Tersalin' : 'Salin'}
        </button>
      </div>
    </div>
  );
}
