from playwright.sync_api import sync_playwright
import base64
import time
import os

# Small sample PNG (1x1 transparent)
SAMPLE_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAn8B9Yb2YgAAAABJRU5ErkJggg=="


def run():
    img_bytes = base64.b64decode(SAMPLE_PNG_B64)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Collect console messages for debugging
        console_messages = []

        def _on_console(msg):
            try:
                console_messages.append(f"{msg.type}: {msg.text}")
            except Exception:
                console_messages.append(f"console message error: {msg}")

        page.on('console', _on_console)

        # Open app
        page.goto('http://127.0.0.1:8000/index.html', timeout=60000)

        # Wait for table and open first product modal
        page.wait_for_selector('.check-btn', timeout=30000)
        page.locator('.check-btn').first.click()

        # Wait for modal to be visible
        page.wait_for_selector('#checklist-modal.active, .modal.active', timeout=10000)

        # Find the first visible file input inside the modal
        file_input = page.locator('input[type=file][id^="photo-"]')
        if file_input.count() == 0:
            print('ERROR: No file input found in modal')
            browser.close()
            raise SystemExit(2)

        # Attach sample image via buffer
        file_input.first.set_input_files({
            'name': 'sample.png',
            'mimeType': 'image/png',
            'buffer': img_bytes,
        })

        # Click save
        try:
            page.click('#save-btn')
        except Exception:
            # Some setups may require clicking via JS if obscured
            page.evaluate("document.getElementById('save-btn')?.click()")
        time.sleep(1)

        # Commit session to history
        page.click('#commit-session-btn')

        # Wait a bit for transaction to complete
        time.sleep(3)

        # Switch to history tab and wait for table rows
        page.evaluate("switchTab('historial')")
        page.wait_for_selector('.view-details-btn', timeout=15000)

        # Open first details modal and assert image exists
        try:
            page.locator('.view-details-btn').first.click()
            page.wait_for_selector('#history-detail-modal.active', timeout=10000)

            # Check if there's an img inside the history modal content
            imgs = page.locator('#history-modal-content img')
            count = imgs.count()
            print(f'Found {count} images in history modal content')
            if count == 0:
                raise Exception('No images found in history details')

            print('TEST PASSED: Image found in history details')

        except Exception:
            # Save artifacts for debugging: screenshot, page HTML, console logs
            try:
                artifacts_dir = os.path.join('tests', 'artifacts')
                os.makedirs(artifacts_dir, exist_ok=True)
                screenshot_path = os.path.join(artifacts_dir, 'failure_screenshot.png')
                html_path = os.path.join(artifacts_dir, 'page_source.html')
                console_path = os.path.join(artifacts_dir, 'console.log')

                # screenshot of full page
                try:
                    page.screenshot(path=screenshot_path, full_page=True)
                except Exception as se:
                    print('Could not take screenshot:', se)

                try:
                    html = page.content()
                    with open(html_path, 'w', encoding='utf-8') as f:
                        f.write(html)
                except Exception as he:
                    print('Could not save page source:', he)

                try:
                    with open(console_path, 'w', encoding='utf-8') as f:
                        for line in console_messages:
                            f.write(line + '\n')
                except Exception as ce:
                    print('Could not save console log:', ce)

                print('Saved artifacts to', artifacts_dir)
            except Exception as ae:
                print('Failed to write artifacts:', ae)
            finally:
                browser.close()
            # Re-raise to cause CI step failure
            raise
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == '__main__':
    run()
