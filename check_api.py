#!/usr/bin/env python3
import requests
import time

print("Testing if API is responding...")
for attempt in range(1, 6):
    try:
        print(f"\nAttempt {attempt}/5...")
        response = requests.get("http://localhost:8000/docs", timeout=3)
        print(f"✓ API Status: {response.status_code}")
        print("API is running successfully!")
        break
    except requests.exceptions.Timeout:
        print(f"✗ Timeout - API startup in progress...")
    except requests.exceptions.ConnectionError:
        print(f"✗ Connection refused - API not started yet...")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    if attempt < 5:
        time.sleep(2)
else:
    print("\n✗ API failed to start after 5 attempts")
