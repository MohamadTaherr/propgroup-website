import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Add a listener for console messages
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        await page.goto("http://localhost:8080")

        # Verify Signup Modal
        await page.click("#signup-btn")
        await page.wait_for_selector("#signup-modal", state="visible")
        await expect(page.locator("#signup-modal h2")).to_have_text("Sign Up")
        await page.screenshot(path="jules-scratch/verification/signup_modal.png")
        await page.click("#signup-modal .close-btn")
        await expect(page.locator("#signup-modal")).to_be_hidden()

        # Verify Login Modal
        await page.click("#login-btn")
        await page.wait_for_selector("#login-modal", state="visible")
        await expect(page.locator("#login-modal h2")).to_have_text("Login")
        await page.screenshot(path="jules-scratch/verification/login_modal.png")
        await page.click("#login-modal .close-btn")
        await expect(page.locator("#login-modal")).to_be_hidden()

        await browser.close()

asyncio.run(main())
