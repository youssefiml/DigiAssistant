from fastapi import APIRouter, HTTPException, status, Depends
from models.schemas import UserCreate, UserLogin, UserResponse
from utils.auth import get_password_hash, verify_password, create_access_token, get_current_user_id
from config.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=dict, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate):
    """Register a new user"""
    db = get_database()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "email": user.email,
        "name": user.name,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "message": "User created successfully",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user.email,
            "name": user.name
        }
    }

@router.post("/signin", response_model=dict)
async def signin(credentials: UserLogin):
    """Authenticate user and return JWT token"""
    db = get_database()
    
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user["email"],
            "name": user["name"]
        }
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    """Get current authenticated user"""
    db = get_database()
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        created_at=user["created_at"]
    )
