from fastapi import APIRouter, HTTPException, status
from models.schemas import Session, Question, Answer, AnswerCreate, SessionResults, MaturityProfile, DimensionScore
from config.database import get_database
from services.ai_service import formulate_first_question, evaluate_and_generate_next
from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Any
import random
import traceback

router = APIRouter(prefix="/sessions", tags=["Diagnostic Sessions"])

def generate_smart_fallback_question(criterion: Dict[str, Any], order: int) -> str:
    """Generate intelligent fallback questions when AI is unavailable"""
    criterion_text = criterion.get("criterion_text", "")
    criterion_id = criterion.get("criterion_id", "")
    
    # Question templates based on dimension
    dimension = criterion_id.split("-")[0]
    
    templates = {
        "STRAT": [
            f"Concernant {criterion_text.lower()}, comment cela se traduit-il concrètement dans votre entreprise?",
            f"Pouvez-vous me décrire l'état actuel de {criterion_text.lower()} chez vous?",
            f"Où en êtes-vous aujourd'hui par rapport à {criterion_text.lower()}?",
        ],
        "CULTURE": [
            f"Dans votre équipe, comment se manifeste {criterion_text.lower()}?",
            f"Pouvez-vous me parler de {criterion_text.lower()} au sein de votre organisation?",
            f"Comment décririez-vous {criterion_text.lower()} dans vos équipes?",
        ],
        "CLIENT": [
            f"En ce qui concerne {criterion_text.lower()}, qu'avez-vous mis en place avec vos clients?",
            f"Comment gérez-vous actuellement {criterion_text.lower()}?",
            f"Pouvez-vous me décrire votre approche sur {criterion_text.lower()}?",
        ],
        "PROCESS": [
            f"Dans vos processus internes, où en êtes-vous sur {criterion_text.lower()}?",
            f"Comment {criterion_text.lower()} est-il organisé dans votre entreprise?",
            f"Pouvez-vous me parler de la façon dont vous gérez {criterion_text.lower()}?",
        ],
        "TECH": [
            f"Sur le plan technique, comment se présente {criterion_text.lower()} chez vous?",
            f"Quels outils ou équipements avez-vous pour {criterion_text.lower()}?",
            f"Pouvez-vous me décrire votre situation concernant {criterion_text.lower()}?",
        ],
        "SECURITE": [
            f"En matière de sécurité, où en êtes-vous sur {criterion_text.lower()}?",
            f"Comment abordez-vous la question de {criterion_text.lower()}?",
            f"Qu'avez-vous mis en place concernant {criterion_text.lower()}?",
        ]
    }
    
    # Get templates for this dimension or use generic ones
    dimension_templates = templates.get(dimension, [
        f"Parlons de {criterion_text.lower()}. Quelle est votre situation actuelle?",
        f"Concernant {criterion_text.lower()}, pouvez-vous m'en dire plus?",
    ])
    
    # Pick a random template for variety
    return random.choice(dimension_templates)

def estimate_score_from_answer(answer: str) -> int:
    """Estimate a score based on answer characteristics (fallback when AI unavailable)"""
    answer_lower = answer.lower()
    answer_length = len(answer.split())
    
    # Score 0 indicators - Absence/Non-existence
    score_0_keywords = ["aucun", "non", "pas du tout", "jamais", "rien", "absent", "inexistant", "n'existe pas", "pas encore"]
    
    # Score 1 indicators - Basic/Initial
    score_1_keywords = ["début", "basique", "simple", "manuel", "occasionnel", "parfois", "peu", "limité", "minimal"]
    
    # Score 2 indicators - Intermediate/Developing
    score_2_keywords = ["en cours", "développement", "partiellement", "quelques", "certains", "moyennement", "progressivement"]
    
    # Score 3 indicators - Advanced/Mature
    score_3_keywords = ["oui", "régulièrement", "systématique", "mature", "avancé", "structuré", "optimisé", "automatisé", "complet", "intégré", "toujours", "tous"]
    
    # Count keyword matches
    score_0_count = sum(1 for kw in score_0_keywords if kw in answer_lower)
    score_1_count = sum(1 for kw in score_1_keywords if kw in answer_lower)
    score_2_count = sum(1 for kw in score_2_keywords if kw in answer_lower)
    score_3_count = sum(1 for kw in score_3_keywords if kw in answer_lower)
    
    # Determine score based on keywords and length
    if score_0_count > 0 or answer_length < 5:
        return 0
    elif score_3_count >= 2 or (score_3_count > 0 and answer_length > 30):
        return 3
    elif score_2_count > 0 or (score_1_count > 0 and answer_length > 15):
        return 2
    elif score_1_count > 0 or answer_length > 10:
        return 1
    else:
        # Default: medium score for unclear answers
        return 1 if answer_length < 15 else 2

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_session(company_id: str):
    """Create a new diagnostic session"""
    db = get_database()
    
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
            question_text = generate_smart_fallback_question(criterion, question_count + 1)
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
            question_text = generate_smart_fallback_question(criterion, question_count + 1)
    
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
            next_question_text = generate_smart_fallback_question(next_criterion, len(history) + 2)
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
    """Get session results with scores and recommendations"""
    db = get_database()
    
    # Get session
    session = await db.sessions.find_one({"_id": ObjectId(session_id)})
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get company
    company = await db.companies.find_one({"_id": ObjectId(session["company_id"])})
    
    # Get all answers
    answers = await db.answers.find({"session_id": session_id}).to_list(length=100)
    
    # Calculate scores by dimension
    dimensions = await db.dimensions.find().to_list(length=10)
    dimension_scores = []
    total_score = 0
    
    for dim in dimensions:
        dim_answers = [a for a in answers if a["criterion_id"].startswith(dim["code"])]
        if dim_answers:
            dim_score = sum(a["score"] for a in dim_answers) / len(dim_answers)
            total_score += dim_score
            
            dimension_scores.append(DimensionScore(
                dimension_code=dim["code"],
                dimension_name=dim["name"],
                score=round(dim_score, 2),
                pillar_scores=[]  # TODO: Calculate pillar scores
            ))
    
    # Calculate global score
    global_score = round((total_score / len(dimensions)) if dimensions else 0, 2)
    percentage = (global_score / 3) * 100
    
    # Determine maturity profile
    if percentage <= 25:
        profile = MaturityProfile(
            level="beginner",
            percentage=percentage,
            description="Débutant - Phase d'initiation digitale"
        )
    elif percentage <= 50:
        profile = MaturityProfile(
            level="emergent",
            percentage=percentage,
            description="Émergent - Digitalisation en cours"
        )
    elif percentage <= 75:
        profile = MaturityProfile(
            level="challenger",
            percentage=percentage,
            description="Challenger - Transformation avancée"
        )
    else:
        profile = MaturityProfile(
            level="leader",
            percentage=percentage,
            description="Leader - Excellence digitale"
        )
    
    # Generate gaps and recommendations (simplified)
    gaps = [
        f"Amélioration nécessaire en {dim.dimension_name}"
        for dim in dimension_scores
        if dim.score < 2
    ]
    
    recommendations = [
        "Développer une stratégie digitale claire",
        "Former les équipes aux outils digitaux",
        "Investir dans l'infrastructure technologique"
    ]
    
    return SessionResults(
        session_id=session_id,
        company_name=company["name"],
        global_score=global_score,
        maturity_profile=profile,
        dimension_scores=dimension_scores,
        gaps=gaps,
        recommendations=recommendations
    )
