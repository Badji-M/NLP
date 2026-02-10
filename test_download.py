#!/usr/bin/env python3
import requests

try:
    r = requests.get('http://localhost:8000/models/ner_model.joblib', timeout=10)
    print(f'Status: {r.status_code}')
    print(f'Size: {len(r.content)} bytes')
    print("✓ Model download endpoint is working!")
except Exception as e:
    print(f"✗ Error: {e}")
