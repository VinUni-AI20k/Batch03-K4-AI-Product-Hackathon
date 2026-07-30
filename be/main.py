"""Compatibility entrypoint.

Existing command remains valid:
    uvicorn main:app --reload
"""

from app.main import app

__all__ = ["app"]
