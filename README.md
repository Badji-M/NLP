# NER MultiCoNER (Français)

Projet de Reconnaissance des Entités Nommées (NER) sur le corpus MultiCoNER v2 (fr). Le repository fournit un notebook, des scripts d'entraînement/évaluation, et une API de prédiction.

## Structure

- data/ : fichiers CoNLL (train/dev/test)
- notebook/NER.ipynb : analyse + modélisation
- src/ : scripts Python (prétraitement, features, entraînement, évaluation, API)
- slides/presentation.md : support de soutenance (plan 25 slides max)

## Installation

```bash
pip install -r requirements.txt
```

## Entraînement

```bash
python -m src.train --data-dir data --model crf --output models/ner_model.joblib
```

Modèle baseline (logreg) :

```bash
python -m src.train --data-dir data --model logreg --output models/ner_model.joblib
```

## Évaluation

```bash
python -m src.evaluate --data-dir data --model-path models/ner_model.joblib --split dev --model-type crf
```

## API

```bash
uvicorn src.api:app --reload
```

Exemple requête :

```json
{
  "tokens": ["Emmanuel", "Macron", "est", "à", "Paris", "."]
}
```

## Notebook

Le notebook suit les étapes :
1) Chargement et validation des données
2) Analyse exploratoire (labels)
3) Baselines (LogReg)
4) CRF séquentiel
5) Évaluation (seqeval)
6) Sauvegarde du modèle
