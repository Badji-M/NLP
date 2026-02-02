from __future__ import annotations

from typing import Dict, List


def token2features(sent: List[str], i: int) -> Dict[str, object]:
    word = sent[i]

    features: Dict[str, object] = {
        "bias": 1.0,
        "word.lower()": word.lower(),
        "word.isupper()": word.isupper(),
        "word.istitle()": word.istitle(),
        "word.isdigit()": word.isdigit(),
        "suffix-3": word[-3:].lower(),
        "suffix-2": word[-2:].lower(),
        "prefix-1": word[:1].lower(),
        "prefix-2": word[:2].lower(),
        "prefix-3": word[:3].lower(),
    }

    if i > 0:
        prev_word = sent[i - 1]
        features.update(
            {
                "-1:word.lower()": prev_word.lower(),
                "-1:word.istitle()": prev_word.istitle(),
                "-1:word.isupper()": prev_word.isupper(),
            }
        )
    else:
        features["BOS"] = True

    if i < len(sent) - 1:
        next_word = sent[i + 1]
        features.update(
            {
                "+1:word.lower()": next_word.lower(),
                "+1:word.istitle()": next_word.istitle(),
                "+1:word.isupper()": next_word.isupper(),
            }
        )
    else:
        features["EOS"] = True

    return features


def sent2features(sent: List[str]) -> List[Dict[str, object]]:
    return [token2features(sent, i) for i in range(len(sent))]
