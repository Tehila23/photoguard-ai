-- PhotoGuard AI Supabase schema
-- Run this in the Supabase SQL editor for a new project.

create extension if not exists "pgcrypto";

-- Profiles mirror auth.users for app-facing account data.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memory_shield_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  protected_categories text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  width integer,
  height integer,
  metadata jsonb not null default '{}'::jsonb,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scan_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  total_photos integer not null default 0,
  scanned_photos integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references public.photos(id) on delete cascade,
  session_id uuid not null references public.scan_sessions(id) on delete cascade,
  risk_level text not null check (risk_level in ('safe', 'low', 'medium', 'high')),
  risk_score numeric not null default 0,
  findings jsonb not null default '[]'::jsonb,
  model_version text,
  processing_ms integer,
  raw_response jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (photo_id, session_id)
);

create table if not exists public.user_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  decision text not null check (decision in ('keep', 'remove', 'undo', 'protected')),
  note text,
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (photo_id, user_id)
);

create table if not exists public.cleanup_queue_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'undone', 'completed')),
  queued_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (photo_id, user_id)
);

create table if not exists public.memory_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  memory_date date,
  category text,
  is_protected boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.memory_collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.memory_collections(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (collection_id, photo_id)
);

create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists photos_user_created_idx on public.photos(user_id, created_at desc);
create index if not exists scan_sessions_user_created_idx on public.scan_sessions(user_id, created_at desc);
create index if not exists analysis_results_session_idx on public.analysis_results(session_id);
create index if not exists analysis_results_photo_idx on public.analysis_results(photo_id);
create index if not exists user_decisions_user_idx on public.user_decisions(user_id);
create index if not exists cleanup_queue_user_status_idx on public.cleanup_queue_items(user_id, status);
create index if not exists memory_collections_user_date_idx on public.memory_collections(user_id, memory_date desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        updated_at = now();

  insert into public.memory_shield_preferences (user_id, protected_categories)
  values (new.id, array['family', 'wedding', 'pets'])
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists memory_shield_preferences_updated_at on public.memory_shield_preferences;
create trigger memory_shield_preferences_updated_at before update on public.memory_shield_preferences
for each row execute procedure public.set_updated_at();

drop trigger if exists photos_updated_at on public.photos;
create trigger photos_updated_at before update on public.photos
for each row execute procedure public.set_updated_at();

drop trigger if exists scan_sessions_updated_at on public.scan_sessions;
create trigger scan_sessions_updated_at before update on public.scan_sessions
for each row execute procedure public.set_updated_at();

drop trigger if exists analysis_results_updated_at on public.analysis_results;
create trigger analysis_results_updated_at before update on public.analysis_results
for each row execute procedure public.set_updated_at();

drop trigger if exists cleanup_queue_items_updated_at on public.cleanup_queue_items;
create trigger cleanup_queue_items_updated_at before update on public.cleanup_queue_items
for each row execute procedure public.set_updated_at();

drop trigger if exists memory_collections_updated_at on public.memory_collections;
create trigger memory_collections_updated_at before update on public.memory_collections
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.memory_shield_preferences enable row level security;
alter table public.photos enable row level security;
alter table public.scan_sessions enable row level security;
alter table public.analysis_results enable row level security;
alter table public.user_decisions enable row level security;
alter table public.cleanup_queue_items enable row level security;
alter table public.memory_collections enable row level security;
alter table public.memory_collection_items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);

drop policy if exists "memory_shield_select_own" on public.memory_shield_preferences;
drop policy if exists "memory_shield_insert_own" on public.memory_shield_preferences;
drop policy if exists "memory_shield_update_own" on public.memory_shield_preferences;
drop policy if exists "memory_shield_delete_own" on public.memory_shield_preferences;

create policy "memory_shield_select_own" on public.memory_shield_preferences
for select using (auth.uid() = user_id);
create policy "memory_shield_insert_own" on public.memory_shield_preferences
for insert with check (auth.uid() = user_id);
create policy "memory_shield_update_own" on public.memory_shield_preferences
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "memory_shield_delete_own" on public.memory_shield_preferences
for delete using (auth.uid() = user_id);

drop policy if exists "photos_select_own" on public.photos;
drop policy if exists "photos_insert_own" on public.photos;
drop policy if exists "photos_update_own" on public.photos;
drop policy if exists "photos_delete_own" on public.photos;

create policy "photos_select_own" on public.photos
for select using (auth.uid() = user_id);
create policy "photos_insert_own" on public.photos
for insert with check (auth.uid() = user_id);
create policy "photos_update_own" on public.photos
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "photos_delete_own" on public.photos
for delete using (auth.uid() = user_id);

drop policy if exists "scan_sessions_all_own" on public.scan_sessions;

create policy "scan_sessions_all_own" on public.scan_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "analysis_results_select_own" on public.analysis_results;
drop policy if exists "analysis_results_insert_own" on public.analysis_results;
drop policy if exists "analysis_results_update_own" on public.analysis_results;

create policy "analysis_results_select_own" on public.analysis_results
for select using (
  exists (
    select 1 from public.scan_sessions s
    where s.id = analysis_results.session_id and s.user_id = auth.uid()
  )
);
create policy "analysis_results_insert_own" on public.analysis_results
for insert with check (
  exists (
    select 1 from public.scan_sessions s
    where s.id = analysis_results.session_id and s.user_id = auth.uid()
  )
);
create policy "analysis_results_update_own" on public.analysis_results
for update using (
  exists (
    select 1 from public.scan_sessions s
    where s.id = analysis_results.session_id and s.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.scan_sessions s
    where s.id = analysis_results.session_id and s.user_id = auth.uid()
  )
);

drop policy if exists "user_decisions_all_own" on public.user_decisions;

create policy "user_decisions_all_own" on public.user_decisions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cleanup_queue_all_own" on public.cleanup_queue_items;

create policy "cleanup_queue_all_own" on public.cleanup_queue_items
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "memory_collections_all_own" on public.memory_collections;

create policy "memory_collections_all_own" on public.memory_collections
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "memory_collection_items_select_own" on public.memory_collection_items;
drop policy if exists "memory_collection_items_insert_own" on public.memory_collection_items;
drop policy if exists "memory_collection_items_delete_own" on public.memory_collection_items;

create policy "memory_collection_items_select_own" on public.memory_collection_items
for select using (
  exists (
    select 1 from public.memory_collections c
    where c.id = memory_collection_items.collection_id and c.user_id = auth.uid()
  )
);
create policy "memory_collection_items_insert_own" on public.memory_collection_items
for insert with check (
  exists (
    select 1 from public.memory_collections c
    where c.id = memory_collection_items.collection_id and c.user_id = auth.uid()
  )
);
create policy "memory_collection_items_delete_own" on public.memory_collection_items
for delete using (
  exists (
    select 1 from public.memory_collections c
    where c.id = memory_collection_items.collection_id and c.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "photos_storage_select_own" on storage.objects;
drop policy if exists "photos_storage_insert_own" on storage.objects;
drop policy if exists "photos_storage_update_own" on storage.objects;
drop policy if exists "photos_storage_delete_own" on storage.objects;

create policy "photos_storage_select_own" on storage.objects
for select using (
  bucket_id = 'photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "photos_storage_insert_own" on storage.objects
for insert with check (
  bucket_id = 'photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "photos_storage_update_own" on storage.objects
for update using (
  bucket_id = 'photos'
  and auth.uid()::text = (storage.foldername(name))[1]
) with check (
  bucket_id = 'photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
create policy "photos_storage_delete_own" on storage.objects
for delete using (
  bucket_id = 'photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);
