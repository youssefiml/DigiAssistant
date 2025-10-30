from openai import AsyncOpenAI
from config.settings import settings
import json
from typing import List, Dict, Any
import random

# Configure OpenAI
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

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

def generate_smart_fallback_reaction(score: int) -> str:
    """Generate contextual AI reaction based on score"""
    reactions = {
        0: [
            "Je comprends, vous débutez dans ce domaine.",
            "C'est un point à développer pour l'avenir.",
            "Pas de problème, c'est une opportunité d'amélioration."
        ],
        1: [
            "Bien, vous avez posé les premières bases!",
            "C'est un bon début, continuons à explorer.",
            "Intéressant, vous êtes en phase initiale."
        ],
        2: [
            "Très bien! Vous êtes sur la bonne voie.",
            "Excellent, vous progressez dans ce domaine!",
            "Je vois que vous avez déjà fait des avancées significatives."
        ],
        3: [
            "Impressionnant! Vous avez une approche mature.",
            "Excellent! Vous êtes très avancé sur ce point.",
            "Bravo! C'est une pratique exemplaire."
        ]
    }
    return random.choice(reactions.get(score, reactions[1]))

def generate_smart_fallback_question(criterion: Dict[str, Any]) -> str:
    """Generate intelligent fallback questions when AI is unavailable"""
    criterion_text = criterion.get("criterion_text", "")
    criterion_id = criterion.get("criterion_id", "")
    
    # Question templates based on dimension
    dimension = criterion_id.split("-")[0] if criterion_id else "STRAT"
    
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

SYSTEM_PROMPT_FIRST_QUESTION = """You are a friendly digital maturity consultant conducting a diagnostic assessment.

Your task: Create a warm, welcoming opening question that:
- Introduces yourself and the diagnostic process
- Explains you'll assess their digital maturity
- Makes them feel comfortable
- Asks about the given criterion naturally
- Uses a conversational, professional tone in French

Keep it concise (2-3 sentences max)."""

SYSTEM_PROMPT_ADAPTIVE = """You are an expert digital transformation consultant conducting a maturity diagnostic.

Your role:
1. **EVALUATE** the user's answer against the criterion options (score 0-3)
2. **REACT** empathetically - acknowledge what they shared
3. **ASK** the next question in a natural, conversational way

**CRITICAL: You are having a REAL CONVERSATION, not reading a questionnaire!**

**READ THE CONVERSATION HISTORY** - Remember what they've said!
- Reference previous answers when relevant
- Build logical connections between topics
- Show you're listening and understanding

**EXAMPLES OF GOOD QUESTIONS:**
✓ "You mentioned using Excel earlier - how do your teams collaborate on these files?"
✓ "Interesting that you have a CRM. Does it integrate with your other tools?"
✓ "Since your strategy is still being defined, how do you currently make digital investment decisions?"

**BAD QUESTIONS (DON'T DO THIS):**
❌ "Bonjour! Parlez-moi de: [criterion text]"
❌ "Question suivante: [criterion text]"
❌ Just repeating the criterion without context

**SCORING GUIDE:**
- 0 = Absent/Non existent
- 1 = Basic/Initial
- 2 = Intermediate/Developing
- 3 = Advanced/Mature

Return JSON: {
  "evaluation": {"score": 0-3, "justification": "why this score"},
  "ai_reaction": "empathetic response to their answer",
  "next_question": "conversational question for next criterion"
}"""

async def formulate_first_question(criterion_text: str) -> str:
    """Generate the first question of the diagnostic"""
    prompt = f"First criterion: '{criterion_text}'\n\nYour friendly welcome question:"
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_FIRST_QUESTION},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"[AI] Error formulating first question: {e}")
        return f"Bonjour! Commençons notre diagnostic de maturité digitale. {criterion_text} Pouvez-vous m'en dire plus?"

async def evaluate_and_generate_next(
    conversation_history: List[Dict[str, Any]],
    current_answer: str,
    current_criterion: Dict[str, Any],
    next_criterion: Dict[str, Any]
) -> Dict[str, Any]:
    """Evaluate current answer and generate next question"""
    
    # Build conversation context
    history_text = "\n".join([
        f"Q{i+1} ({turn.get('criterion_id')}): User said: \"{turn.get('user_answer')}\" [Score: {turn.get('score', 0)}]"
        for i, turn in enumerate(conversation_history)
    ])
    
    if not history_text:
        history_text = "This is the first question."
    
    # Format current criterion options
    options_text = "\n".join([
        f"- Score {opt['score']}: {opt['text']}"
        for opt in current_criterion.get('options', [])
    ])
    
    prompt = f"""
**CONVERSATION SO FAR:**
{history_text}

**USER'S LATEST ANSWER:**
"{current_answer}"

**CURRENT CRITERION TO EVALUATE:**
- ID: {current_criterion.get('criterion_id')}
- Topic: {current_criterion.get('criterion_text')}
- Options:
{options_text}

**NEXT CRITERION TO ASK ABOUT:**
- ID: {next_criterion.get('criterion_id')}
- Topic: {next_criterion.get('criterion_text')}

**YOUR TASKS:**
1. Score the user's answer (0-3) based on the current criterion options
2. Write an empathetic reaction acknowledging what they shared
3. Formulate a natural, conversational question for the NEXT criterion that references previous context when relevant

Remember: You're having a conversation, not filling out a form!
"""
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_ADAPTIVE},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500,
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"[AI] Error in evaluation (using intelligent fallback): {e}")
        # Use intelligent fallback with score estimation
        estimated_score = estimate_score_from_answer(current_answer)
        return {
            "evaluation": {
                "score": estimated_score, 
                "justification": f"Score estimé basé sur l'analyse de votre réponse"
            },
            "ai_reaction": generate_smart_fallback_reaction(estimated_score),
            "next_question": generate_smart_fallback_question(next_criterion)
        }
