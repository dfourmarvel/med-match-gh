-- Migration: Enable RLS on public.quiz_results and add per-user policies
-- Run this in the Supabase SQL editor or via psql using the Service Role key

-- 1) Add a user_id column to associate results with an authenticated user
alter table public.quiz_results
  add column if not exists user_id uuid;

-- 2) Enable Row Level Security
alter table public.quiz_results enable row level security;

-- 3) Policies: allow authenticated users to INSERT/SELECT/UPDATE/DELETE only their own rows
-- Insert: allow if request is authenticated; enforce that user_id equals auth.uid()
create policy "Insert own quiz results" on public.quiz_results
  for insert
  using (auth.uid() is not null)
  with check (user_id = auth.uid());

-- Select: allow users to read only their own rows
create policy "Select own quiz results" on public.quiz_results
  for select
  using (user_id = auth.uid());

-- Update: allow users to update only their own rows
create policy "Update own quiz results" on public.quiz_results
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Delete: allow users to delete only their own rows
create policy "Delete own quiz results" on public.quiz_results
  for delete
  using (user_id = auth.uid());

-- NOTES:
-- - The Supabase service role bypasses RLS; server-side processes using the
--   service role key can still insert/read/update/delete as needed.
-- - If you intend quiz results to be saved anonymously via the anon key,
--   you should NOT expose the anon key with write privileges. Instead,
--   either make inserts only from the server (service role) or create a
--   policy that explicitly allows anon inserts (not recommended).
-- - Run this migration using the Supabase SQL editor (requires a logged-in
--   project owner) or with psql using the service role key.
