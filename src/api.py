from __future__ import annotations

from pathlib import Path
from typing import List

import joblib
from fastapi import FastAPI
from pydantic import BaseModel

from src.features import sent2features

app = FastAPI(title="NER API")

MODEL_PATH = Path("models") / "ner_model.joblib"
MODEL_TYPE = "crf"  # or "logreg"

model = None


class PredictRequest(BaseModel):
    tokens: List[str]


class PredictResponse(BaseModel):
    tokens: List[str]
    labels: List[str]


@app.on_event("startup")
def load_model() -> None:
    global model
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    if model is None:
        return PredictResponse(tokens=req.tokens, labels=["O"] * len(req.tokens))

    if MODEL_TYPE == "logreg":
        feats = [feat for feat in sent2features(req.tokens)]
        labels = list(model.predict(feats))
    else:
        feats = [sent2features(req.tokens)]
        labels = list(model.predict(feats)[0])

    return PredictResponse(tokens=req.tokens, labels=labels)
