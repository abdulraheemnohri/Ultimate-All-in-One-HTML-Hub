import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def verify_ultimate_hub_v4():
    # Start a simple HTTP server in the background
    server_process = subprocess.Popen(["python3", "-m", "http.server", "8003"])
    time.sleep(2)  # Wait for server to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Load the Hub
            await page.goto("http://localhost:8003/index.html")
            await page.wait_for_selector("#desktop")

            # Verify Widgets
            widget_count = await page.evaluate("document.querySelectorAll('.widget').length")
            print(f"Desktop widgets: {widget_count}")
            assert widget_count >= 2

            # Verify Global Search (indexing VFS)
            await page.fill("#app-search", "Tasks")
            await page.wait_for_selector("#global-search-results")
            print("Global search results displayed.")

            # Verify Workspace Switcher
            await page.click("#workspace-switcher button:nth-child(2)")
            print("Switched to Workspace 2.")

            # Verify Power User App (Code Editor)
            await page.fill("#app-search", "Code Editor")
            # Target specifically the search result
            await page.click("#global-search-results li")
            await page.wait_for_selector(".code-editor-app")
            print("Code Editor app loaded dynamically.")

            # Take a final screenshot
            os.makedirs("/home/jules/verification", exist_ok=True)
            screenshot_path = "/home/jules/verification/ultimate_hub_v4_final.png"
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"Final v4 screenshot saved to {screenshot_path}")

    finally:
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(verify_ultimate_hub_v4())
