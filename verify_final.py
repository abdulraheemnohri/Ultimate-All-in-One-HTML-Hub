
import asyncio
from playwright.async_api import async_playwright

async def verify_final():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Test Tablet/Mobile viewports too
        viewports = [
            {'width': 1280, 'height': 720, 'name': 'desktop'},
            {'width': 375, 'height': 667, 'name': 'mobile'}
        ]

        for vp in viewports:
            page = await browser.new_page(viewport={'width': vp['width'], 'height': vp['height']})
            print(f"Verifying {vp['name']} layout...")
            await page.goto('http://localhost:8080')

            # Initial Lock Screen
            await page.wait_for_selector('#lock-screen')
            await page.screenshot(path=f'/home/jules/verification/final_lock_{vp["name"]}.png')

            # Login
            await page.click('text=Default')
            await page.wait_for_selector('#pin-area', state='visible')
            for digit in "1234":
                await page.click(f'.numpad button:has-text("{digit}")')
            await page.click('.numpad button:has-text("OK")')

            # Wait for Hub
            await page.wait_for_selector('#lock-screen', state='hidden', timeout=10000)
            await page.wait_for_selector('#workspace')

            # Open Kids Edu
            print("Opening Kids Edu...")
            if vp['name'] == 'mobile':
                await page.click('#start-menu-btn') # Open sidebar

            await page.click('li[data-app="kids-edu"]')
            await page.wait_for_selector('.window.active', state='visible')
            await page.screenshot(path=f'/home/jules/verification/final_dashboard_{vp["name"]}.png')

            # Open User Manager (if desktop)
            if vp['name'] == 'desktop':
                print("Opening User Manager...")
                await page.click('li[data-app="user-manager"]')
                await page.wait_for_selector('.user-manager-app', state='visible')
                await page.screenshot(path=f'/home/jules/verification/final_usermanager.png')

            await page.close()

        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify_final())
