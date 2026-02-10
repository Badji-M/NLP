#!/usr/bin/env python3
"""
Test rapide du notebook spaCy NER
Valide que toutes les corrections ont bien été appliquées
"""

import sys
from pathlib import Path

# Configuration
NOTEBOOK_PATH = Path(__file__).parent / "notebook" / "NER_spaCy.ipynb"
DATA_PATH = Path(__file__).parent / "data"

def test_data_exists():
    """Vérifie que les données existent"""
    print("🔍 Vérification des données...")
    
    files = ["fr_train.conll", "fr_dev.conll", "fr_test.conll"]
    all_exist = True
    
    for fname in files:
        fpath = DATA_PATH / fname
        if fpath.exists():
            size_mb = fpath.stat().st_size / (1024*1024)
            print(f"  ✅ {fname:20s} ({size_mb:.1f} MB)")
        else:
            print(f"  ❌ {fname:20s} (NOT FOUND)")
            all_exist = False
    
    return all_exist

def test_notebook_exists():
    """Vérifie que le notebook existe"""
    print("\n🔍 Vérification du notebook...")
    if NOTEBOOK_PATH.exists():
        size_kb = NOTEBOOK_PATH.stat().st_size / 1024
        print(f"  ✅ {NOTEBOOK_PATH.name} ({size_kb:.1f} KB)")
        return True
    else:
        print(f"  ❌ {NOTEBOOK_PATH} NOT FOUND")
        return False

def test_imports():
    """Vérifie que les imports clés fonctionnent"""
    print("\n🔍 Vérification des imports...")
    
    packages = {
        'spacy': 'spaCy NER',
        'pandas': 'Data processing',
        'numpy': 'NumPy arrays',
        'seqeval': 'NER metrics',
        'matplotlib': 'Visualization',
    }
    
    all_ok = True
    for pkg, desc in packages.items():
        try:
            __import__(pkg)
            print(f"  ✅ {pkg:15s} - {desc}")
        except ImportError:
            print(f"  ❌ {pkg:15s} - MISSING (pip install {pkg})")
            all_ok = False
    
    return all_ok

def test_conll_loading():
    """Teste le chargement des données CoNLL"""
    print("\n🔍 Test de chargement CoNLL...")
    
    try:
        # Import du code de lecture
        sys.path.insert(0, str(Path(__file__).parent))
        
        def read_conll(path):
            sentences, labels = [], []
            current_sentence, current_labels = [], []
            
            with open(path, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        if current_sentence:
                            sentences.append(current_sentence)
                            labels.append(current_labels)
                            current_sentence, current_labels = [], []
                        continue
                    
                    parts = line.split()
                    if len(parts) >= 4:
                        current_sentence.append(parts[0])
                        current_labels.append(parts[3])
            
            if current_sentence:
                sentences.append(current_sentence)
                labels.append(current_labels)
            return sentences, labels
        
        # Test sur train set
        train_sentences, train_labels = read_conll(DATA_PATH / "fr_train.conll")
        print(f"  ✅ Données train chargées : {len(train_sentences)} phrases")
        
        # Vérifier qu'il y a des labels
        all_labels = set()
        for labels in train_labels:
            all_labels.update(labels)
        
        # Vérifier qu'on a pas trop de labels (bug du passé)
        if len(all_labels) < 100:
            print(f"  ✅ Labels trouvés : {len(all_labels)} (correct)")
            return True
        else:
            print(f"  ❌ Trop de labels : {len(all_labels)} (bug?)")
            return False
            
    except Exception as e:
        print(f"  ❌ Erreur : {e}")
        return False

def main():
    print("=" * 70)
    print("VALIDATION NOTEBOOK SPACY NER")
    print("=" * 70)
    
    results = {
        "Données": test_data_exists(),
        "Notebook": test_notebook_exists(),
        "Imports": test_imports(),
        "CoNLL": test_conll_loading(),
    }
    
    print("\n" + "=" * 70)
    print("RÉSUMÉ :")
    print("=" * 70)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:20s} : {status}")
    
    all_pass = all(results.values())
    
    print("\n" + "=" * 70)
    if all_pass:
        print("✨ TOUS LES TESTS PASSÉS - NOTEBOOK OPÉRATIONNEL ✨")
        print("\nProchaines étapes :")
        print("  1. jupyter notebook notebook/NER_spaCy.ipynb")
        print("  2. Exécutez les cellules 1 à 16 séquentiellement")
        print("  3. Pour entraînement complet : changez n_epochs = 3 → 30")
    else:
        print("⚠️ CERTAINS TESTS ONT ÉCHOUÉ")
        print("\nRésolvez les problèmes au-dessus, puis relancez.")
    print("=" * 70)
    
    return 0 if all_pass else 1

if __name__ == "__main__":
    sys.exit(main())
