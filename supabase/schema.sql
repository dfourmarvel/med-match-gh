create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  education_stage text check (education_stage in ('medical-student', 'high-school', 'dental-student')),
  created_at timestamptz default now()
);

create table if not exists public.quiz_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  audience text not null,
  answers jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.trait_scores (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.quiz_submissions(id) on delete cascade,
  trait_scores jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.specialties (
  id text primary key,
  category text not null,
  name text not null,
  description text not null,
  data jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.saved_results (
  id uuid primary key,
  user_id uuid references public.profiles(id) on delete set null,
  audience text not null,
  result_payload jsonb not null,
  created_at timestamptz default now()
);

alter table public.saved_results enable row level security;
alter table public.quiz_submissions enable row level security;
alter table public.trait_scores enable row level security;
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can manage own submissions" on public.quiz_submissions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can manage own trait scores" on public.trait_scores for all using (
  exists (
    select 1 from public.quiz_submissions qs
    where qs.id = submission_id and qs.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.quiz_submissions qs
    where qs.id = submission_id and qs.user_id = auth.uid()
  )
);
create policy "Users can manage own saved results" on public.saved_results for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
