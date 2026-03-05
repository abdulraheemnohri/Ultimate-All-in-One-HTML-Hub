import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def verify_final_hub():
    # Start a simple HTTP server in the background
    server_process = subprocess.Popen(["python3", "-m", "http.server", "8000"])
    time.sleep(2)  # Wait for server to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Load the Hub
            await page.goto("http://localhost:8000/index.html")
            await page.wait_for_selector("#desktop")

            # Verify Sidebar count (should be 35+)
            app_count = await page.evaluate("document.querySelectorAll('#sidebar-nav li').length")
            print(f"Total apps in sidebar: {app_count}")
            assert app_count >= 35

            # Test Analytics App
            await page.fill("#app-search", "Analytics")
            await page.click("li[data-app='analytics']")
            await page.wait_for_selector(".analytics-app")
            print("Analytics App opened successfully.")

            # Test Markdown App
            await page.fill("#app-search", "MD Editor")
            await page.click("li[data-app='markdown']")
            await page.wait_for_selector(".markdown-app")
            print("Markdown App opened successfully.")

            # Take a final screenshot
            os.makedirs("/home/jules/verification", exist_ok=True)
            screenshot_path = "/home/jules/verification/ultimate_hub_final.png"
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"Final screenshot saved to {screenshot_path}")

    finally:
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(verify_final_hub())
