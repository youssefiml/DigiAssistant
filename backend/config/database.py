from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Connect to MongoDB (supports both local MongoDB and MongoDB Atlas)"""
    try:
        # Configure connection with optimal settings for both local and Atlas
        mongodb.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=10000,  # 10 second connection timeout
            socketTimeoutMS=45000,  # 45 second socket timeout
            maxPoolSize=50,  # Maximum number of connections in the pool
            minPoolSize=10,  # Minimum number of connections in the pool
            retryWrites=True,  # Enable retryable writes (Atlas recommended)
        )
        
        # Test the connection
        await mongodb.client.admin.command('ping')
        
        mongodb.db = mongodb.client[settings.DB_NAME]
        
        # Detect if using Atlas or local
        is_atlas = "mongodb.net" in settings.MONGODB_URL or "mongodb+srv" in settings.MONGODB_URL
        connection_type = "MongoDB Atlas" if is_atlas else "Local MongoDB"
        
        print(f"✅ Connected to {connection_type}: {settings.DB_NAME}")
        logger.info(f"Connected to {connection_type} database: {settings.DB_NAME}")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if mongodb.client:
        mongodb.client.close()
        print("❌ Closed MongoDB connection")
        logger.info("MongoDB connection closed")

def get_database():
    """Get database instance"""
    if mongodb.db is None:
        raise RuntimeError("Database not connected. Call connect_to_mongo() first.")
    return mongodb.db