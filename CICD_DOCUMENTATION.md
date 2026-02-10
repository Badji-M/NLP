# CI/CD Pipeline - Documentation Technique

## Architecture du Pipeline

### Vue d'ensemble

Le pipeline CI/CD implémenté pour le projet NER MultiCoNER est composé de 7 phases distinctes qui s'exécutent automatiquement à chaque push sur les branches `main` et `develop`.

### Déclencheurs

- **Push** sur les branches `main` et `develop`
- **Pull Request** vers la branche `main`

### Technologies utilisées

- **GitHub Actions** pour l'orchestration
- **Python 3.13** pour le backend
- **Node.js 18** pour le frontend
- **Docker** pour la containerisation (futur)

---

## Phase 1: Code Quality Analysis

**Objectif:** Garantir la qualité et la maintenabilité du code

### Étapes d'exécution

1. **Black formatter check**
   - Vérifie le formatage du code Python selon PEP 8
   - Détecte les incohérences de style
   
2. **isort import checker**
   - Valide l'organisation des imports
   - Assure une structure cohérente

3. **Flake8 linter**
   - Analyse statique du code
   - Détection des erreurs potentielles
   - Limite de complexité: 10
   - Longueur de ligne maximale: 120

4. **Pylint analysis**
   - Score minimum requis: 7.0/10
   - Rapport détaillé des problèmes de qualité

### Métriques de succès

- Formatage conforme aux standards Python
- Aucune erreur de linting critique
- Score Pylint supérieur au seuil défini

---

## Phase 2: Backend API Testing

**Objectif:** Valider le fonctionnement de l'API et assurer la compatibilité multi-versions

### Stratégie de test

**Matrix testing** sur 3 versions de Python:
-  Python 3.10
- Python 3.11
- Python 3.13

### Tests exécutés

1. **Unit tests avec coverage**
   - Framework: pytest
   - Coverage minimum: non défini (à ajuster selon les besoins)
   - Génération de rapports XML

2. **API endpoint testing**
   - Tests d'intégration des endpoints FastAPI
   - Validation des réponses HTTP
   - Vérification des formats de données

### Rapports générés

- Rapport de coverage (XML + terminal)
- Résultats des tests unitaires
- Upload automatique vers Codecov (si configuré)

---

## Phase 3: Frontend Build & Validation

**Objectif:** Compiler et valider l'application React

### Processus de build

1. **Installation des dépendances**
   - Utilisation de `npm ci` pour une installation reproductible
   - Cache NPM activé pour optimiser la performance

2. **ESLint analysis**
   - Maximum de warnings autorisés: 0
   - Détection des problèmes JavaScript/React

3. **Production build**
   - Compilation via Vite
   - Optimisation et minification
   - Tree-shaking automatique

4. **Bundle size analysis**
   - Vérification de la taille du bundle final
   - Détection des augmentations anormales

### Artefacts produits

- **frontend-build**: Bundle de production compilé
- **Rétention**: 7 jours
- **Disponible pour**: Déploiement manuel si nécessaire

---

## Phase 4: Security Vulnerability Scan

**Objectif:** Identifier et reporter les vulnérabilités de sécurité

### Analyses effectuées

1. **Trivy Scanner**
   - Scan du filesystem complet
   - Détection de vulnérabilités dans les dépendances
   - Format SARIF pour GitHub Security

2. **Safety Check (Python)**
   - Vérification de la base de données de vulnérabilités
   - Check des dépendances Python connues

3. **NPM Audit**
   - Analyse des vulnérabilités NPM
   - Niveau minimum: moderate
   - Détection des packages obsolètes

### Rapports de sécurité

- Upload automatique vers GitHub Security tab
- Génération de SARIF reports
- Alertes en cas de vulnérabilités critiques

---

## Phase 5: NER Model Validation

**Objectif:** Garantir l'intégrité et la disponibilité du modèle NER

### Validations

1. **Vérification de l'existence des fichiers**
   - `models/ner_model.joblib`
   - `models/ner_model_best.joblib`

2. **Test de chargement du modèle**
   - Import et instanciation
   - Vérification du type
   - Validation de l'intégrité

### Critères de succès

- Fichier modèle présent dans le répertoire
- Chargement réussi sans erreur
- Type de modèle conforme aux attentes

---

## Phase 6: Deployment Status Report

**Objectif:** Fournir un rapport complet de l'état du déploiement

### Conditions d'exécution

- Branche: `main` uniquement
- Événement: `push` (pas les pull requests)
- Dépendances: Toutes les phases précédentes réussies

### Informations reportées

1. **Statut des tests**
   - Backend: PASSED/FAILED
   - Frontend: PASSED/FAILED
   - Security: PASSED/FAILED
   - Model: PASSED/FAILED

2. **Cibles de déploiement**
   - Frontend URL: https://nlp-ner.netlify.app
   - Backend URL: https://nlp-4g9u.onrender.com

3. **Métriques de performance**
   - Durée totale d'exécution
   - Timestamp UTC

---

## Phase 7: Documentation Validation

**Objectif:** Assurer la présence et la qualité de la documentation

### Fichiers vérifiés

- README.md
- requirements.txt
- Procfile
- netlify.toml

### Validation de structure

- Présence de sections "Installation"
- Présence de sections "Usage"
- Complétude des instructions de déploiement

---

## Métriques et Performance

### Temps d'exécution typique

- Code Quality: 2-3 minutes
- Backend Testing: 4-6 minutes (matrix)
- Frontend Build: 3-4 minutes
- Security Scan: 2-3 minutes
- Model Validation: 1-2 minutes
- **Total**: ~15-20 minutes

### Optimisations implémentées

1. **Cache stratégique**
   - Cache Pip pour accélérer l'installation Python
   - Cache NPM pour les dépendances Node.js

2. **Parallel execution**
   - Phase 2 et 3 s'exécutent en parallèle
   - Matrix testing pour multiplier la couverture

3. **Artifact management**
   - Build artifacts sauvegardés
   - Rétention optimisée (7 jours)

---

## Intégration Continue

### Workflow Git

```
develop branch
    |
    | Pull Request
    v
main branch --> Auto Deploy
    |
    |-- Netlify (Frontend)
    |-- Render (Backend)
```

### Stratégie de branches

- **develop**: Développement actif, tests continus
- **main**: Production, déploiement automatique
- **feature branches**: Features isolées avec PR vers develop

---

## Monitoring et Alertes

### Notifications

- Email automatique en cas d'échec
- Status checks sur les Pull Requests
- Badges de build status

### Dashboards

- GitHub Actions tab: Historique complet
- Security tab: Rapports de vulnérabilités
- Insights tab: Métriques d'utilisation

---

## Améliorations futures

### Court terme

- [ ] Ajout de tests end-to-end (Playwright/Cypress)
- [ ] Intégration de SonarQube pour la qualité
- [ ] Déploiement en environnement de staging

### Moyen terme

- [ ] Containerisation avec Docker
- [ ] Tests de charge avec Locust
- [ ] Monitoring applicatif (Sentry, DataDog)

### Long terme

- [ ] Infrastructure as Code (Terraform)
- [ ] Service mesh pour microservices
- [ ] Auto-scaling basé sur les métriques

---

## Conclusion

Ce pipeline CI/CD garantit:

- **Qualité**: Code formaté, testé et sécurisé
- **Fiabilité**: Tests multi-versions et multi-environnements
- **Sécurité**: Scan automatique des vulnérabilités
- **Traçabilité**: Historique complet des déploiements
- **Automatisation**: Déploiement continu sans intervention manuelle

**Résultat**: Une application NER robuste, maintainable et production-ready.
