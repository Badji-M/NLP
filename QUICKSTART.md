# 🚀 Guide de démarrage rapide

## 🎯 Projet complet - NER MultiCoNER v2

Votre projet est **100% fonctionnel** ! Voici comment l'utiliser :

---

## 📁 Structure complète

```
ner-multiconer/
├── data/               ✅ Données CoNLL (train/dev/test)
├── models/             ✅ Modèle CRF sauvegardé
├── notebook/           ✅ NER.ipynb (analyse complète)
├── src/                ✅ Scripts Python
│   ├── conll.py       (Parser CoNLL)
│   ├── features.py    (Extraction features)
│   ├── train.py       (Entraînement)
│   ├── evaluate.py    (Évaluation)
│   └── api.py         (API FastAPI)
├── web/                ✅ Interface web
│   └── index.html
├── slides/             ✅ Présentation (25 slides)
├── test_api.py         ✅ Tests API
├── start_api.bat       ✅ Script de démarrage
├── requirements.txt    ✅ Dépendances
└── README.md           ✅ Documentation
```

---

## 🏃 Démarrage rapide

### 1️⃣ **Lancer l'API**

**Option A - Via le script** (recommandé) :
```bash
start_api.bat
```

**Option B - Via PowerShell** :
```powershell
.venv\Scripts\python.exe -m uvicorn src.api:app --reload --port 8000
```

L'API sera disponible sur : **http://localhost:8000**

### 2️⃣ **Tester l'API**

**Via le navigateur** :
- Documentation interactive : http://localhost:8000/docs
- Interface web : Ouvrir `web/index.html` dans votre navigateur

**Via script Python** :
```bash
python test_api.py
```

**Via curl** :
```bash
curl -X POST "http://localhost:8000/predict" -H "Content-Type: application/json" -d "{\"tokens\": [\"Emmanuel\", \"Macron\", \"à\", \"Paris\"]}"
```

---

## 📊 Résultats attendus

### Notebook (NER.ipynb)
- ✅ **Baseline LogReg** : F1 ~0.40-0.50 (rapide)
- ✅ **CRF séquentiel** : F1 ~0.55-0.65 (meilleur)

### API
Entrée :
```json
{
  "tokens": ["Emmanuel", "Macron", "est", "président"]
}
```

Sortie :
```json
{
  "tokens": ["Emmanuel", "Macron", "est", "président"],
  "labels": ["B-PER", "I-PER", "O", "O"]
}
```

---

## 🎓 Pour la soutenance

### 📌 Ce qui est prêt :
1. ✅ **Notebook complet** avec baseline + CRF
2. ✅ **Scripts modulaires** (train/evaluate/api)
3. ✅ **API REST fonctionnelle**
4. ✅ **Interface web simple**
5. ✅ **Plan de présentation** (25 slides)
6. ✅ **README structuré**
7. ✅ **Tests automatisés**

### 📌 Démonstration recommandée :
1. Montrer le **notebook** (analyse + résultats)
2. Lancer **l'API** en direct
3. Faire une **prédiction live** via l'interface web
4. Montrer le **code modulaire** (src/)
5. Expliquer le **déploiement** (Heroku/AWS)

---

## 🚀 Déploiement (pour aller plus loin)

### **Option 1 - Heroku (gratuit)**
```bash
# Créer Procfile
echo "web: uvicorn src.api:app --host 0.0.0.0 --port $PORT" > Procfile

# Déployer
heroku create ner-multiconer-api
git push heroku main
```

### **Option 2 - Docker**
```dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🎯 Améliorations possibles

1. **Modèle avancé** : Fine-tuning CamemBERT/FlauBERT
2. **Interface riche** : Dashboard Streamlit avec visualisations
3. **Authentification** : API keys pour sécuriser l'accès
4. **Monitoring** : Logs + métriques de performance
5. **CI/CD** : Tests automatiques + déploiement continu

---

## 📞 Support

Tout fonctionne ! Si besoin :
- **Documentation API** : http://localhost:8000/docs
- **Tests** : `python test_api.py`
- **Notebook** : Réexécuter toutes les cellules

---

**Projet réalisé avec ❤️ pour MultiCoNER v2 (FR)**
