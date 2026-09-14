import { XMLParser, XMLValidator } from 'fast-xml-parser'

export const PROFILE = 'https://www.linkedin.com/in/sarvesh-sivasankaran/'
export class SyncError extends Error {
  constructor(code, status = 502) { super(code); this.code = code; this.status = status }
}
const array = value => value == null ? [] : Array.isArray(value) ? value : [value]
const decode = value => String(value ?? '').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (whole, entity) => {
  const named = {amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}
  if (!entity.startsWith('#')) return named[entity.toLowerCase()] ?? whole
  const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2),16) : Number(entity.slice(1))
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ''
})
const plain = value => decode(typeof value === 'object' ? value?.['#text'] ?? '' : value)
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()
const limit = (value, max) => Array.from(value).length <= max ? value : Array.from(value).slice(0,max-1).join('').replace(/\s+\S*$/,'')+'…'
const isProfile = value => {
  try { const u = new URL(value); return u.protocol==='https:' && ['www.linkedin.com','linkedin.com'].includes(u.hostname) && u.pathname.replace(/\/$/,'')==='/in/sarvesh-sivasankaran' } catch { return false }
}
const imageUrl = value => {
  try { const u = new URL(decode(value)); return u.protocol==='https:' && u.hostname==='media.licdn.com' && !u.username && !u.password && !u.port ? u.href : null } catch { return null }
}

export function parseLinkedInFeed(body, now = Date.now()) {
  if (Buffer.byteLength(body)>2_000_000) throw new SyncError('feed_too_large')
  let entries
  try {
    if (body.trimStart().startsWith('{')) {
      const feed=JSON.parse(body)
      if (!isProfile(feed.home_page_url ?? feed.source_profile) || !Array.isArray(feed.items)) throw new SyncError('feed_profile_mismatch')
      entries=feed.items.map(item=>({url:item.url, title:item.title, html:item.content_html, text:item.content_text ?? item.description, date:item.date_published ?? item.published_at, images:[item.image,...array(item.images),...array(item.attachments).filter(a=>a.mime_type?.startsWith('image/')).map(a=>a.url)], author: item.author_url ?? item.authors?.[0]?.url, public:item.public}))
    } else {
      if (/<!DOCTYPE|<!ENTITY/i.test(body) || XMLValidator.validate(body)!==true) throw new SyncError('invalid_feed')
      const xml=new XMLParser({ignoreAttributes:false,parseTagValue:false,processEntities:false}).parse(body)
      if (!xml.rss?.channel || !isProfile(decode(xml.rss.channel.link))) throw new SyncError('feed_profile_mismatch')
      entries=array(xml.rss.channel.item).map(item=>({url:item.link,title:item.title,html:item['content:encoded'] ?? item.description,date:item.pubDate ?? item['dc:date'],images:[...array(item['media:content']),...array(item['media:thumbnail']),...array(item.enclosure).filter(a=>a['@_type']?.startsWith('image/'))].map(a=>a['@_url']),author:item.author_url,public:item.public}))
    }
  } catch (error) { if (error instanceof SyncError) throw error; throw new SyncError('invalid_feed') }
  if (entries.length>100) throw new SyncError('feed_batch_too_large')
  const posts=[]
  for (const entry of entries) {
    if (entry.public===false || entry.public==='false' || (entry.author && !isProfile(entry.author))) continue
    let url
    try { url=new URL(decode(entry.url)) } catch { throw new SyncError('invalid_post_url') }
    if (url.protocol!=='https:' || !['www.linkedin.com','linkedin.com'].includes(url.hostname) || url.username || url.password || url.port) throw new SyncError('invalid_post_url')
    const sourceId=url.pathname.match(/(?:urn:li:activity:|activity-)(\d{19})(?:\/|-|$)/)?.[1]
    if (!sourceId) throw new SyncError('missing_activity_id')
    const description=plain(entry.text ?? entry.html)
    const title=plain(entry.title) || description.split(/(?<=[.!?])\s/)[0]
    const date=new Date(entry.date)
    if (!description || !title || !Number.isFinite(date.valueOf()) || date.valueOf()>now+300_000 || date.getUTCFullYear()<2003) throw new SyncError('invalid_post_content')
    const inlineImages=Array.from(String(entry.html ?? '').matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi),m=>m[1])
    const images=[...new Set([...entry.images,...inlineImages].map(imageUrl).filter(Boolean))].slice(0,12)
    posts.push({source_id:sourceId,author:PROFILE,public:true,linkedin_url:`https://www.linkedin.com/feed/update/urn:li:activity:${sourceId}/`,title:limit(title,240),description:limit(description,5000),images,published_at:date.toISOString()})
  }
  return [...new Map(posts.map(post=>[post.source_id,post])).values()]
}

export async function fetchLinkedInFeed(env, fetcher=fetch) {
  if (!env.LINKEDIN_FEED_URL) throw new SyncError('linkedin_feed_not_configured',503)
  let url
  try { url=new URL(env.LINKEDIN_FEED_URL) } catch { throw new SyncError('invalid_feed_configuration',503) }
  if (url.protocol!=='https:' || url.username || url.password || url.port || url.hostname==='localhost' || /^[\d.]+$/.test(url.hostname) || url.hostname.startsWith('[')) throw new SyncError('invalid_feed_configuration',503)
  const controller=new AbortController()
  const timeout=setTimeout(()=>controller.abort(),20_000)
  try {
    const response=await fetcher(url,{signal:controller.signal,redirect:'error',headers:{Accept:'application/feed+json, application/json, application/rss+xml, application/xml',...(env.LINKEDIN_FEED_TOKEN ? {Authorization:`Bearer ${env.LINKEDIN_FEED_TOKEN}`} : {})}})
    if (!response.ok) throw new SyncError(response.status===401 || response.status===403 ? 'feed_access_denied' : 'feed_unavailable')
    if (!response.body || Number(response.headers.get('content-length'))>2_000_000) throw new SyncError('feed_too_large')
    const reader=response.body.getReader(); const chunks=[]; let length=0
    while (true) {
      const {done,value}=await reader.read(); if(done) break
      length+=value.byteLength
      if(length>2_000_000) { await reader.cancel(); throw new SyncError('feed_too_large') }
      chunks.push(value)
    }
    return parseLinkedInFeed(Buffer.concat(chunks).toString('utf8'))
  } catch(error) { if(error instanceof SyncError) throw error; throw new SyncError('feed_fetch_failed') }
  finally { clearTimeout(timeout) }
}
