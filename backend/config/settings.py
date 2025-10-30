from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "digiassistant"
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # OpenAI
    OPENAI_API_KEY: str = "sk-proj-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"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()