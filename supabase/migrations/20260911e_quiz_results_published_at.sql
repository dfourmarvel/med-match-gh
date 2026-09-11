-- Publishing gate for share links.
--
-- A result row is only readable through its /share/<id> link once it has been
-- published, which requires a signed-in user pressing Save.
--
-- Why: the sign-in gate was bypassable by the visitor themselves. The
-- assessment writes a guest's row id into their browser, the row holds the full
-- re-scored result (it has to — storing the locked payload corrupted the record
-- and broke the share link permanently), and share links are public. So reading
-- that id out of devtools and opening /share/<id> returned the entire unlocked
-- report without an account.
--
-- Applied via MCP on 2026-09-11; this file is the record of that change.

alter table public.quiz_results
  add column if not exists published_at timestamptz;

-- Everything that exists today predates the gate and may already have been
-- shared with a mentor, so those links must keep working.
update public.quiz_results
  set published_at = coalesce(created_at, now())
  where published_at is null;

create index if not exists quiz_results_published_at_idx
  on public.quiz_results (published_at)
  where published_at is not null;
