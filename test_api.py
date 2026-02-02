"""Script de test de l'API NER"""
import requests
import json

API_URL = "http://localhost:8000"

def test_api():
    """Test basique de l'API"""
    
    # Test 1 : Vérifier que l'API est accessible
    print("🧪 Test 1: Vérification de l'API...")
    try:
        response = requests.get(f"{API_URL}/docs")
        print(f"✅ API accessible (status {response.status_code})")
    except Exception as e:
        print(f"❌ API non accessible: {e}")
        return
    
    # Test 2 : Prédiction simple
    print("\n🧪 Test 2: Prédiction simple...")
    test_tokens = ["Emmanuel", "Macron", "est", "président", "de", "la", "France", "."]
    
    payload = {"tokens": test_tokens}
    
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Prédiction réussie!")
            print(f"Tokens: {result['tokens']}")
            print(f"Labels: {result['labels']}")
        else:
            print(f"❌ Erreur {response.status_code}: {response.text}")
    except Exception as e:
        print(f"❌ Erreur lors de la requête: {e}")
    
    # Test 3 : Cas plus complexe
    print("\n🧪 Test 3: Cas complexe...")
    complex_tokens = [
        "Angela", "Merkel", "a", "rencontré", "Barack", "Obama",
        "à", "Washington", "pour", "discuter", "de", "l'OTAN", "."
    ]
    
    payload = {"tokens": complex_tokens}
    
    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        if response.status_code == 200:
            result = response.json()
            print("✅ Prédiction complexe réussie!")
            for token, label in zip(result['tokens'], result['labels']):
                if label != 'O':
                    print(f"  {token} → {label}")
        else:
            print(f"❌ Erreur {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("TEST DE L'API NER")
    print("=" * 60)
    test_api()
    print("\n" + "=" * 60)





