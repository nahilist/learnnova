import json
import logging
from typing import Any, Dict, List, Optional
from google import genai
from google.genai import types
from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self._client: Optional[genai.Client] = None

    @property
    def client(self) -> Optional[genai.Client]:
        if not self._client and settings.GEMINI_API_KEY:
            try:
                self._client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
        return self._client

    def is_configured(self) -> bool:
        return bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here")

    def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        if not self.is_configured():
            return (
                "[Notice] Gemini API key is not configured yet. "
                "Please add your GEMINI_API_KEY in backend/.env to enable live AI responses."
            )

        try:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            ) if system_instruction else types.GenerateContentConfig(temperature=0.7)

            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=config,
            )
            return response.text or ""
        except Exception as e:
            logger.error(f"Gemini generate_text error: {e}")
            raise RuntimeError(f"AI generation failed: {str(e)}")

    def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        if not self.is_configured():
            raise ValueError("GEMINI_API_KEY is not configured in backend/.env")

        try:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.4,
                response_mime_type="application/json",
            )
            response = self.client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=prompt,
                config=config,
            )
            text = response.text or "{}"
            return json.loads(text)
        except Exception as e:
            logger.error(f"Gemini generate_json error: {e}")
            raise RuntimeError(f"AI JSON generation failed: {str(e)}")


gemini_service = GeminiService()
