from __future__ import annotations

import argparse
from pathlib import Path
from typing import List, Tuple

import joblib
from sklearn.feature_extraction import DictVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn_crfsuite import CRF

from src.conll import read_conll
from src.features import sent2features


def load_data(data_dir: Path) -> Tuple[List[List[str]], List[List[str]]]:
    train_path = data_dir / "fr_train.conll"
    train_sent, train_labels = read_conll(train_path)
    return train_sent, train_labels


def train_logreg(train_sent: List[List[str]], train_labels: List[List[str]]):
    X = [feat for sent in train_sent for feat in sent2features(sent)]
    y = [lab for labs in train_labels for lab in labs]

    clf = Pipeline(
        [
            ("vec", DictVectorizer(sparse=True)),
            (
                "clf",
                LogisticRegression(
                    max_iter=200,
                    n_jobs=-1,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    clf.fit(X, y)
    return clf


def train_crf(train_sent: List[List[str]], train_labels: List[List[str]]):
    X = [sent2features(sent) for sent in train_sent]
    y = train_labels

    crf = CRF(
        algorithm="lbfgs",
        c1=0.1,
        c2=0.1,
        max_iterations=100,
        all_possible_transitions=True,
    )
    crf.fit(X, y)
    return crf


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train NER models")
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path("data"),
        help="Path to the data directory",
    )
    parser.add_argument(
        "--model",
        choices=["logreg", "crf"],
        default="crf",
        help="Model type to train",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("models") / "ner_model.joblib",
        help="Output path for the trained model",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    train_sent, train_labels = load_data(args.data_dir)

    if args.model == "logreg":
        model = train_logreg(train_sent, train_labels)
    else:
        model = train_crf(train_sent, train_labels)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, args.output)
    print(f"Model saved to {args.output}")


if __name__ == "__main__":
    main()
