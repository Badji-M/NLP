#!/usr/bin/env python3
"""
Test integration between frontend and backend
"""
import requests
import json

API_URL = "http://localhost:8000"

def test_api():
    """Test if API is responding"""
    print("Testing API connectivity...")
    try:
        response = requests.get(f"{API_URL}/docs", timeout=5)
        print(f"✓ API Status: {response.status_code}")
        return response.status_code == 200
    except Exception as e:
        print(f"✗ API Error: {e}")
        return False

def test_prediction():
    """Test NER prediction"""
    print("\nTesting NER prediction...")
    text = "Emmanuel Macron est le président de la France."
    
    try:
        response = requests.post(
            f"{API_URL}/predict-enhanced",
            json={"text": text},
            timeout=10
        )
        print(f"✓ Prediction Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"  Tokens: {len(data.get('tokens', []))} found")
            print(f"  Sample result: {json.dumps(data, indent=2, ensure_ascii=False)[:200]}...")
            return True
        else:
            print(f"✗ Prediction Error: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"✗ Connection Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("NLP App Integration Test")
    print("=" * 50)
    
    api_ok = test_api()
    pred_ok = test_prediction()
    
    print("\n" + "=" * 50)
    print("Test Results:")
    print(f"  API Connectivity: {'✓ PASS' if api_ok else '✗ FAIL'}")
    print(f"  NER Prediction:   {'✓ PASS' if pred_ok else '✗ FAIL'}")
    print("=" * 50)
