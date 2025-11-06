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
        print(f"⚠️ Warning: Could not connect to MongoDB on startup: {e}")
        print("⚠️ Application will continue but database operations may fail.")
        # Don't raise - allow app to start even if DB is temporarily unavailable

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
