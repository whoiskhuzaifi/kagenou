-- =====================================================================
-- ClassPortal — Supabase schema + Row Level Security
-- Jalankan di: Supabase Dashboard → SQL Editor. Aman dijalankan ulang (idempotent).
--
-- Ringkasan hak akses:
--   mahasiswa : baca semua data kelas; buat post/balasan forum; kelola study plan
--               & status selesai tugas miliknya sendiri.
--   admin     : semua hak mahasiswa + CRUD pengumuman, jadwal, tugas, kas,
--               dan hapus post/balasan forum.
--   anon      : tidak punya akses apa pun.
-- Role HANYA bisa diubah lewat SQL Editor / service_role (lihat bagian paling bawah).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. PROFILES  (1:1 dengan auth.users)  ↔ types: User
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 100),
  email      text not null,
  role       text not null default 'mahasiswa' check (role in ('mahasiswa', 'admin')),
  created_at timestamptz not null default now()
);

-- Helper: cek apakah user saat ini admin.
-- SECURITY DEFINER agar tidak memicu rekursi RLS saat dipakai di policy tabel `profiles`.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;

-- Buat profil otomatis saat user baru dibuat di Supabase Auth.
-- Role SELALU 'mahasiswa' (tidak pernah membaca role dari metadata yang bisa dimanipulasi user).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(coalesce(new.email, 'user'), '@', 1)),
    coalesce(new.email, ''),
    'mahasiswa'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill untuk user yang sudah ada sebelum trigger dibuat.
insert into public.profiles (id, name, email)
select u.id,
       coalesce(nullif(trim(u.raw_user_meta_data ->> 'name'), ''), split_part(coalesce(u.email, 'user'), '@', 1)),
       coalesce(u.email, '')
from auth.users u
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- 2. ANNOUNCEMENTS  ↔ types: Announcement  (author → join profiles.name)
-- ---------------------------------------------------------------------
create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null check (char_length(title) between 1 and 200),
  content    text not null,
  category   text not null default 'Info',
  date       date not null default current_date,
  author_id  uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists announcements_date_idx on public.announcements (date desc);


-- ---------------------------------------------------------------------
-- 3. SCHEDULES  ↔ types: Schedule   (kolom `time` di TS → `time_range`)
-- ---------------------------------------------------------------------
create table if not exists public.schedules (
  id         uuid primary key default gen_random_uuid(),
  day        text not null check (day in ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu')),
  time_range text not null,            -- contoh: '08:00 - 10:30'
  subject    text not null,
  room       text not null default '',
  lecturer   text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists schedules_day_idx on public.schedules (day);


-- ---------------------------------------------------------------------
-- 4. TASKS  ↔ types: Task
--    `status` TIDAK disimpan di sini karena tugas bersifat milik kelas:
--    status "Completed" per mahasiswa disimpan di `task_completions`.
--    Di frontend: status = ada baris di task_completions ? 'Completed' : 'Pending'.
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 1 and 200),
  subject     text not null,
  deadline    timestamptz not null,
  priority    text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  description text not null default '',
  created_by  uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists tasks_deadline_idx on public.tasks (deadline);

create table if not exists public.task_completions (
  task_id      uuid not null references public.tasks (id) on delete cascade,
  user_id      uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (task_id, user_id)
);
create index if not exists task_completions_user_idx on public.task_completions (user_id);


-- ---------------------------------------------------------------------
-- 5. FINANCE_TRANSACTIONS  ↔ types: Transaction  (recordedBy → recorded_by)
-- ---------------------------------------------------------------------
create table if not exists public.finance_transactions (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('in', 'out')),
  amount      bigint not null check (amount > 0),         -- Rupiah, tanpa desimal
  description text not null check (char_length(description) between 1 and 300),
  date        date not null default current_date,
  recorded_by uuid default auth.uid() references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);
create index if not exists finance_transactions_date_idx on public.finance_transactions (date desc);

-- Ringkasan kas ↔ types: KasSummary. security_invoker = RLS tabel dasar tetap berlaku.
create or replace view public.kas_summary
with (security_invoker = true) as
select
  coalesce(sum(amount) filter (where type = 'in'),  0)::bigint as total_in,
  coalesce(sum(amount) filter (where type = 'out'), 0)::bigint as total_out,
  (coalesce(sum(amount) filter (where type = 'in'), 0)
   - coalesce(sum(amount) filter (where type = 'out'), 0))::bigint as balance
from public.finance_transactions;


-- ---------------------------------------------------------------------
-- 6. FORUM  ↔ types: ForumPost & Reply  (role/nama penulis → join profiles)
-- ---------------------------------------------------------------------
create table if not exists public.forum_posts (
  id         uuid primary key default gen_random_uuid(),
  author_id  uuid default auth.uid() references public.profiles (id) on delete set null,
  message    text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists forum_posts_created_idx on public.forum_posts (created_at desc);

create table if not exists public.forum_replies (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.forum_posts (id) on delete cascade,
  author_id  uuid default auth.uid() references public.profiles (id) on delete set null,
  message    text not null check (char_length(message) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists forum_replies_post_idx on public.forum_replies (post_id, created_at);


-- ---------------------------------------------------------------------
-- 7. STUDY_PLANS  ↔ types: StudyPlan  (pribadi per mahasiswa)
-- ---------------------------------------------------------------------
create table if not exists public.study_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  title      text not null check (char_length(title) between 1 and 200),
  date       date not null,
  duration   text not null default '',
  is_done    boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists study_plans_user_idx on public.study_plans (user_id, date);


-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles             enable row level security;
alter table public.announcements        enable row level security;
alter table public.schedules            enable row level security;
alter table public.tasks                enable row level security;
alter table public.task_completions     enable row level security;
alter table public.finance_transactions enable row level security;
alter table public.forum_posts          enable row level security;
alter table public.forum_replies        enable row level security;
alter table public.study_plans          enable row level security;

-- Defense in depth: role anon tidak boleh menyentuh tabel-tabel ini sama sekali.
revoke all on
  public.profiles, public.announcements, public.schedules, public.tasks,
  public.task_completions, public.finance_transactions, public.forum_posts,
  public.forum_replies, public.study_plans, public.kas_summary
from anon;

-- ---- profiles -------------------------------------------------------
-- Semua user login boleh melihat daftar anggota kelas (dibutuhkan untuk nama penulis).
-- Catatan privasi: email ikut terbaca anggota lain. Jika tidak diinginkan, hapus kolom
-- email dari select di frontend / buat view publik tanpa email.
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated using (true);

-- User hanya boleh mengubah baris miliknya, dan hanya kolom `name` (lihat GRANT di bawah).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Cegah eskalasi hak akses: `role` tidak bisa diubah dari client.
revoke insert, update, delete on public.profiles from authenticated;
grant  update (name)           on public.profiles to authenticated;

-- ---- announcements --------------------------------------------------
drop policy if exists "announcements_select" on public.announcements;
create policy "announcements_select" on public.announcements
  for select to authenticated using (true);

drop policy if exists "announcements_admin_insert" on public.announcements;
create policy "announcements_admin_insert" on public.announcements
  for insert to authenticated
  with check (public.is_admin() and author_id = (select auth.uid()));

drop policy if exists "announcements_admin_update" on public.announcements;
create policy "announcements_admin_update" on public.announcements
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "announcements_admin_delete" on public.announcements;
create policy "announcements_admin_delete" on public.announcements
  for delete to authenticated using (public.is_admin());

-- ---- schedules ------------------------------------------------------
drop policy if exists "schedules_select" on public.schedules;
create policy "schedules_select" on public.schedules
  for select to authenticated using (true);

drop policy if exists "schedules_admin_insert" on public.schedules;
create policy "schedules_admin_insert" on public.schedules
  for insert to authenticated with check (public.is_admin());

drop policy if exists "schedules_admin_update" on public.schedules;
create policy "schedules_admin_update" on public.schedules
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "schedules_admin_delete" on public.schedules;
create policy "schedules_admin_delete" on public.schedules
  for delete to authenticated using (public.is_admin());

-- ---- tasks ----------------------------------------------------------
drop policy if exists "tasks_select" on public.tasks;
create policy "tasks_select" on public.tasks
  for select to authenticated using (true);

drop policy if exists "tasks_admin_insert" on public.tasks;
create policy "tasks_admin_insert" on public.tasks
  for insert to authenticated
  with check (public.is_admin() and created_by = (select auth.uid()));

drop policy if exists "tasks_admin_update" on public.tasks;
create policy "tasks_admin_update" on public.tasks
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tasks_admin_delete" on public.tasks;
create policy "tasks_admin_delete" on public.tasks
  for delete to authenticated using (public.is_admin());

-- ---- task_completions ----------------------------------------------
-- Mahasiswa melihat/menandai/membatalkan status tugas miliknya sendiri; admin boleh melihat semua (rekap).
drop policy if exists "task_completions_select" on public.task_completions;
create policy "task_completions_select" on public.task_completions
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

drop policy if exists "task_completions_insert_own" on public.task_completions;
create policy "task_completions_insert_own" on public.task_completions
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "task_completions_delete_own" on public.task_completions;
create policy "task_completions_delete_own" on public.task_completions
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---- finance_transactions ------------------------------------------
-- Kas bersifat transparan untuk seluruh anggota kelas; hanya admin (bendahara) yang boleh mencatat.
drop policy if exists "finance_select" on public.finance_transactions;
create policy "finance_select" on public.finance_transactions
  for select to authenticated using (true);

drop policy if exists "finance_admin_insert" on public.finance_transactions;
create policy "finance_admin_insert" on public.finance_transactions
  for insert to authenticated
  with check (public.is_admin() and recorded_by = (select auth.uid()));

drop policy if exists "finance_admin_update" on public.finance_transactions;
create policy "finance_admin_update" on public.finance_transactions
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "finance_admin_delete" on public.finance_transactions;
create policy "finance_admin_delete" on public.finance_transactions
  for delete to authenticated using (public.is_admin());

-- ---- forum_posts ----------------------------------------------------
drop policy if exists "forum_posts_select" on public.forum_posts;
create policy "forum_posts_select" on public.forum_posts
  for select to authenticated using (true);

drop policy if exists "forum_posts_insert_own" on public.forum_posts;
create policy "forum_posts_insert_own" on public.forum_posts
  for insert to authenticated with check (author_id = (select auth.uid()));

drop policy if exists "forum_posts_update_own" on public.forum_posts;
create policy "forum_posts_update_own" on public.forum_posts
  for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

drop policy if exists "forum_posts_delete_own_or_admin" on public.forum_posts;
create policy "forum_posts_delete_own_or_admin" on public.forum_posts
  for delete to authenticated
  using (author_id = (select auth.uid()) or public.is_admin());

-- ---- forum_replies --------------------------------------------------
drop policy if exists "forum_replies_select" on public.forum_replies;
create policy "forum_replies_select" on public.forum_replies
  for select to authenticated using (true);

drop policy if exists "forum_replies_insert_own" on public.forum_replies;
create policy "forum_replies_insert_own" on public.forum_replies
  for insert to authenticated with check (author_id = (select auth.uid()));

drop policy if exists "forum_replies_update_own" on public.forum_replies;
create policy "forum_replies_update_own" on public.forum_replies
  for update to authenticated
  using (author_id = (select auth.uid()))
  with check (author_id = (select auth.uid()));

drop policy if exists "forum_replies_delete_own_or_admin" on public.forum_replies;
create policy "forum_replies_delete_own_or_admin" on public.forum_replies
  for delete to authenticated
  using (author_id = (select auth.uid()) or public.is_admin());

-- ---- study_plans (pribadi) -----------------------------------------
drop policy if exists "study_plans_owner_all" on public.study_plans;
create policy "study_plans_owner_all" on public.study_plans
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));


-- =====================================================================
-- LANGKAH MANUAL SETELAH MENJALANKAN SCRIPT INI
-- =====================================================================
-- 1) Authentication → Providers → Email → NONAKTIFKAN "Allow new users to sign up",
--    lalu tambahkan mahasiswa lewat Authentication → Users → Add/Invite user.
--    (Jika signup publik dibiarkan aktif, siapa pun bisa mendaftar dan membaca data kelas.)
--
-- 2) Jadikan ketua kelas / bendahara sebagai admin (jalankan di SQL Editor):
--      update public.profiles set role = 'admin' where email = 'ketua@kampus.ac.id';
