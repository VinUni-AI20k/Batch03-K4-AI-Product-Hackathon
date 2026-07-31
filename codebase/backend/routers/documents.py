"""Upload a PDF, list documents, read page chunks, serve the raw file."""

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

import config
from schemas import DocumentDetail, DocumentSummary, PageText
from store import documents, sessions

router = APIRouter(prefix="/api/documents", tags=["documents"])


def _summary(doc) -> DocumentSummary:
    return DocumentSummary(
        id=doc.id,
        filename=doc.filename,
        page_count=doc.page_count,
        uploaded_at=doc.uploaded_at,
        size_bytes=doc.size_bytes,
        scanned=doc.scanned,
    )


def require_document(document_id: str):
    doc = documents.get(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc


@router.post(
    "",
    response_model=DocumentDetail,
    status_code=201,
    summary="Upload a PDF",
    description="Accepts a PDF, splits it into one text chunk per page, and returns the page map.",
)
async def upload_document(file: UploadFile = File(..., description="PDF file")) -> DocumentDetail:
    filename = file.filename or "document.pdf"
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Only PDF files are supported")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    if len(data) > config.MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(
            status_code=413, detail=f"File exceeds the {config.MAX_UPLOAD_MB} MB limit"
        )
    if not data.startswith(b"%PDF"):
        raise HTTPException(status_code=415, detail="File does not look like a PDF")

    try:
        doc = documents.add(filename, data)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Could not read the PDF: {exc}") from exc

    return DocumentDetail(**_summary(doc).model_dump(), pages=doc.pages)


@router.get("", response_model=list[DocumentSummary], summary="List uploaded documents")
def list_documents() -> list[DocumentSummary]:
    return [_summary(doc) for doc in documents.list()]


@router.get("/{document_id}", response_model=DocumentDetail, summary="Document detail with page map")
def get_document(document_id: str) -> DocumentDetail:
    doc = require_document(document_id)
    return DocumentDetail(**_summary(doc).model_dump(), pages=doc.pages)


@router.get(
    "/{document_id}/file",
    summary="Download the original PDF",
    description="Served to the browser so the viewer can render pages with pdf.js.",
    response_class=FileResponse,
)
def get_document_file(document_id: str) -> FileResponse:
    doc = require_document(document_id)
    if not doc.pdf_path.exists():
        raise HTTPException(status_code=410, detail="Stored file is missing")
    return FileResponse(doc.pdf_path, media_type="application/pdf", filename=doc.filename)


@router.get(
    "/{document_id}/pages/{page}",
    response_model=PageText,
    summary="Extracted text of one page",
)
def get_page(document_id: str, page: int) -> PageText:
    doc = require_document(document_id)
    if not 1 <= page <= doc.page_count:
        raise HTTPException(status_code=404, detail=f"Page out of range (1-{doc.page_count})")
    return PageText(page=page, text=doc.page_text(page))


@router.delete("/{document_id}", status_code=204, summary="Delete a document and its sessions")
def delete_document(document_id: str) -> None:
    if not documents.delete(document_id):
        raise HTTPException(status_code=404, detail="Document not found")
    sessions.drop_document(document_id)
