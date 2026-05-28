#!/usr/bin/env python3
"""Take screenshots of each screen in the Knitters app."""

import os
import time
import base64
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# All screens to capture
SCREENS = [
    'splash',
    'login',
    'email-login',
    'signup',
    'find-account',
    'home',
    'projects',
    'community',
    'comm-post-detail',
    'comm-write',
    'explore',
    'profile',
    'edit-profile',
    'settings',
    'project-detail',
    'record',
    'notification',
    'notification-settings',
    'challenge',
    'magazine-list',
    'magazine-article',
]

OUTPUT_DIR = '/Users/saeyeon/knitters/screenshots'
os.makedirs(OUTPUT_DIR, exist_ok=True)

options = Options()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--window-size=900,950')
options.add_argument('--force-device-scale-factor=2')
options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

print("Starting Chrome...")
driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)

file_url = 'file:///Users/saeyeon/knitters/index.html'
driver.get(file_url)
time.sleep(2)

# Skip splash, go directly to login first
driver.execute_script("go('login')")
time.sleep(0.5)

# Pre-populate with a test profile so home works
driver.execute_script("""
    localStorage.setItem('knitters_profile', JSON.stringify({
        name: '김뜨개',
        handle: 'knitter_kim',
        bio: '뜨개질을 사랑해요 🧶',
        avatar: ''
    }));
    localStorage.setItem('knitters_projects', JSON.stringify([
        {
            id: 1001,
            name: '파란 스웨터',
            status: 'in_progress',
            progress: 45,
            knittingTime: 3600,
            author: '김뜨개',
            logs: [{createdAt: new Date().toISOString(), text: '오늘도 열심히!'}]
        }
    ]));
""")
time.sleep(0.3)

def take_screenshot(screen_id, filename):
    """Navigate to a screen and take a screenshot of just the phone element."""
    try:
        driver.execute_script(f"go('{screen_id}')")
    except Exception:
        pass
    time.sleep(0.8)

    # Find the phone element and screenshot it
    try:
        phone = driver.find_element('css selector', '.phone')
        screenshot_data = phone.screenshot_as_png
        path = os.path.join(OUTPUT_DIR, filename)
        with open(path, 'wb') as f:
            f.write(screenshot_data)
        print(f"  ✓ {filename}")
        return path
    except Exception as e:
        print(f"  ✗ {filename}: {e}")
        return None

print("\nCapturing screens...")

screenshots = {}

# Splash screen - reload to get it
driver.get(file_url)
time.sleep(1.5)
try:
    phone = driver.find_element('css selector', '.phone')
    path = os.path.join(OUTPUT_DIR, 'splash.png')
    phone.screenshot(path)
    screenshots['splash'] = path
    print("  ✓ splash.png")
except Exception as e:
    print(f"  ✗ splash.png: {e}")

# Restore profile data after reload
driver.execute_script("""
    localStorage.setItem('knitters_profile', JSON.stringify({
        name: '김뜨개',
        handle: 'knitter_kim',
        bio: '뜨개질을 사랑해요 🧶',
        avatar: ''
    }));
    localStorage.setItem('knitters_projects', JSON.stringify([
        {
            id: 1001,
            name: '파란 스웨터',
            status: 'in_progress',
            progress: 45,
            knittingTime: 3600,
            author: '김뜨개',
            logs: [{createdAt: new Date().toISOString(), text: '오늘도 열심히!'}]
        }
    ]));
""")

for screen in SCREENS[1:]:  # Skip splash, already done
    path = take_screenshot(screen, f'{screen}.png')
    if path:
        screenshots[screen] = path

driver.quit()
print(f"\nDone! {len(screenshots)} screenshots saved to {OUTPUT_DIR}")
print("Files:", list(screenshots.keys()))
