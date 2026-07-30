from fastapi import APIRouter

from app.api.v1.endpoints import chat, courses, health

api_router = APIRouter()

# Legacy paths used by the current frontend.
api_router.include_router(courses.router, prefix="/api/course", tags=["courses"])

# Versioned paths for new agent capabilities.
api_router.include_router(health.router, prefix="/api/v1", tags=["health"])
api_router.include_router(chat.router, prefix="/api/v1", tags=["chat"])
