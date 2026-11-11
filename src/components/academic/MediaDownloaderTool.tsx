import { useState } from 'react';
import type { FormEvent } from 'react';
import { Download, AlertCircle, X } from 'lucide-react';

// Mengunduh berkas dari tautan langsung (PDF, gambar, audio, video, dll.).
// Tidak mengekstrak konten dari platform streaming; hanya membuka/mengunduh URL berkas yang diberikan.
export default function MediaDownloaderTool() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleDownload = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    let parsed: URL;
    try {
      parsed = new URL(url.trim());
    } catch {
      setError('URL tidak valid. Gunakan format lengkap, mis. https://contoh.com/berkas.pdf');
      return;
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      setError('Hanya URL http/https yang didukung.');
      return;
    }

    const a = document.createElement('a');
    a.href = parsed.href;
    a.download = parsed.pathname.split('/').pop() || 'berkas';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    a.remove();

    setHistory((prev) => [parsed.href, ...prev.filter((h) => h !== parsed.href)].slice(0, 5));
    setUrl('');
  };

  return (
    <div className="p-4 sm:p-5 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-white">Unduh Berkas dari Tautan</h3>
        <p className="text-sm text-slate-400">Tempel tautan langsung ke berkas materi (PDF, gambar, audio, video).</p>
      </div>

      <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Gunakan hanya untuk berkas yang kamu berhak mengunduhnya. Jika server asal berbeda domain,
          browser dapat membuka berkas di tab baru alih-alih mengunduh langsung.
        </p>
      </div>

      <form onSubmit={handleDownload} className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://contoh.com/materi.pdf"
          className="flex-1 min-w-0 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition"
        >
          <Download className="w-4 h-4" /> Unduh
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-sm text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {history.length > 0 && (
        <ul className="space-y-2">
          {history.map((h) => (
            <li key={h} className="flex items-center gap-2 p-2.5 bg-slate-900/70 border border-slate-700/70 rounded-lg">
              <span className="flex-1 min-w-0 text-xs text-slate-300 truncate">{h}</span>
              <button
                onClick={() => setHistory((prev) => prev.filter((x) => x !== h))}
                aria-label="Hapus dari riwayat"
                className="p-1 text-slate-500 hover:text-rose-400 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
