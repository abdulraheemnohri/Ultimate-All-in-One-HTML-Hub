import asyncio
import os
import subprocess
import time
from playwright.async_api import async_playwright

async def verify_ultimate_hub_v3():
    # Start a simple HTTP server in the background
    server_process = subprocess.Popen(["python3", "-m", "http.server", "8002"])
    time.sleep(2)  # Wait for server to start

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Load the Hub
            await page.goto("http://localhost:8002/index.html")
            await page.wait_for_selector("#desktop")

            # Verify Desktop Icons
            icon_count = await page.evaluate("document.querySelectorAll('.desktop-icon').length")
            print(f"Desktop icons: {icon_count}")
            assert icon_count >= 4

            # Verify Terminal App
            await page.fill("#app-search", "Terminal")
            await page.click("li[data-app='terminal']")
            await page.wait_for_selector(".terminal-app")
            await page.fill("#term-input", "help")
            await page.keyboard.press("Enter")
            print("Terminal 'help' command executed.")

            # Verify Live Wallpaper (Matrix)
            await page.click("#settings-btn")
            await page.wait_for_selector(".settings-app")
            # Click Matrix preset (the one with MTX text)
            await page.click("text=MTX")
            canvas_exists = await page.evaluate("!!document.getElementById('live-wallpaper-canvas')")
            print(f"Live wallpaper canvas exists: {canvas_exists}")
            assert canvas_exists

            # Take a final screenshot
            os.makedirs("/home/jules/verification", exist_ok=True)
            screenshot_path = "/home/jules/verification/ultimate_hub_v3_final.png"
            await page.screenshot(path=screenshot_path, full_page=True)
            print(f"Final screenshot saved to {screenshot_path}")

    finally:
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(verify_ultimate_hub_v3())
