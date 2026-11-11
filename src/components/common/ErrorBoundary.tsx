import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Fallback kustom. Jika kosong, dipakai tampilan bawaan. */
  fallback?: ReactNode;
  /** true = tampilan layar penuh (untuk boundary level root). */
  fullScreen?: boolean;
  /** Boundary otomatis reset saat salah satu nilai berubah (mis. pindah halaman). */
  resetKeys?: unknown[];
  /** Hook untuk pelaporan error (Sentry, dsb). */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

const keysChanged = (a: unknown[] = [], b: unknown[] = []) =>
  a.length !== b.length || a.some((item, i) => !Object.is(item, b[i]));

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    // Hanya reset jika error sudah tampil sebelumnya, agar tidak loop pada error yang sama.
    if (
      this.state.error !== null &&
      prevState.error !== null &&
      keysChanged(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error === null) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;

    const wrapperClass = this.props.fullScreen
      ? 'min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100'
      : 'flex items-center justify-center py-12';

    return (
      <div className={wrapperClass}>
        <div role="alert" className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white">Terjadi kesalahan tak terduga</h2>
            <p className="text-sm text-slate-400">
              Maaf, bagian ini gagal ditampilkan. Data Anda aman. Silakan coba lagi atau muat ulang halaman.
            </p>
          </div>

          {import.meta.env.DEV && (
            <pre className="max-h-32 overflow-auto rounded-lg bg-slate-900 border border-slate-700 p-3 text-left text-xs text-rose-300 whitespace-pre-wrap">
              {error.message}
            </pre>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            <button
              onClick={this.reset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition"
            >
              <RotateCcw className="w-4 h-4" /> Coba Lagi
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-100 text-sm font-medium transition"
            >
              <RefreshCw className="w-4 h-4" /> Muat Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }
}
