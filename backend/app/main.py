import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import health, youtube, chat, study_tools, documents

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance Python AI backend for LearnNova (AI Tutor platform)",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
origins = settings.cors_origins_list
if "*" not in origins:
    origins.append("http://localhost:3000")
    origins.append("http://127.0.0.1:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers under /api
app.include_router(health.router, prefix=settings.API_V1_PREFIX)
app.include_router(youtube.router, prefix=settings.API_V1_PREFIX)
app.include_router(chat.router, prefix=settings.API_V1_PREFIX)
app.include_router(study_tools.router, prefix=settings.API_V1_PREFIX)
app.include_router(documents.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
def root():
    return {
        "message": "Welcome to LearnNova AI Backend API",
        "docs": "/docs",
        "version": settings.VERSION,
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
