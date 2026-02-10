#  NER MultiCoNER - Named Entity Recognition

<div align="center">

![CI/CD Pipeline](https://img.shields.io/github/actions/workflow/status/Badji-M/NLP/ci-cd-pipeline.yml?branch=main&style=for-the-badge&logo=github&label=CI/CD%20Pipeline)
![Python Version](https://img.shields.io/badge/python-3.13-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Deployment](https://img.shields.io/badge/deploy-success-brightgreen?style=for-the-badge&logo=netlify)

** [Live Demo](https://nlp-ner.netlify.app) |  [API Docs](https://nlp-4g9u.onrender.com/docs) |  [Performance Metrics](#performance)**

</div>
<div align="center">
  
[Support de présentation CANVA](https://www.canva.com/design/DAHA3mGaOmc/XZGzKgxzOv7xgqywnM1tiQ/edit?utm_content=DAHA3mGaOmc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
</div>
---

## 📖 À propos

Système de **Reconnaissance des Entités Nommées (NER)** avancé pour le français, développé sur le corpus **MultiCoNER v2**. Solution full-stack avec API RESTful et interface web moderne.

### ✨ Fonctionnalités

-  **Détection d'entités** - Personnes, Lieux, Organisations, etc.
-  **Analyse statistique** - Métriques détaillées et visualisations
-  **Export multi-format** - PDF, JSON, CSV
-  **Interface moderne** - React + Vite
-  **API RESTful** - FastAPI avec documentation interactive
-  **CI/CD automatisé** - GitHub Actions
-  **Sécurité** - Analyse de vulnérabilités automatique

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

## CI/CD Pipeline

Pipeline automatisé professionnel en 7 phases pour garantir la qualité et la sécurité du code.

### Architecture du Pipeline

```mermaid
graph TB
    START([Git Push/PR]) --> QUALITY[Phase 1: Code Quality<br/>Black, Flake8, Pylint]
    
    QUALITY --> BACKEND[Phase 2: Backend Tests<br/>pytest + Coverage<br/>Python 3.10/3.11/3.13]
    QUALITY --> FRONTEND[Phase 3: Frontend Build<br/>ESLint + Vite<br/>Bundle Artifacts]
    
    BACKEND --> SECURITY[Phase 4: Security Scan<br/>Trivy, Safety, NPM Audit]
    FRONTEND --> SECURITY
    
    SECURITY --> MODEL[Phase 5: Model Validation<br/>File Check + Load Test]
    SECURITY --> DOCS[Phase 7: Documentation<br/>README + Files]
    
    MODEL --> DEPLOY_REPORT[Phase 6: Deployment Report<br/>Status + Metrics]
    DOCS --> DEPLOY_REPORT
    
    DEPLOY_REPORT --> NETLIFY[Netlify Deploy<br/>Frontend]
    DEPLOY_REPORT --> RENDER[Render Deploy<br/>Backend API]
    
    NETLIFY --> PROD[Production Ready<br/>nlp-ner.netlify.app]
    RENDER --> PROD
    
    style START fill:#e1f5ff
    style QUALITY fill:#fff3e0
    style BACKEND fill:#f3e5f5
    style FRONTEND fill:#e8f5e9
    style SECURITY fill:#ffebee
    style MODEL fill:#fce4ec
    style DOCS fill:#e0f2f1
    style DEPLOY_REPORT fill:#f1f8e9
    style NETLIFY fill:#e3f2fd
    style RENDER fill:#e8eaf6
    style PROD fill:#c8e6c9
```

### Phases du Pipeline

| Phase | Outils | Objectif | Durée |
|-------|--------|----------|-------|
| 1. Code Quality | Black, Flake8, Pylint | Vérification du formatage et de la qualité du code | 2-3 min |
| 2. Backend Tests | pytest, Coverage | Tests unitaires sur Python 3.10/3.11/3.13 | 4-6 min |
| 3. Frontend Build | ESLint, Vite | Vérification et build de l'interface React | 3-4 min |
| 4. Security Scan | Trivy, Safety, NPM Audit | Détection des vulnérabilités | 3-4 min |
| 5. Model Validation | Python | Vérification de l'intégrité du modèle NER | 1-2 min |
| 6. Deployment Report | Bash | Génération du rapport de déploiement | 1 min |
| 7. Documentation | Bash | Validation de la documentation | 1 min |

**Durée totale moyenne**: 15-20 minutes

### Métriques de Qualité

- **Code Coverage**: Suivi automatique via pytest-cov
- **Code Quality Score**: Pylint score minimal de 7.0/10
- **Security**: Zero vulnerabilités critiques tolérées
- **Build Success**: 100% des tests doivent passer

Pour plus de détails, consultez [CICD_DOCUMENTATION.md](CICD_DOCUMENTATION.md) et [PIPELINE_PRESENTATION.md](PIPELINE_PRESENTATION.md).

## Notebook

Le notebook suit les étapes :
1) Chargement et validation des données
2) Analyse exploratoire (labels)
3) Baselines (LogReg)
4) CRF séquentiel
5) Évaluation (seqeval)
6) Sauvegarde du modèle
