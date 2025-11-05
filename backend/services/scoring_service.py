"""
Scoring Service - Implements the complete business logic for DigiAssistant
Based on the official diagnostic methodology:
- Dimension Score = Sum of 4 pillars (max 36pts) → percentage
- Global Score = Average of 6 dimensions
- Maturity Profile based on global score (0-25% Beginner, 26-50% Emergent, 51-75% Challenger, 76-100% Leader)
- Gap Analysis: Dimensions where achieved pillar < target pillar for the global maturity profile
"""

from typing import List, Dict, Any, Tuple
from config.database import get_database
from bson import ObjectId

# Constants
MAX_POINTS_PER_CRITERION = 3
CRITERIA_PER_PILLAR = 3
PILLARS_PER_DIMENSION = 4
MAX_POINTS_PER_PILLAR = MAX_POINTS_PER_CRITERION * CRITERIA_PER_PILLAR  # 9
MAX_POINTS_PER_DIMENSION = MAX_POINTS_PER_PILLAR * PILLARS_PER_DIMENSION  # 36
TOTAL_DIMENSIONS = 6

# Maturity Profile Thresholds (based on percentage)
MATURITY_THRESHOLDS = {
    "beginner": (0, 25),      # 0-25%
    "emergent": (26, 50),     # 26-50%
    "challenger": (51, 75),   # 51-75%
    "leader": (76, 100)       # 76-100%
}

# Target Pillar by Maturity Profile
# For gap analysis: if global profile is "challenger", each dimension should ideally reach P3
TARGET_PILLAR_BY_PROFILE = {
    "beginner": 1,    # Should have at least P1 completed
    "emergent": 2,    # Should have at least P2 completed
    "challenger": 3,  # Should have at least P3 completed
    "leader": 4       # Should have P4 completed
}


def get_maturity_profile(percentage: float) -> Dict[str, Any]:
    """
    Determine maturity profile based on global score percentage
    
    Args:
        percentage: Global score as percentage (0-100)
    
    Returns:
        Dictionary with level, percentage, and description
    """
    if percentage <= 25:
        return {
            "level": "beginner",
            "percentage": round(percentage, 2),
            "description": "Débutant - Phase d'initiation digitale"
        }
    elif percentage <= 50:
        return {
            "level": "emergent",
            "percentage": round(percentage, 2),
            "description": "Émergent - Digitalisation en cours"
        }
    elif percentage <= 75:
        return {
            "level": "challenger",
            "percentage": round(percentage, 2),
            "description": "Challenger - Transformation avancée"
        }
    else:
        return {
            "level": "leader",
            "percentage": round(percentage, 2),
            "description": "Leader - Excellence digitale"
        }


async def calculate_pillar_scores(session_id: str, dimension_code: str) -> List[Dict[str, Any]]:
    """
    Calculate scores for each pillar within a dimension
    
    Args:
        session_id: The diagnostic session ID
        dimension_code: The dimension code (e.g., "STRAT", "CULTURE")
    
    Returns:
        List of pillar scores with pillar_code, name, score, max_score, percentage
    """
    db = get_database()
    
    # Get all answers for this session and dimension
    answers = await db.answers.find({
        "session_id": session_id,
        "criterion_id": {"$regex": f"^{dimension_code}-"}
    }).to_list(length=100)
    
    # Get pillars for this dimension
    pillars = await db.pillars.find({"dimension_code": dimension_code}).to_list(length=10)
    
    pillar_scores = []
    for pillar in pillars:
        pillar_code = pillar["code"]
        pillar_name = pillar["name"]
        
        # Get answers for this pillar
        pillar_answers = [
            a for a in answers 
            if a["criterion_id"].startswith(f"{dimension_code}-{pillar_code}-")
        ]
        
        # Calculate pillar score
        total_score = sum(a["score"] for a in pillar_answers)
        answered_count = len(pillar_answers)
        max_possible = MAX_POINTS_PER_PILLAR  # 9 points max per pillar
        
        # Calculate percentage for this pillar
        percentage = (total_score / max_possible * 100) if max_possible > 0 else 0
        
        pillar_scores.append({
            "pillar_code": pillar_code,
            "pillar_name": pillar_name,
            "score": total_score,
            "max_score": max_possible,
            "percentage": round(percentage, 2),
            "answered_count": answered_count
        })
    
    return pillar_scores


async def calculate_dimension_scores(session_id: str) -> Tuple[List[Dict[str, Any]], float]:
    """
    Calculate scores for all dimensions and global score
    
    Args:
        session_id: The diagnostic session ID
    
    Returns:
        Tuple of (dimension_scores, global_score)
        - dimension_scores: List of dimension score dictionaries
        - global_score: Average score across all dimensions (0-3 scale)
    """
    db = get_database()
    
    # Get all dimensions
    dimensions = await db.dimensions.find().to_list(length=10)
    
    dimension_scores = []
    total_dimension_score = 0
    
    for dim in dimensions:
        dim_code = dim["code"]
        dim_name = dim["name"]
        
        # Calculate pillar scores for this dimension
        pillar_scores = await calculate_pillar_scores(session_id, dim_code)
        
        # Calculate dimension score (sum of all pillar scores)
        total_points = sum(p["score"] for p in pillar_scores)
        max_points = MAX_POINTS_PER_DIMENSION  # 36 points max per dimension
        
        # Convert to percentage
        percentage = (total_points / max_points * 100) if max_points > 0 else 0
        
        # Convert to 0-3 scale for global score calculation
        score_on_3_scale = (total_points / max_points * 3) if max_points > 0 else 0
        
        total_dimension_score += score_on_3_scale
        
        # Count answered questions
        answered_count = sum(p["answered_count"] for p in pillar_scores)
        
        dimension_scores.append({
            "dimension_code": dim_code,
            "dimension_name": dim_name,
            "score": round(score_on_3_scale, 2),  # 0-3 scale
            "percentage": round(percentage, 2),   # 0-100 scale
            "total_points": total_points,
            "max_points": max_points,
            "pillar_scores": pillar_scores,
            "answered_count": answered_count
        })
    
    # Calculate global score (average of dimension scores on 0-3 scale)
    global_score = (total_dimension_score / len(dimensions)) if dimensions else 0
    
    return dimension_scores, round(global_score, 2)


async def identify_gaps(dimension_scores: List[Dict[str, Any]], maturity_level: str) -> List[Dict[str, Any]]:
    """
    Identify digital gaps based on maturity profile
    
    A gap exists when a dimension's achieved pillar level is below the target pillar
    for the company's global maturity profile.
    
    Args:
        dimension_scores: List of dimension score dictionaries
        maturity_level: The global maturity level ("beginner", "emergent", "challenger", "leader")
    
    Returns:
        List of gaps with dimension info and recommendations
    """
    target_pillar = TARGET_PILLAR_BY_PROFILE.get(maturity_level, 1)
    gaps = []
    
    for dim in dimension_scores:
        # Determine the highest pillar achieved in this dimension
        # A pillar is "achieved" if its percentage is >= 50%
        achieved_pillar = 0
        for pillar in dim["pillar_scores"]:
            if pillar["percentage"] >= 50:
                pillar_num = int(pillar["pillar_code"].replace("P", ""))
                achieved_pillar = max(achieved_pillar, pillar_num)
        
        # Check if there's a gap
        if achieved_pillar < target_pillar:
            gap_description = (
                f"{dim['dimension_name']}: Pilier atteint P{achieved_pillar}, "
                f"cible P{target_pillar} pour le profil {maturity_level}"
            )
            
            gaps.append({
                "dimension_code": dim["dimension_code"],
                "dimension_name": dim["dimension_name"],
                "achieved_pillar": achieved_pillar,
                "target_pillar": target_pillar,
                "gap_description": gap_description,
                "priority": "high" if (target_pillar - achieved_pillar) >= 2 else "medium"
            })
    
    return gaps


async def generate_recommendations(
    dimension_scores: List[Dict[str, Any]], 
    gaps: List[Dict[str, Any]], 
    maturity_level: str
) -> List[str]:
    """
    Generate actionable recommendations based on scores and gaps
    
    Args:
        dimension_scores: List of dimension score dictionaries
        gaps: List of identified gaps
        maturity_level: The global maturity level
    
    Returns:
        List of recommendation strings
    """
    recommendations = []
    
    # Priority recommendations based on gaps
    high_priority_gaps = [g for g in gaps if g["priority"] == "high"]
    if high_priority_gaps:
        recommendations.append(
            f"Priorité haute: Renforcer {', '.join([g['dimension_name'] for g in high_priority_gaps[:2]])}"
        )
    
    # Recommendations based on weakest dimensions
    sorted_dims = sorted(dimension_scores, key=lambda x: x["percentage"])
    weakest_dims = sorted_dims[:2]
    
    for dim in weakest_dims:
        if dim["percentage"] < 40:
            recommendations.append(
                f"Améliorer {dim['dimension_name']} (actuellement {dim['percentage']:.0f}%)"
            )
    
    # Maturity-specific recommendations
    if maturity_level == "beginner":
        recommendations.extend([
            "Établir une stratégie digitale claire avec des objectifs mesurables",
            "Former les équipes aux outils digitaux de base",
            "Mettre en place des processus de communication numérique"
        ])
    elif maturity_level == "emergent":
        recommendations.extend([
            "Structurer les initiatives digitales existantes",
            "Investir dans l'infrastructure technologique",
            "Développer une culture de l'innovation digitale"
        ])
    elif maturity_level == "challenger":
        recommendations.extend([
            "Optimiser les processus digitaux existants",
            "Intégrer l'intelligence artificielle et l'automatisation",
            "Renforcer la sécurité et la conformité des données"
        ])
    else:  # leader
        recommendations.extend([
            "Maintenir l'excellence opérationnelle digitale",
            "Explorer les technologies émergentes (IA, blockchain, IoT)",
            "Devenir un modèle de transformation digitale dans votre secteur"
        ])
    
    return recommendations[:6]  # Return top 6 recommendations


async def calculate_complete_results(session_id: str) -> Dict[str, Any]:
    """
    Calculate complete diagnostic results including scores, profile, gaps, and recommendations
    
    Args:
        session_id: The diagnostic session ID
    
    Returns:
        Complete results dictionary
    """
    # Calculate dimension scores and global score
    dimension_scores, global_score = await calculate_dimension_scores(session_id)
    
    # Convert global score to percentage
    global_percentage = (global_score / 3) * 100
    
    # Determine maturity profile
    maturity_profile = get_maturity_profile(global_percentage)
    
    # Identify gaps
    gaps = await identify_gaps(dimension_scores, maturity_profile["level"])
    
    # Generate recommendations
    recommendations = await generate_recommendations(
        dimension_scores, 
        gaps, 
        maturity_profile["level"]
    )
    
    return {
        "global_score": global_score,
        "global_percentage": round(global_percentage, 2),
        "maturity_profile": maturity_profile,
        "dimension_scores": dimension_scores,
        "gaps": gaps,
        "recommendations": recommendations
    }

