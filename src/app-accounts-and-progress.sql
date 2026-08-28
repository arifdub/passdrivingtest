-- ===========================================================================
-- PassDrivingTest.ie — learner accounts, subscription flag, progress tracking
--
-- Run this ONCE in Supabase → SQL Editor. It does not touch your existing
-- slots / bookings / app_settings tables.
--
-- What it creates:
--   profiles   — one row per learner, created automatically on sign-up
--   progress   — one row per learner per module (best score, attempts, pass)
--
-- Subscription is stored but defaults to 'active' for everyone, so nobody
-- pays anything yet. When you add payments later, you change the default and
-- flip rows — no app code has to be restructured.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- 1. PROFILES
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  email               text,
  full_name           text,
  subscription_status text        not null default 'active',
  subscription_plan   text        not null default 'free-access',
  subscription_until  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Note: no delete policy on purpose. A learner deleting their own profile row
-- would orphan their progress. Account deletion is handled from the Supabase
-- dashboard (deleting the auth user cascades to both tables).


-- ---------------------------------------------------------------------------
-- 2. AUTO-CREATE A PROFILE ON SIGN-UP
--    Runs as the definer so it can insert before the new user has a session.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ---------------------------------------------------------------------------
-- 3. PROGRESS
--    module_id is a stable text key from src/appStructure.js, e.g.
--      'driving.theory.mcq.signs'      'adi.theory.mock'
--    One row per learner per module. Best score is kept, never lowered.
-- ---------------------------------------------------------------------------
create table if not exists public.progress (
  id            bigint generated always as identity primary key,
  user_id       uuid        not null references auth.users (id) on delete cascade,
  module_id     text        not null,
  best_pct      int         not null default 0 check (best_pct between 0 and 100),
  last_pct      int         not null default 0 check (last_pct between 0 and 100),
  last_score    int         not null default 0,
  last_total    int         not null default 0,
  attempts      int         not null default 0,
  passed        boolean     not null default false,
  completed_ids jsonb       not null default '[]'::jsonb,  -- flashcards marked known
  updated_at    timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists progress_user_idx on public.progress (user_id);

alter table public.progress enable row level security;

drop policy if exists "progress: read own" on public.progress;
create policy "progress: read own"
  on public.progress for select
  using (auth.uid() = user_id);

drop policy if exists "progress: insert own" on public.progress;
create policy "progress: insert own"
  on public.progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "progress: update own" on public.progress;
create policy "progress: update own"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "progress: delete own" on public.progress;
create policy "progress: delete own"
  on public.progress for delete
  using (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- 4. RECORD A RESULT
--    Called by the app after every quiz or mock test. Keeps the best score,
--    counts the attempt, and stores the most recent attempt separately so the
--    app can show both "best" and "last time".
--
--    p_pass_mark is the module's own pass mark (theory test 88, ADI 75, etc.)
--    so the pass line lives with the module, not hard-coded here.
-- ---------------------------------------------------------------------------
create or replace function public.record_result(
  p_module_id text,
  p_score     int,
  p_total     int,
  p_pass_mark int default 75
)
returns public.progress
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_pct int;
  v_row public.progress;
begin
  if p_total <= 0 then
    raise exception 'total must be greater than zero';
  end if;

  v_pct := round((p_score::numeric / p_total::numeric) * 100);

  insert into public.progress as pr
        (user_id,    module_id,   best_pct, last_pct, last_score, last_total, attempts, passed)
  values (auth.uid(), p_module_id, v_pct,    v_pct,    p_score,    p_total,    1,        v_pct >= p_pass_mark)
  on conflict (user_id, module_id) do update
    set best_pct   = greatest(pr.best_pct, excluded.best_pct),
        last_pct   = excluded.last_pct,
        last_score = excluded.last_score,
        last_total = excluded.last_total,
        attempts   = pr.attempts + 1,
        passed     = pr.passed or excluded.passed,
        updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;


-- ---------------------------------------------------------------------------
-- 5. OPTIONAL — flip everyone's subscription off later
--    Left here commented out as a reminder of where the switch lives.
-- ---------------------------------------------------------------------------
-- alter table public.profiles alter column subscription_status set default 'inactive';
-- update public.profiles set subscription_status = 'inactive' where subscription_until < now();
