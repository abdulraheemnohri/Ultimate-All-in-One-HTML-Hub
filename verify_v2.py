import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def verify_ultimate_hub_v2():
    # Start a simple HTTP server in the background
    server_process = subprocess.Popen(["python3", "-m", "http.server", "8001"])
    time.sleep(2)  # Wait for server to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Load the Hub
            await page.goto("http://localhost:8001/index.html")
            await page.wait_for_selector("#desktop")

            # Verify Sidebar count (should be 47+)
            app_count = await page.evaluate("document.querySelectorAll('#sidebar-nav li').length")
            print(f"Total apps in sidebar: {app_count}")
            assert app_count >= 47

            # Verify Toast system
            await page.evaluate("Utils.showToast('Test Toast', 'success')")
            await page.wait_for_selector(".toast.show")
            print("Toast system verified.")

            # Verify Collapsible Sidebar
            before_h = await page.evaluate("document.querySelector('#sidebar-nav ul').offsetHeight")
            await page.click(".nav-group h3") # Collapse first group
            time.sleep(0.5)
            after_h = await page.evaluate("document.querySelector('#sidebar-nav ul').offsetHeight")
            print(f"Sidebar collapse: {before_h} -> {after_h}")
            # Note: OffsetHeight might be 0 if display none

            # Test System Monitor App
            await page.fill("#app-search", "System Monitor")
            await page.click("li[data-app='sysmon']")
            await page.wait_for_selector(".sysmon-app")
            print("System Monitor App opened successfully.")

            # Take a final screenshot
            os.makedirs("/home/jules/verification", exist_ok=True)
            screenshot_path = "/home/jules/verification/ultimate_hub_v2_final.png"
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"Final screenshot saved to {screenshot_path}")

    finally:
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(verify_ultimate_hub_v2())
