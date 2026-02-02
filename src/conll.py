from __future__ import annotations

from pathlib import Path
from typing import List, Tuple


def read_conll(path: str | Path) -> Tuple[List[List[str]], List[List[str]]]:
    """Read a CoNLL-style file and return token and label sequences.

    Each non-empty line is expected to contain at least 2 columns with the label
    in the last column. Sentences are separated by blank lines.
    """
    sentences: List[List[str]] = []
    labels: List[List[str]] = []

    sentence: List[str] = []
    sentence_labels: List[str] = []

    with Path(path).open(encoding="utf-8") as f:
        for line in f:
            line = line.strip()

            if not line:
                if sentence:
                    sentences.append(sentence)
                    labels.append(sentence_labels)
                    sentence = []
                    sentence_labels = []
                continue

            parts = line.split()
            token = parts[0]
            ner_tag = parts[-1]

            sentence.append(token)
            sentence_labels.append(ner_tag)

    if sentence:
        sentences.append(sentence)
        labels.append(sentence_labels)

    return sentences, labels
