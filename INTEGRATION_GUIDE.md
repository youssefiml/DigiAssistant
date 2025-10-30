# 🤖 DigiAssistant - AI Integration Guide

## Architecture Overview

DigiAssistant now uses a **3-tier architecture** for maximum flexibility and AI power:

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎨 Frontend (React + Vite)                   │
│                    Port 5173                                     │
│  - Conversational Chat Interface                                │
│  - Real-time Progress Tracking                                  │
│  - Results Dashboard                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  ⚙️  Backend (Node.js + Express)                │
│                  Port 3002                                       │
│  - Session Management                                           │
│  - Adaptive Engine (Question Flow Logic)                        │
│  - Scoring & Profiling                                          │
│  - PDF Report Generation                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                🤖 AI Agent (FastAPI + Gemini)                   │
│                Port 8000                                         │
│  - Natural Language Analysis                                    │
│  - Score Evaluation (0-3)                                       │
│  - Empathetic Reactions                                         │
│  - Adaptive Flow Logic (Skip/Jump)                              │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Integration Flow

### 1. Session Start
```
User → Frontend → Backend
  ↓
Backend creates session ID
  ↓
Backend returns first question
```

### 2. User Answers (AI-Powered)
```
User types answer → Frontend → Backend
  ↓
Backend calls AI Agent with:
  - Conversation history
  - User's text answer
  - Current criterion (with options)
  - Next linear criterion (normal flow)
  - Next jump criterion (skip option)
  ↓
AI Agent (FastAPI) analyzes and returns:
  - evaluation: {score: 0-3, justification}
  - ai_reaction: empathetic response
  - chosen_next_criterion_id: which question to ask next
  - next_question: formulated question
  ↓
Backend stores score & updates session
  ↓
Frontend displays AI reaction + next question
```

### 3. Adaptive Logic (AI-Powered)
The AI Agent implements your skip logic:
- If ending Pillar 1 (P1-C3) and total score ≤ 2 → Skip to next dimension's P1-C1
- Otherwise → Continue linear flow (next criterion)

## 🔧 Configuration

### Backend Environment (`.env`)
```properties
PORT=3002
AI_AGENT_URL=http://localhost:8000
```

### AI Agent Environment (`ai-agent/.env`)
```properties
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## 🚀 Starting the System

### Option 1: Automated (Recommended)
```powershell
cd c:\Digi-Assistant
.\start.ps1
```

This starts all three services automatically:
1. 🤖 AI Agent (port 8000)
2. ⚙️  Backend (port 3002)
3. 🎨 Frontend (port 5173)

### Option 2: Manual Start

**Terminal 1 - AI Agent:**
```powershell
cd c:\Digi-Assistant\ai-agent
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Backend:**
```powershell
cd c:\Digi-Assistant\backend
npm run dev
```

**Terminal 3 - Frontend:**
```powershell
cd c:\Digi-Assistant\frontend
npm run dev
```

## 📡 API Endpoints

### Backend → AI Agent

#### 1. **POST** `/api/v1/formulate_first_question`
First question generation (called once at diagnostic start).

**Request:**
```json
{
  "criterion_text": "Votre entreprise a-t-elle une stratégie digitale formalisée ?"
}
```

**Response:**
```json
{
  "ai_question": "Bonjour! Pour commencer, parlez-moi de votre stratégie digitale..."
}
```

#### 2. **POST** `/api/v1/process_turn`
Main AI evaluation and next question (called for each user answer).

**Request:**
```json
{
  "history": [
    {
      "criterion_id": "STRAT-P1-C1",
      "user_answer": "Nous avons un document mais pas vraiment appliqué",
      "evaluation": {"score": 1, "justification": "Informal approach"}
    }
  ],
  "user_answer": "On utilise Excel et quelques emails mais c'est tout",
  "current_criterion": {
    "id": "STRAT-P1-C2",
    "criterion_text": "...",
    "options": [
      {"score": 0, "text": "Aucune utilisation"},
      {"score": 1, "text": "Utilisation basique"},
      {"score": 2, "text": "Utilisation régulière"},
      {"score": 3, "text": "Utilisation optimisée"}
    ],
    "dimensionCode": "STRAT",
    "palier": 1
  },
  "next_linear_criterion": {
    "id": "STRAT-P1-C3",
    "criterion_text": "..."
  },
  "next_jump_criterion": {
    "id": "CULT-P1-C1",
    "criterion_text": "..."
  }
}
```

**Response:**
```json
{
  "evaluation": {
    "score": 1,
    "justification": "Basic tools mentioned (Excel, email) with no advanced integration"
  },
  "ai_reaction": "Je comprends, vous utilisez des outils de base. C'est un bon point de départ.",
  "chosen_next_criterion_id": "STRAT-P1-C3",
  "next_question": "Maintenant, parlez-moi de vos processus de mesure..."
}
```

### Frontend → Backend

#### **POST** `/api/diagnostic/:sessionId/response`
Submit user's text answer.

**Request:**
```json
{
  "questionId": "STRAT-P1-C2",
  "userText": "On utilise Excel et quelques emails mais c'est tout"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Text response recorded and analyzed",
  "analysis": {
    "score": 1,
    "confidence": 0.9,
    "reasoning": "Basic tools mentioned",
    "detectedLevel": "basic"
  },
  "followUp": "Je comprends, vous utilisez des outils de base...\n\nMaintenant, parlez-moi de...",
  "currentScores": {
    "globalScore": 25.5,
    "dimensionScores": {"STRAT": 33.3, "CULT": 0, ...},
    "maturityProfile": {...}
  }
}
```

## 🧩 Code Components

### Backend - AdaptiveEngine.js
**Key Changes:**
- ✅ Imports `axios` instead of `AIAnalyzer.js`
- ✅ Calls FastAPI endpoints via HTTP
- ✅ Manages conversation history for AI context
- ✅ Implements fallback scoring if AI is unavailable
- ✅ Handles first question vs. subsequent questions

**Key Methods:**
- `recordTextResponse(sessionId, questionId, userText)` - **Now async!**
- `_getNextLinearQuestion(session)` - Normal flow
- `_getNextJumpQuestion(session)` - Skip to next dimension
- `_simpleFallbackScore(text)` - Fallback when AI unavailable

### AI Agent - services.py
**Key Functions:**
- `process_ai_turn()` - Main evaluation logic
- `formulate_first_question()` - Welcome question generation

**Adaptive Logic:**
```python
# Implemented in AI Agent's prompt:
# If P1-C3 and total_palier_score <= 2:
#   chosen_next_criterion_id = next_jump_criterion.id
# Else:
#   chosen_next_criterion_id = next_linear_criterion.id
```

## 🐛 Troubleshooting

### AI Agent Not Responding
**Symptom:** Backend shows "AI Agent Error" in console

**Solutions:**
1. Check AI Agent is running: `http://localhost:8000`
2. Verify `GEMINI_API_KEY` in `ai-agent/.env`
3. Check backend `.env` has correct `AI_AGENT_URL`
4. Review AI Agent console for errors

**Fallback:** Backend uses simple length-based scoring when AI unavailable

### Questions Not Loading
**Check:**
1. Backend running on port 3002
2. Session initialized correctly
3. `diagnosticCriteria.js` loaded properly

### Frontend Not Connecting
**Check:**
1. Backend API URL in `frontend/src/services/api.js`
2. CORS enabled on backend
3. All three services running

## 📊 Data Flow Example

**Complete conversation turn:**

```
1. User types: "Nous utilisons un CRM et des outils de marketing automation"
   ↓
2. Frontend → Backend POST /response
   ↓
3. Backend → AI Agent POST /process_turn
   {
     history: [...previous answers...],
     user_answer: "Nous utilisons un CRM...",
     current_criterion: {...},
     next_linear: {...},
     next_jump: {...}
   }
   ↓
4. AI Agent (Gemini) analyzes:
   - Keywords: "CRM", "automation" → Advanced tools
   - Score: 2 (intermediate)
   - Justification: "Integration of CRM and marketing tools"
   - Reaction: "Excellent! Vous avez une bonne base technologique."
   - Next: STRAT-P2-C1 (continue to Pillar 2)
   ↓
5. AI Agent → Backend
   {
     evaluation: {score: 2, justification: "..."},
     ai_reaction: "Excellent! ...",
     chosen_next_criterion_id: "STRAT-P2-C1",
     next_question: "Parlons maintenant de..."
   }
   ↓
6. Backend stores score, updates session
   ↓
7. Backend → Frontend
   {
     analysis: {...},
     followUp: "Excellent! ...\n\nParlons maintenant de...",
     currentScores: {...}
   }
   ↓
8. Frontend displays AI reaction + next question
```

## 🎯 Benefits of This Architecture

### ✅ Separation of Concerns
- **Frontend**: UI/UX only
- **Backend**: Business logic, session management, scoring
- **AI Agent**: Pure NLP analysis and evaluation

### ✅ Scalability
- AI Agent can be scaled independently
- Backend handles multiple concurrent sessions
- Frontend is stateless

### ✅ Flexibility
- Easy to swap AI models (Gemini → GPT-4 → Claude)
- Backend logic isolated from AI implementation
- Frontend works with any backend API

### ✅ Maintainability
- Clear API contracts between services
- Each service has single responsibility
- Easy to test each component independently

### ✅ Your Custom Logic
- Adaptive skip logic in AI Agent (your Python code)
- Conversation history maintained
- Context-aware question formulation

## 🔐 Security Notes

### Production Deployment
1. **AI Agent:**
   - Don't expose port 8000 publicly
   - Backend should be only client
   - Use internal network or API gateway

2. **Backend:**
   - Add rate limiting
   - Implement session timeouts
   - Validate all inputs

3. **Environment Variables:**
   - Never commit `.env` files
   - Use secrets management in production
   - Rotate API keys regularly

## 📚 Further Enhancements

### Potential Additions
- **Session persistence**: Store in MongoDB/PostgreSQL
- **User authentication**: JWT tokens
- **AI caching**: Cache common responses
- **Analytics**: Track answer patterns
- **Multi-language**: Support English/French/Spanish
- **A/B testing**: Different AI prompts
- **Streaming responses**: Real-time AI typing effect

---

## 🎉 You're All Set!

Your DigiAssistant now uses:
- ✅ Your custom FastAPI AI Agent with Gemini
- ✅ Conversational text-based interface
- ✅ Adaptive question flow logic
- ✅ Real-time AI analysis and scoring
- ✅ Empathetic, engaging user experience

**Start the system:**
```powershell
.\start.ps1
```

**Test the flow:**
1. Type natural answers
2. Watch AI analyze and respond
3. See adaptive logic in action
4. Complete diagnostic and get results

**Happy diagnosing! 🚀**
