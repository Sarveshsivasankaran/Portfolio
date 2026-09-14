begin;

grant usage on schema portfolio_private to service_role;
create table portfolio_private.linkedin_sync_state (
  source_id text primary key,
  post_id uuid references public.linkedin_posts(id) on delete set null,
  managed boolean not null default false,
  snapshot jsonb not null default '{}'
);
create table portfolio_private.linkedin_sync_runs (
  id uuid primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running','success','failed')),
  result jsonb
);
create index linkedin_sync_state_post_idx on portfolio_private.linkedin_sync_state(post_id);
create table portfolio_private.linkedin_sync_lock (
  id boolean primary key default true check (id),
  run_id uuid,
  expires_at timestamptz not null default '-infinity'
);
insert into portfolio_private.linkedin_sync_lock(id) values (true);
alter table portfolio_private.linkedin_sync_state enable row level security;
alter table portfolio_private.linkedin_sync_runs enable row level security;
alter table portfolio_private.linkedin_sync_lock enable row level security;
revoke all on portfolio_private.linkedin_sync_state, portfolio_private.linkedin_sync_runs, portfolio_private.linkedin_sync_lock from public, anon, authenticated;
grant all on portfolio_private.linkedin_sync_state, portfolio_private.linkedin_sync_runs, portfolio_private.linkedin_sync_lock to service_role;

-- Bootstrap existing content as curated. A separate one-time transfer may mark
-- matching records from the old local ledger as source-managed.
insert into portfolio_private.linkedin_sync_state(source_id, post_id)
select substring(linkedin_url from '(?:activity:|activity-)([0-9]{19})'), id
from public.linkedin_posts
where linkedin_url ~ '(?:activity:|activity-)[0-9]{19}'
on conflict do nothing;

create function public.portfolio_linkedin_begin(p_run_id uuid) returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update portfolio_private.linkedin_sync_lock set run_id=p_run_id, expires_at=now()+interval '5 minutes'
  where id and expires_at < now();
  if not found then return false; end if;
  update portfolio_private.linkedin_sync_runs set status='failed', finished_at=now(), result='{"code":"lease_expired"}'
  where status='running' and started_at < now()-interval '5 minutes';
  insert into portfolio_private.linkedin_sync_runs(id) values(p_run_id);
  delete from portfolio_private.linkedin_sync_runs where id in
    (select id from portfolio_private.linkedin_sync_runs order by started_at desc offset 100);
  return true;
end;
$$;

create function public.portfolio_linkedin_apply(p_run_id uuid, p_posts jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
#variable_conflict use_variable
declare
  item jsonb; state portfolio_private.linkedin_sync_state; current_post public.linkedin_posts;
  candidate public.linkedin_posts; source_id text; post_uuid uuid; media text[];
  inserted_count integer:=0; updated_count integer:=0; skipped_count integer:=0;
begin
  perform 1 from portfolio_private.linkedin_sync_lock where id and run_id=p_run_id and expires_at>now() for update;
  if not found then raise exception 'Sync lease missing or expired'; end if;
  if jsonb_typeof(p_posts) is distinct from 'array' or jsonb_array_length(p_posts)>100 then raise exception 'Invalid sync batch'; end if;
  for item in select value from jsonb_array_elements(p_posts) loop
    source_id:=item->>'source_id';
    if source_id is null or source_id !~ '^[0-9]{19}$' then raise exception 'Invalid activity ID'; end if;
    if item->>'linkedin_url' is distinct from 'https://www.linkedin.com/feed/update/urn:li:activity:'||source_id||'/' then raise exception 'Invalid post URL'; end if;
    if item->>'author' is distinct from 'https://www.linkedin.com/in/sarvesh-sivasankaran/' or item->>'public' is distinct from 'true' then raise exception 'Unverified source'; end if;
    if coalesce(length(btrim(item->>'title')),0) not between 1 and 240 or coalesce(length(btrim(item->>'description')),0) not between 1 and 5000 then raise exception 'Invalid post text'; end if;
    if jsonb_typeof(item->'images') is distinct from 'array' or jsonb_array_length(item->'images')>12 then raise exception 'Invalid images'; end if;
    select coalesce(array_agg(value),'{}') into media from jsonb_array_elements_text(item->'images');
    if exists(select 1 from unnest(media) u where u !~ '^https://media[.]licdn[.]com/[^[:space:]]+$') then raise exception 'Invalid content image host'; end if;
    if item->>'published_at' is null or (item->>'published_at')::timestamptz < '2003-01-01'::timestamptz or (item->>'published_at')::timestamptz>now()+interval '5 minutes' then raise exception 'Invalid post date'; end if;
    select * into state from portfolio_private.linkedin_sync_state s where s.source_id=source_id;
    if found then
      if not state.managed or state.post_id is null then skipped_count:=skipped_count+1; continue; end if;
      select * into current_post from public.linkedin_posts where id=state.post_id for update;
      if not found then skipped_count:=skipped_count+1; continue; end if;
      candidate:=current_post;
      if current_post.title=state.snapshot->>'title' then candidate.title:=item->>'title'; end if;
      if current_post.description=state.snapshot->>'description' then candidate.description:=item->>'description'; end if;
      if current_post.published_at=(state.snapshot->>'published_at')::timestamptz then candidate.published_at:=(item->>'published_at')::timestamptz; end if;
      if to_jsonb(current_post.images)=state.snapshot->'images' and cardinality(media)>0 then candidate.images:=media; end if;
      if row(candidate.title,candidate.description,candidate.published_at,candidate.images) is distinct from row(current_post.title,current_post.description,current_post.published_at,current_post.images) then
        update public.linkedin_posts set title=candidate.title,description=candidate.description,published_at=candidate.published_at,images=candidate.images where id=state.post_id;
        updated_count:=updated_count+1;
      else skipped_count:=skipped_count+1; end if;
      if cardinality(media)=0 then item:=jsonb_set(item,'{images}',coalesce(state.snapshot->'images','[]')); end if;
      update portfolio_private.linkedin_sync_state s set snapshot=item where s.source_id=source_id;
    else
      select id into post_uuid from public.linkedin_posts where linkedin_url ~ ('(^|[^0-9])'||source_id||'([^0-9]|$)') limit 1;
      if found then
        insert into portfolio_private.linkedin_sync_state(source_id,post_id,managed) values(source_id,post_uuid,false);
        skipped_count:=skipped_count+1;
      else
        insert into public.linkedin_posts(title,description,linkedin_url,images,published_at)
        values(item->>'title',item->>'description',item->>'linkedin_url',media,(item->>'published_at')::timestamptz) returning id into post_uuid;
        insert into portfolio_private.linkedin_sync_state(source_id,post_id,managed,snapshot) values(source_id,post_uuid,true,item);
        inserted_count:=inserted_count+1;
      end if;
    end if;
  end loop;
  return jsonb_build_object('inserted',inserted_count,'updated',updated_count,'unchanged',skipped_count);
end;
$$;

create function public.portfolio_linkedin_finish(p_run_id uuid, p_success boolean, p_result jsonb) returns void
language plpgsql security invoker set search_path = '' as $$
begin
  update portfolio_private.linkedin_sync_runs set status=case when p_success then 'success' else 'failed' end,finished_at=now(),result=p_result where id=p_run_id and status='running';
  update portfolio_private.linkedin_sync_lock set run_id=null,expires_at='-infinity' where id and run_id=p_run_id;
end;
$$;
revoke all on function public.portfolio_linkedin_begin(uuid), public.portfolio_linkedin_apply(uuid,jsonb), public.portfolio_linkedin_finish(uuid,boolean,jsonb) from public,anon,authenticated;
grant execute on function public.portfolio_linkedin_begin(uuid), public.portfolio_linkedin_apply(uuid,jsonb), public.portfolio_linkedin_finish(uuid,boolean,jsonb) to service_role;
commit;
