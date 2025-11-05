from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from models.schemas import Session, Question, Answer, AnswerCreate, SessionResults, MaturityProfile, DimensionScore
from config.database import get_database
from services.ai_service import (
    formulate_first_question, 
    evaluate_and_generate_next,
    generate_smart_fallback_question,
    estimate_score_from_answer
)
from services.pdf_service import generate_diagnostic_pdf, generate_advantages_disadvantages, generate_detailed_recommendations
from services.scoring_service import calculate_complete_results, calculate_dimension_scores
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Any
import traceback
import io

router = APIRouter(prefix="/sessions", tags=["Diagnostic Sessions"])

@router.post("/temp", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_temp_session(company_data: dict):
    """Create a new diagnostic session without saving company to database"""
    db = get_database()
    
    # Get first criterion
    first_criterion = await db.criteria.find_one({"criterion_id": "STRAT-P1-C1"})
    if not first_criterion:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Diagnostic criteria not found. Please seed the database."
        )
    
    # Create session with company info embedded (no company_id reference)
    session_doc = {
        "company_info": {
            "name": company_data.get("name", ""),
            "sector": company_data.get("sector", ""),
            "size": company_data.get("size", "")
        },
        "status": "in_progress",
        "progress": 0,
        "total_questions": 72,
        "current_criterion_id": first_criterion["criterion_id"],
        "created_at": datetime.utcnow(),
        "completed_at": None
    }
    
    result = await db.sessions.insert_one(session_doc)
    session_id = str(result.inserted_id)
    
    return {
        "session_id": session_id,
        "message": "Session created successfully"
    }

# Removed duplicate functions - now importing from ai_service

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_session(request: dict):
    """Create a new diagnostic session"""
    db = get_database()
    
    # Extract company_id from request body
    company_id = request.get("company_id")
    if not company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="company_id is required"
        )
    
    # Verify company exists
    company = await db.companies.find_one({"_id": ObjectId(company_id)})
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )
    
    # Get first criterion
    first_criterion = await db.criteria.find_one({"criterion_id": "STRAT-P1-C1"})
    if not first_criterion:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Diagnostic criteria not found. Please seed the database."
        )
    
    # Create session
    session_doc = {
        "company_id": company_id,
        "status": "in_progress",
        "progress": 0,
        "total_questions": 72,
        "current_criterion_id": first_criterion["criterion_id"],
        "created_at": datetime.utcnow(),
        "completed_at": None
    }
    
    result = await db.sessions.insert_one(session_doc)
    session_id = str(result.inserted_id)
    
    return {
        "session_id": session_id,
        "message": "Session created successfully"
    }

@router.post("/{session_id}/next", response_model=dict)
async def get_next_question(session_id: str):
    """Generate and return the next question"""
    db = get_database()
    
    # Get session
    session = await db.sessions.find_one({"_id": ObjectId(session_id)})
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session["status"] == "completed":
        return {"completed": True, "message": "Diagnostic completed"}
    
    # Get current criterion
    criterion = await db.criteria.find_one({"criterion_id": session["current_criterion_id"]})
    if not criterion:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Criterion not found"
        )
    
    # Check if this is the first question
    question_count = await db.questions.count_documents({"session_id": session_id})
    
    # Initialize question_text
    question_text = None
    
    try:
        if question_count == 0:
            # Generate first question using AI
            question_text = await formulate_first_question(criterion["criterion_text"])
        else:
            # This shouldn't happen - questions are generated when submitting answers
            # But provide a fallback just in case
            question_text = generate_smart_fallback_question(criterion)
    except Exception as e:
        # Log the error and provide a fallback question
        print(f"[sessions.get_next_question] AI service error: {e}")
        traceback.print_exc()
        # Use smart fallback question generator
        if question_count == 0:
            question_text = (
                "Bonjour! Je suis votre conseiller digital. "
                "Commençons par comprendre votre situation actuelle. "
                f"Concernant {criterion['criterion_text'].lower()}, "
                "où en êtes-vous aujourd'hui?"
            )
        else:
            question_text = generate_smart_fallback_question(criterion)
    
    # Save question
    question_doc = {
        "session_id": session_id,
        "criterion_id": criterion["criterion_id"],
        "generated_text": question_text,
        "order": question_count + 1,
        "created_at": datetime.utcnow()
    }
    
    result = await db.questions.insert_one(question_doc)
    
    return {
        "question_id": str(result.inserted_id),
        "question_text": question_text,
        "criterion_id": criterion["criterion_id"],
        "dimension": criterion["dimension_code"],
        "pillar": criterion["pillar_code"],
        "progress": session["progress"],
        "total": session["total_questions"]
    }

@router.post("/{session_id}/answers", response_model=dict)
async def submit_answer(session_id: str, answer_data: AnswerCreate):
    """Submit answer, get AI evaluation, and generate next question"""
    db = get_database()
    
    # Get session
    session = await db.sessions.find_one({"_id": ObjectId(session_id)})
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get current criterion
    current_criterion = await db.criteria.find_one({"criterion_id": session["current_criterion_id"]})
    
    # Get last question for this criterion
    last_question = await db.questions.find_one(
        {"session_id": session_id, "criterion_id": session["current_criterion_id"]},
        sort=[("created_at", -1)]
    )
    
    if not last_question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No question found for this criterion"
        )
    
    # Get conversation history
    previous_answers = await db.answers.find({"session_id": session_id}).to_list(length=100)
    history = [
        {
            "criterion_id": ans["criterion_id"],
            "user_answer": ans["user_text"],
            "score": ans["score"]
        }
        for ans in previous_answers
    ]
    
    # Determine next criterion
    next_criterion_id = current_criterion.get("next_linear")
    if not next_criterion_id:
        # Diagnostic complete
        next_criterion = None
    else:
        next_criterion = await db.criteria.find_one({"criterion_id": next_criterion_id})
    
    # Get AI evaluation and next question
    if next_criterion:
        try:
            ai_response = await evaluate_and_generate_next(
                conversation_history=history,
                current_answer=answer_data.user_text,
                current_criterion=current_criterion,
                next_criterion=next_criterion
            )
            
            score = ai_response["evaluation"]["score"]
            explanation = ai_response["evaluation"].get("justification", "")
            ai_reaction = ai_response.get("ai_reaction", "")
            next_question_text = ai_response.get("next_question", "")
        except Exception as e:
            # Log error and provide fallback
            import traceback
            print("[sessions.submit_answer] AI service error:")
            traceback.print_exc()
            # Intelligent fallback values if AI fails
            # Estimate score based on answer length and keywords
            score = estimate_score_from_answer(answer_data.user_text)
            explanation = "Merci pour cette réponse détaillée."
            ai_reaction = "Très bien, j'ai bien noté. Continuons!"
            # Use smart question generator
            next_question_text = generate_smart_fallback_question(next_criterion)
    else:
        # Last question - just evaluate
        score = 2  # Default score
        explanation = "Merci pour votre participation!"
        ai_reaction = "Excellent! Nous avons terminé le diagnostic."
        next_question_text = ""
    
    # Save answer
    answer_doc = {
        "session_id": session_id,
        "question_id": str(last_question["_id"]),
        "criterion_id": session["current_criterion_id"],
        "user_text": answer_data.user_text,
        "score": score,
        "explanation": explanation,
        "ai_reaction": ai_reaction,
        "created_at": datetime.utcnow()
    }
    
    await db.answers.insert_one(answer_doc)
    
    # Update session progress
    new_progress = session["progress"] + 1
    update_data = {
        "progress": new_progress
    }
    
    if next_criterion:
        # Save next question
        next_question_doc = {
            "session_id": session_id,
            "criterion_id": next_criterion["criterion_id"],
            "generated_text": next_question_text,
            "order": new_progress + 1,
            "created_at": datetime.utcnow()
        }
        next_q_result = await db.questions.insert_one(next_question_doc)
        
        update_data["current_criterion_id"] = next_criterion["criterion_id"]
        
        await db.sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": update_data}
        )
        
        return {
            "ai_reaction": ai_reaction,
            "score": score,
            "explanation": explanation,
            "next_question": {
                "question_id": str(next_q_result.inserted_id),
                "question_text": next_question_text,
                "criterion_id": next_criterion["criterion_id"],
                "dimension": next_criterion["dimension_code"],
                "pillar": next_criterion["pillar_code"]
            },
            "progress": new_progress,
            "total": session["total_questions"]
        }
    else:
        # Complete session
        update_data["status"] = "completed"
        update_data["completed_at"] = datetime.utcnow()
        
        await db.sessions.update_one(
            {"_id": ObjectId(session_id)},
            {"$set": update_data}
        )
        
        return {
            "ai_reaction": ai_reaction,
            "score": score,
            "completed": True,
            "message": "Diagnostic terminé! Consultez vos résultats."
        }

@router.get("/{session_id}/results", response_model=SessionResults)
async def get_results(session_id: str):
    """Get session results with scores and recommendations using the official scoring methodology"""
    db = get_database()
    
    # Get session
    session = await db.sessions.find_one({"_id": ObjectId(session_id)})
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get company (handle both temp sessions and regular sessions)
    company_name = "Unknown Company"
    if "company_info" in session:
        # Temp session
        company_name = session["company_info"].get("name", "Unknown Company")
    elif "company_id" in session:
        # Regular session with saved company
        company = await db.companies.find_one({"_id": ObjectId(session["company_id"])})
        if company:
            company_name = company["name"]
    
    # Calculate complete results using the official scoring methodology
    results = await calculate_complete_results(session_id)
    
    # Convert dimension scores to DimensionScore schema
    dimension_scores = [
        DimensionScore(
            dimension_code=dim["dimension_code"],
            dimension_name=dim["dimension_name"],
            score=dim["score"],
            pillar_scores=dim["pillar_scores"],
            answered_count=dim["answered_count"]
        )
        for dim in results["dimension_scores"]
    ]
    
    # Convert maturity profile to MaturityProfile schema
    profile = MaturityProfile(
        level=results["maturity_profile"]["level"],
        percentage=results["maturity_profile"]["percentage"],
        description=results["maturity_profile"]["description"]
    )
    
    # Format gaps as strings
    gaps = [gap["gap_description"] for gap in results["gaps"]]
    
    return SessionResults(
        session_id=session_id,
        company_name=company_name,
        global_score=results["global_score"],
        maturity_profile=profile,
        dimension_scores=dimension_scores,
        gaps=gaps,
        recommendations=results["recommendations"]
    )

@router.get("/{session_id}/download-pdf")
async def download_pdf_report(session_id: str):
    """Generate and download PDF report using the official scoring methodology"""
    db = get_database()
    
    # Get session
    session = await db.sessions.find_one({"_id": ObjectId(session_id)})
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get company name
    company_name = "Unknown Company"
    if "company_info" in session:
        company_name = session["company_info"].get("name", "Unknown Company")
    elif "company_id" in session:
        company = await db.companies.find_one({"_id": ObjectId(session["company_id"])})
        if company:
            company_name = company["name"]
    
    # Calculate complete results using the official scoring methodology
    results = await calculate_complete_results(session_id)
    
    # Format dimension scores for PDF generation
    dimension_scores = [
        {
            "dimension_code": dim["dimension_code"],
            "dimension_name": dim["dimension_name"],
            "score": dim["score"],
            "avg_score": dim["score"],
            "percentage": dim["percentage"],
            "answered_count": dim["answered_count"],
            "pillar_scores": dim["pillar_scores"]
        }
        for dim in results["dimension_scores"]
    ]
    
    # Generate advantages and disadvantages
    advantages, disadvantages = generate_advantages_disadvantages(dimension_scores)
    
    # Generate PDF
    pdf_bytes = generate_diagnostic_pdf(
        company_name=company_name,
        global_score=results["global_score"],
        maturity_level=results["maturity_profile"]["description"],
        dimension_scores=dimension_scores,
        advantages=advantages,
        disadvantages=disadvantages,
        recommendations=results["recommendations"],
        session_id=session_id
    )
    
    # Create streaming response
    pdf_stream = io.BytesIO(pdf_bytes)
    
    return StreamingResponse(
        pdf_stream,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=diagnostic_report_{session_id}.pdf"
        }
    )

@router.get("/{session_id}/export-json")
async def export_json_results(session_id: str):
    """Export complete diagnostic results as JSON"""
    db = get_database()
    
    # Get session
    session = await db.sessions.find_one({"_id": ObjectId(session_id)})
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get company info
    company_info = {}
    if "company_info" in session:
        company_info = session["company_info"]
    elif "company_id" in session:
        company = await db.companies.find_one({"_id": ObjectId(session["company_id"])})
        if company:
            company_info = {
                "name": company["name"],
                "sector": company.get("sector", ""),
                "size": company.get("size", "")
            }
    
    # Calculate complete results
    results = await calculate_complete_results(session_id)
    
    # Get all answers for detailed export
    answers = await db.answers.find({"session_id": session_id}).to_list(length=100)
    answers_export = [
        {
            "criterion_id": ans["criterion_id"],
            "user_text": ans["user_text"],
            "score": ans["score"],
            "explanation": ans.get("explanation", ""),
            "ai_reaction": ans.get("ai_reaction", "")
        }
        for ans in answers
    ]
    
    # Compile complete export
    export_data = {
        "session_id": session_id,
        "company_info": company_info,
        "diagnostic_date": session["created_at"].isoformat() if "created_at" in session else None,
        "completion_date": session["completed_at"].isoformat() if session.get("completed_at") else None,
        "results": {
            "global_score": results["global_score"],
            "global_percentage": results["global_percentage"],
            "maturity_profile": results["maturity_profile"],
            "dimension_scores": results["dimension_scores"],
            "gaps": results["gaps"],
            "recommendations": results["recommendations"]
        },
        "detailed_answers": answers_export
    }
    
    return export_data
