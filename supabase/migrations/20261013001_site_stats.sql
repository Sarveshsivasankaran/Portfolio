-- Stores key/value pairs for scraped site stats (e.g. linkedin_followers).
-- Only the Vercel cron (service_role) may write; /api/stats reads via service_role key.
begin;

create table if not exists portfolio_private.site_stats (
  key   text primary key,
  value bigint not null,
  updated_at timestamptz not null default now()
);

-- Seed with safe fallback so the stats endpoint always gets a row
insert into portfolio_private.site_stats (key, value)
values ('linkedin_followers', 5259)
on conflict (key) do nothing;

grant all on portfolio_private.site_stats to service_role;
revoke all on portfolio_private.site_stats from public, anon, authenticated;

commit;
