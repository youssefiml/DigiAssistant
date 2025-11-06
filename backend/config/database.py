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
        # Detect if using Atlas or local
        is_atlas = "mongodb.net" in settings.MONGODB_URL or "mongodb+srv" in settings.MONGODB_URL
        connection_type = "MongoDB Atlas" if is_atlas else "Local MongoDB"
        
        # Base connection parameters
        connection_params = {
            "serverSelectionTimeoutMS": 30000,  # 30 second timeout (increased for Atlas)
            "connectTimeoutMS": 30000,  # 30 second connection timeout
            "socketTimeoutMS": 45000,  # 45 second socket timeout
            "maxPoolSize": 50,  # Maximum number of connections in the pool
            "minPoolSize": 1,  # Minimum number of connections (reduced from 10)
            "retryWrites": True,  # Enable retryable writes (Atlas recommended)
        }
        
        # For MongoDB Atlas, add SSL/TLS configuration
        if is_atlas:
            # Motor/PyMongo handles SSL automatically for mongodb+srv://, but we can be explicit
            try:
                import certifi
                # Use certifi's certificate bundle for more reliable SSL connections
                connection_params["tlsCAFile"] = certifi.where()
                print(f"🔒 Using SSL/TLS with certifi certificates for {connection_type}")
            except ImportError:
                # certifi not available, Motor will use system defaults
                print(f"⚠️ certifi not available, using system default SSL context")
        
        print(f"🔌 Connecting to {connection_type}...")
        mongodb.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            **connection_params
        )
        
        # Test the connection with longer timeout
        print("⏳ Testing connection...")
        await mongodb.client.admin.command('ping')
        
        mongodb.db = mongodb.client[settings.DB_NAME]
        
        print(f"✅ Connected to {connection_type}: {settings.DB_NAME}")
        logger.info(f"Connected to {connection_type} database: {settings.DB_NAME}")
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Failed to connect to MongoDB: {e}")
        logger.error(f"Failed to connect to MongoDB: {e}")
        
        # Provide helpful error messages
        if "SSL" in error_msg or "TLS" in error_msg:
            print("\n" + "="*60)
            print("⚠️  SSL/TLS CONNECTION ERROR")
            print("="*60)
            print("Possible solutions:")
            print("1. Check MongoDB Atlas Network Access - allow Railway IPs or 0.0.0.0/0")
            print("2. Verify your connection string includes proper SSL/TLS parameters")
            print("3. Ensure your MongoDB Atlas cluster is running")
            print("="*60 + "\n")
        
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