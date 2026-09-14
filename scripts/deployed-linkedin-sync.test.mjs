import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'
import { parseLinkedInFeed, fetchLinkedInFeed, PROFILE, SyncError } from '../server/linkedin-feed.mjs'
import { createLinkedInCron } from '../server/linkedin-cron.mjs'

const url='https://www.linkedin.com/posts/sarvesh-example-activity-7504373235493343232-abcd'
const item={url,title:'A milestone',content_text:'A public post',date_published:'2026-09-12T03:00:03Z',image:'https://media.licdn.com/dms/image/photo?e=1'}
const feed=items=>JSON.stringify({version:'https://jsonfeed.org/version/1.1',home_page_url:PROFILE,items})
const post=()=>parseLinkedInFeed(feed([item]))[0]

test('parses RSS and JSON feeds with dates, plain text, media, and stable activity IDs',()=>{
  assert.equal(parseLinkedInFeed(feed([item,item])).length,1)
  const rss=`<rss><channel><link>${PROFILE}</link><item><link>${url}</link><title>Testing &amp; learning</title><description><![CDATA[<p>A <b>public</b> post.</p><img src="https://media.licdn.com/dms/image/photo?e=1&amp;x=2">]]></description><pubDate>Sat, 12 Sep 2026 03:00:03 GMT</pubDate></item></channel></rss>`
  const parsed=parseLinkedInFeed(rss)[0]
  assert.equal(parsed.title,'Testing & learning')
  assert.equal(parsed.description,'A public post.')
  assert.equal(parsed.images[0],'https://media.licdn.com/dms/image/photo?e=1&x=2')
  assert.equal(parsed.source_id,'7504373235493343232')
})

test('rejects gated/invalid feeds and skips explicitly private or other-author posts',()=>{
  for(const body of ['<html>Sign in</html>','<!DOCTYPE rss><rss/>',feed([{...item,date_published:'invalid'}]),feed([{...item,url:'https://linkedin.com.evil.test/activities/1'}]),JSON.stringify({home_page_url:'https://www.linkedin.com/in/other/',items:[item]})]) assert.throws(()=>parseLinkedInFeed(body))
  assert.deepEqual(parseLinkedInFeed(feed([{...item,public:false},{...item,author_url:'https://www.linkedin.com/in/other/'}])),[])
  assert.deepEqual(parseLinkedInFeed(feed([])),[])
  assert.deepEqual(parseLinkedInFeed(feed([{...item,image:'javascript:alert(1)'}]))[0].images,[])
})

test('requires a real hosted source and rejects failed/oversized responses',async()=>{
  await assert.rejects(fetchLinkedInFeed({}),/not_configured/)
  await assert.rejects(fetchLinkedInFeed({LINKEDIN_FEED_URL:'http://localhost/a'}),/configuration/)
  await assert.rejects(fetchLinkedInFeed({LINKEDIN_FEED_URL:'https://feed.example/a'},async()=>new Response('login',{status:403})),/access_denied/)
  await assert.rejects(fetchLinkedInFeed({LINKEDIN_FEED_URL:'https://feed.example/a'},async()=>new Response('x',{headers:{'content-length':'2000001'}})),/too_large/)
  assert.equal((await fetchLinkedInFeed({LINKEDIN_FEED_URL:'https://feed.example/a'},async()=>new Response(feed([item])))).length,1)
})

test('cron authenticates, rejects missing setup, logs failures, and respects leases',async()=>{
  const env={CRON_SECRET:'x'.repeat(40),SUPABASE_URL:'https://fxnconsxvbmpkmsxjpjq.supabase.co',SUPABASE_SECRET_KEY:'sb_secret_test'}
  const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(body){this.body=body;return this}})
  const request={method:'GET',headers:{authorization:`Bearer ${env.CRON_SECRET}`}}
  const calls=[]
  const client=()=>({rpc:async(name,args)=>{calls.push([name,args]);return {error:null,data:name.endsWith('begin') ? true : {inserted:1,updated:0,unchanged:0}}}})
  let handler=createLinkedInCron({env,client,fetchPosts:async()=>[post()],log:()=>{}})
  assert.equal((await handler({...request,headers:{}},response())).code,401)
  assert.equal((await handler({...request,method:'POST'},response())).code,405)
  assert.equal((await handler(request,response())).body.status,'success')
  assert.equal(calls.length,3)
  calls.length=0
  handler=createLinkedInCron({env,client,fetchPosts:async()=>{throw new SyncError('linkedin_feed_not_configured',503)},log:()=>{}})
  assert.equal((await handler(request,response())).code,503)
  assert.equal(calls[1][1].p_success,false)
  assert.equal(calls.some(([name])=>name.endsWith('apply')),false)
  handler=createLinkedInCron({env,client:()=>({rpc:async()=>({data:false,error:null})}),fetchPosts:async()=>assert.fail('must not fetch while locked')})
  assert.equal((await handler(request,response())).body.status,'already_running')
  assert.equal((await createLinkedInCron({env:{}})(request,response())).code,503)
})

test('hosted SQL protects permissions and atomically syncs while preserving curation and tombstones',async()=>{
  const db=new PGlite()
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create schema storage; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql as $$ select null::uuid $$;
      grant usage on schema public,auth,storage to anon,authenticated,service_role;
      create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      create table storage.objects(id uuid primary key,bucket_id text);`)
    await db.exec(readFileSync('supabase/migrations/202609130001_linkedin_activity_feed.sql','utf8'))
    await db.exec(readFileSync('supabase/migrations/20260913184039_deployed_linkedin_sync.sql','utf8'))
    for(const role of ['anon','authenticated']) {
      await db.exec(`set role ${role}`)
      await assert.rejects(db.query('select public.portfolio_linkedin_begin($1)',[randomUUID()]))
      await assert.rejects(db.query('select * from portfolio_private.linkedin_sync_state'))
      await db.exec('reset role')
    }
    await db.exec('set role service_role')
    const runId=randomUUID()
    assert.equal((await db.query('select public.portfolio_linkedin_begin($1) as acquired',[runId])).rows[0].acquired,true)
    assert.equal((await db.query('select public.portfolio_linkedin_begin($1) as acquired',[randomUUID()])).rows[0].acquired,false)
    const apply=posts=>db.query('select public.portfolio_linkedin_apply($1,$2::jsonb) as result',[runId,JSON.stringify(posts)])
    const initial=post()
    assert.equal((await apply([initial])).rows[0].result.inserted,1)
    assert.equal((await apply([initial])).rows[0].result.unchanged,1)
    await db.exec("update public.linkedin_posts set title='Curated',visible=false,featured=true")
    const updated={...initial,title:'Source title',description:'New source summary',images:['https://media.licdn.com/dms/image/fresh']}
    assert.equal((await apply([updated])).rows[0].result.updated,1)
    const row=(await db.query('select * from public.linkedin_posts')).rows[0]
    assert.equal(row.title,'Curated'); assert.equal(row.visible,false); assert.equal(row.featured,true)
    assert.equal(row.description,'New source summary'); assert.deepEqual(row.images,updated.images)
    await apply([{...updated,images:[]}])
    assert.deepEqual((await db.query('select images from public.linkedin_posts')).rows[0].images,updated.images)
    await assert.rejects(apply([{...updated,description:'Must roll back'},{...initial,source_id:'bad'}]))
    assert.equal((await db.query('select description from public.linkedin_posts')).rows[0].description,'New source summary')
    await db.exec('delete from public.linkedin_posts')
    await apply([updated])
    assert.equal((await db.query('select * from public.linkedin_posts')).rows.length,0)
    await db.query('select public.portfolio_linkedin_finish($1,true,$2::jsonb)',[runId,'{"inserted":1}'])
    assert.equal((await db.query('select status from portfolio_private.linkedin_sync_runs')).rows[0].status,'success')
  } finally { await db.close() }
})
