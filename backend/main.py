from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from config.database import connect_to_mongo, close_mongo_connection
from routes import auth, company, sessions

app = FastAPI(
    title="DigiAssistant API",
    description="AI-Powered Digital Maturity Diagnostic",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Events
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    print("🚀 DigiAssistant API is running!")

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
app.include_router(auth.router)
app.include_router(company.router)
app.include_router(sessions.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
