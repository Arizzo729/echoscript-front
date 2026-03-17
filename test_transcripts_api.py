#!/usr/bin/env python
"""Test Transcripts API endpoints"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("Testing Transcripts API Endpoints")
print("=" * 60)

# Step 1: Sign up
print("\n[1] Creating test user...")
signup_data = {
    "email": f"transcript_test_{int(time.time())}@test.com",
    "password": "TestPassword123!",
    "username": "transcript_tester"
}
signup_resp = requests.post(f"{BASE_URL}/api/v1/auth/signup", json=signup_data)
print(f"    Signup: {signup_resp.status_code}")
if signup_resp.status_code != 200:
    print(f"    Error: {signup_resp.text}")
    exit(1)

token = signup_resp.json().get('access_token')
headers = {"Authorization": f"Bearer {token}"}
print(f"    ✓ User created, token: {token[:20]}...")

# Step 2: Get initial transcripts (should be empty)
print("\n[2] Fetching transcripts (should be empty)...")
get_resp = requests.get(f"{BASE_URL}/api/v1/transcripts/", headers=headers)
print(f"    GET /api/v1/transcripts/: {get_resp.status_code}")
print(f"    Response: {json.dumps(get_resp.json(), indent=2)}")
initial_count = len(get_resp.json()) if isinstance(get_resp.json(), list) else 0
print(f"    Initial transcripts: {initial_count}")

# Step 3: Create a transcript manually
print("\n[3] Creating a test transcript...")
create_data = {
    "title": f"Test Transcript at {time.time()}",
    "original_filename": "test_audio.mp3",
    "content": "This is a test transcript content. It contains sample text that was transcribed from an audio file.",
    "duration": 120,
    "language": "en"
}
create_resp = requests.post(f"{BASE_URL}/api/v1/transcripts/", json=create_data, headers=headers)
print(f"    POST /api/v1/transcripts/: {create_resp.status_code}")
if create_resp.status_code != 200:
    print(f"    Error: {create_resp.text}")
    exit(1)

created = create_resp.json()
transcript_id = created.get('id')
print(f"    Response: {json.dumps(created, indent=2)}")
print(f"    ✓ Transcript created with ID: {transcript_id}")

# Step 4: Fetch transcripts again (should have 1)
print("\n[4] Fetching transcripts again...")
get_resp2 = requests.get(f"{BASE_URL}/api/v1/transcripts/", headers=headers)
print(f"    GET /api/v1/transcripts/: {get_resp2.status_code}")
transcripts_list = get_resp2.json()
print(f"    Transcripts count: {len(transcripts_list) if isinstance(transcripts_list, list) else 0}")
if isinstance(transcripts_list, list) and len(transcripts_list) > 0:
    print(f"    First transcript: {json.dumps(transcripts_list[0], indent=2)}")
else:
    print(f"    Response: {json.dumps(transcripts_list, indent=2)}")

# Step 5: Get a specific transcript
print(f"\n[5] Fetching specific transcript (ID: {transcript_id})...")
get_single = requests.get(f"{BASE_URL}/api/v1/transcripts/{transcript_id}", headers=headers)
print(f"    GET /api/v1/transcripts/{transcript_id}: {get_single.status_code}")
single_data = get_single.json()
if get_single.status_code == 200:
    print(f"    ✓ Transcript retrieved")
    print(f"    Content length: {len(single_data.get('content', ''))}")
    print(f"    Title: {single_data.get('title')}")
else:
    print(f"    Error: {single_data}")

# Step 6: Update the transcript
print(f"\n[6] Updating transcript...")
update_data = {
    "title": f"Updated Transcript {time.time()}",
    "content": "This is updated transcript content with more information."
}
update_resp = requests.put(f"{BASE_URL}/api/v1/transcripts/{transcript_id}", json=update_data, headers=headers)
print(f"    PUT /api/v1/transcripts/{transcript_id}: {update_resp.status_code}")
if update_resp.status_code == 200:
    updated = update_resp.json()
    print(f"    ✓ Transcript updated: {updated.get('title')}")
else:
    print(f"    Error: {update_resp.text}")

# Step 7: Delete the transcript
print(f"\n[7] Deleting transcript...")
delete_resp = requests.delete(f"{BASE_URL}/api/v1/transcripts/{transcript_id}", headers=headers)
print(f"    DELETE /api/v1/transcripts/{transcript_id}: {delete_resp.status_code}")
if delete_resp.status_code == 200:
    print(f"    ✓ Transcript deleted")
else:
    print(f"    Error: {delete_resp.text}")

# Step 8: Verify deletion
print(f"\n[8] Verifying deletion...")
final_get = requests.get(f"{BASE_URL}/api/v1/transcripts/", headers=headers)
print(f"    GET /api/v1/transcripts/: {final_get.status_code}")
final_count = len(final_get.json()) if isinstance(final_get.json(), list) else 0
print(f"    Final transcript count: {final_count}")

print("\n" + "=" * 60)
print("✓ All tests completed!")
print("=" * 60)
