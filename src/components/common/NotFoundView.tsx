import { Compass, Home } from 'lucide-react';

interface NotFoundViewProps {
  onGoHome: () => void;
}

export default function NotFoundView({ onGoHome }: NotFoundViewProps) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
          <Compass className="w-8 h-8" />
        </div>
        <div>
          <p className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            404
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">Halaman tidak ditemukan</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Alamat yang Anda buka tidak tersedia atau sudah dipindahkan.
          </p>
        </div>
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
        >
          <Home className="w-4 h-4" /> Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
