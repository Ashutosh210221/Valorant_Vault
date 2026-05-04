-- ============================================================
-- AshuValz Valorant Portfolio — Supabase Schema
-- Run this entire file in Supabase Dashboard → SQL Editor.
-- It creates all tables, security rules, and helper functions.
-- ============================================================

-- ===== PROFILES =====
-- One row per signed-up user. Auto-created on signup via trigger.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  ign         text,
  rank        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Trigger: when a new auth user is created, create their profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ===== PORTFOLIOS =====
-- One saved loadout slot per user (PK = user_id).
create table if not exists public.portfolios (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text default 'My Loadout',
  data       jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.portfolios enable row level security;

drop policy if exists "portfolios_select_own" on public.portfolios;
drop policy if exists "portfolios_insert_own" on public.portfolios;
drop policy if exists "portfolios_update_own" on public.portfolios;
drop policy if exists "portfolios_delete_own" on public.portfolios;

create policy "portfolios_select_own" on public.portfolios
  for select using (auth.uid() = user_id);
create policy "portfolios_insert_own" on public.portfolios
  for insert with check (auth.uid() = user_id);
create policy "portfolios_update_own" on public.portfolios
  for update using (auth.uid() = user_id);
create policy "portfolios_delete_own" on public.portfolios
  for delete using (auth.uid() = user_id);


-- ===== FEEDBACK VOTES =====
-- Exactly one vote per user (PK = user_id). Re-voting overwrites.
create table if not exists public.feedback_votes (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  vote       text not null check (vote in ('up','down')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.feedback_votes enable row level security;

drop policy if exists "feedback_select_own" on public.feedback_votes;
drop policy if exists "feedback_insert_own" on public.feedback_votes;
drop policy if exists "feedback_update_own" on public.feedback_votes;

create policy "feedback_select_own" on public.feedback_votes
  for select using (auth.uid() = user_id);
create policy "feedback_insert_own" on public.feedback_votes
  for insert with check (auth.uid() = user_id);
create policy "feedback_update_own" on public.feedback_votes
  for update using (auth.uid() = user_id);

-- ===== FEEDBACK TOTALS (anonymous-friendly counter) =====
-- Two-row aggregate counter table that anyone can increment via the
-- cast_feedback_vote() RPC below. Lets us count votes from anonymous
-- users (no login required). Logged-in users ALSO get a row in
-- feedback_votes above so we can see who voted what.
create table if not exists public.feedback_totals (
  kind  text primary key check (kind in ('up','down')),
  count bigint not null default 0
);

insert into public.feedback_totals (kind, count) values ('up', 0)
  on conflict (kind) do nothing;
insert into public.feedback_totals (kind, count) values ('down', 0)
  on conflict (kind) do nothing;

alter table public.feedback_totals enable row level security;

drop policy if exists "feedback_totals_select_all" on public.feedback_totals;
create policy "feedback_totals_select_all" on public.feedback_totals
  for select using (true);

-- Anyone (including anon) can increment a counter via this RPC.
-- SECURITY DEFINER bypasses RLS so the increment succeeds even though
-- writes to the table are otherwise denied.
create or replace function public.cast_feedback_vote(p_vote text)
returns table(up_count bigint, down_count bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid;
begin
  if p_vote not in ('up','down') then
    raise exception 'Invalid vote';
  end if;

  -- Always bump the public counter.
  update public.feedback_totals
    set count = count + 1
    where kind = p_vote;

  -- If the caller is logged in, also record their per-user vote.
  v_uid := auth.uid();
  if v_uid is not null then
    insert into public.feedback_votes (user_id, vote, updated_at)
      values (v_uid, p_vote, now())
      on conflict (user_id) do update
        set vote = excluded.vote,
            updated_at = excluded.updated_at;
  end if;

  return query
    select
      (select count from public.feedback_totals where kind = 'up')   as up_count,
      (select count from public.feedback_totals where kind = 'down') as down_count;
end;
$$;

grant execute on function public.cast_feedback_vote(text) to anon, authenticated;

-- Read-only totals fetcher — used by the public widget to show counts.
create or replace function public.get_feedback_totals()
returns table(up_count bigint, down_count bigint)
language sql
security definer
set search_path = public
as $$
  select
    (select count from public.feedback_totals where kind = 'up')   as up_count,
    (select count from public.feedback_totals where kind = 'down') as down_count;
$$;

grant execute on function public.get_feedback_totals() to anon, authenticated;


-- ===== DOWNLOAD EVENTS =====
-- One row each time a logged-in user downloads a portfolio image.
create table if not exists public.download_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  skin_count int default 0,
  ign        text,
  rank       text,
  created_at timestamptz default now()
);

create index if not exists download_events_user_id_idx on public.download_events(user_id);

alter table public.download_events enable row level security;

drop policy if exists "downloads_select_own" on public.download_events;
drop policy if exists "downloads_insert_own" on public.download_events;

create policy "downloads_select_own" on public.download_events
  for select using (auth.uid() = user_id);
create policy "downloads_insert_own" on public.download_events
  for insert with check (auth.uid() = user_id);
