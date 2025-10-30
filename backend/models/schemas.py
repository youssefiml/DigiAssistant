from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

# ==================== USER ====================
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(UserBase):
    id: str
    created_at: datetime

# ==================== COMPANY ====================
class CompanyBase(BaseModel):
    name: str
    sector: str
    size: str  # e.g., "1-10", "11-50", "51-200", etc.
    
class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CompanyResponse(CompanyBase):
    id: str
    created_at: datetime

# ==================== DIMENSION ====================
class Dimension(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    code: str  # e.g., "STRAT"
    name: str  # e.g., "Stratégie"
    description: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ==================== PILLAR ====================
class Pillar(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    dimension_code: str
    code: str  # e.g., "P1"
    name: str
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ==================== CRITERION ====================
class CriterionOption(BaseModel):
    score: int
    text: str

class Criterion(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    criterion_id: str  # e.g., "STRAT-P1-C1"
    dimension_code: str
    pillar_code: str
    criterion_text: str
    options: List[CriterionOption]
    next_linear: Optional[str] = None
    next_jump: Optional[str] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ==================== SESSION ====================
class SessionStatus(str):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"

class Session(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    company_id: str
    status: str = SessionStatus.IN_PROGRESS
    progress: int = 0  # Number of questions answered
    total_questions: int = 72
    current_criterion_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ==================== QUESTION ====================
class Question(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    session_id: str
    criterion_id: str
    generated_text: str  # AI-generated question
    order: int  # Question number in session
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ==================== ANSWER ====================
class AnswerCreate(BaseModel):
    user_text: str

class Answer(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    session_id: str
    question_id: str
    criterion_id: str
    user_text: str
    score: int  # 0-3
    explanation: Optional[str] = None  # AI explanation
    ai_reaction: Optional[str] = None  # AI empathetic response
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# ==================== RESULTS ====================
class DimensionScore(BaseModel):
    dimension_code: str
    dimension_name: str
    score: float
    pillar_scores: List[dict]

class MaturityProfile(BaseModel):
    level: str  # "beginner", "emergent", "challenger", "leader"
    percentage: float
    description: str

class SessionResults(BaseModel):
    session_id: str
    company_name: str
    global_score: float
    maturity_profile: MaturityProfile
    dimension_scores: List[DimensionScore]
    gaps: List[str]
    recommendations: List[str]
