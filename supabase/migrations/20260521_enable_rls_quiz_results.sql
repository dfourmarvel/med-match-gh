-- Migration: RLS for public.quiz_results (anonymous-first sharing model)
--
-- MedMatch is anonymous-first: there is no user auth. Results are written
-- server-side with the service role and read back by their unguessable UUID via
-- share links, which are the product feature. These policies make anonymous
-- save + public-by-id read work while RLS is enabled.
--
-- Idempotent: safe to re-run. If an earlier per-user version of this migration
-- was already applied, re-running replaces those policies with the set below.
-- Run in the Supabase SQL editor, or via psql with the service role key.

-- 1) Keep user_id for a possible future authenticated mode (unused while anon).
alter table public.quiz_results
  add column if not exists user_id uuid;

-- 2) Enable Row Level Security.
alter table public.quiz_results enable row level security;

-- 3) Drop any previously created policies so this migration is re-runnable.
drop policy if exists "Insert own quiz results" on public.quiz_results;
drop policy if exists "Select own quiz results" on public.quiz_results;
drop policy if exists "Update own quiz results" on public.quiz_results;
drop policy if exists "Delete own quiz results" on public.quiz_results;
drop policy if exists "Anonymous insert quiz results" on public.quiz_results;
drop policy if exists "Public read quiz results" on public.quiz_results;

-- 4) Anonymous-first policies.
-- Insert: allow anonymous rows only (user_id must be null). The service role
-- bypasses RLS, so server writes are unaffected; this covers any anon-key path.
create policy "Anonymous insert quiz results" on public.quiz_results
  for insert
  with check (user_id is null);

-- Select: results are shared by unguessable UUID, so reads are public. The
-- access control is "you must know the id"; there is no listing endpoint.
create policy "Public read quiz results" on public.quiz_results
  for select
  using (true);

-- NOTES:
-- - No anonymous UPDATE/DELETE policies: rows are immutable once created.
-- - The service role key bypasses RLS entirely; all current server routes use it.
-- - Stricter per-user policies for a future authenticated mode are kept below,
--   commented out. Enable them (and set user_id = auth.uid() on insert) when auth
--   is introduced, and drop the anonymous policies above.
--
-- create policy "Insert own quiz results" on public.quiz_results
--   for insert with check (user_id = auth.uid());
-- create policy "Select own quiz results" on public.quiz_results
--   for select using (user_id = auth.uid());
-- create policy "Update own quiz results" on public.quiz_results
--   for update using (user_id = auth.uid()) with check (user_id = auth.uid());
-- create policy "Delete own quiz results" on public.quiz_results
--   for delete using (user_id = auth.uid());
