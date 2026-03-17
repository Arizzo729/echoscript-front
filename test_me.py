import requests

BASE_URL = "http://localhost:8001"

# First signin to get token
print("Signing in...")
response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": "test@example.com", "password": "password123"},
    headers={"Content-Type": "application/json"}
)
if response.status_code == 200:
    token = response.json()["access_token"]
    print("Got token, testing /me endpoint...")
    
    # Test /me
    response = requests.get(
        f"{BASE_URL}/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
else:
    print(f"Signin failed: {response.status_code} {response.text}")