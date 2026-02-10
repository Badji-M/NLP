from __future__ import annotations

import argparse
from pathlib import Path
from typing import List

import joblib
from seqeval.metrics import classification_report, f1_score

from src.conll import read_conll
from src.features import sent2features


def load_split(data_dir: Path, split: str):
    path = data_dir / f"fr_{split}.conll"
    return read_conll(path)


def predict_logreg(model, sentences: List[List[str]]):
    all_feats = [feat for sent in sentences for feat in sent2features(sent)]
    all_preds = model.predict(all_feats)

    preds = []
    idx = 0
    for sent in sentences:
        preds.append(list(all_preds[idx:idx + len(sent)]))
        idx += len(sent)
    return preds


def predict_crf(model, sentences: List[List[str]]):
    X = [sent2features(sent) for sent in sentences]
    return model.predict(X)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Evaluate NER models")
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path("data"),
        help="Path to the data directory",
    )
    parser.add_argument(
        "--model-path",
        type=Path,
        default=Path("models") / "ner_model.joblib",
        help="Path to the trained model",
    )
    parser.add_argument(
        "--split",
        choices=["dev", "test"],
        default="dev",
        help="Data split to evaluate",
    )
    parser.add_argument(
        "--model-type",
        choices=["logreg", "crf"],
        default="crf",
        help="Model type",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    sentences, labels = load_split(args.data_dir, args.split)

    model = joblib.load(args.model_path)
    if args.model_type == "logreg":
        preds = predict_logreg(model, sentences)
    else:
        preds = predict_crf(model, sentences)

    print("F1:", f1_score(labels, preds))
    print(classification_report(labels, preds))


if __name__ == "__main__":
    main()
