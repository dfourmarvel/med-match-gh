-- Close the unauthenticated write surface on quiz_results, and remove two dead
-- read surfaces. Verified against the live project (atfxbatiooamydfqbltz) on
-- 2026-09-11 before and after.
--
-- WHY THIS EXISTS AT ALL: 20260903_fix_quiz_results_insert_policy.sql was
-- committed but NEVER APPLIED to production. Checked directly: the policy it
-- drops was still present, and none of its three CHECK constraints existed. The
-- repository said this was fixed on 3 September; the database disagreed.
--
-- 1. THE PERMISSIVE INSERT POLICY (the real problem)
--    "Anyone can insert quiz results" — with check (true), granted to anon and
--    authenticated — was still live alongside the stricter "Anonymous insert
--    quiz results" (user_id is null). Postgres ORs permissive policies, so the
--    stricter one was decorative. Combined with anon holding a real INSERT
--    grant, that is an unauthenticated, unvalidated, unbounded write path
--    straight into the table through PostgREST, bypassing the API route's Zod
--    validation and its rate limiter entirely.
--
-- 2. THE SIZE AND SHAPE CONSTRAINTS
--    Re-applied from 20260903 with one correction. That migration required
--    `jsonb_typeof(answers) = 'object'`, but the app writes an ARRAY:
--    [{"questionId":"q1","selectedOption":"4"}, ...]. All three existing rows
--    are arrays, so the original constraint could never have been added, and
--    had it somehow been forced it would have rejected every future insert.
--    Checked live before writing this: answers is 1,308 bytes, scores peaks at
--    2,413 — both far inside the caps.
--
-- 3. THE DEAD READ SURFACES
--    "Public read quiz results" (using true) is INERT, not exploitable: anon and
--    authenticated hold INSERT only, and grants are checked before policies, so
--    PostgREST refuses the select before the policy is consulted. Dropped as
--    dead surface rather than as a live hole — it would become one the moment
--    anyone added a SELECT grant.
--
--    get_quiz_result(uuid) is SECURITY DEFINER and granted EXECUTE to anon, so
--    it genuinely does return any row's scores to anyone holding the UUID, with
--    no rate limit in front of it. Nothing calls it: lib/results.ts now reads
--    through the service-role client only, and the RPC branch it used to have
--    was unreachable anyway (serverSupabase is non-null only when the
--    service-role key is set). The function is kept, the public grant is not.
--
-- Idempotent: safe to re-run.

-- 1 ---------------------------------------------------------------------------
drop policy if exists "Anyone can insert quiz results" on public.quiz_results;

-- 2 ---------------------------------------------------------------------------
-- Postgres has no `add constraint if not exists`, so each is guarded.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'quiz_results_top_specialty_len') then
    alter table public.quiz_results
      add constraint quiz_results_top_specialty_len
      check (char_length(top_specialty) <= 120);
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'quiz_results_answers_shape') then
    alter table public.quiz_results
      add constraint quiz_results_answers_shape
      check (
        answers is null
        or (jsonb_typeof(answers) = 'array' and pg_column_size(answers) <= 65536)
      );
  end if;
end
$$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'quiz_results_scores_shape') then
    alter table public.quiz_results
      add constraint quiz_results_scores_shape
      check (
        scores is null
        or (jsonb_typeof(scores) = 'object' and pg_column_size(scores) <= 16384)
      );
  end if;
end
$$;

-- 3 ---------------------------------------------------------------------------
drop policy if exists "Public read quiz results" on public.quiz_results;

revoke execute on function public.get_quiz_result(uuid) from anon, authenticated;
