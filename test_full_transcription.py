#!/usr/bin/env python
"""Test complete transcription flow"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("Testing Complete Transcription Flow")
print("=" * 60)

# Step 1: Sign up
print("\n[1] Creating test user...")
signup_data = {
    "email": f"transcribe_test_{int(time.time())}@test.com",
    "password": "TestPassword123!",
    "username": "transcribe_tester"
}
signup_resp = requests.post(f"{BASE_URL}/api/v1/auth/signup", json=signup_data)
print(f"    Signup: {signup_resp.status_code}")
if signup_resp.status_code != 200:
    print(f"    Error: {signup_resp.text}")
    exit(1)

token = signup_resp.json().get('access_token')
headers = {"Authorization": f"Bearer {token}"}
print(f"    ✓ User created")

# Step 2: Upload and transcribe an MP3 file
print("\n[2] Creating and uploading an MP3 file...")
# Create a minimal MP3 file (actually just binary data that looks like an MP3)
mp3_data = b'ID3\x04\x00\x00\x00\x00\x00(\xff\xfb\x90\x00' + b'\x00' * 1000  # Minimal MP3 header + padding

files = {'file': ('test_audio.mp3', mp3_data, 'audio/mpeg')}
transcribe_resp = requests.post(
    f"{BASE_URL}/api/v1/transcribe/",
    files=files,
    params={"language": "en"},
    headers=headers
)
print(f"    POST /api/v1/transcribe/: {transcribe_resp.status_code}")
if transcribe_resp.status_code != 200:
    print(f"    Error: {transcribe_resp.text}")
    # Try to parse error anyway
    try:
        error_data = transcribe_resp.json()
        print(f"    Error detail: {error_data}")
    except:
        pass
else:
    transcribe_data = transcribe_resp.json()
    print(f"    Response: {json.dumps(transcribe_data, indent=2)}")
    transcript_id = transcribe_data.get('transcript_id')
    print(f"    ✓ File transcribed, transcript_id: {transcript_id}")
    
    # Step 3: Verify the transcript was created
    print(f"\n[3] Verifying transcript was created...")
    verify_resp = requests.get(f"{BASE_URL}/api/v1/transcripts/", headers=headers)
    print(f"    GET /api/v1/transcripts/: {verify_resp.status_code}")
    transcripts_list = verify_resp.json()
    print(f"    Transcript count: {len(transcripts_list) if isinstance(transcripts_list, list) else 0}")
    
    if isinstance(transcripts_list, list) and len(transcripts_list) > 0:
        print(f"    ✓ Transcripts retrieved successfully")
        for i, t in enumerate(transcripts_list):
            print(f"      [{i}] ID: {t.get('id')}, Title: {t.get('title')}, Status: {t.get('status')}")
    else:
        print(f"    ❌ No transcripts found!")
        print(f"    Response: {json.dumps(transcripts_list, indent=2)}")

print("\n" + "=" * 60)
print("Test completed!")
print("=" * 60)
