#!/usr/bin/env python3
import requests
import json

# Test l'API avec du texte français
text = "Emmanuel Macron est le président de la France. Il habite à Paris."

print("Testing API endpoint /predict-enhanced")
print("=" * 60)
print(f"Input: {text}")
print("=" * 60)

try:
    response = requests.post(
        "http://localhost:8000/predict-enhanced",
        json={"text": text},
        timeout=10
    )
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nResponse structure:")
        print(f"  - keys: {list(data.keys())}")
        print(f"  - tokens count: {len(data.get('tokens', []))}")
        print(f"  - labels count: {len(data.get('labels', []))}")
        print(f"\nFull response:")
        print(json.dumps(data, indent=2, ensure_ascii=False))
    else:
        print(f"Error response:\n{response.text}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
