from fastapi import APIRouter
from app.core.config import settings
from app.services.ai_service import ai_service

router = APIRouter()


@router.get("/health")
def health_check():
    groq_active = ai_service.is_groq_active()
    deepseek_active = ai_service.is_deepseek_active()
    gemini_active = bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here")

    if groq_active:
        provider = f"Groq Cloud ({settings.GROQ_MODEL})"
    elif deepseek_active:
        provider = f"DeepSeek ({settings.DEEPSEEK_MODEL})"
    elif gemini_active:
        provider = f"Gemini ({settings.GEMINI_MODEL})"
    else:
        provider = "None"

    return {
        "status": "online",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "primary_ai_provider": provider,
        "groq_configured": groq_active,
        "deepseek_configured": deepseek_active,
        "gemini_configured": gemini_active,
    }
