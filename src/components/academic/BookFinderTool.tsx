import { useState } from 'react';
import type { FormEvent } from 'react';
import { Search, Book, AlertCircle, RefreshCw } from 'lucide-react';
import type { BookItem } from '../../types';

export default function BookFinderTool() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookItem[]>([]);
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
        q,
        limit: '12',
        fields: 'key,title,author_name,first_publish_year,cover_i',
      });
      const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`);
      if (!res.ok) throw new Error(`Permintaan gagal (status ${res.status})`);
      const data: { docs: BookItem[] } = await res.json();
      setResults(data.docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mencari buku.');
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Pencari Buku Referensi</h3>
        <p className="text-sm text-slate-400">Pencarian buku melalui Open Library.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Judul atau penulis buku"
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
        <p className="text-sm text-slate-400">Tidak ada buku ditemukan.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {results.map((b) => (
          <li key={b.key} className="flex gap-3 p-3 bg-slate-900/70 border border-slate-700/70 rounded-xl">
            {b.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`}
                alt={`Sampul ${b.title}`}
                loading="lazy"
                className="w-14 h-20 object-cover rounded-md bg-slate-800 shrink-0"
              />
            ) : (
              <div className="w-14 h-20 rounded-md bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <Book className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <a
                href={`https://openlibrary.org${b.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-indigo-300 hover:text-indigo-200 line-clamp-2"
              >
                {b.title}
              </a>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {b.author_name?.join(', ') ?? 'Penulis tidak tersedia'}
              </p>
              {b.first_publish_year && (
                <p className="text-xs text-slate-500">Terbit pertama {b.first_publish_year}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
