from openai import AsyncOpenAI
from config.settings import settings
import json
from typing import List, Dict, Any
import random
import asyncio

# Try to import Google Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print("[AI] Google Gemini not available - install with: pip install google-generativeai")

# Configure AI Clients
print(f"[AI] Initializing AI service...")
print(f"[AI] Provider: {settings.AI_PROVIDER}")
print(f"[AI] OpenAI API Key present: {bool(settings.OPENAI_API_KEY)}")
print(f"[AI] Gemini API Key present: {bool(settings.GEMINI_API_KEY)}")

# Initialize OpenAI client (if configured)
openai_client = None
if settings.OPENAI_API_KEY:
    try:
        openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        print(f"[AI] OpenAI client initialized (key prefix: {settings.OPENAI_API_KEY[:10]}...)")
    except Exception as e:
        print(f"[AI] OpenAI client initialization error: {e}")

# Initialize Gemini client (if configured)
gemini_client = None
gemini_model_name = None
if settings.GEMINI_API_KEY and GEMINI_AVAILABLE:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Try different Gemini models - some API keys may have restrictions
        model_names_to_try = [
            'gemini-2.0-flash',      # Stable 2.0 version (often more accessible)
            'gemini-flash-latest',   # Latest flash (alias)
            'gemini-2.5-flash',      # Latest stable flash model
            'gemini-1.5-flash',      # Older but reliable
        ]
        
        for model_name in model_names_to_try:
            try:
                gemini_client = genai.GenerativeModel(model_name)
                gemini_model_name = model_name
                print(f"[AI] Gemini client initialized with {model_name} (key prefix: {settings.GEMINI_API_KEY[:10]}...)")
                break
            except Exception as e:
                continue
        
        if not gemini_client:
            raise Exception("Could not initialize any Gemini model")
    except Exception as e:
        print(f"[AI] Gemini client initialization error: {e}")

# Determine which client to use
client = None
client_type = None

if settings.AI_PROVIDER == "gemini" and gemini_client:
    client = gemini_client
    client_type = "gemini"
    print("[AI] Using Google Gemini as AI provider")
elif settings.AI_PROVIDER == "openai" and openai_client:
    client = openai_client
    client_type = "openai"
    print("[AI] Using OpenAI as AI provider")
elif gemini_client:
    client = gemini_client
    client_type = "gemini"
    print("[AI] Auto-selected Gemini (OpenAI not available)")
elif openai_client:
    client = openai_client
    client_type = "openai"
    print("[AI] Auto-selected OpenAI (Gemini not available)")
else:
    print("[AI] No AI provider available - using intelligent fallback system")

def estimate_score_from_answer(answer: str) -> int:
    """Estimate a score based on answer characteristics (fallback when AI unavailable)"""
    answer_lower = answer.lower()
    answer_length = len(answer.split())
    
    # Score 0 indicators - Absence/Non-existence
    score_0_keywords = ["aucun", "non", "pas du tout", "jamais", "rien", "absent", "inexistant", "n'existe pas", "pas encore", "inconnu", "nul", "zéro", "sans", "manque", "faible", "insuffisant", "limité", "peu développé"]
    
    # Score 1 indicators - Basic/Initial
    score_1_keywords = ["début", "basique", "simple", "manuel", "occasionnel", "parfois", "peu", "limité", "minimal", "élémentaire","rudimentaire","léger","restreint","sporadique","rare","sommaire","superficiel","trivial","bas de gamme","ordinaire","peu fréquent","primaire","modeste","simplet","frugal","succinct","minimaliste"]
    
    # Score 2 indicators - Intermediate/Developing
    score_2_keywords = ["en cours","développement","partiellement","quelques","certains","moyennement","progressivement","intermédiaire","modérément","évolutif","provisoire","temporaire","relatif","semi","graduel","périphérique","fragmentaire","occasionnel"]
    
    # Score 3 indicators - Advanced/Mature
    score_3_keywords = ["oui","régulièrement","systématique","mature","avancé","structuré","optimisé","automatisé","complet","intégré","toujours","tous","parfait","constamment","total","efficace","professionnel","maîtrisé","permanent","continu","exhaustif","solide","fiable","développé","abouti","standardisé","éprouvé"]
    
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
            "Pas de problème, c'est une opportunité d'amélioration.",
            "C'est une bonne chose de commencer par quelque chose."
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

SYSTEM_PROMPT_FIRST_QUESTION = """You are a professional digital transformation consultant. Create a warm, conversational French question for a business diagnostic interview. Keep it professional, friendly, and concise (2-3 sentences)."""

SYSTEM_PROMPT_ADAPTIVE = """You are an expert digital transformation consultant conducting a maturity diagnostic in French.

**CRITICAL REQUIREMENTS:**
- ALL responses must be in FRENCH (français)
- You are having a REAL CONVERSATION, not reading a questionnaire
- Questions must start naturally, NOT with "Given", "Ensuite", or "Question suivante"

Your role:
1. **EVALUATE** the user's answer against the criterion options (score 0-3)
2. **REACT** empathetically in French - acknowledge what they shared
3. **ASK** the next question in natural French conversation

**READ THE CONVERSATION HISTORY** - Remember what they've said!
- Reference previous answers when relevant
- Build logical connections between topics
- Show you're listening and understanding

**EXAMPLES OF GOOD QUESTIONS (in French):**
✓ "Vous avez mentionné utiliser Excel plus tôt - comment vos équipes collaborent-elles sur ces fichiers?"
✓ "Intéressant que vous ayez un CRM. Est-ce qu'il s'intègre avec vos autres outils?"
✓ "Puisque votre stratégie est encore en cours de définition, comment prenez-vous actuellement les décisions d'investissement digital?"

**BAD QUESTIONS (DON'T DO THIS):**
❌ "Given that..." (English)
❌ "Bonjour! Parlez-moi de: [criterion text]" (too formal/repetitive)
❌ "Question suivante: [criterion text]" (sounds like a form)
❌ "Ensuite, parlez-moi de..." (too sequential)

**SCORING GUIDE:**
- 0 = Absent/Non existant
- 1 = Basique/Initial
- 2 = Intermédiaire/En développement
- 3 = Avancé/Mature

Return JSON (all text in French): {
  "evaluation": {"score": 0-3, "justification": "explication en français"},
  "ai_reaction": "réaction empathique en français",
  "next_question": "question conversationnelle en français pour le prochain critère"
}"""

async def formulate_first_question(
    criterion_text: str, 
    company_name: str = None, 
    sector: str = None, 
    size: str = None
) -> str:
    """Generate the first question of the diagnostic"""
    
    # Build company context string
    company_context = ""
    if company_name:
        company_context = f"L'entreprise s'appelle {company_name}."
        if sector:
            company_context += f" Elle évolue dans le secteur {sector}."
        if size:
            company_context += f" C'est une entreprise de taille {size}."
        company_context += " "
    
    # Use fallback if no API key
    if not openai_client and not gemini_client:
        greeting = f"Bonjour! Je suis votre conseiller digital."
        if company_name:
            greeting = f"Bonjour {company_name}! Je suis votre conseiller digital."
        return (
            f"{greeting} "
            f"Commençons par comprendre votre situation actuelle. "
            f"Concernant {criterion_text.lower()}, "
            f"où en êtes-vous aujourd'hui?"
        )
    
    # Direct prompt - Gemini works better with simple, direct requests
    context_part = f"{company_context}" if company_context else ""
    full_prompt = (
        f"Créez une question d'accueil amicale en français pour un diagnostic de maturité digitale. "
        f"{context_part}"
        f"Le sujet de la première question est: {criterion_text}. "
        f"Si le nom de l'entreprise est mentionné, utilisez-le dans la question. "
        f"Soyez conversationnel et professionnel (2-3 phrases maximum)."
    )
    
    # Try Gemini first if available and configured
    if gemini_client and (settings.AI_PROVIDER == "gemini" or not openai_client):
        try:
            print(f"[AI] Calling Gemini API for first question...")
            # Gemini uses synchronous API, run in thread to avoid blocking
            response = await asyncio.to_thread(
                client.generate_content,
                full_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=500,  # Increased to avoid truncation
                    top_p=0.95,
                    top_k=40,
                ),
                safety_settings=[
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
                ]
            )
            # Extract text safely - handle different response formats
            result = None
            if response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                # Check finish reason: 1=STOP (success), 2=MAX_TOKENS (truncated but has content), 3=SAFETY, 4=RECITATION, 5=OTHER
                finish_reason = candidate.finish_reason
                if finish_reason == 3:  # SAFETY - actually blocked
                    print(f"[AI] Warning: Response was blocked by safety filters (finish_reason=3). Using fallback...")
                    raise Exception("Response blocked by safety filters")
                
                # Extract text from parts (works even with finish_reason=2 MAX_TOKENS)
                if candidate.content and candidate.content.parts and len(candidate.content.parts) > 0:
                    result = candidate.content.parts[0].text.strip()
                    if finish_reason == 2:  # MAX_TOKENS - response was truncated
                        print(f"[AI] Note: Response truncated (finish_reason=2), but content extracted successfully")
            
            # Fallback to response.text if no content in parts (shouldn't happen, but just in case)
            if not result:
                try:
                    result = response.text.strip()
                except ValueError as e:
                    # This happens when finish_reason is 2 and trying to use .text property
                    print(f"[AI] Warning: Could not use response.text (likely truncated). Trying alternative extraction...")
                    # Try to get any available text
                    if response.candidates and response.candidates[0].content:
                        result = "".join([part.text for part in response.candidates[0].content.parts if hasattr(part, 'text')]).strip()
                    if not result:
                        raise Exception("Could not extract response text")
            
            print(f"[AI] Successfully generated first question with Gemini")
            return result
        except Exception as gemini_error:
            print(f"[AI] Gemini failed: {gemini_error}. Trying OpenAI fallback...")
            # Fall through to OpenAI attempt
    
    # Try OpenAI if available (either as primary or fallback)
    if openai_client:
        try:
            print(f"[AI] Calling OpenAI API for first question...")
            context_info = ""
            if company_name:
                context_info = f"Company: {company_name}"
                if sector:
                    context_info += f", Sector: {sector}"
                if size:
                    context_info += f", Size: {size}"
                context_info += "\n"
            
            prompt = f"{context_info}First criterion: '{criterion_text}'\n\nYour friendly welcome question (in French, mention the company name if provided):"
            response = await openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT_FIRST_QUESTION},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            result = response.choices[0].message.content.strip()
            print(f"[AI] Successfully generated first question with OpenAI")
            return result
        except Exception as openai_error:
            print(f"[AI] OpenAI also failed: {openai_error}")
    
    # If both fail, use intelligent fallback
    print(f"[AI] Both providers failed, using intelligent fallback")
    greeting = "Bonjour! Je suis votre conseiller digital."
    if company_name:
        greeting = f"Bonjour {company_name}! Je suis votre conseiller digital."
    return (
        f"{greeting} "
        f"Commençons par comprendre votre situation actuelle. "
        f"Concernant {criterion_text.lower()}, "
        f"où en êtes-vous aujourd'hui?"
    )

async def evaluate_and_generate_next(
    conversation_history: List[Dict[str, Any]],
    current_answer: str,
    current_criterion: Dict[str, Any],
    next_criterion: Dict[str, Any],
    company_name: str = None,
    sector: str = None,
    size: str = None
) -> Dict[str, Any]:
    """Evaluate current answer and generate next question"""
    
    # Build company context
    company_context = ""
    if company_name:
        company_context = f"**COMPANY INFORMATION:**\n"
        company_context += f"- Name: {company_name}\n"
        if sector:
            company_context += f"- Sector: {sector}\n"
        if size:
            company_context += f"- Size: {size}\n"
        company_context += "\n"
    
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
{company_context}**CONVERSATION SO FAR:**
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
4. Remember the company name and context throughout the conversation

Remember: You're having a conversation, not filling out a form!
"""
    
    # Use fallback if no API key available
    if not openai_client and not gemini_client:
        estimated_score = estimate_score_from_answer(current_answer)
        return {
            "evaluation": {
                "score": estimated_score, 
                "justification": f"Score estimé basé sur l'analyse de votre réponse"
            },
            "ai_reaction": generate_smart_fallback_reaction(estimated_score),
            "next_question": generate_smart_fallback_question(next_criterion)
        }
    
                    # Try Gemini first if available and configured
    if gemini_client and (settings.AI_PROVIDER == "gemini" or not openai_client):
        try:
            print(f"[AI] Calling Gemini API for evaluation and next question...")
            full_prompt = f"{SYSTEM_PROMPT_ADAPTIVE}\n\n{prompt}\n\nIMPORTANT: Return ONLY valid JSON in this exact format (ALL TEXT IN FRENCH):\n{{\n  \"evaluation\": {{\"score\": 0-3, \"justification\": \"explication en français\"}},\n  \"ai_reaction\": \"réaction empathique en français\",\n  \"next_question\": \"question conversationnelle en français (NE PAS commencer par 'Given' ou 'Ensuite')\"\n}}"
            # Gemini uses synchronous API, run in thread to avoid blocking
            response = await asyncio.to_thread(
                gemini_client.generate_content,
                full_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=500,
                    top_p=0.95,
                    top_k=40,
                ),
                safety_settings=[
                    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
                    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH"},
                    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
                    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
                ]
            )
            # Check if response was blocked
            if response.candidates and response.candidates[0].finish_reason == 2:
                print(f"[AI] Warning: Response was blocked (finish_reason=2). Using fallback...")
                raise Exception("Response blocked by safety filters")
            
            # Extract text safely
            if response.candidates and response.candidates[0].content:
                response_text = response.candidates[0].content.parts[0].text.strip()
            else:
                response_text = response.text.strip()
            
            # Parse JSON from response (Gemini sometimes adds markdown formatting)
            # Remove markdown code blocks if present
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.startswith("```"):
                response_text = response_text[3:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            result = json.loads(response_text)
            
            # Clean up the next_question if it starts with "Given" or other unwanted patterns
            if "next_question" in result:
                next_q = result["next_question"]
                # Remove common unwanted prefixes (English and overly formal French)
                unwanted_prefixes = [
                    "Given", "Given that", "Now, ", "Next, ", "Then, ",
                    "Étant donné que", "Étant donné", "Vu que", "Considérant que",
                    "Ensuite, ", "Question suivante: ", "Par la suite, "
                ]
                next_q_lower = next_q.lower()
                for prefix in unwanted_prefixes:
                    if next_q_lower.startswith(prefix.lower()):
                        next_q = next_q[len(prefix):].strip()
                        # Capitalize first letter if needed
                        if next_q and not next_q[0].isupper():
                            next_q = next_q[0].upper() + next_q[1:]
                        result["next_question"] = next_q
                        print(f"[AI] Cleaned up question (removed '{prefix}' prefix)")
                        break
            
            print(f"[AI] Successfully generated evaluation and next question with Gemini")
            return result
        except Exception as gemini_error:
            print(f"[AI] Gemini failed: {gemini_error}. Trying OpenAI fallback...")
            # Fall through to OpenAI attempt
        except Exception as gemini_error:
            print(f"[AI] Gemini failed: {gemini_error}. Trying OpenAI fallback...")
            # Fall through to OpenAI attempt
    
    # Try OpenAI if available (either as primary or fallback)
    if openai_client:
        try:
            print(f"[AI] Calling OpenAI API for evaluation and next question...")
            response = await openai_client.chat.completions.create(
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
            
            # Clean up the next_question if it starts with "Given" or other unwanted patterns
            if "next_question" in result:
                next_q = result["next_question"]
                # Remove common unwanted prefixes (English and overly formal French)
                unwanted_prefixes = [
                    "Given", "Given that", "Now, ", "Next, ", "Then, ",
                    "Étant donné que", "Étant donné", "Vu que", "Considérant que",
                    "Ensuite, ", "Question suivante: ", "Par la suite, "
                ]
                next_q_lower = next_q.lower()
                for prefix in unwanted_prefixes:
                    if next_q_lower.startswith(prefix.lower()):
                        next_q = next_q[len(prefix):].strip()
                        # Capitalize first letter if needed
                        if next_q and not next_q[0].isupper():
                            next_q = next_q[0].upper() + next_q[1:]
                        result["next_question"] = next_q
                        print(f"[AI] Cleaned up question (removed '{prefix}' prefix)")
                        break
            
            print(f"[AI] Successfully generated evaluation and next question with OpenAI")
            return result
        except Exception as openai_error:
            print(f"[AI] OpenAI also failed: {openai_error}")
    
    # If both fail, use intelligent fallback
    print(f"[AI] Both providers failed, using intelligent fallback")
    estimated_score = estimate_score_from_answer(current_answer)
    return {
        "evaluation": {
            "score": estimated_score, 
            "justification": f"Score estimé basé sur l'analyse de votre réponse"
        },
        "ai_reaction": generate_smart_fallback_reaction(estimated_score),
        "next_question": generate_smart_fallback_question(next_criterion)
    }
