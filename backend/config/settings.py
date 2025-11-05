from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "digiassistant"
    
    # JWT
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production"  # Change this in production!
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # AI Provider Configuration
    # Option 1: OpenAI
    OPENAI_API_KEY: str = ""  # Leave empty to use intelligent fallback system
    
    # Option 2: Google Gemini (Recommended - supports GitHub Marketplace API keys)
    GEMINI_API_KEY: str = ""  # Google Gemini API key (can be from GitHub Marketplace)
    
    # AI Provider Selection
    AI_PROVIDER: str = "gemini"  # Options: "openai", "gemini", "fallback"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()