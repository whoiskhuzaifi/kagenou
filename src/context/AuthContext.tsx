import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Role, User } from '../types';

interface AuthContextValue {
  /** Profil mahasiswa/admin yang sedang login, atau null jika belum login. */
  user: User | null;
  /** true selama sesi / profil masih dimuat (cegah "kedip" halaman login). */
  loading: boolean;
  /** Pesan error tingkat aplikasi (mis. profil gagal dimuat). */
  error: string | null;
  /** Mengembalikan pesan error (Bahasa Indonesia) atau null jika sukses. */
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: Role;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function translateAuthError(err: { message?: string; status?: number; name?: string }): string {
  const msg = (err.message ?? '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email atau password salah.';
  if (msg.includes('email not confirmed')) return 'Email belum diverifikasi. Cek kotak masuk Anda.';
  if (msg.includes('banned')) return 'Akun ini dinonaktifkan. Hubungi pengurus kelas.';
  if (err.status === 429 || msg.includes('rate limit')) {
    return 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.';
  }
  if (err.name === 'AuthRetryableFetchError' || msg.includes('fetch')) {
    return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
  }
  return 'Gagal masuk. Silakan coba lagi.';
}

async function fetchProfile(userId: string): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role')
    .eq('id', userId)
    .single();
  if (error || !data) throw error ?? new Error('Profil tidak ditemukan');
  return data as ProfileRow;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Sinkronisasi sesi Supabase (termasuk login/logout dari tab lain & refresh token).
  //    Catatan: jangan memanggil API Supabase lain (await) di dalam callback onAuthStateChange
  //    karena berisiko deadlock; pengambilan profil dilakukan di effect terpisah di bawah.
  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        setSessionLoading(false);
      })
      .catch(() => {
        if (active) setSessionLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setSessionLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // 2) Ambil profil (nama + role) dari tabel `profiles` setiap kali user id berubah.
  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    let active = true;
    fetchProfile(userId)
      .then((p) => {
        if (!active) return;
        setProfile({ id: p.id, name: p.name, email: p.email, role: p.role });
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        console.error('[Auth] Gagal memuat profil:', err);
        setError('Profil akun tidak dapat dimuat. Coba lagi atau hubungi pengurus kelas.');
        // scope "local": hanya hapus sesi di perangkat ini, tidak butuh jaringan.
        void supabase.auth.signOut({ scope: 'local' });
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return authError ? translateAuthError(authError) : null;
  }, []);

  const signOut = useCallback(async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    // Jika request gagal (mis. offline), tetap bersihkan sesi lokal.
    if (signOutError) await supabase.auth.signOut({ scope: 'local' });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(() => {
    // Hindari menampilkan profil user sebelumnya saat pergantian akun.
    const user = profile && profile.id === userId ? profile : null;
    const loading = sessionLoading || (userId !== null && user === null);
    return { user, loading, error, signIn, signOut, clearError };
  }, [profile, userId, sessionLoading, error, signIn, signOut, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}
