from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    IMPORTANT: Do NOT put API keys directly in this file!
    Create a .env file in the backend/ directory with your actual values.
    
    Example .env file:
        OPENAI_API_KEY=your-actual-key-here
        GEMINI_API_KEY=your-actual-key-here
        # For local MongoDB:
        # MONGODB_URL=mongodb://localhost:27017
        # For MongoDB Atlas (cloud):
        # MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
        MONGODB_URL=mongodb://localhost:27017
        DB_NAME=digiassistant
        JWT_SECRET_KEY=your-secret-key
    
    The .env file is automatically loaded and will override these default values.
    """
    
    # MongoDB Configuration
    # Supports both local MongoDB and MongoDB Atlas
    # For Atlas: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
    # For local: mongodb://localhost:27017
    MONGODB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "digiassistant"
    
    # JWT
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production"  # Override in .env for production!
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # AI Provider Configuration
    # Option 1: OpenAI - Set OPENAI_API_KEY in .env file
    OPENAI_API_KEY: str = ""  # Default: empty. Set in .env file!
    
    # Option 2: Google Gemini (Recommended - supports GitHub Marketplace API keys)
    GEMINI_API_KEY: str = ""  # Default: empty. Set in .env file!
    
    # AI Provider Selection
    AI_PROVIDER: str = "gemini"  # Options: "openai", "gemini", "fallback"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"  # Automatically loads from backend/.env file
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()