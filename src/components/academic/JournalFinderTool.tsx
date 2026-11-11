import { useState } from 'react';
import type { FormEvent } from 'react';
import { Search, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import type { Work } from '../../types';
import { SUPABASE_CONFIG } from '../../config/supabase';

export default function JournalFinderTool() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Work[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: q,
        'per-page': '10',
        mailto: SUPABASE_CONFIG.openAlexMail,
      });
      if (SUPABASE_CONFIG.openAlexApiKey) params.set('api_key', SUPABASE_CONFIG.openAlexApiKey);

      const res = await fetch(`https://api.openalex.org/works?${params.toString()}`);
      if (!res.ok) throw new Error(`Permintaan gagal (status ${res.status})`);
      const data: { results: Work[] } = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mencari jurnal.');
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const linkFor = (w: Work) =>
    w.primary_location?.pdf_url ?? w.primary_location?.landing_page_url ?? w.doi ?? w.id;

  return (
    <div className="p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Pencari Jurnal Ilmiah</h3>
        <p className="text-sm text-slate-400">Pencarian paper melalui OpenAlex.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Contoh: convolutional neural network"
          className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium rounded-xl transition"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Cari
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-sm text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {searched && !loading && !error && results.length === 0 && (
        <p className="text-sm text-slate-400">Tidak ada hasil ditemukan.</p>
      )}

      <ul className="space-y-3">
        {results.map((w) => (
          <li key={w.id} className="p-4 bg-slate-900/70 border border-slate-700/70 rounded-xl space-y-1.5">
            <a
              href={linkFor(w)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 font-semibold text-indigo-300 hover:text-indigo-200 text-sm"
            >
              <span>{w.title}</span>
              <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            </a>
            <p className="text-xs text-slate-400">
              {w.authorships?.slice(0, 3).map((a) => a.author.display_name).join(', ') || 'Penulis tidak tersedia'}
            </p>
            <p className="text-xs text-slate-500">
              {w.publication_year} • Dikutip {w.cited_by_count} kali
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
