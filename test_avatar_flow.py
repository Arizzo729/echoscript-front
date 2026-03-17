#!/usr/bin/env python
"""Test avatar upload flow to verify instant UI update"""
import requests
import json
from io import BytesIO
import time

BASE_URL = "http://localhost:8000"

# Step 1: Create a simple PNG image (red 200x200)
print("[1] Creating test image...")
# Minimal PNG: 1x1 red pixel (73 bytes)
png_data = bytes.fromhex(
    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f'
    '15c4890000000a49444154789c63f80f000001010000188dd5de'
)
img_bytes = BytesIO(png_data)

# Step 2: Sign up a test user
print("[2] Signing up test user...")
signup_data = {
    "email": f"avatar_test_{int(time.time())}@test.com",
    "password": "TestPassword123!",
    "username": "avatar_tester"
}
signup_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/signup",
    json=signup_data
)
print(f"   Signup Response: {signup_resp.status_code}")
if signup_resp.status_code != 200:
    print(f"   Error: {signup_resp.text}")
    exit(1)

signup_result = signup_resp.json()
access_token = signup_result.get('access_token')
if not access_token:
    print("   Error: No access_token in signup response")
    exit(1)

print(f"   Got access token: {access_token[:20]}...")

# Step 3: Get current user before avatar upload
print("[3] Fetching user before avatar upload...")
user_resp = requests.get(
    f"{BASE_URL}/api/v1/auth/me",
    headers={"Authorization": f"Bearer {access_token}"}
)
print(f"   User Response: {user_resp.status_code}")
user_before = user_resp.json()
avatar_before = user_before.get('avatar') or user_before.get('avatar_url')
print(f"   Avatar before upload: {avatar_before}")

# Step 4: Upload avatar
print("[4] Uploading avatar image...")
img_bytes.seek(0)  # Reset to start
files = {'file': ('test_avatar.png', img_bytes, 'image/png')}
avatar_resp = requests.post(
    f"{BASE_URL}/api/v1/user/avatar",
    headers={"Authorization": f"Bearer {access_token}"},
    files=files
)
print(f"   Avatar Upload Response: {avatar_resp.status_code}")
if avatar_resp.status_code != 200:
    print(f"   Error: {avatar_resp.text}")
    exit(1)

avatar_result = avatar_resp.json()
print(f"   Avatar Response: {json.dumps(avatar_result, indent=2)}")
avatar_url_from_upload = avatar_result.get('avatar_url')
print(f"   New avatar URL: {avatar_url_from_upload}")

# Step 5: Fetch user again to confirm avatar is persisted
print("[5] Fetching user after avatar upload (verify persistence)...")
user_resp2 = requests.get(
    f"{BASE_URL}/api/v1/auth/me",
    headers={"Authorization": f"Bearer {access_token}"}
)
print(f"   User Response: {user_resp2.status_code}")
user_after = user_resp2.json()
avatar_after = user_after.get('avatar') or user_after.get('avatar_url')
print(f"   Avatar after upload: {avatar_after}")

# Step 6: Verify the avatar changed
if avatar_before == avatar_after:
    print("\n   ❌ FAIL: Avatar URL did not change after upload!")
    print(f"   Before: {avatar_before}")
    print(f"   After:  {avatar_after}")
else:
    print("\n   ✓ SUCCESS: Avatar URL changed!")
    print(f"   Before: {avatar_before}")
    print(f"   After:  {avatar_after}")

# Step 7: Verify the image file exists and is accessible
print("[6] Verifying avatar image is accessible...")
if avatar_after:
    img_resp = requests.head(avatar_after)
    print(f"   Image accessibility: {img_resp.status_code}")
    if img_resp.status_code == 200:
        print("   ✓ Avatar image is accessible")
    else:
        print(f"   ❌ Avatar image returned: {img_resp.status_code}")
