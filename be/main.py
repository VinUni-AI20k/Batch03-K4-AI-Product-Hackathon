from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CourseInfo(BaseModel):
    title: str
    students: int
    progress_completed: int
    progress_total: int

class Day(BaseModel):
    id: int
    seq: str
    title: str
    slides: int
    is_completed: bool

# In-memory state
COURSE = {
    "title": "COMP2010 - Khoá 3 + 4 Phase 1",
    "students": 1074,
    "progress_completed": 0,
    "progress_total": 6
}

DAYS = [
    {"id":1, "seq":"01", "title":"Day01", "slides":2, "is_completed":False},
    {"id":2, "seq":"02", "title":"Day02", "slides":1, "is_completed":False},
    {"id":3, "seq":"03", "title":"Day03", "slides":2, "is_completed":False},
    {"id":4, "seq":"04", "title":"Day04", "slides":3, "is_completed":False},
]

@app.get('/api/course/info', response_model=CourseInfo)
def get_course_info():
    return {
        "title": COURSE['title'],
        "students": COURSE['students'],
        "progress_completed": COURSE['progress_completed'],
        "progress_total": COURSE['progress_total']
    }

@app.get('/api/course/days', response_model=List[Day])
def get_course_days():
    return DAYS

@app.post('/api/course/toggle-day/{day_id}')
def toggle_day(day_id: int):
    # toggle completion for day
    for d in DAYS:
        if d['id'] == day_id:
            d['is_completed'] = not d['is_completed']
            break
    # recalc progress
    completed = sum(1 for d in DAYS if d['is_completed'])
    COURSE['progress_completed'] = completed
    return {"success": True, "completed": completed, "total": COURSE['progress_total']}
