from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Connect to MongoDB"""
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongodb.db = mongodb.client[settings.DB_NAME]
    print(f"✅ Connected to MongoDB: {settings.DB_NAME}")

async def close_mongo_connection():
    """Close MongoDB connection"""
    if mongodb.client:
        mongodb.client.close()
        print("❌ Closed MongoDB connection")

def get_database():
    """Get database instance"""
    return mongodb.db