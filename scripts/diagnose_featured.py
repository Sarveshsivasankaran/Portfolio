import asyncio
from playwright.async_api import async_playwright
import os
import json

SESSION_FILE = "linkedin_session.json"
FEATURED_URL = "https://www.linkedin.com/in/sarvesh-sivasankaran/details/featured/"

async def diagnose():
    async with async_playwright() as p:
        if not os.path.exists(SESSION_FILE):
            print("Error: No session file found.")
            return

        print("Launching Chromium in headless mode...")
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=SESSION_FILE)
        page = await context.new_page()
        
        print("Navigating to Featured page...")
        await page.goto(FEATURED_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(8000)
        
        # Take initial screenshot
        await page.screenshot(path="diagnose_initial.png")
        print("Initial screenshot saved.")

        # Incremental scroll to trigger lazy loading
        print("Starting incremental scroll...")
        await page.evaluate('''async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 400;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    
                    if (totalHeight >= scrollHeight) {
                        // Click any "See more" or "Show more" button if it appears
                        const buttons = Array.from(document.querySelectorAll('button'));
                        const showMoreBtn = buttons.find(b => {
                            const txt = (b.innerText || '').toLowerCase();
                            return txt.includes('show more') || txt.includes('see more') || txt.includes('load more');
                        });
                        if (showMoreBtn) {
                            showMoreBtn.click();
                        }
                        
                        if (totalHeight >= document.body.scrollHeight + 3000) {
                            clearInterval(timer);
                            resolve();
                        }
                    }
                }, 300);
            });
        }''')
        
        await page.wait_for_timeout(5000)
        await page.screenshot(path="diagnose_final.png")
        print("Final screenshot saved.")
        
        # Dump HTML
        content = await page.content()
        with open("diagnose_featured.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("DOM dumped to diagnose_featured.html")
        
        # Count all links
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
                
                const pElements = Array.from(link.querySelectorAll('p')).map(p => p.innerText.trim()).filter(Boolean);
                cards.push({
                    type: matchType,
                    pTexts: pElements,
                    textSnippet: textClean.substring(0, 100)
                });
            }
            return cards;
        }''')
        
        print(f"\nDiagnostic results: Found {len(raw_items)} matched cards.")
        for idx, c in enumerate(raw_items):
            print(f"Card #{idx+1} [Type: {c['type']}]: {c['pTexts'][1] if len(c['pTexts']) > 1 else c['textSnippet']}")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(diagnose())
