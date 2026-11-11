import { useState, type FormEvent } from 'react';
import { AlertCircle, BookOpen, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

const inputClass =
  'w-full pl-10 pr-3 py-3 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-white ' +
  'placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 ' +
  'focus:ring-indigo-500/30 disabled:opacity-60';

export default function LoginView() {
  const { signIn, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const message = formError ?? authError;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setFormError(null);
    clearError();

    if (!email.trim() || !password) {
      setFormError('Email dan password wajib diisi.');
      return;
    }

    setSubmitting(true);
    const errorMessage = await signIn(email, password);
    // Jika sukses, AuthProvider mengganti tampilan; tidak perlu set state lagi.
    if (errorMessage) {
      setFormError(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
      {/* Dekorasi latar */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative w-full max-w-md bg-slate-800/80 backdrop-blur border border-slate-700/70 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center space-y-3 mb-6">
          <div className="mx-auto w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ClassPortal</h1>
            <p className="text-sm text-slate-400 mt-1">Masuk untuk mengakses portal kelas Anda</p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div role="alert" className="mb-4 flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Supabase belum dikonfigurasi. Isi <code className="font-mono">VITE_SUPABASE_URL</code> dan{' '}
              <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> di <code className="font-mono">.env.local</code>, lalu restart dev server.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-medium text-slate-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="nama@kampus.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                aria-invalid={Boolean(message)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-medium text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                aria-invalid={Boolean(message)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {message && (
            <div role="alert" className="flex gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Akun dibuat oleh pengurus kelas. Lupa password atau belum punya akun? Hubungi pengurus kelas.
        </p>
      </div>
    </div>
  );
}
