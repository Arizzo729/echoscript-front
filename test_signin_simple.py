import requests

BASE_URL = "http://localhost:8001"

# Test signin
print("Testing signin...")
response = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"email": "test@example.com", "password": "password123"},
    headers={"Content-Type": "application/json"}
)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")