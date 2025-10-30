from fastapi import APIRouter, HTTPException, status
from models.schemas import CompanyCreate, CompanyResponse
from config.database import get_database
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/company", tags=["Company"])

@router.post("", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
async def create_company(company: CompanyCreate):
    """Create company profile"""
    print("[company.create] Received request to create company:", company.dict())
    db = get_database()

    company_doc = {
        "name": company.name,
        "sector": company.sector,
        "size": company.size,
        "created_at": datetime.utcnow()
    }

    try:
        result = await db.companies.insert_one(company_doc)

        return CompanyResponse(
            id=str(result.inserted_id),
            name=company.name,
            sector=company.sector,
            size=company.size,
            created_at=company_doc["created_at"]
        )
    except Exception as e:
        # Log the full exception to the server console for debugging
        import traceback
        traceback.print_exc()
        # Return a structured HTTP error so the frontend doesn't hang
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create company profile"
        ) from e

@router.get("/my-company", response_model=CompanyResponse)
async def get_my_company():
    """Get the most recent company profile"""
    print("[company.get_my_company] Received request")
    db = get_database()
    
    company = await db.companies.find_one(sort=[("created_at", -1)])
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found"
        )
    
    return CompanyResponse(
        id=str(company["_id"]),
        name=company["name"],
        sector=company["sector"],
        size=company["size"],
        created_at=company["created_at"]
    )
