create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  email text unique,
  name text not null,
  audience text not null check (audience in ('medical-student', 'high-school', 'dental-student')),
  institution text,
  region text,
  year_of_study integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  audience text not null check (audience in ('medical-student', 'high-school', 'dental-student')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_seconds integer,
  app_version text,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  quiz_attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id integer not null check (question_id between 1 and 25),
  answer integer not null check (answer between 1 and 5),
  response_time_ms integer,
  created_at timestamptz not null default now(),
  unique (quiz_attempt_id, question_id)
);

create table if not exists public.trait_scores (
  id uuid primary key default gen_random_uuid(),
  quiz_attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  trait_id text not null,
  score numeric(4, 2) not null check (score >= 1 and score <= 10),
  contributing_questions integer[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (quiz_attempt_id, trait_id)
);

create table if not exists public.specialty_matches (
  id uuid primary key default gen_random_uuid(),
  quiz_attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  specialty_id text not null,
  specialty_name text not null,
  rank integer not null check (rank >= 1),
  raw_score numeric(6, 4) not null,
  match_percentage integer not null check (match_percentage between 0 and 100),
  confidence text not null check (confidence in ('Low', 'Medium', 'High')),
  strengths text[] not null default '{}',
  challenges text[] not null default '{}',
  reasoning text,
  created_at timestamptz not null default now(),
  unique (quiz_attempt_id, specialty_id)
);

create table if not exists public.saved_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  quiz_attempt_id uuid references public.quiz_attempts(id) on delete cascade,
  share_slug text unique not null default encode(gen_random_bytes(9), 'hex'),
  result_payload jsonb not null,
  is_public boolean not null default false,
  view_count integer not null default 0,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_auth_user_id on public.users(auth_user_id);
create index if not exists idx_users_audience_region on public.users(audience, region);
create index if not exists idx_quiz_attempts_user_completed on public.quiz_attempts(user_id, completed_at desc);
create index if not exists idx_quiz_answers_attempt on public.quiz_answers(quiz_attempt_id);
create index if not exists idx_trait_scores_attempt on public.trait_scores(quiz_attempt_id);
create index if not exists idx_specialty_matches_attempt_rank on public.specialty_matches(quiz_attempt_id, rank);
create index if not exists idx_specialty_matches_specialty_rank on public.specialty_matches(specialty_id, rank);
create index if not exists idx_saved_reports_share_slug on public.saved_reports(share_slug);
create index if not exists idx_saved_reports_public on public.saved_reports(is_public) where is_public = true;

alter table public.users enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.trait_scores enable row level security;
alter table public.specialty_matches enable row level security;
alter table public.saved_reports enable row level security;

drop policy if exists "users can read own dataset profile" on public.users;
create policy "users can read own dataset profile"
  on public.users for select
  using (auth.uid() = auth_user_id);

drop policy if exists "users can insert own dataset profile" on public.users;
create policy "users can insert own dataset profile"
  on public.users for insert
  with check (auth.uid() = auth_user_id or auth_user_id is null);

drop policy if exists "users can read own quiz attempts" on public.quiz_attempts;
create policy "users can read own quiz attempts"
  on public.quiz_attempts for select
  using (exists (select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()) or user_id is null);

drop policy if exists "allow quiz attempt inserts" on public.quiz_attempts;
create policy "allow quiz attempt inserts"
  on public.quiz_attempts for insert
  with check (true);

drop policy if exists "allow quiz answer inserts" on public.quiz_answers;
create policy "allow quiz answer inserts"
  on public.quiz_answers for insert
  with check (true);

drop policy if exists "public reports are readable" on public.saved_reports;
create policy "public reports are readable"
  on public.saved_reports for select
  using (is_public = true or exists (select 1 from public.users u where u.id = user_id and u.auth_user_id = auth.uid()));
