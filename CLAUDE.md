# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Backend
- **Setup**:
  ```bash
  cd backend
  python -m venv .venv
  # Windows
  .venv/Scripts/pip install -r requirements.txt
  # macOS/Linux
  .venv/bin/pip install -r requirements.txt
  cp .env.example .env
  ```
- **Run**:
  ```bash
  cd backend
  .venv/Scripts/python -m uvicorn app.main:app --port 8000 --host 127.0.0.1
  ```
- **Endpoints**:
  - `GET /api/health` - Server health check
  - `GET /api/outline` - Parse outline from transcript
  - `POST /api/quiz/generate` - Generate MCQs using OpenAI (Core AI feature)

### Frontend
- **Setup**:
  ```bash
  cd frontend
  npm install
  ```
- **Run (Dev)**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Build**:
  ```bash
  cd frontend
  npm run build
  ```

### Evaluation
- **Run Golden Set**:
  ```bash
  python eval/run_golden_set.py
  ```

## Code Architecture

### High-Level Overview
The project is a personalized learning assistant (`vlearn-agent-ui`) comprising a React frontend and a FastAPI backend. It uses a pipeline-based approach to process educational transcripts, generate study outlines, and create quiz banks.

### Backend Structure (`backend/app/`)
- `api/`: Route handlers (`routes_diagnosis.py`, `routes_reteach.py`, `routes_session.py`).
- `pipeline/`: Modular AI processing logic:
  - `quiz_bank.py`: MCQ generation (uses OpenAI).
  - `classify.py`: Transcript classification (uses Gemini).
  - `outline.py`, `grading.py`, `weakness.py`, `rewrite.py`, `align.py`: Specialized content processing modules.
- `core/`: Core utilities and LLM clients:
  - `llm_client_openai.py`: Interface for OpenAI.
  - `llm_client.py`: Interface for Gemini.
- `prompts/`: Centralized storage for LLM prompt templates.
- `utils/`: Common helper functions.

### Frontend Structure (`frontend/`)
- A Vite + React + TypeScript SPA.
- Configured to communicate with the backend at `http://127.0.0.1:8000`.

### LLM Integration
The system utilizes a dual-LLM strategy:
- **OpenAI**: Primarily used for high-stakes content generation like the quiz bank.
- **Gemini**: Used for classification and other processing tasks.
- Configuration is managed via `.env` files using `OPENAI_API_KEY` and `GOOGLE_API_KEY`.
