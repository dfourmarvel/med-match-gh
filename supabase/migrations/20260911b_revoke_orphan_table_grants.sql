-- Revoke public API access to six orphan tables.
--
-- FOUND 2026-09-11 while closing the quiz_results surface. The live project has
-- SEVEN tables in `public`; the repository's schema.sql creates ONE. These six
-- are left over from an abandoned earlier design — the same schema the deleted
-- seed pipeline and types/dataset.ts were written against:
--
--   users, saved_reports, quiz_attempts, quiz_answers,
--   specialty_matches, trait_scores
--
-- All six are EMPTY, and nothing in app/, components/ or lib/ references any of
-- them (grepped for `.from("<table>")`). All six nonetheless carried full CRUD
-- grants to anon and authenticated — SELECT, INSERT, UPDATE, DELETE, TRUNCATE,
-- REFERENCES, TRIGGER. RLS was enabled on every one, which is the only reason
-- this was not already being exploited, but three real gaps sat behind it:
--
--   * quiz_attempts — SELECT policy is `... OR (user_id IS NULL)`, so every
--     anonymous row is world-readable, and its INSERT policy is `with check
--     (true)`. Anyone could write rows and read all anonymous ones.
--   * quiz_answers — INSERT `with check (true)` and no SELECT policy: a
--     write-only dumping ground open to anon.
--   * users — INSERT `with check (auth.uid() = auth_user_id OR auth_user_id IS
--     NULL)`, so anon could create arbitrary profile rows.
--
--   specialty_matches and trait_scores have RLS on and ZERO policies, so they
--   already denied everything — safe, but with grants that said otherwise.
--
-- Revoking the grants closes all of it without touching data or schema. Grants
-- are checked before policies, so this is the outer fence going back up.
--
-- NOT DROPPED. These tables are empty and unused and probably should be dropped,
-- but that is destructive and irreversible, so it is Daniel's call to make
-- deliberately rather than a side effect of a security pass.
--
-- Idempotent: safe to re-run.

revoke all on public.users              from anon, authenticated;
revoke all on public.saved_reports      from anon, authenticated;
revoke all on public.quiz_attempts      from anon, authenticated;
revoke all on public.quiz_answers       from anon, authenticated;
revoke all on public.specialty_matches  from anon, authenticated;
revoke all on public.trait_scores       from anon, authenticated;
