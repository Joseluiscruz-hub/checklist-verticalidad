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

        # Open app. Use TEST_BASE_URL env var if provided (defaults to local static server started in CI)
        base_url = os.environ.get('TEST_BASE_URL', 'http://localhost:8000').rstrip('/')
        page.goto(f"{base_url}/", timeout=60000)

        # Helper to save artifacts on any failure
        def _save_artifacts():
            try:
                artifacts_dir = os.path.join('tests', 'artifacts')
                os.makedirs(artifacts_dir, exist_ok=True)
                screenshot_path = os.path.join(artifacts_dir, 'failure_screenshot.png')
                html_path = os.path.join(artifacts_dir, 'page_source.html')
                console_path = os.path.join(artifacts_dir, 'console.log')

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

        # Helper to remove common blocking overlays (toasts, backdrops)
        def _remove_blocking_overlays():
            page.evaluate("""
                (() => {
                    const selectors = ['#toast-container', '.toast', '.overlay', '.modal-backdrop', '.backdrop'];
                    selectors.forEach(s => {
                        document.querySelectorAll(s).forEach(el => {
                            try { el.style.display = 'none'; el.style.pointerEvents = 'none'; } catch(e){}
                        });
                    });
                })()
            """)

        # Run the main interaction flow and capture artifacts on any exception
        try:
            # Wait for table and open first product modal
            page.wait_for_selector('.check-btn', timeout=30000)
            page.locator('.check-btn').first.click()

            # Wait for modal to be visible
            page.wait_for_selector('#checklist-modal.active, .modal.active', timeout=10000)

            # Find the first visible file input inside the modal
            file_input = page.locator('input[type=file][id^="photo-"]')
            if file_input.count() == 0:
                print('ERROR: No file input found in modal')
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
            # Remove blocking overlays before clicking (toasts often intercept pointer events)
            _remove_blocking_overlays()
            try:
                page.click('#commit-session-btn', timeout=60000)
            except Exception:
                try:
                    page.click('#commit-session-btn', timeout=60000, force=True)
                except Exception:
                    # As a last resort, disable pointer-events for other elements inside
                    # the modal and dispatch a direct JS click on the button.
                    page.evaluate("""
                        (function() {
                            const btn = document.getElementById('commit-session-btn');
                            if (!btn) return;
                            btn.style.pointerEvents = 'auto';
                            btn.style.zIndex = '9999';
                            let modal = btn.closest('#checklist-modal') || btn.closest('.modal');
                            if (modal) {
                                modal.querySelectorAll('*').forEach(el => {
                                    if (el !== btn) {
                                        try { el.style.pointerEvents = 'none'; } catch(e){}
                                    }
                                });
                            }
                            btn.click();
                        })();
                    """)

            # Wait a bit for transaction to complete
            time.sleep(3)

            # Switch to history tab and wait for table rows
            # Avoid calling switchTab via evaluate (might not be defined yet). Click the tab button instead.
            tab_btn = page.locator('.tab-button[data-tab="historial"]').first
            if tab_btn.count() > 0:
                try:
                    tab_btn.click()
                except Exception:
                    # if click fails, fallback to JS click
                    page.evaluate("document.querySelector('.tab-button[data-tab=\'historial\']')?.click()")
            else:
                # As fallback try to call switchTab (older versions)
                try:
                    page.evaluate("switchTab('historial')")
                except Exception:
                    pass
            page.wait_for_selector('.view-details-btn', timeout=15000)

            # Open first details modal and assert image exists
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
            _save_artifacts()
            browser.close()
            raise
        finally:
            try:
                browser.close()
            except Exception:
                pass


if __name__ == '__main__':
    run()
