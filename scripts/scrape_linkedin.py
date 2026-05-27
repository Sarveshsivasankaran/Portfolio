import asyncio
from playwright.async_api import async_playwright
import os
import json
import re
from datetime import datetime
import urllib.parse

SESSION_FILE = "linkedin_session.json"
FEATURED_URL = "https://www.linkedin.com/in/sarvesh-sivasankaran/details/featured/"
VITE_DATA_FILE = "src/data/linkedinPosts.ts"
VERCEL_API_FILE = "api/linkedin.ts"

def parse_relative_date(date_text):
    """Parse relative date text (e.g. '3 weeks ago', '1 month ago') to a standard ISO date."""
    now = datetime.now()
    if not date_text:
        return now.strftime("%Y-%m-%d")
        
    date_text = date_text.lower().strip()
    match = re.search(r'(\d+)\s*(hour|day|week|month|year)', date_text)
    if not match:
        return now.strftime("%Y-%m-%d")
        
    val = int(match.group(1))
    unit = match.group(2)
    
    # Estimate date
    from datetime import timedelta
    if "hour" in unit:
        delta = timedelta(hours=val)
    elif "day" in unit:
        delta = timedelta(days=val)
    elif "week" in unit:
        delta = timedelta(weeks=val)
    elif "month" in unit:
        delta = timedelta(days=val * 30)
    elif "year" in unit:
        delta = timedelta(days=val * 365)
    else:
        delta = timedelta(0)
        
    calc_date = now - delta
    return calc_date.strftime("%Y-%m-%d")

def clean_url(url):
    """Decode LinkedIn safety redirects to real external URLs."""
    if not url:
        return 'https://in.linkedin.com/in/sarvesh-sivasankaran'
        
    if "linkedin.com/safety/go/?url=" in url or "linkedin.com/safety/go" in url:
        parsed = urllib.parse.urlparse(url)
        params = urllib.parse.parse_qs(parsed.query)
        if "url" in params:
            return params["url"][0]
            
    return url

async def login_and_save_session(playwright):
    # Detect non-interactive CI/Cloud environment to avoid XServer crashes
    if os.environ.get('CI') or os.environ.get('GITHUB_ACTIONS'):
        print("\n" + "="*70)
        print("ERROR: LINKEDIN SESSION COOKIES ARE EXPIRED OR INVALID IN GITHUB SECRETS!")
        print("Because this is running in a non-interactive GitHub Actions cloud container,")
        print("the script cannot launch a manual browser window for you to log in.")
        print("\nTO RESOLVE:")
        print("1. Log in to linkedin.com in your web browser.")
        print("2. Export fresh cookies as JSON (e.g. using the EditThisCookie extension).")
        print("3. Copy that JSON and update your GITHUB REPOSITORY SECRET named: LINKEDIN_SESSION_JSON")
        print("="*70 + "\n")
        raise Exception("Authentication session expired in CI. Update LINKEDIN_SESSION_JSON secret on GitHub.")

    print("\n" + "="*70)
    print("ACTION REQUIRED: LINKEDIN MANUAL LOGIN REQUIRED")
    print("We will launch a Chromium browser window for you.")
    print("Please log in to your LinkedIn account.")
    print("Once you are logged in and see your home feed, the script will detect it")
    print("and automatically proceed to save your session.")
    print("="*70 + "\n")
    
    # Launch headfully so the user can interact
    browser = await playwright.chromium.launch(headless=False)
    context = await browser.new_context()
    page = await context.new_page()
    
    await page.goto("https://www.linkedin.com/login")
    
    # Wait for the URL to change to the home feed or similar logged-in page
    try:
        # Wait up to 3 minutes (180000 ms) for login completion
        await page.wait_for_url("**/feed**", timeout=180000)
        print("\nLogin detected! Finalizing session caching...")
        await page.wait_for_timeout(3000)  # Wait for cookies to write
        await context.storage_state(path=SESSION_FILE)
        print(f"Session state saved successfully to {SESSION_FILE}!")
    except Exception as e:
        print(f"Error or timeout during login: {e}")
    finally:
        await browser.close()

async def scrape_linkedin():
    async with async_playwright() as p:
        # Check if session file exists, if not trigger login
        if not os.path.exists(SESSION_FILE):
            print("No cached LinkedIn session found.")
            await login_and_save_session(p)
            
        if not os.path.exists(SESSION_FILE):
            print("Aborting: Could not establish a valid session.")
            return

        print("Launching scraper in headless mode...")
        browser = await p.chromium.launch(headless=True)
        
        # Load authenticated context
        try:
            context = await browser.new_context(storage_state=SESSION_FILE)
        except Exception as e:
            print(f"Failed to load cached session: {e}. Re-logging in...")
            await login_and_save_session(p)
            context = await browser.new_context(storage_state=SESSION_FILE)
            
        page = await context.new_page()
        
        # Verify if we are indeed logged in by visiting feed
        print("Verifying session status...")
        await page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded")
        if "login" in page.url or "signup" in page.url or "checkpoint" in page.url:
            print("Session expired or invalid. Launching manual login...")
            await browser.close()
            await login_and_save_session(p)
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(storage_state=SESSION_FILE)
            page = await context.new_page()
            await page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded")

        print("Successfully authenticated! Navigating to Featured section page...")
        await page.goto(FEATURED_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(8000)  # Wait for full React render
        
        # Take a screenshot to inspect (saved in local directory)
        await page.screenshot(path="featured_scraped_check.png")
        print("Debugging screenshot saved as featured_scraped_check.png")

        # Infinite scroll using high-fidelity recursive DOM scrolling to bypass LinkedIn scroll barriers
        print("Scrolling page using autoscroll recursive mechanism to trigger all lazy loads...")
        scroll_attempts = 0
        max_attempts = 10 # 10 steps is more than enough to load everything
        
        while scroll_attempts < max_attempts:
            print(f"Executing smart recursive scroll step {scroll_attempts+1}/{max_attempts}...")
            await page.evaluate('''() => {
                function scrollAll(el) {
                    if (el.scrollHeight > el.clientHeight) {
                        el.scrollTop = el.scrollTop + 1200;
                        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
                            el.scrollTop = el.scrollHeight;
                        }
                    }
                    const kids = el.children;
                    if (kids) {
                        for (let i=0; i<kids.length; i++) {
                            scrollAll(kids[i]);
                        }
                    }
                }
                scrollAll(document.body);
            }''')
            await page.wait_for_timeout(2000)
            scroll_attempts += 1

        # Scrape items using our highly validated Prefix matching block
        print("Extracting featured items...")
        raw_items = await page.evaluate('''() => {
            const cards = [];
            const links = document.querySelectorAll('a');
            const prefixes = ["Post", "Link", "Article", "Document", "Certificate", "Certification", "Project", "Media"];
            
            for (const link of links) {
                const text = link.innerText || '';
                const textClean = text.replace(/\\s+/g, ' ').trim();
                
                let matchType = null;
                for (const p of prefixes) {
                    if (textClean.startsWith(p)) {
                        matchType = p.toLowerCase();
                        break;
                    }
                }
                
                if (!matchType) continue;
                
                const href = link.href || '';
                // Skip corporate LinkedIn pages, help articles, or legal links parsed due to 'Link' matching
                if (href.includes('/company/') || href.includes('/help/') || href.includes('/legal/') || href === 'https://www.linkedin.com/') {
                    continue;
                }
                
                // Get nested paragraphs
                const pElements = Array.from(link.querySelectorAll('p')).map(p => p.innerText.trim()).filter(Boolean);
                
                // Get nested image
                const imgEl = link.querySelector('img');
                const image = imgEl ? imgEl.src : '';
                
                cards.push({
                    type: matchType,
                    href: href,
                    image: image,
                    pTexts: pElements
                });
            }
            return cards;
        }''')
        
        await browser.close()
        
        print(f"Scraped {len(raw_items)} items successfully!")
        
        processed_posts = []
        seen_titles = set()
        
        for idx, item in enumerate(raw_items):
            p_texts = item['pTexts']
            href = item['href']
            image = item['image']
            card_type = item['type']
            
            title = ""
            summary = ""
            
            if card_type == "link":
                if len(p_texts) >= 2:
                    title = p_texts[1]
                if len(p_texts) >= 4:
                    summary = p_texts[3]
                else:
                    summary = "Click to view the live project."
                    
            elif card_type in ["post", "article", "document", "certificate", "certification", "project", "media"]:
                if len(p_texts) >= 2:
                    full_content = p_texts[1]
                    lines = [l.strip() for l in full_content.split('\n') if l.strip()]
                    if lines:
                        title = lines[0]
                        summary = "\n\n".join(lines[1:]) if len(lines) > 1 else "Read the full details on LinkedIn."
                
            if not title:
                continue
                
            # Clean lengths
            clean_title = title.strip()
            clean_summary = summary.strip()
            
            # Deduplicate and skip corporate links that might slip through
            if clean_title in seen_titles or clean_title.lower() in ["linkedin", "company", "help", "legal"]:
                continue
            seen_titles.add(clean_title)
            
            # Decode safety external redirects
            url = clean_url(href)
            
            # Classification
            lower_text = (clean_title + " " + clean_summary).lower()
            post_type = 'post'
            badge = 'SYSTEM LOG'
            
            if any(k in lower_text for k in ['hackathon', 'project', 'built', 'developer', 'sih', 'github', 'recexpo', 'notezilla', 'crewai']):
                post_type = 'project'
                badge = 'TACTICAL WIN'
                if 'hackathon' in lower_text or 'sih' in lower_text:
                    badge = 'HACKATHON WINNER'
                elif 'crewai' in lower_text:
                    badge = 'AI WORKFLOW'
            elif any(k in lower_text for k in ['certificate', 'certified', 'award', 'symposium', 'record', 'tifa', 'speaking', 'speaker', 'spoke', 'investiture', 'lead', 'volunteer', 'volunteered', 'ctf', 'mentorship', 'internship', 'intern']):
                post_type = 'certificate'
                badge = 'CREDENTIAL'
                if 'record' in lower_text or 'tifa' in lower_text:
                    badge = 'WORLD RECORD'
                elif 'speaker' in lower_text or 'spoke' in lower_text:
                    badge = 'KEYNOTE SPEAKER'
                elif 'lead' in lower_text:
                    badge = 'CLUB DESIGN LEAD'
                elif 'ctf' in lower_text:
                    badge = 'CTF CHALLENGER'
                elif 'intern' in lower_text or 'internship' in lower_text:
                    badge = 'SECURE INTERN'
            elif any(k in lower_text for k in ['magazine', 'texplore', 'article', 'blog', 'writeup', 'dev log']):
                post_type = 'article'
                badge = 'DEV LOG'
                if 'texplore' in lower_text or 'magazine' in lower_text:
                    badge = 'FEATURED AUTHOR'
                
            # Default placeholder images if scraped is empty
            if not image:
                if post_type == 'project':
                    image = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80"
                elif post_type == 'certificate':
                    image = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"
                else:
                    image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80"
                    
            processed_posts.append({
                "id": idx + 1,
                "title": clean_title,
                "summary": clean_summary,
                "date": datetime.now().strftime("%Y-%m-%d"),
                "url": url,
                "type": post_type,
                "badge": badge,
                "image": image
            })
            
        if len(processed_posts) == 0:
            print("No items extracted. Keeping current files unchanged.")
            return
            
        # Complete historical high-fidelity date mapping
        for post in processed_posts:
            t = post['title']
            s = post['summary']
            full_txt = (t + " " + s).lower()
            
            if "sih" in full_txt or "hackathon 2025" in full_txt:
                post['date'] = "2025-09-15"
            elif "open source" in full_txt:
                post['date'] = "2026-02-20"
            elif "texplore" in full_txt:
                post['date'] = "2026-02-15"
            elif "investiture" in full_txt or "cyber sentinels club" in full_txt:
                post['date'] = "2026-01-10"
            elif "notezilla" in full_txt:
                post['date'] = "2026-01-25"
            elif "student coordinator" in full_txt or "iccsd" in full_txt:
                post['date'] = "2026-05-05"
            elif "summer fest" in full_txt:
                post['date'] = "2026-05-10"
            elif "crewai" in full_txt or "nexora" in full_txt:
                post['date'] = "2026-03-05"
            elif "titanium 2k26" in full_txt or "titanium techfest 2k26" in full_txt or "titanium 2026" in full_txt:
                post['date'] = "2026-02-13"
            elif "technovanza" in full_txt or "jerusalem college" in full_txt:
                post['date'] = "2025-12-10"
            elif "digital dreamers den" in full_txt or "d3 community" in full_txt:
                post['date'] = "2026-01-05"
            elif "january 2k26 meetup" in full_txt:
                post['date'] = "2026-01-28"
            elif "0xti ctf" in full_txt:
                post['date'] = "2026-02-10"
            elif "mentorship program" in full_txt:
                post['date'] = "2025-12-20"
            elif "fix & flex" in full_txt or "cryptrix" in full_txt:
                post['date'] = "2025-10-15"
            elif "joined the intellexa rec" in full_txt or "joined intellexa rec" in full_txt:
                post['date'] = "2025-07-20"
            elif "skillcraft technology" in full_txt or "cybersecurity internship" in full_txt or "cyber security intern" in full_txt:
                post['date'] = "2025-08-15"
            elif "blood donation" in full_txt or "donating 350ml of blood" in full_txt:
                post['date'] = "2025-04-10"
            elif "root@localhost" in full_txt:
                post['date'] = "2025-01-15"
            elif "portfolio" in full_txt:
                post['date'] = "2026-05-20"
            else:
                post['date'] = "2026-05-20"
                
        # Sort by date descending
        processed_posts.sort(key=lambda x: x['date'], reverse=True)
        
        # Re-assign sequential ids
        for i, post in enumerate(processed_posts):
            post['id'] = i + 1
            
        print(f"Processed {len(processed_posts)} highly structured posts.")
        
        # Write to VITE_DATA_FILE
        write_vite_fallback(processed_posts)
        
        # Write to VERCEL_API_FILE
        write_vercel_fallback(processed_posts)
        
        print("\n" + "="*50)
        print("LINKEDIN FEATURED POSTS REFRESHED!")
        print(f"Updates written to: \n- {VITE_DATA_FILE}\n- {VERCEL_API_FILE}")
        print("="*50 + "\n")

def write_vite_fallback(posts):
    typescript_content = f"""export interface LinkedInPost {{
  id: number | string
  title: string
  summary: string
  date: string
  url: string
  type: 'post' | 'article' | 'certificate' | 'project'
  badge: string
  image: string
}}

export const LINKEDIN_POSTS: LinkedInPost[] = {json.dumps(posts, indent=2)};
"""
    with open(VITE_DATA_FILE, "w", encoding="utf-8") as f:
        f.write(typescript_content)
    print(f"Wrote local Vite fallback cache to {VITE_DATA_FILE}")

def write_vercel_fallback(posts):
    # Read existing api/linkedin.ts and replace FALLBACK_POSTS
    if not os.path.exists(VERCEL_API_FILE):
        print(f"Warning: {VERCEL_API_FILE} not found. Skipping Vercel update.")
        return
        
    with open(VERCEL_API_FILE, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Find matching bracket for FALLBACK_POSTS
    start_str = "const FALLBACK_POSTS: LinkedInPost[] = ["
    start_idx = content.find(start_str)
    if start_idx == -1:
        print("Could not find FALLBACK_POSTS declaration in api/linkedin.ts!")
        return
        
    # We want to replace everything from the [ to the closing ] of the array.
    # Let's search for "];" at the end of array
    # Let's find the closing ] that is followed by a newline and optionally comments or next declaration
    end_pattern = r'\]\s*(?=\n\s*(?:export|const|function|async|class|let|var|\n|$))'
    match = re.search(end_pattern, content[start_idx:])
    if not match:
        print("Could not find closing bracket for FALLBACK_POSTS!")
        return
        
    end_idx = start_idx + match.end()
    
    formatted_posts_json = json.dumps(posts, indent=2)
    # Adjust indentation to match Vercel API style (2 spaces)
    indented_json = "\n".join("  " + line for line in formatted_posts_json.split("\n"))
    
    new_content = content[:start_idx] + f"const FALLBACK_POSTS: LinkedInPost[] = {formatted_posts_json}\n" + content[end_idx:]
    
    with open(VERCEL_API_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Updated Vercel Serverless Function fallback in {VERCEL_API_FILE}")

if __name__ == "__main__":
    asyncio.run(scrape_linkedin())
