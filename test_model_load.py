#!/usr/bin/env python3
import sys
sys.path.insert(0, ".")
from pathlib import Path
import joblib
import time

print("Attempting to load model...")
start = time.time()
model_path = Path("models") / "ner_model.joblib"
print(f"Model path: {model_path}")
print(f"Model exists: {model_path.exists()}")

if model_path.exists():
    try:
        print("Loading model from joblib...")
        model = joblib.load(model_path)
        elapsed = time.time() - start
        print(f"✓ Model loaded successfully in {elapsed:.2f} seconds")
        print(f"  Model type: {type(model)}")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        import traceback
        traceback.print_exc()
else:
    print("✗ Model file not found")
