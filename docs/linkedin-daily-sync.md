# Daily LinkedIn import in production

Vercel Cron calls `/api/cron/linkedin`, which reads a hosted RSS 2.0 or JSON feed and imports validated posts into Supabase. Realtime refreshes the existing Wins & Activity carousel after database changes. The deployed job uses no local computer, Codex task, or signed-in browser.

## Activation status

- The former Codex automation `daily-linkedin-portfolio-sync` is **paused**.
- The endpoint and daily schedule are deployed to the existing Vercel production project. The public Supabase variables, server URL, and private cron token are configured. `SUPABASE_SECRET_KEY` and a hosted source are still missing. Live checks returned 401 for anonymous requests and 503 `database_not_configured` for an authenticated request.
- The database migration is already applied to **Portfolio** (`fxnconsxvbmpkmsxjpjq`) in **Sarvesh Portfolio**. Do not use or resume the old project.
- There are **39 posts**: 21 curated entries and 18 imported public authored posts. The newest imported post is September 12, 2026. The carousel shows the latest 30, featured first.
- The source ledger is now in the database: 18 imported entries are managed; 21 curated entries are protected. The gitignored `.linkedin-sync` folder is only a historical backup.
- **Automatic LinkedIn fetching is not active:** no server-accessible feed has been connected. `LINKEDIN_FEED_URL` is deliberately unset. A profile URL is a web page, not a feed. With database credentials configured but no source, an authenticated request records a failed run and returns HTTP 503 `linkedin_feed_not_configured`.

LinkedIn documents personal-profile `r_member_social` access as closed to new requests. A suitable source must be connected separately; installing an SDK does not grant access. Do not upload browser cookies or LinkedIn passwords. [LinkedIn API FAQ](https://learn.microsoft.com/en-us/linkedin/marketing/lms-faq?view=li-lms-2025-09).

## Production setup

Use the existing Vercel project `portfolio` (`prj_wz62btZnDkXJvDPdhrDlze1XAlHv`) in team `team_va5xKyQWDOKMrNMEIjIbMynU`, serving [the portfolio](https://solo-p-leveller-portfolio.vercel.app).

Set these variables in Vercel's **Project Settings → Environment Variables → Production**, then deploy:

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://fxnconsxvbmpkmsxjpjq.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | This project's `sb_publishable_...` key |
| `SUPABASE_URL` | `https://fxnconsxvbmpkmsxjpjq.supabase.co` |
| `SUPABASE_SECRET_KEY` | This project's server-only `sb_secret_...` key |
| `CRON_SECRET` | A cryptographically random value of at least 32 characters |
| `LINKEDIN_FEED_URL` | A real HTTPS RSS 2.0 or JSON endpoint for the profile |
| `LINKEDIN_FEED_TOKEN` | Optional bearer token required by that source |

Mark credentials sensitive. Never prefix server credentials with `VITE_`, commit them, or print them in logs. Vercel sends `CRON_SECRET` as a bearer token; unauthorized requests are rejected. The endpoint also refuses configuration against another Supabase project.

`vercel.json` schedules a daily run at **03:30 UTC / 09:00 India time**. Cron runs on production deployments. Hobby execution can occur within the scheduled hour, so the exact minute is not guaranteed. This is a daily import; database-to-browser updates use Realtime. [Vercel cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs), [timing and plan limits](https://vercel.com/docs/cron-jobs/usage-and-pricing).

## Feed contract

Configure the source for [this profile](https://www.linkedin.com/in/sarvesh-sivasankaran/)'s **public authored posts**, excluding other people's reposts. Feed metadata identifies the configured profile; it is not independent proof of visibility or authorship.

- **RSS 2.0:** `channel.link` is the profile URL. Items provide a LinkedIn `link`, `title`, `description` or `content:encoded`, and `pubDate` or `dc:date`. Image enclosures, `media:content`, `media:thumbnail`, and inline images are recognized. Atom is not supported.
- **JSON Feed:** `home_page_url` (or `source_profile`) is the profile URL and `items` is an array. Entries provide `url`, `title`, `content_text` (or `description`/`content_html`), and `date_published` (or `published_at`). Optional `image`, `images`, or image `attachments` supply media. Explicitly private or mismatched-author entries are skipped.

URLs must contain a 19-digit LinkedIn activity ID; alternate URLs deduplicate to the same activity. Text is converted to plain text and bounded to database limits. Up to 12 HTTPS `media.licdn.com` images are accepted. The source must provide absolute publication dates and refresh expiring image URLs. Responses are limited to 100 items and 2 MB. Redirects, login pages, invalid XML, external entity declarations, and failed responses are rejected. An empty valid feed never deletes existing posts.

## Preservation and diagnostics

`supabase/migrations/20260913184039_deployed_linkedin_sync.sql` creates the private ledger, run log, and five-minute lease. It is already applied to the configured project. For a fresh database, apply it after the original activity-feed migration.

Service-only RPCs apply each batch atomically; overlapping runs return `already_running`. Repeated imports are idempotent. Each title, description, image array, and date updates only if it still matches the previous source snapshot. Manual edits, visibility, featured status, category, and sort order are preserved. Missing media never erases existing images. Deleted rows leave ledger tombstones and cannot be recreated by imports. Retain the private ledger in backups.

Inspect the last 100 runs in the Supabase SQL Editor:

```sql
select started_at, finished_at, status, result
from portfolio_private.linkedin_sync_runs
order by started_at desc
limit 20;
```

Failures store sanitized codes without credentials or source URLs. The three private tables deliberately have RLS with no public policies or grants. Supabase may report informational `rls_enabled_no_policy` notices; only the service role can access these tables.

After deployment and source configuration, run the job from Vercel's Cron Jobs dashboard and verify a successful run and carousel update. An unauthenticated request should return 401 once `CRON_SECRET` is configured. Success returns insertion/update/unchanged counts. Deployment alone does not confirm a working LinkedIn source.

## Verification

```sh
npm run test:sync
npm test
npm run build
```

Sync tests execute the real migrations in Postgres/PGlite and check permissions, authentication, overlapping runs, failed feeds, deduplication, atomic rollback, manual edits, image refresh, and deletion preservation. Vite does not serve Vercel API routes; use `vercel dev` or a deployed function for HTTP checks.
