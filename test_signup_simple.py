import requests

BASE_URL = "http://localhost:8001"

# Test signup
print("Testing signup...")
response = requests.post(
    f"{BASE_URL}/api/auth/signup",
    json={"email": "test@example.com", "password": "password123", "username": "testuser"},
    headers={"Content-Type": "application/json"}
)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")