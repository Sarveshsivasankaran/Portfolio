# LinkedIn activity feed

The existing `src/components/Wins.tsx` carousel is preserved. This is a React 18 / TypeScript / Vite 5 SPA with inline styles, global CSS/Tailwind, Framer Motion carousel transitions, native mobile scroll snapping, and GSAP/Spline backgrounds. There was no router, admin login, Supabase client, migration system, or lint script. Vercel API functions already exist under `api/`; `vercel.json` includes the two activity-admin path rewrites and the daily import schedule.

## Configured project

**Deployment-side daily import:** see [daily LinkedIn sync](./linkedin-daily-sync.md). The initial profile scan added 18 newer activities, for 39 total rows (latest 30 shown). The Codex automation is paused. The Vercel Cron endpoint is implemented and its database migration is applied. A hosted LinkedIn feed and production configuration are still required to activate automatic fetching.

Created a dedicated **Sarvesh Portfolio** organization (`lbvilawkovddohbutiqa`) and **Portfolio** project (`fxnconsxvbmpkmsxjpjq`) on the free plan in Mumbai. [Open the project](https://supabase.com/dashboard/project/fxnconsxvbmpkmsxjpjq).

The schema migration and 21-post import are already applied. Storage, RLS, and Realtime are enabled, and the gitignored `.env.local` points to this project using its publishable key. Do not reapply the setup/import to this project. The previously existing project was returned to its original paused state; it is not connected to this portfolio.

Live checks confirmed 21 public posts, denied anonymous INSERT/UPDATE/DELETE and image uploads, and a real UPDATE event followed by an authoritative re-fetch. The actual carousel displayed the 21 database entries in Chrome. Supabase's security advisor returned no findings. The Realtime probe only refreshed an existing row's `updated_at`; its content was unchanged.

**Remaining activation steps:** create and allowlist your own Auth user (step 3 below) to use the protected editor. Until then, manage `linkedin_posts` through the project's Table Editor. The public Supabase variables and frontend are deployed to Vercel. Automatic imports still need the server key and hosted source described in the daily sync guide. Future content updates need no deployment.

## One-time Supabase setup

1. Create/open your Supabase project. Apply `supabase/migrations/202609130001_linkedin_activity_feed.sql` in the SQL Editor, or through your Supabase migration workflow. The migration is intended to run once against a project without these tables. Review existing Storage policies if reusing a bucket, because permissive policies combine with OR.
2. To preserve the old carousel posts, optionally run `supabase/seed_legacy_activities.sql` **once**. It imports 21 existing LinkedIn entries and skips exact URL duplicates. The unusually long CRYPTRIX title is shortened to fit the editor, with the full story retained in its description. The TEXPLORE magazine entry links to an external website, so it remains only in the static fallback; add it through the editor if you have its original LinkedIn post URL. Some old LinkedIn CDN URLs expire; re-upload those images using the editor. The distinct world-record feature above the carousel stays as it is.
3. In Authentication → Users, create an email/password user for yourself. There is no public signup UI. Add the user's UUID to the administrator allowlist in the SQL Editor:

   ```sql
   insert into public.activity_admins (user_id)
   values ('YOUR-AUTH-USER-UUID') on conflict do nothing;
   ```

   Being signed in alone does not grant write access. Anonymous users cannot read or modify this allowlist. Signed-in users can inspect only their own membership and cannot change it. Removing the UUID revokes database access immediately; the UI verifies membership again before saving.
4. Copy the public project URL and modern `sb_publishable_...` key from the project's Connect/API settings into `.env.local`:

   ```env
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
   ```

   Restart Vite after editing environment variables. Configure the same two values in your host's build environment and deploy once. Never put a secret key, service-role key, or database password in any `VITE_` variable. This client intentionally accepts only modern publishable keys.
5. Visit `/admin/activities`, sign in, and add your first activity with its title, summary, HTTPS LinkedIn URL, date, optional category, images, and visibility/featured settings. Dates entered in your local time are stored as timestamps; public dates use UTC.

After setup, add or edit future activities in the admin page or Supabase Table Editor. **Content changes do not require a rebuild or redeployment.** Changing the project's URL/key does require rebuilding this Vite SPA.

## Database, RLS, Storage, and Realtime

- `linkedin_posts` implements all requested columns, an updated-at trigger, a partial feed index, length constraints, and unique LinkedIn URLs.
- The administrator-check RPC uses invoker permissions and membership RLS. The revision trigger is isolated in the non-exposed `portfolio_private` schema.
- Anonymous visitors have SELECT privilege only, restricted to `visible = true`. Authenticated non-admin users also see visible posts only. Only allowlisted administrators can read hidden rows or INSERT/UPDATE/DELETE.
- The `linkedin-posts` Storage bucket is public, accepts WebP/JPEG/PNG/AVIF, and limits objects to 5 MB. New paths are `{post-uuid}/{random-uuid}.{extension}`. Uploads require authenticated admin RLS; anonymous uploads are denied. The editor limits each post to 12 images and shows upload/save state. New uploads are cleaned up if saving fails; cleanup failures are surfaced for manual recovery.
- Public image URLs are saved in `images`. **Hiding a post hides its database content; it does not make an already-public image URL private.** Removing an image from a post or deleting a post deliberately retains Storage objects, so other references are not broken. Remove unneeded objects in Storage after confirming they are unused. Use a private-bucket/signed-URL design if you need confidential media.
- The migration publishes both `linkedin_posts` and `activity_feed_revision` to `supabase_realtime`. A trigger increments a content-free revision after changes. Public clients subscribe to post INSERT/UPDATE/DELETE and revision UPDATE, and re-fetch the authoritative list after a short debounce. The revision handles hidden-row updates suppressed by RLS without exposing hidden contents. Default replica identity keeps deleted-post payloads limited to keys.
- The existing card widths and breakpoints are retained; visible-card counts also measure the available deck width so the last card remains reachable on narrower desktops. The query filters visible posts, sorts featured first, then newest date, then sort order and UUID for stable ties, and limits the feed to 30. The editor paginates 20 records at a time. Images are lazy loaded, collages show at most four, and URLs are validated before rendering links.
- A 30-second refresh while the page is active, window-focus refresh, online reconnect, and subscription acknowledgement refresh recover missed events. Requests have a 12-second timeout. Channels, event listeners, and debounce timers are removed on unmount.
- Configured initial loads use the existing skeletons. If the first fetch fails or configuration is absent, the original static activities remain available. After a successful fetch, the database result (including an empty list) is authoritative. Later transient errors retain the last successful result. Legacy entries are never appended to the live feed; otherwise hidden/deleted entries could reappear.

## Verify Realtime with your project

1. Open the portfolio at `/#wins` in an incognito window. Sign in to `/admin/activities` in a separate normal window.
2. Add a visible activity. It should appear without reloading the visitor page; featured activities sort ahead of other posts.
3. Edit its title/images and save. Verify the same visitor tab updates.
4. Hide it, then show it. Check that hiding removes it immediately via the revision signal. Test a post without images, one image, 2/3/4/5+ images, and a long description.
5. Delete a test activity. It should disappear and carousel navigation should remain in range, including when the last post is deleted.
6. Temporarily block the project's Realtime WebSocket. The active tab should recover through polling within about 30 seconds; restore the connection and check subscription recovery. Blocking all requests should leave the existing page functional.
7. In DevTools Network, inspect the public REST response: it must contain visible rows only. Use a test non-admin account to confirm the editor denies access. Anonymous mutation requests must be rejected; do not test mutation permissions with a service-role key.

## Local verification

```sh
npm test
npm run test:e2e
npm run build
```

For a real-project public API/RLS check with Node 22+:

```sh
node --env-file=.env.local scripts/verify-live-activities.mjs
```

Add `--watch` to wait up to 90 seconds for a real post change made through the Table Editor or authenticated admin page. The script subscribes, re-fetches after a change, and closes its channel. It uses only the publishable key and never intentionally creates public test content.

Latest checks: 29 local tests and 9 browser tests passed; the production build passed. Browser INSERT/UPDATE/hide/DELETE flows use fixtures; the hosted Realtime UPDATE and anonymous access checks also passed against the new project. Hosted admin login/upload testing still requires your Auth user.

- Unit/component tests check safe URLs, field/upload validation, all collage sizes, image fallback, Realtime invalidation, and subscription cleanup.
- `tests/policies.test.ts` runs the actual SQL migration in PGlite (local Postgres) with Supabase auth/storage schema fixtures. It exercises RLS, anonymous/non-admin write rejection, admin operations, bucket isolation, and revision updates. This does not replace testing hosted Supabase Auth, Storage or Realtime.
- Browser tests run the real `Wins` component and Supabase SDK using isolated REST/WebSocket fixtures. They check the six requested widths, card geometry, arrow controls/native mobile scrolling, empty/error states, login protection, and live-update events. Unrelated Spline rendering is stubbed in these focused tests. Test environment settings are isolated to port 4175; no real project is mutated.
- Browser tests use installed Chrome (`channel: 'chrome'`). Install Chrome or adjust the test channel for your environment.
- No repository lint configuration existed; the build runs strict TypeScript checking. Existing third-party bundle-size warnings may remain.

## Production checklist

- Apply the migration, optionally seed once, allowlist your user, and set both public variables in the target deployment environment.
- Deploy once and open the root page plus `/admin/activities` directly, including a browser refresh on the admin path. Vercel rewrites are supplied; other SPA hosts must route that path to `index.html`.
- Check successful REST responses and a subscribed Realtime WebSocket, and repeat the INSERT/UPDATE/hide/DELETE visitor test above against a disposable activity.
- Confirm no service-role/secret key is present in the deployed frontend, verify anonymous RLS restrictions, and check image uploads on the configured bucket.
- Verify the LinkedIn CTA opens a new tab and test actual touch swiping on a phone.

## Files

Created: `.env.example`, `vercel.json`, `src/lib/database.types.ts`, `src/lib/supabase.ts`, `src/lib/linkedinPosts.ts`, `src/lib/activityAdmin.ts`, `src/hooks/useLinkedInPosts.ts`, `src/components/ActivityImages.tsx`, `src/pages/ActivitiesAdmin.tsx`, `src/pages/ActivitiesAdmin.css`, `supabase/migrations/202609130001_linkedin_activity_feed.sql`, `supabase/seed_legacy_activities.sql`, `docs/linkedin-activity-feed.md`, `vitest.config.ts`, `playwright.config.ts`, `tests/activities.test.tsx`, `tests/admin.test.ts`, `tests/feed.test.tsx`, `tests/policies.test.ts`, `tests/e2e/harness.html`, `tests/e2e/harness.tsx`, `tests/e2e/activities.spec.ts`.

Also created: `scripts/verify-live-activities.mjs` and gitignored `.env.local` (local public project settings).

Modified: `src/components/Wins.tsx`, `src/data/linkedinPosts.ts`, `src/main.tsx`, `src/vite-env.d.ts`, `package.json`, `package-lock.json`, `.gitignore`, `README.md`.

Existing edits to `Events.tsx`, `Publications.tsx`, and the world-record feature in `Wins.tsx` were retained.

Implementation references: [Supabase Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes), [Storage access control](https://supabase.com/docs/guides/storage/security/access-control), and [React setup](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs).
