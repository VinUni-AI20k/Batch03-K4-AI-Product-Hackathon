# CLAUDE.md — Agent System Rules

## Build Commands
- Build entire project (Frontend): `cd codebase/frontend && npm run build`
- Install Frontend dependencies: `cd codebase/frontend && npm install`
- Sync Backend dependencies (uv): `conda activate ai_in_action && cd codebase/backend && uv sync`

## Development / Run Commands
- Run Frontend (Next.js): `cd codebase/frontend && npm run dev`
- Run Backend (FastAPI): `conda activate ai_in_action && cd codebase/backend && uv run uvicorn app.main:app --reload --port 8000`

## Tech Stack & Architecture
- **Frontend:** Next.js (App Router, Tailwind CSS, TypeScript). Use `@/*` alias for import paths from `src/`.
- **Backend:** FastAPI (Python, managed via `uv`). Environment variables configured via `.env` in `codebase/backend/`.

## Critical Agent Guidelines & Rules
1. **Python Environment Activation (CRITICAL):**
   - You **MUST** prefix every Python, pip, uv, uvicorn, or pytest command with `conda activate ai_in_action && ...`
   - Example: `conda activate ai_in_action && cd codebase/backend && uv add fastapi`
   - NEVER run bare python/uv commands in the bash shell without activating `ai_in_action`.
2. **Directory Structure:**
   - Keep all prototype implementation code strictly inside `codebase/frontend` or `codebase/backend`.
3. **Data Security & Privacy:**
   - **DO NOT** commit any raw datasets from `data/` directory to git.
   - Do not print, read or export large portions of files inside `data/` to avoid token context overflow.
4. **Code Quality:**
   - Backend: Use explicit type hints and Pydantic models for request/response validation.
   - Frontend: Ensure TypeScript compiles cleanly during build (`npm run build`).
