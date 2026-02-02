"""Demo rapide de l'API NER directement depuis Python"""
from pathlib import Path
import sys

# Ajouter le dossier parent au path
sys.path.insert(0, str(Path(__file__).parent))

import joblib
from src.features import sent2features

# Charger le modèle
MODEL_PATH = Path("models") / "ner_model.joblib"

if not MODEL_PATH.exists():
    print("❌ Modèle non trouvé. Exécutez d'abord le notebook pour l'entraîner.")
    sys.exit(1)

print("📦 Chargement du modèle...")
model = joblib.load(MODEL_PATH)
print("✅ Modèle chargé !")

# Fonction de prédiction
def predict_ner(text: str):
    """Prédire les entités nommées d'un texte"""
    tokens = text.split()
    features = [sent2features(tokens)]
    predictions = model.predict(features)[0]
    return list(zip(tokens, predictions))

# Exemples de démonstration
print("\n" + "=" * 70)
print("                    DEMO NER - MultiCoNER v2")
print("=" * 70)

exemples = [
    "Emmanuel Macron est président de la France",
    "Angela Merkel a rencontré Barack Obama à Washington",
    "Paris est la capitale de la France",
    "Leonardo DiCaprio a joué dans Titanic",
    "Microsoft et Apple sont des entreprises américaines"
]

for i, texte in enumerate(exemples, 1):
    print(f"\n🔹 Exemple {i}: {texte}")
    print("-" * 70)
    
    resultats = predict_ner(texte)
    
    # Afficher uniquement les entités détectées
    entites = [(token, label) for token, label in resultats if label != 'O']
    
    if entites:
        print("Entités détectées:")
        for token, label in entites:
            print(f"  • {token:<20} → {label}")
    else:
        print("  Aucune entité détectée")

print("\n" + "=" * 70)
print("\n💡 Pour utiliser l'API web, lancez: start_api.bat")
print("   Puis ouvrez: web/index.html")
print("=" * 70)
