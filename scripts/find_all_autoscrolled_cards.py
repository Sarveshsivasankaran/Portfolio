import asyncio
from playwright.async_api import async_playwright
import os
from lxml import html

SESSION_FILE = "linkedin_session.json"
FEATURED_URL = "https://www.linkedin.com/in/sarvesh-sivasankaran/details/featured/"

async def scroll_and_dump():
    async with async_playwright() as p:
        if not os.path.exists(SESSION_FILE):
            print("Error: No session file.")
            return

        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=SESSION_FILE)
        page = await context.new_page()
        
        await page.goto(FEATURED_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(8000)
        
        print("Starting smart loop scrolling to trigger all lazy-loading...")
        for step in range(8):
            print(f"Scroll step {step+1}/8...")
            await page.evaluate('''() => {
                function scrollAll(el) {
                    if (el.scrollHeight > el.clientHeight) {
                        el.scrollTop = el.scrollHeight;
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
            # Wait for lazy-loading content to load
            await page.wait_for_timeout(2000)
            
        print("Dumping final scrolled HTML...")
        content = await page.content()
        with open("diagnose_scrolled.html", "w", encoding="utf-8") as f:
            f.write(content)
            
        # Let's count unique feed/update links in the DOM
        tree = html.fromstring(content)
        anchors = tree.xpath("//a")
        
        unique_links = {}
        for a in anchors:
            href = a.get('href', '')
            text = a.text_content().strip()
            text_clean = " ".join(text.split())
            if href and len(text_clean) > 20:
                if "feed/update" in href or "safety/go" in href:
                    if href not in unique_links:
                        unique_links[href] = text_clean
                        
        print(f"\nSUCCESS! Found {len(unique_links)} unique potential card links in fully scrolled DOM:")
        for idx, (href, text) in enumerate(unique_links.items()):
            print(f"\nItem #{idx+1}:")
            print(f"  Href: {href}")
            print(f"  Text: {text[:200]}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(scroll_and_dump())
