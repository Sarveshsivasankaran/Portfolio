import { randomUUID, timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { fetchLinkedInFeed, SyncError } from './linkedin-feed.mjs'

const respond=(res,status,body)=> { res.setHeader('Cache-Control','no-store'); return res.status(status).json(body) }
export function createLinkedInCron({env=process.env,client=createClient,fetchPosts=fetchLinkedInFeed,log=console.error}={}) {
  return async function handler(req,res) {
    if(req.method!=='GET') { res.setHeader('Allow','GET'); return respond(res,405,{error:'method_not_allowed'}) }
    if(!env.CRON_SECRET || env.CRON_SECRET.length<32) return respond(res,503,{error:'cron_not_configured'})
    const received=Buffer.from(typeof req.headers.authorization==='string' ? req.headers.authorization : '')
    const expected=Buffer.from(`Bearer ${env.CRON_SECRET}`)
    if(received.length!==expected.length || !timingSafeEqual(received,expected)) return respond(res,401,{error:'unauthorized'})
    if(!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY?.startsWith('sb_secret_')) return respond(res,503,{error:'database_not_configured'})
    // Prevent an accidental deployment against the user's unrelated Supabase project.
    if(env.SUPABASE_URL!=='https://fxnconsxvbmpkmsxjpjq.supabase.co') return respond(res,503,{error:'wrong_database_project'})
    const db=client(env.SUPABASE_URL,env.SUPABASE_SECRET_KEY,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(url,init)=>fetch(url,{...init,signal:AbortSignal.timeout(15_000)})}})
    const runId=randomUUID(); let acquired=false
    const rpc=async(name,args)=>{ const {data,error}=await db.rpc(name,args); if(error) throw new SyncError('database_sync_failed',500); return data }
    try {
      acquired=await rpc('portfolio_linkedin_begin',{p_run_id:runId})
      if(!acquired) return respond(res,200,{status:'already_running'})
      const posts=await fetchPosts(env)
      const result=await rpc('portfolio_linkedin_apply',{p_run_id:runId,p_posts:posts})
      await rpc('portfolio_linkedin_finish',{p_run_id:runId,p_success:true,p_result:result})
      return respond(res,200,{status:'success',...result})
    } catch(error) {
      const code=error instanceof SyncError ? error.code : 'sync_failed'
      log('[LinkedIn sync]',{runId,code})
      if(acquired) {
        try { await rpc('portfolio_linkedin_finish',{p_run_id:runId,p_success:false,p_result:{code}}) }
        catch { log('[LinkedIn sync]',{runId,code:'failure_recording_failed'}) }
      }
      return respond(res,error instanceof SyncError ? error.status : 500,{error:code,runId})
    }
  }
}
