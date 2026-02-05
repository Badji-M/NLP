from __future__ import annotations

from pathlib import Path
from typing import List, Tuple

import re

import os

import joblib
import pdfplumber
from docx import Document
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.features import sent2features

app = FastAPI(title="NER API")

raw_origins = os.getenv("CORS_ALLOW_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
allow_credentials = True
if "*" in origins:
    origins = ["*"]
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"]
)

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
