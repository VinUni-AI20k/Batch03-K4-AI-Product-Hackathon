from __future__ import annotations

from fastapi.testclient import TestClient

from app.services.ocr.pipeline import OcrPipeline


def test_parse_get_and_delete_run_endpoints(monkeypatch, settings, docx_bytes):
    import app.api.ocr as ocr_api
    from app.main import app

    pipeline = OcrPipeline(settings)
    monkeypatch.setattr(ocr_api, "get_pipeline", lambda: pipeline)
    monkeypatch.setattr(ocr_api, "get_settings", lambda: settings)
    client = TestClient(app)

    response = client.post(
        "/api/ocr/parse",
        files={
            "file": (
                "synthetic.docx",
                docx_bytes,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            )
        },
        data={
            "use_llm": "false",
            "language_hint": "vie+eng",
            "consent_external_processing": "false",
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "needs_confirmation"
    assert payload["requires_user_confirmation"] is True
    assert "raw_text" not in response.text

    run_id = payload["run_id"]
    metadata = client.get(f"/api/ocr/runs/{run_id}")
    assert metadata.status_code == 200
    assert metadata.json()["run_id"] == run_id
    assert "document_content" not in metadata.text

    deleted = client.delete(f"/api/ocr/runs/{run_id}")
    assert deleted.status_code == 200
    assert deleted.json()["event_log_retained"] is True


def test_api_returns_sanitized_error_without_stack_trace(monkeypatch, settings):
    import app.api.ocr as ocr_api
    from app.main import app

    monkeypatch.setattr(ocr_api, "get_pipeline", lambda: OcrPipeline(settings))
    monkeypatch.setattr(ocr_api, "get_settings", lambda: settings)
    response = TestClient(app).post(
        "/api/ocr/parse",
        files={"file": ("profile.exe", b"MZ synthetic", "application/octet-stream")},
    )
    assert response.status_code == 400
    payload = response.json()["detail"]
    assert payload["code"] == "UNSUPPORTED_FILE_TYPE"
    assert "Traceback" not in response.text
