from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from config.database import connect_to_mongo, close_mongo_connection
from routes import company, sessions

app = FastAPI(
    title="DigiAssistant API",
    description="AI-Powered Digital Maturity Diagnostic",
    version="2.0.0"
)

# CORS Configuration
# Log CORS origins for debugging
print(f"🌐 CORS Origins configured: {settings.cors_origins_list}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Database Events
@app.on_event("startup")
async def startup_event():
    try:
        await connect_to_mongo()
        print("🚀 DigiAssistant API is running!")
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Failed to connect to MongoDB on startup: {e}")
        print("\n" + "="*60)
        print("⚠️  DATABASE CONNECTION REQUIRED")
        print("="*60)
        if "localhost" in error_msg or "127.0.0.1" in error_msg:
            print("📝 For Railway deployment, set MONGODB_URL environment variable")
            print("   to your MongoDB Atlas connection string (mongodb+srv://...)")
            print("   Example: mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority")
        print("="*60 + "\n")
        # For production, we should fail fast - database is required
        # Only allow app to continue in development mode
        import os
        # Check if we're in a production environment (Railway sets PORT, or we can check for PORT)
        # Also check if MONGODB_URL is set but pointing to localhost (common mistake)
        is_production = os.getenv("PORT") is not None or os.getenv("RAILWAY_ENVIRONMENT")
        mongodb_url = os.getenv("MONGODB_URL", settings.MONGODB_URL)
        is_localhost_db = "localhost" in mongodb_url or "127.0.0.1" in mongodb_url
        
        if is_production and is_localhost_db:
            # Production environment but using localhost DB - this is wrong
            raise RuntimeError(
                "Production environment detected but MONGODB_URL points to localhost. "
                "Set MONGODB_URL to your MongoDB Atlas connection string in Railway environment variables."
            )
        elif is_production:
            # Production with non-localhost DB but connection failed - fail fast
            raise RuntimeError("Database connection failed. Cannot start without database in production.")
        else:
            print("⚠️ Development mode: Continuing without database (operations will fail)")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Health Check
@app.get("/")
async def root():
    return {
        "message": "DigiAssistant API",
        "version": "2.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include Routers
app.include_router(company.router)
app.include_router(sessions.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
