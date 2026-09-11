create extension if not exists "pgcrypto";

create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp default now(),
  answers jsonb,
  scores jsonb,
  top_specialty text,
  -- Set when a result belongs to a signed-in account. Null for the anonymous
  -- rows the assessment still creates for guests. Owner policies live in
  -- 20260911d_quiz_results_owner_policies.sql.
  user_id uuid
);

alter table public.quiz_results enable row level security;

-- No permissive insert policy here. This file used to create
-- "Anyone can insert quiz results" with check (true), which ORed with the
-- stricter "Anonymous insert quiz results" (user_id is null) added by
-- 20260521 and silently defeated it — Postgres ORs permissive policies.
-- 20260903 was written to drop it but was NEVER APPLIED to production; the
-- policy was still live on 2026-09-11, along with none of that migration's
-- CHECK constraints. Creating it here at all is what made that drift possible,
-- so it is gone rather than dropped-and-recreated. The RLS migrations own the
-- insert policy now.

revoke all on public.quiz_results from anon, authenticated;
-- No grant to anon/authenticated at all. Every write goes through the
-- service-role client (lib/results.ts, and the save-result, quiz-results and
-- health routes), which bypasses grants and RLS entirely, so an anon INSERT
-- grant bought nothing and let anyone holding the public anon key write rows
-- directly through PostgREST. Verified 2026-09-11: service_role INSERT succeeds,
-- anon INSERT is refused with 42501. The insert POLICY and the size constraints
-- stay in place as defence in depth if a client-side write is ever added.

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
-- Deliberately NOT granted to anon/authenticated. This is SECURITY DEFINER, so
-- a public grant made it an unauthenticated RPC returning any row's scores to
-- anyone holding the UUID, with no rate limit in front of it. Nothing calls it:
-- lib/results.ts reads through the service-role client, which bypasses RLS and
-- needs no grant. Kept as a function for future authenticated use.
