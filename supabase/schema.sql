create extension if not exists "pgcrypto";

create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp default now(),
  answers jsonb,
  scores jsonb,
  top_specialty text
);

alter table public.quiz_results enable row level security;

drop policy if exists "Anyone can insert quiz results" on public.quiz_results;
create policy "Anyone can insert quiz results"
  on public.quiz_results
  for insert
  to anon, authenticated
  with check (true);

revoke all on public.quiz_results from anon, authenticated;
grant insert on public.quiz_results to anon, authenticated;

create or replace function public.get_quiz_result(p_result_id uuid)
returns table (scores jsonb)
language sql
security definer
set search_path = public
as $$
  select quiz_results.scores
  from public.quiz_results
  where quiz_results.id = p_result_id
  limit 1;
$$;

revoke all on function public.get_quiz_result(uuid) from public;
grant execute on function public.get_quiz_result(uuid) to anon, authenticated;
