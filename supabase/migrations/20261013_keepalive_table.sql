-- One-row table the keep-alive ping writes to.
--
-- Why: the previous ping only read (a count-only request on quiz_results, twice
-- a week) and passed every run through 21 Sep 2026, yet Supabase still paused
-- the project by 24 Sep. Most likely reads at that rate did not count as
-- activity (not proven: the failing runs only show the query erroring), so
-- /api/health now writes here once a day instead.
--
-- Only the service-role key (server-side, bypasses RLS) can touch it: RLS is on
-- with no policies, and the browser-facing roles have no grants at all.

create table if not exists public.keepalive (
  id smallint primary key default 1 check (id = 1),
  pinged_at timestamptz not null default now()
);

alter table public.keepalive enable row level security;

revoke all on public.keepalive from anon, authenticated;

-- Explicit, rather than relying on Supabase's default privileges.
grant select, insert, update on public.keepalive to service_role;
