#!/usr/bin/env python
"""
Test script to verify signin endpoint is working
"""
import requests
import json
from pathlib import Path
import sys

# Add backend to path
backend_path = Path(__file__).parent / "echoscript-backend"
sys.path.insert(0, str(backend_path))

BASE_URL = "http://127.0.0.1:8000"

def test_signin():
    """Test the signin endpoint"""
    print("Testing signin endpoint...")
    
    # Test with non-existent user
    print("\n1. Testing with non-existent user...")
    response = requests.post(
        f"{BASE_URL}/api/auth/signin",
        json={"email": "nonexistent@test.com", "password": "password123"},
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test with invalid credentials
    print("\n2. Testing with test user (if exists)...")
    response = requests.post(
        f"{BASE_URL}/api/auth/signin",
        json={"email": "test@example.com", "password": "wrongpassword"},
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test signup endpoint
    print("\n3. Testing signup endpoint...")
    test_email = f"testuser_{int(__import__('time').time())}@test.com"
    response = requests.post(
        f"{BASE_URL}/api/auth/signup",
        json={"email": test_email, "password": "TestPassword123!", "username": "testuser"},
        headers={"Content-Type": "application/json"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nSignup successful!")
        print(f"User ID: {data.get('id')}")
        print(f"Email: {data.get('email')}")
        print(f"Access Token: {data.get('access_token')[:50]}...")
        
        # Test signin with new user
        print(f"\n4. Testing signin with new user...")
        response = requests.post(
            f"{BASE_URL}/api/auth/signin",
            json={"email": test_email, "password": "TestPassword123!"},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print(f"\nSignin successful!")
            print(f"Access Token: {token[:50]}...")
            
            # Test /me endpoint
            print(f"\n5. Testing /me endpoint with token...")
            response = requests.get(
                f"{BASE_URL}/api/auth/me",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
            )
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_signin()
