-- Migration: close the permissive insert policy left over from schema.sql,
-- and put basic shape/size limits on quiz_results columns.
--
-- schema.sql creates "Anyone can insert quiz results" (with check (true), granted
-- to anon + authenticated). The 20260521 RLS migration added a stricter
-- "Anonymous insert quiz results" policy (user_id is null) but never dropped the
-- older permissive one, so both policies were active and the permissive one won
-- (Postgres RLS policies are OR'd together for a given command). This migration
-- removes it, leaving only the anonymous-first policy from 20260521.
--
-- Idempotent: safe to re-run.

drop policy if exists "Anyone can insert quiz results" on public.quiz_results;

-- Cap top_specialty length. Postgres has no `add constraint if not exists`, so
-- guard via pg_constraint.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'quiz_results_top_specialty_len'
  ) then
    alter table public.quiz_results
      add constraint quiz_results_top_specialty_len
      check (char_length(top_specialty) <= 120);
  end if;
end
$$;

-- answers/scores must be JSON objects, not arrays/scalars/null, and bounded in
-- size so a single row can't be used to stuff arbitrary large payloads.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'quiz_results_answers_shape'
  ) then
    alter table public.quiz_results
      add constraint quiz_results_answers_shape
      check (
        answers is null
        or (jsonb_typeof(answers) = 'object' and pg_column_size(answers) <= 65536)
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'quiz_results_scores_shape'
  ) then
    alter table public.quiz_results
      add constraint quiz_results_scores_shape
      check (
        scores is null
        or (jsonb_typeof(scores) = 'object' and pg_column_size(scores) <= 16384)
      );
  end if;
end
$$;
