#!/usr/bin/env python
"""Test Stripe checkout session creation for cart"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

# Step 1: Sign up a test user
print("[1] Signing up test user...")
signup_data = {
    "email": f"stripe_test_{int(time.time())}@test.com",
    "password": "TestPassword123!",
    "username": "stripe_tester"
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

print(f"   ✓ User created with token: {access_token[:20]}...")

# Step 2: Create a checkout session for cart
print("\n[2] Creating Stripe checkout session for cart items...")
cart_items = [
    {
        "bundle_id": 1,
        "quantity": 1,
        "minutes": 5,
        "price": 0.99
    },
    {
        "bundle_id": 2,
        "quantity": 2,
        "minutes": 40,
        "price": 3.99
    }
]

checkout_payload = {
    "mode": "payment",
    "metadata": {
        "type": "extra_minutes",
        "items": json.dumps(cart_items),
        "is_gift": False,
        "recipient_email": ""
    }
}

checkout_resp = requests.post(
    f"{BASE_URL}/api/stripe/checkout/create",
    json=checkout_payload,
    headers={"Authorization": f"Bearer {access_token}"}
)
print(f"   Checkout Response: {checkout_resp.status_code}")

if checkout_resp.status_code != 200:
    print(f"   Error: {checkout_resp.text}")
    exit(1)

checkout_result = checkout_resp.json()
print(f"   Response: {json.dumps(checkout_result, indent=2)}")

# Step 3: Verify the response
if 'url' in checkout_result and checkout_result['url']:
    print(f"\n   ✓ SUCCESS: Stripe checkout URL created!")
    print(f"   Checkout URL: {checkout_result['url'][:80]}...")
    
    # Extract session ID if available
    if 'id' in checkout_result:
        print(f"   Session ID: {checkout_result['id']}")
else:
    print(f"\n   ❌ FAIL: No checkout URL in response")
    exit(1)

# Step 4: Test with gift option
print("\n[3] Creating checkout session with gift option...")
checkout_payload_gift = {
    "mode": "payment",
    "metadata": {
        "type": "extra_minutes",
        "items": json.dumps(cart_items),
        "is_gift": True,
        "recipient_email": "recipient@test.com"
    }
}

gift_resp = requests.post(
    f"{BASE_URL}/api/stripe/checkout/create",
    json=checkout_payload_gift,
    headers={"Authorization": f"Bearer {access_token}"}
)
print(f"   Gift Checkout Response: {gift_resp.status_code}")

if gift_resp.status_code == 200:
    gift_result = gift_resp.json()
    if 'url' in gift_result:
        print(f"   ✓ Gift checkout session created successfully!")
    else:
        print(f"   ❌ No URL in gift response")
else:
    print(f"   Error: {gift_resp.text}")

print("\n✓ All tests completed!")
