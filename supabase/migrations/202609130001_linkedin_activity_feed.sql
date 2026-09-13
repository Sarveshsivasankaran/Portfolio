-- Apply once with Supabase migrations or the SQL Editor. No frontend secrets needed.
begin;

create table public.linkedin_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 240),
  description text not null check (char_length(btrim(description)) between 1 and 5000),
  linkedin_url text not null unique check (linkedin_url ~ '^https://([A-Za-z0-9-]+\.)*linkedin\.com/[^[:space:]]+$'),
  images text[] not null default '{}' check (cardinality(images) <= 12),
  category text check (char_length(category) <= 80),
  published_at timestamptz not null,
  featured boolean not null default false,
  visible boolean not null default true,
  sort_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index linkedin_posts_feed_idx on public.linkedin_posts (featured desc, published_at desc, sort_order, id) where visible;
alter table public.linkedin_posts enable row level security;

-- Only the SQL Editor / privileged server may manage this allowlist.
create table public.activity_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.activity_admins enable row level security;
revoke all on public.activity_admins from public, anon, authenticated;
grant all on public.activity_admins to service_role;
grant select on public.activity_admins to authenticated;
create policy "Users inspect their own admin membership" on public.activity_admins
for select to authenticated using (user_id = (select auth.uid()));

create function public.is_activity_admin() returns boolean
language sql stable security invoker set search_path = ''
as $$ select exists (select 1 from public.activity_admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_activity_admin() from public, anon;
grant execute on function public.is_activity_admin() to authenticated;

revoke all on public.linkedin_posts from public, anon, authenticated;
grant select on public.linkedin_posts to anon;
grant select, insert, update, delete on public.linkedin_posts to authenticated;
grant all on public.linkedin_posts to service_role;
create policy "Visitors read visible activities" on public.linkedin_posts for select to anon, authenticated using (visible = true);
create policy "Activity admins read all" on public.linkedin_posts for select to authenticated using ((select public.is_activity_admin()));
create policy "Activity admins insert" on public.linkedin_posts for insert to authenticated with check ((select public.is_activity_admin()));
create policy "Activity admins update" on public.linkedin_posts for update to authenticated using ((select public.is_activity_admin())) with check ((select public.is_activity_admin()));
create policy "Activity admins delete" on public.linkedin_posts for delete to authenticated using ((select public.is_activity_admin()));

create function public.touch_linkedin_post() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger linkedin_posts_updated_at before update on public.linkedin_posts for each row execute function public.touch_linkedin_post();

-- A public, content-free invalidation signal handles visible -> hidden updates
-- that the posts' SELECT policy correctly prevents anonymous clients from seeing.
create table public.activity_feed_revision (
  id smallint primary key default 1 check (id = 1),
  revision bigint not null default 0
);
insert into public.activity_feed_revision (id) values (1);
alter table public.activity_feed_revision enable row level security;
revoke all on public.activity_feed_revision from public, anon, authenticated;
grant select on public.activity_feed_revision to anon, authenticated;
grant all on public.activity_feed_revision to service_role;
create policy "Public feed invalidation" on public.activity_feed_revision for select to anon, authenticated using (true);
create schema portfolio_private;
revoke all on schema portfolio_private from public, anon, authenticated;
create function portfolio_private.invalidate_activity_feed() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.activity_feed_revision set revision = revision + 1 where id = 1;
  return null;
end;
$$;
revoke all on function portfolio_private.invalidate_activity_feed() from public, anon, authenticated;
revoke all on function public.touch_linkedin_post() from public, anon, authenticated;
create trigger linkedin_posts_invalidate after insert or update or delete on public.linkedin_posts for each row execute function portfolio_private.invalidate_activity_feed();

-- Default replica identity sends only the primary key for deleted rows, not hidden content.
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  alter publication supabase_realtime add table public.linkedin_posts, public.activity_feed_revision;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('linkedin-posts', 'linkedin-posts', true, 5242880, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy "Activity admins upload images" on storage.objects for insert to authenticated
with check (bucket_id = 'linkedin-posts' and (select public.is_activity_admin()));
create policy "Activity admins inspect images" on storage.objects for select to authenticated
using (bucket_id = 'linkedin-posts' and (select public.is_activity_admin()));
create policy "Activity admins remove images" on storage.objects for delete to authenticated
using (bucket_id = 'linkedin-posts' and (select public.is_activity_admin()));
-- No upsert/overwrite permission; uploads always have random unique filenames.
commit;
