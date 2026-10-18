# LearnNova AI Backend (Python + FastAPI)

High-performance AI backend for **LearnNova**, handling YouTube lecture transcripts, PDF extraction, AI Tutor chat, and automated study tool synthesis (quizzes, flashcards) powered by **Google Gemini**.

---

## ⚡ Quick Start

### 1. Requirements
- Python 3.12+
- [`uv`](https://github.com/astral-sh/uv) (fast Python package manager)

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Add your free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/):
```env
GEMINI_API_KEY=your_actual_key_here
```

### 3. Run Development Server
Using `uv`:
```bash
uv run uvicorn app.main:app --reload --port 8000
```
Or directly from the project root:
```bash
npm run backend:dev
```

The API will be available at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Alternative ReDoc**: `http://localhost:8000/redoc`

---

## 🧪 Run Tests
```bash
uv run pytest
```

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & service readiness |
| `POST` | `/api/youtube/summarize` | Extracts transcript and generates summary, chapters, key takeaways, quiz, and flashcards from YouTube URL |
| `POST` | `/api/documents/process-pdf` | Extracts text from uploaded PDF and generates study guides |
| `POST` | `/api/chat/ask` | AI Tutor contextual Q&A conversation |
| `POST` | `/api/study/flashcards` | Generates active recall flashcards from text |
| `POST` | `/api/study/quiz` | Generates rigorous multiple-choice quizzes with explanations |
