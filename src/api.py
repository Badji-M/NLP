from __future__ import annotations

from pathlib import Path
from typing import List, Tuple, Dict
import re
import joblib
import pdfplumber
from docx import Document
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from src.features import sent2features

app = FastAPI(title="NER API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5175", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Serve static files (models, documents, etc.)
models_path = Path("models")
if models_path.exists():
    app.mount("/models", StaticFiles(directory=str(models_path)), name="models")
MODEL_PATH = Path("models") / "ner_model_best.joblib"
FALLBACK_MODEL_PATH = Path("models") / "ner_model.joblib"
MODEL_TYPE = "crf"  # or "logreg"

model = None


class PredictRequest(BaseModel):
    tokens: List[str]


class PredictTextRequest(BaseModel):
    text: str


class PredictResponse(BaseModel):
    tokens: List[str]
    labels: List[str]


class EnhancedPredictResponse(BaseModel):
    tokens: List[str]
    labels: List[str]
    entities: List[Dict]
    statistics: Dict


def extract_entities(tokens: List[str], labels: List[str]) -> List[Dict]:
    """Regroupe les tokens en entités complètes"""
    entities = []
    current_entity = None

    for i, (token, label) in enumerate(zip(tokens, labels)):
        if label.startswith('B-'):
            if current_entity:
                entities.append(current_entity)
            current_entity = {
                'text': token,
                'label': label[2:],  # Enlève le préfixe B-
                'start': i,
                'end': i,
                'tokens': [token]
            }
        elif label.startswith('I-') and current_entity and label[2:] == current_entity['label']:
            current_entity['text'] += ' ' + token
            current_entity['end'] = i
            current_entity['tokens'].append(token)
        else:
            if current_entity:
                entities.append(current_entity)
                current_entity = None

    if current_entity:
        entities.append(current_entity)

    return entities


def calculate_statistics(entities: List[Dict], total_tokens: int) -> Dict:
    """Calcule les statistiques détaillées"""
    if not entities:
        return {}

    # Comptage par type
    label_counts = {}
    for entity in entities:
        label = entity['label']
        label_counts[label] = label_counts.get(label, 0) + 1

    # Calcul des pourcentages
    total_entities = len(entities)
    stats = []
    for label, count in label_counts.items():
        # Calcul du nombre de tokens pour ce label
        token_count = sum(len(e['tokens']) for e in entities if e['label'] == label)
        stats.append({
            'label': label,
            'count': count,
            'percentage': round((count / total_entities) * 100, 1) if total_entities > 0 else 0,
            'token_percentage': round((token_count / total_tokens) * 100, 1) if total_tokens > 0 else 0
        })

    return {
        'total_entities': total_entities,
        'total_tokens': total_tokens,
        'entity_density': round((total_entities / total_tokens) * 100, 1) if total_tokens > 0 else 0,
        'by_type': stats
    }


@app.on_event("startup")
def load_model() -> None:
    global model
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
    elif FALLBACK_MODEL_PATH.exists():
        model = joblib.load(FALLBACK_MODEL_PATH)


def tokenize_text(text: str) -> List[str]:
    text = text.strip()
    if not text:
        return []
    return re.findall(r"\w+|[^\w\s]", text, flags=re.UNICODE)


def extract_text_from_pdf(file_path: Path) -> str:
    text_parts: List[str] = []
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def extract_text_from_docx(file_path: Path) -> str:
    doc = Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs if p.text])


def predict_tokens(tokens: List[str]) -> Tuple[List[str], List[str]]:
    if not tokens:
        return [], []
    if model is None:
        return tokens, ["O"] * len(tokens)

    if MODEL_TYPE == "logreg":
        feats = [feat for feat in sent2features(tokens)]
        labels = list(model.predict(feats))
    else:
        feats = [sent2features(tokens)]
        labels = list(model.predict(feats)[0])
    return tokens, labels


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    tokens, labels = predict_tokens(req.tokens)
    return PredictResponse(tokens=tokens, labels=labels)


@app.post("/predict-text", response_model=PredictResponse)
def predict_text(req: PredictTextRequest) -> PredictResponse:
    tokens = tokenize_text(req.text)
    tokens, labels = predict_tokens(tokens)
    return PredictResponse(tokens=tokens, labels=labels)


@app.post("/predict-enhanced", response_model=EnhancedPredictResponse)
def predict_enhanced(req: PredictTextRequest) -> EnhancedPredictResponse:
    tokens = tokenize_text(req.text)
    tokens, labels = predict_tokens(tokens)

    # Extraire les entités structurées
    entities = extract_entities(tokens, labels)

    # Calculer les statistiques
    stats = calculate_statistics(entities, len(tokens))

    return EnhancedPredictResponse(
        tokens=tokens,
        labels=labels,
        entities=entities,
        statistics=stats
    )


@app.post("/predict-file", response_model=PredictResponse)
async def predict_file(file: UploadFile = File(...)) -> PredictResponse:
    if file is None:
        raise HTTPException(status_code=400, detail="Aucun fichier reçu")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in {".pdf", ".docx", ".txt"}:
        raise HTTPException(status_code=400, detail="Format non supporté. Utilisez PDF, DOCX ou TXT.")

    tmp_dir = Path(".tmp")
    tmp_dir.mkdir(exist_ok=True)
    tmp_path = tmp_dir / file.filename

    content = await file.read()
    tmp_path.write_bytes(content)

    if suffix == ".pdf":
        text = extract_text_from_pdf(tmp_path)
    elif suffix == ".docx":
        text = extract_text_from_docx(tmp_path)
    else:
        try:
            text = content.decode("utf-8")
        except UnicodeDecodeError:
            text = content.decode("latin-1")

    tokens = tokenize_text(text)
    tokens, labels = predict_tokens(tokens)
    return PredictResponse(tokens=tokens, labels=labels)


@app.post("/export-pdf")
def export_pdf(data: dict):
    """Génère un PDF avec les résultats"""
    # Créer un buffer pour le PDF
    buffer = io.BytesIO()

    # Créer le document
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    # Contenu du PDF
    content = []

    # Titre
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30
    )
    content.append(Paragraph("Rapport d'Analyse NER", title_style))

    # Texte original
    content.append(Paragraph("<b>Texte analysé :</b>", styles['Heading2']))
    content.append(Paragraph(data.get('text', ''), styles['Normal']))
    content.append(Spacer(1, 20))

    # Statistiques
    content.append(Paragraph("<b>Statistiques :</b>", styles['Heading2']))
    stats = data.get('statistics', {})

    stats_data = [
        ['Métrique', 'Valeur'],
        ['Tokens analysés', stats.get('total_tokens', 0)],
        ['Entités détectées', stats.get('total_entities', 0)],
        ['Densité d\'entités', f"{stats.get('entity_density', 0)}%"]
    ]

    stats_table = Table(stats_data)
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    content.append(stats_table)
    content.append(Spacer(1, 20))

    # Détail par type
    content.append(Paragraph("<b>Détail par type d'entité :</b>", styles['Heading2']))

    entities_by_type = data.get('entities_by_type', [])
    if entities_by_type:
        detail_data = [['Type', 'Nombre', 'Pourcentage']]
        for item in entities_by_type:
            detail_data.append([
                item.get('label', ''),
                item.get('count', 0),
                f"{item.get('percentage', 0)}%"
            ])

        detail_table = Table(detail_data)
        detail_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        content.append(detail_table)

    # Liste des entités
    content.append(Spacer(1, 20))
    content.append(Paragraph("<b>Liste des entités détectées :</b>", styles['Heading2']))

    entities = data.get('entities', [])
    if entities:
        for i, entity in enumerate(entities, 1):
            content.append(Paragraph(
                f"{i}. <b>{entity.get('text', '')}</b> [{entity.get('label', '')}]",
                styles['Normal']
            ))

    # Générer le PDF
    doc.build(content)
    buffer.seek(0)

    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=rapport_ner.pdf"}
    )