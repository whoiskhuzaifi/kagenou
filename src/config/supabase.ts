// Nilai dibaca dari environment Vite (lihat .env.example).
// Fallback di bawah adalah nilai bawaan dari kode asli.
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL ?? 'https://xyzcompany.supabase.co',
  roleKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'anon-public-key',
  openAlexMail: import.meta.env.VITE_OPENALEX_MAIL ?? 'class.app@university.edu',
  openAlexApiKey: import.meta.env.VITE_OPENALEX_API_KEY ?? 'CHyoDjU82TujPfjLrPmyme',
};
