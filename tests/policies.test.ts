// @vitest-environment node
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'
import { afterAll, beforeAll, expect, it } from 'vitest'
let db: PGlite
const admin = '11111111-1111-4111-8111-111111111111'
beforeAll(async () => {
  db = new PGlite()
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    create table auth.users (id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid; $$;
    grant usage on schema public, auth, storage to anon, authenticated, service_role;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
    alter table storage.objects enable row level security;
    grant select, insert, update, delete on storage.objects to anon, authenticated;
    insert into auth.users values ('${admin}');
  `)
  await db.exec(readFileSync('supabase/migrations/202609130001_linkedin_activity_feed.sql', 'utf8'))
  await db.exec(`insert into public.activity_admins values ('${admin}');
    insert into public.linkedin_posts(title,description,linkedin_url,published_at,visible) values
    ('Visible','Summary','https://www.linkedin.com/posts/visible',now(),true),
    ('Hidden','Summary','https://www.linkedin.com/posts/hidden',now(),false);`)
})
afterAll(async () => { await db?.close() })
async function asRole(role: string, sql: string, user = '') {
  await db.exec(`set role ${role}; select set_config('request.jwt.claim.sub', '${user}', false);`)
  try { return await db.query(sql) } finally { await db.exec('reset role') }
}
it('anonymous visitors can read only visible posts and cannot write rows, images, or revisions', async () => {
  expect((await asRole('anon', 'select title from public.linkedin_posts')).rows).toEqual([{ title: 'Visible' }])
  for (const sql of [
    "insert into public.linkedin_posts(title,description,linkedin_url,published_at) values ('Bad','Bad','https://linkedin.com/posts/bad',now())",
    "update public.linkedin_posts set title='Bad'", 'delete from public.linkedin_posts',
    'update public.activity_feed_revision set revision=99',
    "insert into storage.objects(bucket_id,name) values ('linkedin-posts','bad.webp')",
    `insert into public.activity_admins values ('22222222-2222-4222-8222-222222222222')`,
  ]) await expect(asRole('anon', sql)).rejects.toThrow()
})
it('authenticated non-admins cannot elevate themselves or modify content', async () => {
  expect((await asRole('authenticated', 'select public.is_activity_admin() as allowed')).rows).toEqual([{ allowed: false }])
  expect((await asRole('authenticated', 'select title from public.linkedin_posts')).rows).toEqual([{ title: 'Visible' }])
  expect((await asRole('authenticated', 'select user_id from public.activity_admins')).rows).toEqual([])
  await expect(asRole('authenticated', "insert into public.linkedin_posts(title,description,linkedin_url,published_at) values ('Bad','Bad','https://linkedin.com/posts/bad',now())")).rejects.toThrow()
  expect((await asRole('authenticated', "update public.linkedin_posts set title='Bad' returning id")).rows).toEqual([])
  expect((await asRole('authenticated', 'delete from public.linkedin_posts returning id')).rows).toEqual([])
  await expect(asRole('authenticated', `insert into public.activity_admins values ('${admin}')`)).rejects.toThrow()
  await expect(asRole('authenticated', "insert into storage.objects(bucket_id,name) values ('linkedin-posts','bad.webp')")).rejects.toThrow()
})
it('allowlisted admins can manage posts and images; every mutation updates the public invalidation signal', async () => {
  expect((await asRole('authenticated', 'select title from public.linkedin_posts', admin)).rows).toHaveLength(2)
  expect((await asRole('authenticated', 'select user_id from public.activity_admins', admin)).rows).toEqual([{ user_id: admin }])
  const before = (await db.query<{ revision: number }>('select revision from public.activity_feed_revision')).rows[0].revision
  await asRole('authenticated', "insert into public.linkedin_posts(title,description,linkedin_url,published_at) values ('Admin','Summary','https://linkedin.com/posts/admin',now())", admin)
  await asRole('authenticated', "update public.linkedin_posts set visible=false where title='Visible'", admin)
  await asRole('authenticated', "delete from public.linkedin_posts where title='Admin'", admin)
  const after = (await db.query<{ revision: number }>('select revision from public.activity_feed_revision')).rows[0].revision
  expect(Number(after) - Number(before)).toBe(3)
  expect((await asRole('anon', 'select title from public.linkedin_posts')).rows).toEqual([])
  await asRole('authenticated', "insert into storage.objects(bucket_id,name) values ('linkedin-posts','good.webp')", admin)
  await asRole('authenticated', "delete from storage.objects where name='good.webp'", admin)
  await expect(asRole('authenticated', "insert into storage.objects(bucket_id,name) values ('other-bucket','bad.webp')", admin)).rejects.toThrow()
})
it('imports the existing activities without duplicate URLs', async () => {
  const seed = readFileSync('supabase/seed_legacy_activities.sql', 'utf8')
  const before = (await db.query('select id from public.linkedin_posts')).rows.length
  await db.exec(seed)
  const after = (await db.query('select id from public.linkedin_posts')).rows.length
  expect(after - before).toBe(21)
  await db.exec(seed)
  expect((await db.query('select id from public.linkedin_posts')).rows).toHaveLength(after)
})
