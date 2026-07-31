from __future__ import annotations

import hashlib


def sha256_bytes(data: bytes) -> str:
    """Return a lowercase SHA-256 digest without retaining the source bytes."""

    return hashlib.sha256(data).hexdigest()
