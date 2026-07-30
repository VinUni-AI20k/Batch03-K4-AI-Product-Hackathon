from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI in Action Hackathon API",
    description="Backend API for AI in Action Hackathon projects using Next.js & FastAPI",
    version="1.0.0"
)

# Cấu hình CORS để cho phép Next.js gọi API từ localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Có thể giới hạn lại thành ["http://localhost:3000"] nếu cần bảo mật hơn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI in Action Hackathon API"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "backend"}
