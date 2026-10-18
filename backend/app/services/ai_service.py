import json
import logging
from typing import Any, Dict, Optional
from openai import OpenAI, APIStatusError
from app.core.config import settings
from app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self._groq_client: Optional[OpenAI] = None
        self._deepseek_client: Optional[OpenAI] = None

    @property
    def groq_client(self) -> Optional[OpenAI]:
        if not self._groq_client and settings.GROQ_API_KEY:
            self._groq_client = OpenAI(
                api_key=settings.GROQ_API_KEY,
                base_url=settings.GROQ_BASE_URL,
            )
        return self._groq_client

    @property
    def deepseek_client(self) -> Optional[OpenAI]:
        if not self._deepseek_client and settings.DEEPSEEK_API_KEY:
            self._deepseek_client = OpenAI(
                api_key=settings.DEEPSEEK_API_KEY,
                base_url=settings.DEEPSEEK_BASE_URL,
            )
        return self._deepseek_client

    def is_groq_active(self) -> bool:
        return bool(settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here")

    def is_deepseek_active(self) -> bool:
        return bool(settings.DEEPSEEK_API_KEY and settings.DEEPSEEK_API_KEY != "your_deepseek_api_key_here")

    def is_configured(self) -> bool:
        return self.is_groq_active() or self.is_deepseek_active() or gemini_service.is_configured()

    def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        # 1. Primary: Groq Cloud (Ultra-fast)
        if self.is_groq_active():
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})

                response = self.groq_client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=messages,
                    temperature=0.7,
                )
                return response.choices[0].message.content or ""
            except Exception as e:
                logger.error(f"Groq API error: {e}, attempting fallbacks...")

        # 2. Secondary: DeepSeek
        if self.is_deepseek_active():
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})

                response = self.deepseek_client.chat.completions.create(
                    model=settings.DEEPSEEK_MODEL,
                    messages=messages,
                    temperature=0.7,
                )
                return response.choices[0].message.content or ""
            except APIStatusError as e:
                if e.status_code == 402:
                    logger.warning("DeepSeek error: Insufficient Balance. Falling back...")
                else:
                    logger.error(f"DeepSeek error: {e}")
            except Exception as e:
                logger.error(f"DeepSeek error: {e}")

        # 3. Tertiary: Gemini
        if gemini_service.is_configured():
            return gemini_service.generate_text(prompt, system_instruction)

        return (
            "[Notice] No active AI provider key configured. "
            "Please configure GROQ_API_KEY, DEEPSEEK_API_KEY, or GEMINI_API_KEY in backend/.env."
        )

    def generate_json(self, prompt: str, system_instruction: Optional[str] = None) -> Dict[str, Any]:
        # 1. Primary: Groq Cloud (Ultra-fast JSON)
        if self.is_groq_active():
            try:
                messages = []
                system_msg = system_instruction or "You are a helpful AI educator."
                system_msg += " Output must be strictly valid JSON without markdown fences."
                messages.append({"role": "system", "content": system_msg})
                messages.append({"role": "user", "content": prompt})

                response = self.groq_client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=messages,
                    temperature=0.3,
                    response_format={"type": "json_object"},
                )
                content = response.choices[0].message.content or "{}"
                return json.loads(content)
            except Exception as e:
                logger.error(f"Groq JSON error: {e}, attempting fallbacks...")

        # 2. Secondary: DeepSeek
        if self.is_deepseek_active():
            try:
                messages = []
                system_msg = system_instruction or "You are a helpful AI educator."
                system_msg += " Output must be strictly valid JSON without markdown fences."
                messages.append({"role": "system", "content": system_msg})
                messages.append({"role": "user", "content": prompt})

                response = self.deepseek_client.chat.completions.create(
                    model=settings.DEEPSEEK_MODEL,
                    messages=messages,
                    temperature=0.3,
                    response_format={"type": "json_object"},
                )
                content = response.choices[0].message.content or "{}"
                return json.loads(content)
            except Exception as e:
                logger.error(f"DeepSeek JSON error: {e}")

        # 3. Tertiary: Gemini
        if gemini_service.is_configured():
            return gemini_service.generate_json(prompt, system_instruction)

        raise ValueError("No configured AI provider available to generate JSON.")


ai_service = AIService()
