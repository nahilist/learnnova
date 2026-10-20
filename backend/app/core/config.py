from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    PROJECT_NAME: str = "LearnNova AI Backend"
    VERSION: str = "0.2.0"
    API_V1_PREFIX: str = "/api"
    
    # Shared secret for trusted server-to-server Next.js -> FastAPI communication
    BACKEND_SECRET: str = "learnnova-secure-backend-shared-secret-dev"

    # Database URL (Neon PostgreSQL)
    DATABASE_URL: str = ""

    # Groq Cloud API Settings (Primary high-speed provider)
    GROQ_API_KEY: str = ""
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    # DeepSeek API Settings
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com"
    DEEPSEEK_MODEL: str = "deepseek-chat"

    # Gemini API Key (optional fallback)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"
    
    # Server & Environment
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    
    # CORS Origins (Restricted in production)
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000,https://learnnova-taupe.vercel.app"

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
