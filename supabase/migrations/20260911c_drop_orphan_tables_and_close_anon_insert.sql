-- Drop the six orphan tables, and close the last unauthenticated write path.
--
-- Approved explicitly by Daniel on 2026-09-11 ("yes to both, drop the tables and
-- revoke the grant") after 20260911b revoked their grants as an interim measure.
--
-- SAFETY CHECKS RUN IMMEDIATELY BEFORE THIS, all against the live project:
--   * all six tables held 0 rows;
--   * no code in app/, components/ or lib/ addresses any of them — the only
--     table the application touches is quiz_results, at four call sites, all
--     through the service-role client;
--   * NO foreign key connects any of them to quiz_results, so the live table
--     cannot be affected;
--   * no views or other objects depend on them.
--
-- Drop order follows the FK graph, children first:
--   quiz_answers, specialty_matches, trait_scores, saved_reports
--     -> quiz_attempts -> users
-- No CASCADE is used anywhere. If an unexpected dependency exists, this fails
-- loudly rather than quietly taking something else with it.
--
-- ── THE SCHEMA BEING REMOVED, PRESERVED HERE ────────────────────────────────
-- These tables were a real design — the one types/dataset.ts was written
-- against, with per-question response times, per-trait contributing questions
-- and shareable report slugs. It was never wired up, but it is better thought
-- out than what replaced it, so it is recorded rather than only deleted. Recover
-- from this comment or from git history if it is ever wanted.
--
--   users              (id uuid pk, auth_user_id uuid, email text, name text not null,
--                       audience text not null, institution text, region text,
--                       year_of_study int, created_at timestamptz, updated_at timestamptz)
--
--   quiz_attempts      (id uuid pk, user_id uuid -> users, audience text not null,
--                       started_at timestamptz, completed_at timestamptz,
--                       duration_seconds int, app_version text, created_at timestamptz)
--
--   quiz_answers       (id uuid pk, quiz_attempt_id uuid not null -> quiz_attempts,
--                       question_id int not null, answer int not null,
--                       response_time_ms int, created_at timestamptz)
--
--   trait_scores       (id uuid pk, quiz_attempt_id uuid not null -> quiz_attempts,
--                       trait_id text not null, score numeric not null,
--                       contributing_questions int[] not null default '{}',
--                       created_at timestamptz)
--
--   specialty_matches  (id uuid pk, quiz_attempt_id uuid not null -> quiz_attempts,
--                       specialty_id text not null, specialty_name text not null,
--                       rank int not null, raw_score numeric not null,
--                       match_percentage int not null, confidence text not null,
--                       strengths text[] not null default '{}',
--                       challenges text[] not null default '{}',
--                       reasoning text, created_at timestamptz)
--
--   saved_reports      (id uuid pk, user_id uuid -> users,
--                       quiz_attempt_id uuid -> quiz_attempts,
--                       share_slug text not null default encode(gen_random_bytes(9),'hex'),
--                       result_payload jsonb not null, is_public bool not null default false,
--                       view_count int not null default 0, expires_at timestamptz,
--                       created_at timestamptz, updated_at timestamptz)
-- ─────────────────────────────────────────────────────────────────────────────

drop table if exists public.quiz_answers;
drop table if exists public.specialty_matches;
drop table if exists public.trait_scores;
drop table if exists public.saved_reports;
drop table if exists public.quiz_attempts;
drop table if exists public.users;

-- ── The last unauthenticated write path ─────────────────────────────────────
-- quiz_results still granted INSERT to anon and authenticated. Traced: every
-- write goes through serverSupabase (service-role), which bypasses grants and
-- RLS entirely — lib/results.ts:39, app/api/health/route.ts:33,
-- app/api/save-result/route.ts:64, app/api/quiz-results/route.ts:85. There is no
-- browser Supabase client at all; the browserSupabase export was removed
-- earlier in this pass because nothing imported it.
--
-- So the grant bought nothing and allowed anyone holding the public anon key to
-- write rows directly through PostgREST. The "Anonymous insert quiz results"
-- policy and the size constraints from 20260911 stay in place as defence in
-- depth if a client-side insert is ever added deliberately.
revoke insert on public.quiz_results from anon, authenticated;
