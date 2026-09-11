-- Owner policies for quiz_results, added alongside sign-in.
--
-- Context: the app gained Supabase Auth so the full report (all five matches,
-- both charts, the PDF) can be gated behind an account. quiz_results already
-- had a user_id column and an anonymous-insert policy; this adds the
-- authenticated half.
--
-- Note on the access path: every application read and write still goes through
-- a server route on the service role, which bypasses RLS. These policies are a
-- floor for the day something does reach the table with a user's own JWT, not
-- the mechanism the app depends on.
--
-- auth.uid() is wrapped in a scalar subquery so Postgres evaluates it once per
-- statement instead of once per row.
--
-- Applied via MCP on 2026-09-11; this file is the record of that change.

-- Signed-in users may insert rows they own.
drop policy if exists "Owners insert quiz results" on public.quiz_results;
create policy "Owners insert quiz results"
  on public.quiz_results
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- ...and read back only their own.
drop policy if exists "Owners read own quiz results" on public.quiz_results;
create policy "Owners read own quiz results"
  on public.quiz_results
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- ...and update only their own. Claiming a guest row (setting user_id on a row
-- where it IS NULL) happens on the service role in /api/claim-result, since by
-- definition the claimer does not own the row yet.
drop policy if exists "Owners update own quiz results" on public.quiz_results;
create policy "Owners update own quiz results"
  on public.quiz_results
  for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Owner lookups are the only per-user query shape. Partial: anonymous rows are
-- the majority and are never fetched by user_id.
create index if not exists quiz_results_user_id_idx
  on public.quiz_results (user_id)
  where user_id is not null;
