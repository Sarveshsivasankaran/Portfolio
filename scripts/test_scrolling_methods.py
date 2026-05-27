import asyncio
from playwright.async_api import async_playwright
import os

SESSION_FILE = "linkedin_session.json"
FEATURED_URL = "https://www.linkedin.com/in/sarvesh-sivasankaran/details/featured/"

async def test_scrolling():
    async with async_playwright() as p:
        if not os.path.exists(SESSION_FILE):
            print("Error: No session file.")
            return

        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(storage_state=SESSION_FILE)
        page = await context.new_page()
        
        await page.goto(FEATURED_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(8000)
        
        # Test 1: PageDown press
        print("Testing Keyboard PageDown...")
        for i in range(5):
            await page.keyboard.press("PageDown")
            await page.wait_for_timeout(500)
        await page.screenshot(path="test_pagedown.png")
        
        # Reset position
        await page.goto(FEATURED_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(5000)
        
        # Test 2: Mouse Wheel
        print("Testing Mouse Wheel...")
        for i in range(5):
            await page.mouse.wheel(0, 1000)
            await page.wait_for_timeout(500)
        await page.screenshot(path="test_wheel.png")

        # Reset position
        await page.goto(FEATURED_URL, wait_until="domcontentloaded")
        await page.wait_for_timeout(5000)

        # Test 3: Scrolling documentElement and body directly
        print("Testing direct DOM scroll...")
        await page.evaluate('''() => {
            const scroller = document.scrollingElement || document.documentElement || document.body;
            scroller.scrollTop = scroller.scrollHeight;
        }''')
        await page.wait_for_timeout(2000)
        await page.screenshot(path="test_direct.png")

        # Test 4: Find any scrollable element and scroll it
        print("Testing auto-scroller element finder...")
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
        await page.wait_for_timeout(2000)
        await page.screenshot(path="test_autoscroller.png")

        await browser.close()
        print("Scrolling tests completed!")

if __name__ == "__main__":
    asyncio.run(test_scrolling())
