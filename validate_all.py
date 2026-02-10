#!/usr/bin/env python3
"""
Final validation of all fixes
"""
import requests
import json

print("=" * 60)
print("🔍 FINAL VALIDATION - NLP NER APPLICATION")
print("=" * 60)

tests = []

# Test 1: API Connectivity
try:
    r = requests.get("http://localhost:8000/docs", timeout=5)
    tests.append(("✓ API Responsive", r.status_code == 200))
except:
    tests.append(("✗ API Responsive", False))

# Test 2: NER Prediction
try:
    r = requests.post(
        "http://localhost:8000/predict-enhanced",
        json={"text": "Emmanuel Macron est président de la France."},
        timeout=10
    )
    has_response = r.status_code == 200 and "tokens" in r.json()
    tests.append(("✓ NER Prediction", has_response))
except:
    tests.append(("✗ NER Prediction", False))

# Test 3: Model Download
try:
    r = requests.get("http://localhost:8000/models/ner_model.joblib", timeout=10)
    tests.append(("✓ Model Download", r.status_code == 200 and len(r.content) > 1000000))
except:
    tests.append(("✗ Model Download", False))

# Test 4: Frontend
try:
    r = requests.get("http://localhost:5175", timeout=5)
    tests.append(("✓ Frontend Serving", r.status_code in [200, 304]))
except:
    tests.append(("✗ Frontend Serving", False))

# Print Results
print("\n🧪 TEST RESULTS:\n")
passed = 0
for test_name, result in tests:
    status = "PASS" if result else "FAIL"
    color_code = "✅" if result else "❌"
    print(f"  {color_code} {test_name}: {status}")
    if result:
        passed += 1

print(f"\n📊 SCORE: {passed}/{len(tests)} tests passed")

if passed == len(tests):
    print("\n🎉 ALL SYSTEMS OPERATIONAL!")
    print("\n📍 Access the app at: http://localhost:5175/analyze")
    print("   • Text analysis: Enter French text and click Lancer l'analyse")
    print("   • File upload: Upload .txt, .pdf, or .docx files")
    print("   • Downloads: Guide and model available")
    print("   • Exports: JSON and CSV formats")
else:
    print(f"\n⚠️  Some tests failed. Please check the services.")

print("=" * 60)
