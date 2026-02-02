# Soutenance NER MultiCoNER (FR)

## 1. Titre & équipe
- NER multi-classes sur corpus MultiCoNER v2

## 2. Problématique
- Extraction d'entités nommées en français
- Valeur métier (KPI, automatisation)

## 3. Objectifs
- Construire un modèle NER
- Comparer deux approches
- Évaluer avec précision/rappel/F1

## 4. Dataset
- MultiCoNER v2 (FR)
- Format CoNLL (BIO)

## 5. Types d'entités
- Exemples d'entités fines et ambiguës

## 6. Prétraitement
- Parsing CoNLL
- Reconstruction phrases/labels

## 7. Analyse exploratoire
- Taille des splits
- Distribution des labels

## 8. Baseline 1
- Modèle token-level LogReg
- Features n-grammes simples

## 9. Baseline 1 (résultats)
- F1 micro/macro
- Discussion

## 10. Modèle séquentiel
- CRF (dépendances entre labels)

## 11. Features CRF
- Word shape, préfixes/suffixes, contexte

## 12. CRF (résultats)
- F1 global + per-class

## 13. Comparaison
- LogReg vs CRF
- Qualité + temps

## 14. Erreurs fréquentes
- Entités ambigües
- Nouvelles entités

## 15. Robustesse
- OOV
- Entités rares

## 16. Améliorations
- Embeddings
- Transformers

## 17. Pipeline complet
- Data → Features → Modèle → Éval

## 18. API
- FastAPI /predict

## 19. Démo API
- Exemple d'input/output

## 20. Conclusion
- Résultats clés
- Limites

## 21. Perspectives
- DistilBERT / CamemBERT
- Fine-tuning

## 22. Plan de déploiement
- CI/CD, monitoring

## 23. Références
- MultiCoNER v2
- Outils utilisés

## 24. Q/R

## 25. Merci
