from pydantic import BaseModel


class Citation(BaseModel):
    source_id: str
    lecture_id: str
    lecture_title: str
    page: int | None = None
    excerpt: str | None = None
